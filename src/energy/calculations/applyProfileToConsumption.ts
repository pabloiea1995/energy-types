import { DayCurve } from "..";
import { PowerCurve } from "../classes/powerCurve.class";

export type ConsumptionIntroductionModes =
  | "totalConsumption"
  | "monthConsumption";
/**
 * Function to generate a power curve from a profile and consumption information
 * * @param {*} metodo
 * @param {*} perfilado
 * @param {*} consumos
 */
export const applyProfileToConsumption = (
  method: ConsumptionIntroductionModes,
  profile: DayCurve[],
  consumption: number | Record<number, Record<number, number>>
) => {
  //creating profile curve
  const profileCurve = new PowerCurve(profile, false, "profile", true);

  //initializing result curve
  const resultCurve = new PowerCurve([], false, "consumption", true);

  switch (method) {
    case "totalConsumption":
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

    case "monthConsumption":
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
          Object.keys(consumption[parseInt(year)]).forEach((month) => {
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

            const consumoMes = consumption[parseInt(year)][parseInt(month)];

            dailyValueProfileConsumption.valuesList![hour] =
              (consumoMes * valorHorarioPerfilado) /
              yearMonthAccumulatedProfilesDict[parseInt(year)][parseInt(month)];
          });

          resultCurve.days.push(dailyValueProfileConsumption);
        });

        return resultCurve;
      }

    default:
      console.warn(
        `No se reconoce el metodo de calculo introducido = ${method}`
      );
  }
};
