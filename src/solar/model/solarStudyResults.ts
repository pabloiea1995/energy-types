import { PowerCurve } from "../../energy/classes/powerCurve.class";
import { AbstractByPeriodValuesDto } from "../../energy/dtos/AbstractByPeriodValuesDto";

export class SolarStudyResults {
  constructor() {}

  totalProduction?: number;
  totalSavings?: number; //€ saved by production
  totalSavingsByPeriod?: AbstractByPeriodValuesDto<number>; //€ saved by production for each period

  totalConsumptionCoverage?: number; //total consumption/total production

  totalRawSpendingByPeriod?: AbstractByPeriodValuesDto<number>; //€ spent from raw consumption by period
  totalRawSpending?: number; //total € spent by raw consumption

  netConsumption?: PowerCurve;
  totalNetSpendingByPeriod?: AbstractByPeriodValuesDto<number>;
  totalNetSpending?: number;

  excessesCurve?: PowerCurve;
  totalExcesses?: number;
  totalExcessesByPeriod?: AbstractByPeriodValuesDto<number>;
}
