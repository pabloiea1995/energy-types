import { AbstractByPeriodValuesDto } from "../dtos/AbstractByPeriodValuesDto";

interface GraphSerie {
  name: string;
  x: any[];
  y: any[];
  xDailyAverage: any[];
  yDailyAverage: any[];
}
export class PowerCurve {
  constructor(
    daysList: DayCurve[],
    ignore0: boolean,
    identifier: string,
    parseDate?: boolean
  ) {
    this.days = daysList;
    this.ignore0 = ignore0 || false;
    this.identifier = identifier;
    this.parseDate = parseDate === undefined ? true : parseDate;
  }

  days: DayCurve[];
  ignore0: boolean;
  identifier: string;
  parseDate?: boolean;

  /**
   * Converts curve to a data object ready to be ploted by a charting library like react-plotly.js
   */
  convertoToSerie(): GraphSerie {
    let x = [];
    let xDailyAverage = [];
    let y = [];
    let yDailyAverage = [];

    for (let dia in this.days) {
      let dailyAverage;
      let dailyAccumulate = 0;

      const currentDay = this.days[dia];

      if (!currentDay || !currentDay.date || !currentDay.valuesList) {
        continue;
      }

      let date = new Date(currentDay.date);

      for (let i = 1; i < 26; i++) {
        //flag para ignorar los valor 0
        if (this.ignore0) {
          if (
            currentDay.valuesList[i.toString()] !== 0 &&
            currentDay.valuesList[i.toString()] !== undefined
          ) {
            y.push(currentDay.valuesList[i]);
            //x.push(`H${i} ${currentDay.date}`)
            if (this.parseDate) {
              let hour = i;
              let [year, month, day] = currentDay.date.split("-");
              x.push(
                new Date(
                  parseInt(year),
                  parseInt(month) - 1,
                  parseInt(day),
                  i - 1
                )
              );
              //x.push(`H${i} ${currentDia.fecha}`)
            } else {
              x.push(`H${i} ${currentDay.date}`);
            }
            if (currentDay.valuesList[i]) {
              let yS = currentDay.valuesList[i].toString();
              dailyAccumulate += parseFloat(yS);
            }
          }
        } else {
          //si no se ignoran los 0, solo se ignora el 0 en la hora 25
          if (currentDay.valuesList[i.toString()] === 0 && i === 25) {
          } else {
            y.push(currentDay.valuesList[i]);
            if (this.parseDate) {
              let hour = i;
              let [year, month, day] = currentDay.date.split("-");
              x.push(
                new Date(
                  parseInt(year),
                  parseInt(month) - 1,
                  parseInt(day),
                  i - 1
                )
              );
              //x.push(`H${i} ${currentDia.fecha}`)
            } else {
              x.push(`H${i} ${currentDay.date}`);
            }
            if (currentDay.valuesList[i]) {
              let yS = currentDay.valuesList[i].toString();
              dailyAccumulate += parseFloat(yS);
            }
          }
        }
      }

      dailyAverage = dailyAccumulate / 24;
      xDailyAverage.push(
        `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1
        }`
      );
      yDailyAverage.push(dailyAverage);
    }

    return { x, y, name: this.identifier, xDailyAverage, yDailyAverage };
  }

  /**
   * Returns starting and ending dates of the curve
   */
  getTotalPeriod(): [Date, Date] {
    return [
      new Date(this.sortByDate()[0].date),
      new Date(this.sortByDate()[this.days.length - 1].date),
    ];
  }

  /**
   * sorts a curve by date ascending
   */
  sortByDate(): DayCurve[] {
    return this.days.sort(
      (today, tomorrow) =>
        new Date(today.date).getTime() - new Date(tomorrow.date).getTime()
    );
  }

