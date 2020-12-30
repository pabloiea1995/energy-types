"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerCurve = void 0;
class PowerCurve {
    constructor(daysList, ignore0, identifier) {
        this.days = daysList;
        this.ignore0 = ignore0 || true;
        this.identifier = identifier;
    }
    /**
     * Converts curve to a data object ready to be ploted by a charting library like react-plotly.js
     */
    convertoToSerie() {
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
                    if (currentDay.valuesList[i.toString()] !== 0 && currentDay.valuesList[i.toString()] !== undefined) {
                        y.push(currentDay.valuesList[i]);
                        x.push(`H${i} ${currentDay.date}`);
                        if (currentDay.valuesList[i]) {
                            let yS = currentDay.valuesList[i].toString();
                            dailyAccumulate += parseFloat(yS);
                        }
                    }
                }
                else {
                    //si no se ignoran los 0, solo se ignora el 0 en la hora 25
                    if (currentDay.valuesList[i.toString()] === 0 || i === 25) {
                    }
                    else {
                        y.push(currentDay.valuesList[i]);
                        x.push(`H${i} ${currentDay.date}`);
                        if (currentDay.valuesList[i]) {
                            let yS = currentDay.valuesList[i].toString();
                            dailyAccumulate += parseFloat(yS);
                        }
                    }
                }
            }
            dailyAverage = dailyAccumulate / 24;
            xDailyAverage.push(`${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}`);
            yDailyAverage.push(dailyAverage);
        }
        return { x, y, name: this.identifier, xDailyAverage, yDailyAverage };
    }
    /**
     * Returns starting and ending dates of the curve
     */
    getTotalPeriod() {
        return [new Date(this.sortByDate()[0].date), new Date(this.sortByDate()[this.days.length - 1].date)];
    }
    /**
     * sorts a curve by date ascending
     */
    sortByDate() {
        return this.days.sort((today, tomorrow) => new Date(today.date).getTime() - new Date(tomorrow.date).getTime());
    }
    /**
     * filters days values by given start and end date
     */
    filterByDates(startDate, endDate) {
        if (startDate && endDate) {
            return this.days.filter(day => new Date(day.date) >= startDate && new Date(day.date) <= endDate);
        }
        if (startDate) {
            return this.days.filter(day => new Date(day.date) >= startDate);
        }
        if (endDate) {
            return this.days.filter(day => new Date(day.date) <= endDate);
        }
        return [];
    }
    /**
     * Calculates acumulate of hourly values
     */
    getTotalAcumulate() {
        let acumulate = 0;
        //console.log(this.dias)
        this.days.forEach(day => {
            const values = day.valuesList;
            if (values) {
                const hours = Object.keys(values);
                hours.forEach(hour => {
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
    classifyByYears() {
        let years = {};
        let yearsCounter = {};
        this.days.forEach(day => {
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
        return Object.keys(years).map(year => ({
            year: parseInt(year),
            days: years[year],
            isComplete: (yearsCounter[year] / (leapyear(parseInt(year)) ? 366 : 365) === 1)
        }));
    }
    /**
     * Calculates statistics of the consumption curva by year
     */
    calculateStatistics(periodDistribution) {
        //inicialización de los objetos resultado
        //acumulados diarios 
        //formato -> {[YYYY-MM-DD]: XX.XX,[YYYY-MM-DD]: XX.XX ... }
        let dailyAccumulate = {};
        //acumulados de consumo para cada par mes-año
        //formato -> {[YYYY]:{1: XX.XX, 2: XX.XX ... 12: XX.XX} ... }
        let anualMonthAccumulate = {};
        //cuenta total de valores para cada par mes-año
        //formato -> {[YYYY]:{1: XX, 2: XX ... 12: XX} ... }
        let anualMonthCount = {};
        //maximo de consumo con date y hora y periodo (si se ha introducido distribución de periodos)
        //formato -> {[YYYY]:{date: null, hora: null, valor: null, diaSemana: null }}
        let max = {};
        //minimo de consumo con date y hora y periodo (si se ha introducido distribución de periodos)
        let min = {};
        //agregacion por periodos
        let periodoAgregattion = {};
        //consumo medio por dia de la semana para cada año
        let weeklyAverageConsumption = {};
        //consumo medio por hora del dia para cada año
        let hourlyAverageConsumption = {};
        let weeklyhourlyAverageConsumption = {};
        //curva de distribución horaria por periodo para cada año para la tarifa de acceso seleccionada en la curva
        let hourlyPeriodDistribution = {};
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
                    const dateDateObject = new Date(year, month - 1, parseInt(dayOfMonth), 12);
                    //dia de la semana empezando en lunes = 1 y domingo 7
                    const dayOfWeekIndex = dateDateObject.getDay() === 0 ? 7 : dateDateObject.getDay();
                    //variable para acumular el consumo diario 
                    let dailyConsumption = 0;
                    //recorremos los valores horarios de valuesList
                    Object.keys(valuesList).map(hourS => {
                        let hour = parseInt(hourS);
                        let consumoHorario = valuesList[hour];
                        //Acumulamos el consumo diario
                        if (!isNaN(consumoHorario)) {
                            //si existe curva de periodos para esta curva, se acumula el consumo en su periodo correspondiente
                            if (periodDistribution) {
                                //console.log(periodDistribution)
                                if (periodDistribution[date]) {
                                    //console.log(periodDistribution[date])
                                    if (!hourlyPeriodDistribution[year]) {
                                        hourlyPeriodDistribution[year] = {};
                                    }
                                    hourlyPeriodDistribution[year][date] = periodDistribution[date];
                                    //se obtiene el periodo de la hora actual
                                    let periodo = periodDistribution[date][hour];
                                    if (periodo) {
                                        if ((!periodoAgregattion[year])) {
                                            periodoAgregattion[year] = {};
                                            periodoAgregattion[year][periodo] = consumoHorario;
                                        }
                                        else {
                                            if (!periodoAgregattion[year][periodo]) {
                                                periodoAgregattion[year][periodo] = consumoHorario;
                                            }
                                            else {
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
                                if (max[year].value < consumoHorario) {
                                    max[year].value = consumoHorario;
                                    max[year].date = date;
                                    max[year].hour = hour;
                                    max[year].weekDay = dayOfWeekIndex;
                                    if (periodDistribution) {
                                        if (periodDistribution[date]) {
                                            max[year].period = periodDistribution[date][hour];
                                        }
                                    }
                                }
                            }
                            else {
                                max[year].value = consumoHorario;
                                max[year].date = date;
                                max[year].hour = hour;
                                max[year].weekDay = dayOfWeekIndex;
                                if (periodDistribution) {
                                    if (periodDistribution[date]) {
                                        max[year].period = periodDistribution[date][hour];
                                    }
                                }
                            }
                            //Primero contrastamos el valor con el valor de maximo y minimo, para ver si es un máximo o minimo
                            if (min[year].value) {
                                if (min[year].value > consumoHorario) {
                                    min[year].value = consumoHorario;
                                    min[year].date = date;
                                    min[year].hour = hour;
                                    min[year].weekDay = dayOfWeekIndex;
                                    if (periodDistribution) {
                                        if (periodDistribution[date]) {
                                            min[year].period = periodDistribution[date][hour];
                                        }
                                    }
                                }
                            }
                            else {
                                min[year].value = consumoHorario;
                                min[year].date = date;
                                min[year].hour = hour;
                                min[year].weekDay = dayOfWeekIndex;
                                if (periodDistribution) {
                                    if (periodDistribution[date]) {
                                        min[year].period = periodDistribution[date][hour];
                                    }
                                }
                            }
                            if (!hourlyAverageConsumption[year]) {
                                hourlyAverageConsumption[year] = {};
                                hourlyAverageConsumption[year][hour] = {
                                    acumulado: 0,
                                    cuenta: 0
                                };
                                hourlyAverageConsumption[year][hour].acumulado += consumoHorario;
                                hourlyAverageConsumption[year][hour].cuenta += 1;
                            }
                            else {
                                if (!hourlyAverageConsumption[year][hour]) {
                                    hourlyAverageConsumption[year][hour] = {
                                        acumulado: 0,
                                        cuenta: 0
                                    };
                                }
                                hourlyAverageConsumption[year][hour].acumulado += consumoHorario;
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
                                weeklyhourlyAverageConsumption[year][dayOfWeekIndex][hour] = { acumulado: 0, cuenta: 0 };
                            }
                            weeklyhourlyAverageConsumption[year][dayOfWeekIndex][hour].acumulado += consumoHorario;
                            weeklyhourlyAverageConsumption[year][dayOfWeekIndex][hour].cuenta += 1;
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
                        }
                        else {
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
                    }
                    else {
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
                            cuenta: 0
                        };
                        weeklyAverageConsumption[year][dayOfWeekIndex].acumulado += dailyConsumption;
                        weeklyAverageConsumption[year][dayOfWeekIndex].cuenta += 1;
                    }
                    else {
                        if (!weeklyAverageConsumption[year][dayOfWeekIndex]) {
                            weeklyAverageConsumption[year][dayOfWeekIndex] = {
                                acumulado: 0,
                                cuenta: 0
                            };
                        }
                        weeklyAverageConsumption[year][dayOfWeekIndex].acumulado += dailyConsumption;
                        weeklyAverageConsumption[year][dayOfWeekIndex].cuenta += 1;
                    }
                }
            }
        }
        //una vez finalizado el procesamiento de la curva, se calculan las medias mensuales y acumulados anuales
        //calculo del agregado anual y media mensual
        let anualMonthlyAverage = {};
        Object.keys(anualMonthAccumulate).map(year => {
            anualMonthlyAverage[year] = {};
            //iteramos para todos los meses del año
            let acumuladoAnual = 0;
            Object.keys(anualMonthAccumulate[year]).map(mes => {
                //acumulamos el anual
                acumuladoAnual += anualMonthAccumulate[year][mes];
                //calculamos la media mensual
                anualMonthlyAverage[year][mes] = parseFloat((anualMonthAccumulate[year][mes] / anualMonthCount[year][mes]).toFixed(6));
            });
            anualMonthAccumulate[year].yearly = acumuladoAnual;
        });
        let weeklyAverage = {};
        //calculamos la media de los consumos diariso medios semanales
        //console.log(consumoMedioSemanal)
        Object.keys(weeklyAverageConsumption).map(year => {
            const yearI = parseInt(year);
            weeklyAverage[year] = {};
            Object.keys(weeklyAverageConsumption[yearI]).map(weekday => {
                weeklyAverage[year][weekday] = parseFloat((weeklyAverageConsumption[yearI][weekday].acumulado / weeklyAverageConsumption[yearI][weekday].cuenta).toFixed(6));
            });
        });
        let hourlyAverage = {};
        //calculamos la media de los consumos diariso medios semanales
        //console.log(consumoMedioHorario)
        Object.keys(hourlyAverageConsumption).map(year => {
            const yearI = parseInt(year);
            hourlyAverage[yearI] = {};
            Object.keys(hourlyAverageConsumption[yearI]).map(hour => {
                hourlyAverage[year][hour] = parseFloat((hourlyAverageConsumption[yearI][hour].acumulado / hourlyAverageConsumption[yearI][hour].cuenta).toFixed(6));
            });
        });
        //calculamos la medua de los consumos medios horarios por dia de la semana
        Object.keys(weeklyhourlyAverageConsumption).map(year => {
            const yearI = parseInt(year);
            Object.keys(weeklyhourlyAverageConsumption[yearI]).map(weekDay => {
                const weekDayI = parseInt(weekDay);
                Object.keys(weeklyhourlyAverageConsumption[yearI][weekDayI]).map(hour => {
                    const hourI = parseInt(hour);
                    weeklyhourlyAverageConsumption[yearI][weekDayI][hourI] = parseFloat((weeklyhourlyAverageConsumption[yearI][weekDayI][hourI].acumulado / weeklyhourlyAverageConsumption[yearI][weekDayI][hourI].cuenta).toFixed(6));
                });
            });
        });
        //Añadimos definiciones explicativas a los resultados
        dailyAccumulate.definition = "Acumulado de consumo diario";
        anualMonthAccumulate.definition = "Acumulado de consumo para cada mes de cada año";
        anualMonthCount.definition = "Número de dias de cada mes de cada año";
        anualMonthlyAverage.definition = "Consumo medio diario de cada mes de cada año";
        periodoAgregattion.definition = "Consumo acumulado por periodo para cada año";
        hourlyPeriodDistribution.definition = "Distribución horaria de los periodos para cada año";
        weeklyAverage.definition = "Media diaria de consumo para cada dia de la semana de cada año. (Distribución semenal media)";
        hourlyAverage.definition = "Media horaria del consumo para cada año. (Distribución horaria media)";
        weeklyAverage.definition = "Media anual de cada hora de cada dia de la semana";
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
                max
            }
        };
    }
}
exports.PowerCurve = PowerCurve;
function leapyear(year) {
    return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
}
