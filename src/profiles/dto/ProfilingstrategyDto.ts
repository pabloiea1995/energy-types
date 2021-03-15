import { ProfilingStrategyTypes } from "../enums/ProfilingStrategyTypes.enum";

export type Year = number;
export type Month = number;
export type MonthlyConsumption = number;
export type Period = number;
export type ConsumptionType = number;
export class ProfilingStrategyDto {
  type: ProfilingStrategyTypes;

  totalConsumption: ConsumptionType;

  monthlyConsumptionJSON: Record<Year, Record<Month, MonthlyConsumption>>;

  periodConsumptionJSON: Record<Year, Record<Period, ConsumptionType>>;

  monthlyPeriodConsumptionJSON: Record<
    Year,
    Record<Month, Record<Period, ConsumptionType>>
  >;
}
