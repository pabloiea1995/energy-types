import { ProfilingStrategyTypes } from "../enums/ProfilingStrategyTypes.enum";

export class ProfilingStrategy {
  idProfilingStrategy: number;

  type: ProfilingStrategyTypes;
  consumptionUnit: string;
  totalConsumption?: number;

  monthlyConsumptionJSON?: string;

  periodConsumptionJSON?: string;

  monthlyPeriodConsumptionJSON?: string;
}