  /**
   * filters days values by given start and end date
   */
  filterByDates(startDate?: Date, endDate?: Date): DayCurve[] {
    if (startDate && endDate) {
      return this.days.filter((day) => {
        return new Date(day.date) >= startDate && new Date(day.date) <= endDate;
      });
    }
    if (startDate) {
      return this.days.filter((day) => new Date(day.date) >= startDate);
    }
    if (endDate) {
      return this.days.filter((day) => new Date(day.date) <= endDate);
    }
    return [];
  }

  /**
   * Calculates acumulate of hourly values
   */
  getTotalAcumulate(): number {
    let acumulate = 0;
    //console.log(this.dias)
    this.days.forEach((day) => {
      const values = day.valuesList;

      if (values) {
        const hours = Object.keys(values);

        hours.forEach((hour) => {
          const hourValue = values[hour];
          if (!isNaN(hourValue)) {
            acumulate += hourValue;
          }
        });
      }
    });
    return acumulate;
  }

  /**
   * Classifies daily values on its corresponding year
   */
  classifyByYears(): ConsumptionCurve[] {
    let years: Record<string, DayCurve[]> = {};

    let yearsCounter: Record<string, number> = {};
    this.days.forEach((day) => {
      let year = day.date.split("-")[0];
      if (year) {
        if (!years[year]) {
          years[year] = [];
        }
        years[year].push(day);
        if (!yearsCounter[year]) {
          yearsCounter[year] = 0;
        }
        yearsCounter[year] += 1;
      }
    });

    return Object.keys(years).map((year) => ({
      year: parseInt(year),
      days: years[year],
      isComplete:
        yearsCounter[year] / (leapyear(parseInt(year)) ? 366 : 365) === 1,
    }));
  }

  aggregatePowerCurve(curveToAggregate: PowerCurve): PowerCurve {
    const curve = this.days;
    let resultCurve: DayCurve[] = [];

    resultCurve = curve.map((day) => {
      let resultDay: DayCurve = { date: day.date };
      let aggregatedValuesList: Record<string, number> =
        JSON.parse(JSON.stringify(day.valuesList)) || {};
      if (aggregatedValuesList && day.valuesList) {
        Object.keys(day.valuesList).forEach((hour) => {
          if (hour) {
            const dayToAggregate = curveToAggregate.days.filter(
              (dayToAggregate) => day.date === dayToAggregate.date
            )[0];

            if (dayToAggregate && dayToAggregate.valuesList) {
              aggregatedValuesList![hour] +=
                dayToAggregate.valuesList[hour] || 0;
            }
          }
        });
      }
      resultDay.valuesList = aggregatedValuesList;
      return resultDay;
    });

    return new PowerCurve(
      resultCurve,
      this.ignore0,
      this.identifier + " + " + curveToAggregate.identifier,
      this.parseDate
    );
  }

  /**
   * Calculates statistics of the consumption curve by year
   */

