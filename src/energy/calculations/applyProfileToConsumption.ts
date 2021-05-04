import { DayCurve } from "..";
import { PowerCurve } from "../classes/powerCurve.class";
import { AbstractByPeriodValuesDto } from "../dtos/AbstractByPeriodValuesDto";

export enum ConsumptionIntroductionModes {
  TOTAL_CONSUMPTION = "totalConsumption",
  MONTH_CONSUMPTION = "monthConsumption",
  CONSUMPTION_BY_PERIOD = "consumptionByPeriod",
}

type ConsumptionIntroductionModesDict = {
  [key in ConsumptionIntroductionModes]: any;
};
interface IntroductionModeConsumptionShapeI
  extends ConsumptionIntroductionModesDict {
  totalConsumption: number;
  monthConsumption: Record<number, Record<number, number>>;
  consumptionByPeriod: Record<`p${number}`, number>;
}
/**
 * Function to generate a power curve from a profile and consumption information
 * * @param {*} method
 * @param {*} profile
 * @param {*} consumption
 */
export function applyProfileToConsumption<
  T extends ConsumptionIntroductionModes
>(
  method: T,
  profile: DayCurve[],
  consumption: IntroductionModeConsumptionShapeI[T],
  periodsCurve?: DayCurve[]
  //consumption: number | Record<number, Record<number, number>> | Record<`p${number}`, number>
) {
  //creating profile curve
  const profileCurve = new PowerCurve(profile, false, "profile", true);

  //initializing result curve
  const resultCurve = new PowerCurve([], false, "consumption", true);

  switch (method as ConsumptionIntroductionModes) {
    case ConsumptionIntroductionModes.TOTAL_CONSUMPTION:
      //Primero, se normalizan los valores horarios del perfilado dividiend cada uno por el acumulado de todos los valores horarios.
      //ya que la suma de los valores de perfilado en el periodo considereado debe ser igual a 1
      const accumulated = profileCurve.getTotalAcumulate();
      if (accumulated && typeof consumption === "number") {
        //se recorre cada hora del perfilado y se obtiene el valor horario de la curva de consumo resultante, multiplicando el valor total
        //de consumo por el perfilado normalizado (valor horario del perfilado entre el acumulado del perfilado en el periodo)
        profile.forEach((day) => {
          let dailyConsumptionProfileValue: DayCurve = {
            date: day.date,
            valuesList: {},
          };

          if (day.valuesList) {
            Object.keys(day.valuesList).forEach((hour) => {
              const profileHourValue = day.valuesList![hour] || 0;

              dailyConsumptionProfileValue.valuesList![hour] =
                (consumption * profileHourValue) / accumulated;
            });

            resultCurve.days.push(dailyConsumptionProfileValue);
          }
        });
      }

      return resultCurve;

    case ConsumptionIntroductionModes.MONTH_CONSUMPTION:
      if (typeof consumption == "object") {
        const yearList = Object.keys(consumption).sort(
          (a, b) => parseInt(a) - parseInt(b)
        );
        console.log(yearList);
        //preprocesamos los valores diarios de los perfilados, agregando por año y por mes
        //para generar un objeto de perfilados mensuales
        //precargamos el objeto
        const yearMonthProfilesDic: Record<number, Record<number, any>> = {};

        yearList.forEach((year) => {
          if (!yearMonthProfilesDic[parseInt(year)]) {
            yearMonthProfilesDic[parseInt(year)] = {};
          }
          //iteramos por cada mes del año del objeto de valores de consumo
          Object.keys((consumption as any)[parseInt(year)]).forEach((month) => {
            if (!yearMonthProfilesDic[parseInt(year)][parseInt(month)]) {
              yearMonthProfilesDic[parseInt(year)][parseInt(month)] = [];
            }
          });
        });

        //iteramos por los perfilados agregandolos por meses en el objeto anterior
        profileCurve.days.forEach((day) => {
          const { date } = day;

          const [year, month, _] = date.split("-");

          //añadimos el valor diario de perfilado al objeto
          yearMonthProfilesDic[parseInt(year)][parseInt(month)].push(day);
        });

        //una vez gregados, calculamos el acumulado de cada mes
        let yearMonthAccumulatedProfilesDict = yearMonthProfilesDic;
        //iteramos por cada año y mes generando el objeto curva de carga de cada mes y calculando el acumulado
        Object.keys(yearMonthAccumulatedProfilesDict).forEach((year) => {
          //iteramos por cada mes del año del objeto de valores de consumo
          Object.keys(yearMonthAccumulatedProfilesDict[parseInt(year)]).forEach(
            (month) => {
              let profileMonthCurve = new PowerCurve(
                yearMonthAccumulatedProfilesDict[parseInt(year)][
                  parseInt(month)
                ],
                false,
                "p",
                true
              );

              yearMonthAccumulatedProfilesDict[parseInt(year)][
                parseInt(month)
              ] = profileMonthCurve.getTotalAcumulate();
            }
          );
        });
        //ahora iteramor por cada mes del los perfilados obteniendo el consumo aplicando el consumo mensual total,
        //el valor horario del perfilado, y el valor total del perfilado acumulado
        profileCurve.days.forEach((day) => {
          let dailyValueProfileConsumption: DayCurve = {
            date: day.date,
            valuesList: {},
          };

          const [year, month, day_] = day.date.split("-");

          Object.keys(day.valuesList!).forEach((hour) => {
            const valorHorarioPerfilado = day.valuesList![hour];

            const consumoMes = (consumption as any)[parseInt(year)][
              parseInt(month)
            ];

            dailyValueProfileConsumption.valuesList![hour] =
              (consumoMes * valorHorarioPerfilado) /
              yearMonthAccumulatedProfilesDict[parseInt(year)][parseInt(month)];
          });

          resultCurve.days.push(dailyValueProfileConsumption);
        });

        return resultCurve;
      }

    case ConsumptionIntroductionModes.CONSUMPTION_BY_PERIOD:
      console.log("Evaluating consumption by period profile");
      if (typeof consumption == "object" && periodsCurve?.length) {
        //first, aggregate the profile by period
        const profileCurve = new PowerCurve(profile, false, "profile", true);
        const profileByPeriod = profileCurve.aggregateByPeriod(periodsCurve);

        //second iterate through the profile curve calculating each consumption hour value
        //as the product of itds period consumption value and the profile hour value divided by the aggregatted value of that period
        profileCurve.days.forEach((day) => {
          const resultProfileDay: DayCurve = { ...day, valuesList: {} };
          const [year, month, day_] = day.date.split("-");
          if (day.valuesList) {
            //get the period of the day
            const dayPeriod = periodsCurve.find((day1) => {
              const [year1, month1, day_1] = day1.date.split("T")[0].split("-");
              return month === month1 && day_ === day_1;
            });
            if (!dayPeriod) {
              return;
            }
            Object.keys(day.valuesList).map((hour) => {
              if (dayPeriod?.valuesList) {
                const hourPeriod = dayPeriod.valuesList[hour];
                if (hourPeriod) {
                  let hourCalculatedConsumption = 0;
                  if (
                    (profileByPeriod as any)[`p${hourPeriod}`] !== undefined
                  ) {
                    hourCalculatedConsumption =
                      (day.valuesList![hour] /
                        (profileByPeriod as any)[`p${hourPeriod}`]) *
                      (consumption as any)[`p${hourPeriod}`];
                  }
                  resultProfileDay.valuesList![
                    hour
                  ] = hourCalculatedConsumption;
                }
              } else {
                // console.log(
                //   `no se ha encontrado periodo para el dia ${day.date}`
                // );
              }
            });
          }
          resultCurve.days.push(resultProfileDay);
        });

        return resultCurve;
      }

    default:
      console.warn(
        `No se reconoce el metodo de calculo introducido = ${method}`
      );
  }
}
