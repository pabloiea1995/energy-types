import { DayCurve, PowerCurve } from "../../energy/classes/powerCurve.class";
import { AbstractByPeriodValuesDto } from "../../energy/dtos/AbstractByPeriodValuesDto";
import { SolarStudy } from "../model/solarStudy";
import { SolarStudyResults } from "../model/solarStudyResults";

export class SolarResultCalculator {
  constructor(solarStudy: SolarStudy) {
    this.solarStudy = solarStudy;
  }
  solarStudy: SolarStudy;

  calculateResults(
    periodDistribution?: DayCurve[]
  ): SolarStudyResults | undefined {
    const results: SolarStudyResults = {};

    if (
      this.solarStudy.consumption &&
      this.aggregateProductionResults() &&
      this.solarStudy.energyPrices
    ) {
      //calculate total net consumption
      const totalProductionCurve = this.aggregateProductionResults();
      results.netConsumption = this.solarStudy.consumption.aggregatePowerCurve(
        totalProductionCurve.applyMultiplier(-1)
      );

      //console.log(this.solarStudy.consumption.getTotalAcumulate());
      //console.log(totalProductionCurve.applyMultiplier(-1).getTotalAcumulate());

      //calculate total production
      results.totalProduction = totalProductionCurve.getTotalAcumulate();

      //calculate production coverage
      results.totalConsumptionCoverage =
        (results.totalProduction /
          this.solarStudy.consumption.getTotalAcumulate()) *
        100;

      if (periodDistribution && this.solarStudy.energyPrices) {
        //filter negative values on net consumptionm curve
        const positiveNetconsumptionCurve = results.netConsumption.filterNegativeValues();
        // //console.log(
        //   "positiveNetconsumptionCurve",
        //   positiveNetconsumptionCurve.getTotalAcumulate()
        // );
        //aggregate net consumption by period
        const positivenetconsumptionByPeriod = positiveNetconsumptionCurve.aggregateByPeriod(
          periodDistribution
        );

        //agregatte raw consumption by period
        const rawConsumptionByPeriod = this.solarStudy.consumption.aggregateByPeriod(
          periodDistribution
        );

        //console.log(this.solarStudy.energyPrices);
        //raw spending by period
        results.totalRawSpendingByPeriod = {
          p1:
            (rawConsumptionByPeriod?.p1 || 0) *
            (this.solarStudy.energyPrices.p1 || 0),
          p2:
            (rawConsumptionByPeriod?.p2 || 0) *
            (this.solarStudy.energyPrices.p2 || 0),
          p3:
            (rawConsumptionByPeriod?.p3 || 0) *
            (this.solarStudy.energyPrices.p3 || 0),
          p4:
            (rawConsumptionByPeriod?.p4 || 0) *
            (this.solarStudy.energyPrices.p4 || 0),
          p5:
            (rawConsumptionByPeriod?.p5 || 0) *
            (this.solarStudy.energyPrices.p5 || 0),
          p6:
            (rawConsumptionByPeriod?.p6 || 0) *
            (this.solarStudy.energyPrices.p6 || 0),
        };
        // console.log("rawConsumptionByPeriod", rawConsumptionByPeriod);
        // console.log(
        //   "this.solarStudy.energyPrices",
        //   this.solarStudy.energyPrices
        // );
        // console.log(
        //   "results.totalNetSpendingByPeriod",
        //   results.totalRawSpendingByPeriod
        // );
        let totalRawSpendingByPeriod: any = results.totalRawSpendingByPeriod;
        let periodValuesArray = Object.keys(totalRawSpendingByPeriod).map(
          (hour) => totalRawSpendingByPeriod[hour]
        );
        results.totalRawSpending = periodValuesArray.reduce((a, b) => a + b, 0);
        //net spending by period
        // //console.log(
        //   "this.solarStudy.energyPrices",
        //   this.solarStudy.energyPrices
        // );
        // //console.log(
        //   "positivenetconsumptionByPeriod",
        //   positivenetconsumptionByPeriod
        // );
        // //console.log(
        //   (positivenetconsumptionByPeriod?.p1 || 0) *
        //     (this.solarStudy.energyPrices.p1 || 0)
        // );
        results.totalNetSpendingByPeriod = {
          p1:
            (positivenetconsumptionByPeriod?.p1 || 0) *
            (this.solarStudy.energyPrices.p1 || 0),
          p2:
            (positivenetconsumptionByPeriod?.p2 || 0) *
            (this.solarStudy.energyPrices.p2 || 0),
          p3:
            (positivenetconsumptionByPeriod?.p3 || 0) *
            (this.solarStudy.energyPrices.p3 || 0),
          p4:
            (positivenetconsumptionByPeriod?.p4 || 0) *
            (this.solarStudy.energyPrices.p4 || 0),
          p5:
            (positivenetconsumptionByPeriod?.p5 || 0) *
            (this.solarStudy.energyPrices.p5 || 0),
          p6:
            (positivenetconsumptionByPeriod?.p6 || 0) *
            (this.solarStudy.energyPrices.p6 || 0),
        };
        // //console.log(
        //   "results.totalNetSpendingByPeriod",
        //   results.totalNetSpendingByPeriod
        // );
        results.totalNetSpending = 0;

        let totalNetSpendingByPeriod: any = results.totalNetSpendingByPeriod;
        periodValuesArray = Object.keys(totalNetSpendingByPeriod).map(
          (hour) => totalNetSpendingByPeriod[hour]
        );
        results.totalNetSpending = periodValuesArray.reduce((a, b) => a + b, 0);

        //console.log("results.totalNetSpending", results.totalNetSpending);

        //calculate total energy savings by period [kWh]
        const netConsumedProductionByPeriod = {
          p1:
            (rawConsumptionByPeriod?.p1 || 0) -
            (positivenetconsumptionByPeriod?.p1 || 0),

          p2:
            (rawConsumptionByPeriod?.p2 || 0) -
            (positivenetconsumptionByPeriod?.p2 || 0),

          p3:
            (rawConsumptionByPeriod?.p3 || 0) -
            (positivenetconsumptionByPeriod?.p3 || 0),

          p4:
            (rawConsumptionByPeriod?.p4 || 0) -
            (positivenetconsumptionByPeriod?.p4 || 0),

          p5:
            (rawConsumptionByPeriod?.p5 || 0) -
            (positivenetconsumptionByPeriod?.p5 || 0),

          p6:
            (rawConsumptionByPeriod?.p6 || 0) -
            (positivenetconsumptionByPeriod?.p6 || 0),
        };

        // //console.log(
        //   "netConsumedProductionByPeriod",
        //   netConsumedProductionByPeriod
        // );

        // //console.log("energyPrices", this.solarStudy.energyPrices);
        //calculate total economic savings by period [€]
        results.totalSavingsByPeriod = {
          p1:
            (netConsumedProductionByPeriod?.p1 || 0) *
            (this.solarStudy.energyPrices.p1 || 0),
          p2:
            (netConsumedProductionByPeriod?.p2 || 0) *
            (this.solarStudy.energyPrices.p2 || 0),
          p3:
            (netConsumedProductionByPeriod?.p3 || 0) *
            (this.solarStudy.energyPrices.p3 || 0),
          p4:
            (netConsumedProductionByPeriod?.p4 || 0) *
            (this.solarStudy.energyPrices.p4 || 0),
          p5:
            (netConsumedProductionByPeriod?.p5 || 0) *
            (this.solarStudy.energyPrices.p5 || 0),
          p6:
            (netConsumedProductionByPeriod?.p6 || 0) *
            (this.solarStudy.energyPrices.p6 || 0),
        };
        // //console.log(
        //   "results.totalSavingsByPeriod",
        //   results.totalSavingsByPeriod
        // );

        //calculate total energy savings
        results.totalSavings = 0;
        let totalSavingsByPeriod: any = results.totalSavingsByPeriod;
        periodValuesArray = Object.keys(totalSavingsByPeriod).map(
          (hour) => totalSavingsByPeriod[hour]
        );
        results.totalSavings = periodValuesArray.reduce((a, b) => a + b, 0);
        // //console.log("results.totalSavings", results.totalSavings);

        //get excesses curve
        results.excessesCurve = totalProductionCurve
          .aggregatePowerCurve(this.solarStudy.consumption.applyMultiplier(-1))
          .filterNegativeValues();
        results.totalExcessesByPeriod = results.excessesCurve.aggregateByPeriod(
          periodDistribution
        );

        results.totalExcesses = 0;
        let totalExcessesByPeriod: any = results.totalExcessesByPeriod;
        periodValuesArray = Object.keys(totalExcessesByPeriod).map(
          (hour) => totalExcessesByPeriod[hour]
        );
        results.totalExcesses = periodValuesArray.reduce((a, b) => a + b, 0);
      }

      return results;
    }
  }

  aggregateProductionResults(): PowerCurve {
    const curves = this.getSeriesProductionCurves();

    let initialCurve = curves[0];
    curves.forEach((curve, index) => {
      if (index > 0) {
        initialCurve = initialCurve.aggregatePowerCurve(curve);
      }
    });

    return new PowerCurve(
      initialCurve.days,
      false,
      initialCurve.identifier,
      true
    );
  }

  getSeriesProductionCurves(): PowerCurve[] {
    let result: PowerCurve[] = [];

    this.solarStudy.surfaces?.forEach((surface) => {
      if (surface && surface.production) {
        result.push(surface.production);
      }
    });
    return result;
  }
}