  calculateStatistics(periodDistribution?: DayCurve[]): PowerCurveStatistics {
    //inicialización de los objetos resultado
    //acumulados diarios
    //formato -> {[YYYY-MM-DD]: XX.XX,[YYYY-MM-DD]: XX.XX ... }
    let dailyAccumulate: Record<string, number> & StatisticResult = {};

    //acumulados de consumo para cada par mes-año
    //formato -> {[YYYY]:{1: XX.XX, 2: XX.XX ... 12: XX.XX} ... }
    let anualMonthAccumulate: Record<string, Record<number | string, number>> &
      StatisticResult = {};

    //cuenta total de valores para cada par mes-año
    //formato -> {[YYYY]:{1: XX, 2: XX ... 12: XX} ... }
    let anualMonthCount: Record<string, Record<number | string, number>> &
      StatisticResult = {};
    //maximo de consumo con date y hora y periodo (si se ha introducido distribución de periodos)
    //formato -> {[YYYY]:{date: null, hora: null, valor: null, diaSemana: null }}
    let max: Record<Year, StatisticValue> & StatisticResult = {};

    //minimo de consumo con date y hora y periodo (si se ha introducido distribución de periodos)
    let min: Record<Year, StatisticValue> & StatisticResult = {};
    //agregacion por periodos
    let periodoAgregattion: Record<Year, Record<number, number>> &
      StatisticResult = {};

    //consumo medio por dia de la semana para cada año
    let weeklyAverageConsumption: Record<Year, Record<number | string, any>> &
      StatisticResult = {};

    //consumo medio por hora del dia para cada año
    let hourlyAverageConsumption: Record<Year, Record<Hour | string, any>> &
      StatisticResult = {};

    let weeklyhourlyAverageConsumption: Record<
      Year,
      Record<WeekDay, Record<Hour, any>>
    > &
      StatisticResult = {};
    //curva de distribución horaria por periodo para cada año para la tarifa de acceso seleccionada en la curva
    let hourlyPeriodDistribution: Record<Year, Record<string, any>> &
      StatisticResult = {};

    //una vez inicializados, iniciamos el analisis de la curva de carga
    //iteramos por cada objeto dia de la curva
    for (let dia in this.days) {
      let currentDay = this.days[dia];

      if (currentDay) {
        //obtenemos la date y la lista de valores
        const { date, valuesList } = currentDay;

        //parseamos el dia, el mes y el año de  date
        if (date && valuesList) {
          let [yearString, monthString, dayOfMonth] = date.split("-");
          const year = parseInt(yearString);
          const month = parseInt(monthString);
          //creamos un objeto date con hora 12 para evitar errores con el UTC
          const dateDateObject = new Date(
            year,
            month - 1,
            parseInt(dayOfMonth),
            12
          );
          //dia de la semana empezando en lunes = 1 y domingo 7
          const dayOfWeekIndex =
            dateDateObject.getDay() === 0 ? 7 : dateDateObject.getDay();
          //variable para acumular el consumo diario
          let dailyConsumption = 0;
          //recorremos los valores horarios de valuesList
          Object.keys(valuesList).map((hourS) => {
            let hour = parseInt(hourS);

            let consumoHorario = valuesList[hour];
            //Acumulamos el consumo diario
            if (!isNaN(consumoHorario)) {
              let dayPeriodDistribution;
              //si existe curva de periodos para esta curva, se acumula el consumo en su periodo correspondiente
              if (periodDistribution) {
                //obtenemos la curva de distribución de periodos de la misma fecha
                dayPeriodDistribution = periodDistribution.filter(
                  (periodDay) => periodDay.date.split("T")[0] === date
                )[0];
                //console.log(periodDistribution)
                if (dayPeriodDistribution) {
                  //console.log(periodDistribution[date])
                  if (!hourlyPeriodDistribution[year]) {
                    hourlyPeriodDistribution[year] = {};
                  }
                  hourlyPeriodDistribution[year][date] = dayPeriodDistribution;
                  //se obtiene el periodo de la hora actual
                  let periodo = dayPeriodDistribution.valuesList
                    ? dayPeriodDistribution.valuesList[hour]
                    : undefined;

                  if (periodo) {
                    if (!periodoAgregattion[year]) {
                      periodoAgregattion[year] = {};
                      periodoAgregattion[year][periodo] = consumoHorario;
                    } else {
                      if (!periodoAgregattion[year][periodo]) {
                        periodoAgregattion[year][periodo] = consumoHorario;
                      } else {
                        periodoAgregattion[year][periodo] += consumoHorario;
                      }
                    }
                  }
                }
              }
              dailyConsumption += consumoHorario;

              if (!max[year]) {
                max[year] = {};
              }
              if (!min[year]) {
                min[year] = {};
              }
              //Contrastamos el valor con el valor de maximo y minimo, para ver si es un máximo o minimo
              if (max[year].value) {
                if (max[year].value! < consumoHorario) {
                  max[year].value = consumoHorario;
                  max[year].date = date;
                  max[year].hour = hour;
                  max[year].weekDay = dayOfWeekIndex;
                  if (periodDistribution) {
                    if (dayPeriodDistribution) {
                      max[year].period =
                        dayPeriodDistribution.valuesList![hour];
                    }
                  }
                }
              } else {
                max[year].value = consumoHorario;
                max[year].date = date;
                max[year].hour = hour;
                max[year].weekDay = dayOfWeekIndex;
                if (periodDistribution) {
                  if (dayPeriodDistribution) {
                    max[year].period = dayPeriodDistribution.valuesList![hour];
                  }
                }
              }
              //Primero contrastamos el valor con el valor de maximo y minimo, para ver si es un máximo o minimo
              if (min[year].value) {
                if (min[year].value! > consumoHorario) {
                  min[year].value = consumoHorario;
                  min[year].date = date;
                  min[year].hour = hour;
                  min[year].weekDay = dayOfWeekIndex;
                  if (periodDistribution) {
                    if (dayPeriodDistribution) {
                      min[year].period =
                        dayPeriodDistribution.valuesList![hour];
                    }
                  }
                }
              } else {
                min[year].value = consumoHorario;
                min[year].date = date;
                min[year].hour = hour;
                min[year].weekDay = dayOfWeekIndex;
                if (periodDistribution) {
                  if (dayPeriodDistribution) {
                    min[year].period = dayPeriodDistribution.valuesList![hour];
                  }
                }
              }

              if (!hourlyAverageConsumption[year]) {
                hourlyAverageConsumption[year] = {};
                hourlyAverageConsumption[year][hour] = {
                  acumulado: 0,
                  cuenta: 0,
                };
                hourlyAverageConsumption[year][hour].acumulado +=
                  consumoHorario;
                hourlyAverageConsumption[year][hour].cuenta += 1;
              } else {
                if (!hourlyAverageConsumption[year][hour]) {
                  hourlyAverageConsumption[year][hour] = {
                    acumulado: 0,
                    cuenta: 0,
                  };
                }
                hourlyAverageConsumption[year][hour].acumulado +=
                  consumoHorario;
                hourlyAverageConsumption[year][hour].cuenta += 1;
              }

              //añadimos el valor horario a la hora del dia de la semana para la media horaria semanal

              if (!weeklyhourlyAverageConsumption[year]) {
                weeklyhourlyAverageConsumption[year] = {};
              }
              if (!weeklyhourlyAverageConsumption[year][dayOfWeekIndex]) {
                weeklyhourlyAverageConsumption[year][dayOfWeekIndex] = {};
              }
              if (!weeklyhourlyAverageConsumption[year][dayOfWeekIndex][hour]) {
                weeklyhourlyAverageConsumption[year][dayOfWeekIndex][hour] = {
                  acumulado: 0,
                  cuenta: 0,
                };
              }
              weeklyhourlyAverageConsumption[year][dayOfWeekIndex][
                hour
              ].acumulado += consumoHorario;
              weeklyhourlyAverageConsumption[year][dayOfWeekIndex][
                hour
              ].cuenta += 1;
            }
          });

          //añadimos el consumo diario al objeto de acumulados diarios
          dailyAccumulate[date] = dailyConsumption;

          if (!isNaN(dailyConsumption)) {
            //sumamos el consumo diario al consumo mesual
            if (!anualMonthAccumulate[year]) {
              anualMonthAccumulate[year] = {};
              anualMonthAccumulate[year][month] = 0;
              anualMonthAccumulate[year][month] += dailyConsumption;
            } else {
              if (!anualMonthAccumulate[year][month]) {
                anualMonthAccumulate[year][month] = 0;
              }
              anualMonthAccumulate[year][month] += dailyConsumption;
            }
          }
          //sumamos el 24 valores a la cuenta
          if (!anualMonthCount[year]) {
            anualMonthCount[year] = {};
            anualMonthCount[year][month] = 1;
          } else {
            if (!anualMonthCount[year][month]) {
              anualMonthCount[year][month] = 0;
            }
            anualMonthCount[year][month] += 1;
          }

          //rellenamos los acumulados semanales
          if (!weeklyAverageConsumption[year]) {
            weeklyAverageConsumption[year] = {};
            weeklyAverageConsumption[year][dayOfWeekIndex] = {
              acumulado: 0,
              cuenta: 0,
            };
            weeklyAverageConsumption[year][dayOfWeekIndex].acumulado +=
              dailyConsumption;
            weeklyAverageConsumption[year][dayOfWeekIndex].cuenta += 1;
          } else {
            if (!weeklyAverageConsumption[year][dayOfWeekIndex]) {
              weeklyAverageConsumption[year][dayOfWeekIndex] = {
                acumulado: 0,
                cuenta: 0,
              };
            }
            weeklyAverageConsumption[year][dayOfWeekIndex].acumulado +=
              dailyConsumption;
            weeklyAverageConsumption[year][dayOfWeekIndex].cuenta += 1;
          }
        }
      }
    }

    //una vez finalizado el procesamiento de la curva, se calculan las medias mensuales y acumulados anuales

    //calculo del agregado anual y media mensual
    let anualMonthlyAverage: Record<number | string, Record<string, any>> &
      StatisticResult = {};

    Object.keys(anualMonthAccumulate).map((year) => {
      anualMonthlyAverage[year] = {};
      //iteramos para todos los meses del año
      let acumuladoAnual = 0;
      Object.keys(anualMonthAccumulate[year]).map((mes) => {
        //acumulamos el anual
        acumuladoAnual += anualMonthAccumulate[year][mes];
        //calculamos la media mensual
        anualMonthlyAverage[year][mes] = parseFloat(
          (
            anualMonthAccumulate[year][mes] / anualMonthCount[year][mes]
          ).toFixed(6)
        );
      });
      anualMonthAccumulate[year].yearly = acumuladoAnual;
    });

    let weeklyAverage: Record<number | string, Record<string, any>> &
      StatisticResult = {};
    //calculamos la media de los consumos diariso medios semanales
    //console.log(consumoMedioSemanal)
    Object.keys(weeklyAverageConsumption).map((year) => {
      const yearI = parseInt(year);
      weeklyAverage[year] = {};

      Object.keys(weeklyAverageConsumption[yearI]).map((weekday) => {
        weeklyAverage[year][weekday] = parseFloat(
          (
            weeklyAverageConsumption[yearI][weekday].acumulado /
            weeklyAverageConsumption[yearI][weekday].cuenta
          ).toFixed(6)
        );
      });
    });

    let hourlyAverage: Record<number | string, Record<string, any>> &
      StatisticResult = {};
    //calculamos la media de los consumos diariso medios semanales
    //console.log(consumoMedioHorario)
    Object.keys(hourlyAverageConsumption).map((year) => {
      const yearI = parseInt(year);
      hourlyAverage[yearI] = {};

      Object.keys(hourlyAverageConsumption[yearI]).map((hour) => {
        hourlyAverage[year][hour] = parseFloat(
          (
            hourlyAverageConsumption[yearI][hour].acumulado /
            hourlyAverageConsumption[yearI][hour].cuenta
          ).toFixed(6)
        );
      });
    });

    //calculamos la medua de los consumos medios horarios por dia de la semana
    Object.keys(weeklyhourlyAverageConsumption).map((year) => {
      const yearI = parseInt(year);

      Object.keys(weeklyhourlyAverageConsumption[yearI]).map((weekDay) => {
        const weekDayI = parseInt(weekDay);

        Object.keys(weeklyhourlyAverageConsumption[yearI][weekDayI]).map(
          (hour) => {
            const hourI = parseInt(hour);

            weeklyhourlyAverageConsumption[yearI][weekDayI][hourI] = parseFloat(
              (
                weeklyhourlyAverageConsumption[yearI][weekDayI][hourI]
                  .acumulado /
                weeklyhourlyAverageConsumption[yearI][weekDayI][hourI].cuenta
              ).toFixed(6)
            );
          }
        );
      });
    });

    //Añadimos definiciones explicativas a los resultados
    dailyAccumulate.definition = "Acumulado de consumo diario";
    anualMonthAccumulate.definition =
      "Acumulado de consumo para cada mes de cada año";
    anualMonthCount.definition = "Número de dias de cada mes de cada año";
    anualMonthlyAverage.definition =
      "Consumo medio diario de cada mes de cada año";
    periodoAgregattion.definition =
      "Consumo acumulado por periodo para cada año";
    hourlyPeriodDistribution.definition =
      "Distribución horaria de los periodos para cada año";
    weeklyAverage.definition =
      "Media diaria de consumo para cada dia de la semana de cada año. (Distribución semenal media)";
    hourlyAverage.definition =
      "Media horaria del consumo para cada año. (Distribución horaria media)";
    weeklyAverage.definition =
      "Media anual de cada hora de cada dia de la semana";

    return {
      identifier: this.identifier,
      statistics: {
        dailyAccumulate,
        anualMonthAccumulate,
        anualMonthCount,
        anualMonthlyAverage,
        periodoAgregattion,
        hourlyPeriodDistribution,
        weeklyhourlyAverageConsumption,
        weeklyAverage,
        hourlyAverage,
        min,
        max,
      },
    };
  }

