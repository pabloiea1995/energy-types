import { AbstractByPeriodValuesDto } from "../dtos/AbstractByPeriodValuesDto";
interface GraphSerie {
    name: string;
    x: any[];
    y: any[];
    xDailyAverage: any[];
    yDailyAverage: any[];
}
export declare class PowerCurve {
    constructor(daysList: DayCurve[], ignore0: boolean, identifier: string, parseDate?: boolean);
    days: DayCurve[];
    ignore0: boolean;
    identifier: string;
    parseDate?: boolean;
    /**
     * Converts curve to a data object ready to be ploted by a charting library like react-plotly.js
     */
    convertoToSerie(): GraphSerie;
    /**
     * Returns starting and ending dates of the curve
     */
    getTotalPeriod(): [Date, Date];
    /**
     * sorts a curve by date ascending
     */
    sortByDate(): DayCurve[];
    /**
     * filters days values by given start and end date
     */
    filterByDates(startDate?: Date, endDate?: Date): DayCurve[];
    /**
     * Calculates acumulate of hourly values
     */
    getTotalAcumulate(): number;
    /**
     * Classifies daily values on its corresponding year
     */
    classifyByYears(): ConsumptionCurve[];
    aggregatePowerCurve(curveToAggregate: PowerCurve): PowerCurve;
    /**
     * Calculates statistics of the consumption curve by year
     */
    calculateStatistics(periodDistribution?: DayCurve[]): PowerCurveStatistics;
    /**
     * Applyes a multiplier to every consumption value
     * @param multiplier
     */
    applyMultiplier(multiplier: number): PowerCurve;
    /**
     * Returns a new power curve with only positive values
     */
    filterNegativeValues(): PowerCurve;
    /**
     * Returns a new power curve with only negative values
     */
    filterPositiveValues(): PowerCurve;
    aggregateByPeriod(periodDistribution: DayCurve[]): AbstractByPeriodValuesDto<number>;
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
        anualMonthAccumulate: Record<Year, Record<string | number, number>> & StatisticResult;
        anualMonthCount: Record<Year, Record<string | number, number>> & StatisticResult;
        anualMonthlyAverage: Record<Year, Record<string, any>> & StatisticResult;
        periodoAgregattion: Record<Year, Record<number, number>> & StatisticResult;
        hourlyPeriodDistribution: Record<Year, Record<string, any>> & StatisticResult;
        weeklyhourlyAverageConsumption: Record<Year, Record<WeekDay, Record<Hour, number>>>;
        weeklyAverage: Record<string | number, Record<string, any>> & StatisticResult;
        hourlyAverage: Record<string | number, Record<string, any>> & StatisticResult;
        max: Record<number, StatisticValue> & StatisticResult;
        min: Record<number, StatisticValue> & StatisticResult;
    };
}
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
export declare type Year = number;
export declare type Month = number;
export declare type Hour = number;
export declare type WeekDay = number;
export {};