  /**
   * Applyes a multiplier to every consumption value
   * @param multiplier
   */
  applyMultiplier(multiplier: number): PowerCurve {
    const curve = this.days;
    let resultCurve: DayCurve[] = [];

    resultCurve = curve.map((day) => {
      let resultDay: DayCurve = { date: day.date };
      let aggregatedValuesList: Record<string, number> =
        JSON.parse(JSON.stringify(day.valuesList)) || {};
      if (aggregatedValuesList && day.valuesList) {
        Object.keys(day.valuesList).forEach((hour) => {
          if (hour) {
            aggregatedValuesList![hour] *= multiplier;
          }
        });
      }
      resultDay.valuesList = aggregatedValuesList;
      return resultDay;
    });
    return new PowerCurve(
      resultCurve,
      this.ignore0,
      this.identifier,
      this.parseDate
    );
  }

  /**
   * Returns a new power curve with only positive values
   */
  filterNegativeValues(): PowerCurve {
    const curve = this.days;
    let resultCurve: DayCurve[] = [];

    resultCurve = curve.map((day) => {
      let resultDay: DayCurve = { date: day.date };
      let aggregatedValuesList: Record<string, number> =
        JSON.parse(JSON.stringify(day.valuesList)) || {};
      if (aggregatedValuesList && day.valuesList) {
        Object.keys(day.valuesList).forEach((hour) => {
          if (hour) {
            aggregatedValuesList![hour] =
              aggregatedValuesList![hour] >= 0
                ? aggregatedValuesList![hour]
                : 0;
          }
        });
      }
      resultDay.valuesList = aggregatedValuesList;
      return resultDay;
    });
    return new PowerCurve(
      resultCurve,
      this.ignore0,
      this.identifier,
      this.parseDate
    );
  }
  /**
   * Returns a new power curve with only negative values
   */
  filterPositiveValues(): PowerCurve {
    const curve = this.days;
    let resultCurve: DayCurve[] = [];

    resultCurve = curve.map((day) => {
      let resultDay: DayCurve = { date: day.date };
      let aggregatedValuesList: Record<string, number> =
        JSON.parse(JSON.stringify(day.valuesList)) || {};
      if (aggregatedValuesList && day.valuesList) {
        Object.keys(day.valuesList).forEach((hour) => {
          if (hour) {
            aggregatedValuesList![hour] =
              aggregatedValuesList![hour] <= 0
                ? aggregatedValuesList![hour]
                : 0;
          }
        });
      }
      resultDay.valuesList = aggregatedValuesList;
      return resultDay;
    });
    return new PowerCurve(
      resultCurve,
      this.ignore0,
      this.identifier,
      this.parseDate
    );
  }

  aggregateByPeriod(
    periodDistribution: DayCurve[]
  ): AbstractByPeriodValuesDto<number> {
    let periodAggregation: AbstractByPeriodValuesDto<number> = {};
    try {
      if (periodDistribution[0].date) {
        let periodDistributionDay: DayCurve;
        //iterate throw power curve days
        this.days.forEach((day) => {
          //distintion between "T" format date and normal date
          if (periodDistribution[0].date.split("T").length > 0) {
            //get the period distribution day
            periodDistributionDay = periodDistribution.filter(
              (periodDay) => periodDay.date.split("T")[0] === day.date
            )[0];
          } else {
            //get the period distribution day
            periodDistributionDay = periodDistribution.filter(
              (periodDay) => periodDay.date === day.date
            )[0];
          }

          if (
            periodDistributionDay &&
            day.valuesList &&
            periodDistributionDay.valuesList
          ) {
            Object.keys(day.valuesList).forEach((hour) => {
              //undefined values of the curve must betreated as 0
              let currentValue =
                day.valuesList![hour] !== undefined ? day.valuesList![hour] : 0;

              let currentPeriod = ("p" +
                periodDistributionDay.valuesList![
                  hour
                ]) as keyof AbstractByPeriodValuesDto<number>;

              if (currentPeriod) {
                if (periodAggregation[currentPeriod] === undefined) {
                  periodAggregation[currentPeriod] = 0;
                }
                periodAggregation[currentPeriod]! += currentValue;
              }
            });
          }
        });
      }
    } catch (error) {
      console.error(error);
      return periodAggregation;
    }
    return periodAggregation;
  }

  /**
   * Returns a new "rotated" power curve: This starts on introduced date and last day is the previous to that one
   * @param startingDate
   * @returns
   */
  rotateCurve(startingDate: {
    day: string;
    month: string;
  }): PowerCurve | undefined {
    const numDays = this.days.length;

    const rotatedDays = [];
    let startingDateIndex;
    if (numDays) {
      //find starting date day object
      const startingDayObject = this.days.find(
        (day: DayCurve, index: number) => {
          const [_, month, day_] = day.date.split("-");

          if (startingDate.day === day_ && startingDate.month === month) {
            startingDateIndex = index;
            return true;
          }
        }
      );
      if (startingDayObject && startingDateIndex !== undefined) {
        rotatedDays.push(startingDayObject);
        //once the starting date has been found and set at the start of the days array, iterate through the rest of the days from
        //that index, pushing the intemas and filling the arrays
        //first to the right from the startingDateIndex
        for (
          let rightIndex = startingDateIndex + 1;
          rightIndex < numDays;
          rightIndex++
        ) {
          rotatedDays.push(this.days[rightIndex]);
        }
        for (let leftIndex = 0; leftIndex < startingDateIndex; leftIndex++) {
          rotatedDays.push(this.days[leftIndex]);
        }
        return new PowerCurve(
          rotatedDays,
          this.ignore0,
          "rotated curve-" + this.identifier,
          this.parseDate
        );
      }
    }
  }

  /**
   * Returns a new power curve with dates aligned with referenced one
   * @param reference
   * @returns
   */
  alignPowerCurveDates(reference: PowerCurve): PowerCurve {
    const alignedPowerCurve = new PowerCurve(
      this.days,
      this.ignore0,
      this.identifier,
      this.parseDate
    );

    const referenceDays = reference.days;
    //  const toAdaptDays = curveToAdapt.days;

    for (let referenceDay of referenceDays) {
      const referenceDate = referenceDay.date;
      const [r_year, r_month, r_day] = referenceDate.split("-");

      alignedPowerCurve.days.find((d) => {
        const [year, month, day] = d.date.split("-");
        if (month === r_month && day === r_day) {
          d.date = `${r_year}-${month}-${day}`;
        }
      });
    }
    return alignedPowerCurve;
  }

  /**
   * Returns an object with the power curve classified by years and month. Each month key contains a powerCurve with
   * the days in that month
   */
  classifyByYearsAndMonths(): Record<number, Record<number, PowerCurve>> {
    const result: Record<number, Record<number, PowerCurve>> = {};

    const classifiedByYears = this.classifyByYears();

    for (let currentYearCurveDays of classifiedByYears) {
      if (currentYearCurveDays.year && currentYearCurveDays.days) {
        result[currentYearCurveDays.year] = {};
        //iterate through every month from start date to end date of this year to get the curveDays in that month
        const [startDate, endDate] = new PowerCurve(
          //get the start date and end date of the current year curve, sorted by dates
          new PowerCurve(
            currentYearCurveDays.days,
            false,
            "",
            true
          ).sortByDate(),
          false,
          "",
          true
        ).getTotalPeriod();
        //get the month of start date and end date
        const startDateMonth = startDate.getMonth();
        const endDateMonth = endDate.getMonth();

        //iterate from start date month and end date month, filtering by dates
        for (let month = startDateMonth; month <= endDateMonth; month++) {
          //get the first and last dates of the month
          const firstDateOfMonth = new Date(
            currentYearCurveDays.year,
            month,
            1,
            12
          );
          const lastDateOfMonth = new Date(
            currentYearCurveDays.year,
            month + 1,
            0,
            12
          );
          //filter by those dates and asign it to the month index
          result[currentYearCurveDays.year][month + 1] = new PowerCurve(
            new PowerCurve(
              currentYearCurveDays.days,
              false,
              "",
              true
            ).filterByDates(
              new Date(firstDateOfMonth.toISOString().split("T")[0]),
              new Date(lastDateOfMonth.toISOString().split("T")[0])
            ),
            false,
            "",
            true
          );
        }
      }
    }

    return result;
  }
}

export interface ConsumptionCurve {
  days?: DayCurve[];
  year?: number;
  isComplete?: boolean;
}

export interface PowerCurveStatistics {
  identifier: string;
  statistics: {
    dailyAccumulate: Record<string, number> & StatisticResult;
    anualMonthAccumulate: Record<Year, Record<string | number, number>> &
      StatisticResult;
    anualMonthCount: Record<Year, Record<string | number, number>> &
      StatisticResult;
    anualMonthlyAverage: Record<Year, Record<string, any>> & StatisticResult;
    periodoAgregattion: Record<Year, Record<number, number>> & StatisticResult;
    hourlyPeriodDistribution: Record<Year, Record<string, any>> &
      StatisticResult;
    weeklyhourlyAverageConsumption: Record<
      Year,
      Record<WeekDay, Record<Hour, number>>
    >;
    weeklyAverage: Record<string | number, Record<string, any>> &
      StatisticResult;
    hourlyAverage: Record<string | number, Record<string, any>> &
      StatisticResult;
    max: Record<number, StatisticValue> & StatisticResult;
    min: Record<number, StatisticValue> & StatisticResult;
  };
}
//{[YYYY]:{date: null, hora: null, valor: null, diaSemana: null }}
export interface StatisticValue {
  period?: number;

  date?: string;
  hour?: number | string;
  value?: number;
  weekDay?: number;
}
export interface StatisticResult {
  definition?: string;
}
export interface DayCurve {
  unit?: string;
  date: string;
  valuesList?: Record<string, number>;
}

function leapyear(year: number): boolean {
  return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
}

export type Year = number;
export type Month = number;
export type Hour = number;
export type WeekDay = number;
