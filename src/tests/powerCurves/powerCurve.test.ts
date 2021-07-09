import { PowerCurve } from "../../energy/classes/powerCurve.class";
import { expect } from "chai";
import { curve } from "./consumptionCurveMockup";
import { periodDistributionMockup } from "./periodDistributionMockup";
import { Increasable } from "../../commons/increaseable";

//statistics tests
describe("Power curve statistics calculation", () => {
  let mockedPowerCurve = new PowerCurve(curve.days, true, "test curve");

  let result = mockedPowerCurve.calculateStatistics(periodDistributionMockup);
  // console.log(result.statistics.weeklyhourlyAverageConsumption)
  // let years = Object.keys(mockedPowerCurve.classifyByYears())
  it("calculates with no errors", () => {
    expect(result).not.to.be.equal(null);
  });
  it("calculates all properties", () => {
    expect(result.statistics.dailyAccumulate).not.to.be.equal(null);
    expect(result.statistics.anualMonthAccumulate).not.to.be.equal(null);
    expect(result.statistics.anualMonthCount).not.to.be.equal(null);
    expect(result.statistics.anualMonthlyAverage).not.to.be.equal(null);
    expect(result.statistics.periodoAgregattion).not.to.be.equal(null);
    expect(result.statistics.hourlyPeriodDistribution).not.to.be.equal(null);
    expect(result.statistics.weeklyhourlyAverageConsumption).not.to.be.equal(
      null
    );
    expect(result.statistics.weeklyAverage).not.to.be.equal(null);
    expect(result.statistics.hourlyAverage).not.to.be.equal(null);
    expect(result.statistics.min).not.to.be.equal(null);
    expect(result.statistics.max).not.to.be.equal(null);

    expect(result.statistics.dailyAccumulate).not.to.be.equal(undefined);
    expect(result.statistics.anualMonthAccumulate).not.to.be.equal(undefined);
    expect(result.statistics.anualMonthCount).not.to.be.equal(undefined);
    expect(result.statistics.anualMonthlyAverage).not.to.be.equal(undefined);
    expect(result.statistics.periodoAgregattion).not.to.be.equal(undefined);
    expect(result.statistics.hourlyPeriodDistribution).not.to.be.equal(
      undefined
    );
    expect(result.statistics.weeklyhourlyAverageConsumption).not.to.be.equal(
      undefined
    );
    expect(result.statistics.weeklyAverage).not.to.be.equal(undefined);
    expect(result.statistics.hourlyAverage).not.to.be.equal(undefined);
    expect(result.statistics.min).not.to.be.equal(undefined);
    expect(result.statistics.max).not.to.be.equal(undefined);

    expect(result.statistics.dailyAccumulate).not.to.be.equal({});
    expect(result.statistics.anualMonthAccumulate).not.to.be.equal({});
    expect(result.statistics.anualMonthCount).not.to.be.equal({});
    expect(result.statistics.anualMonthlyAverage).not.to.be.equal({});
    expect(result.statistics.periodoAgregattion).not.to.be.equal({});
    expect(result.statistics.hourlyPeriodDistribution).not.to.be.equal({});
    expect(result.statistics.weeklyhourlyAverageConsumption).not.to.be.equal(
      {}
    );
    expect(result.statistics.weeklyAverage).not.to.be.equal({});
    expect(result.statistics.hourlyAverage).not.to.be.equal({});
    expect(result.statistics.min).not.to.be.equal({});
    expect(result.statistics.max).not.to.be.equal({});
  });
  it("Generates graphs correctly", () => {
    let graph = mockedPowerCurve.convertoToSerie();

    expect(graph).not.to.be.equal(null);

    expect(graph.x.length).to.be.equal(graph.y.length);
    expect(graph.xDailyAverage.length).to.be.equal(graph.yDailyAverage.length);
  });

  it("Generates graphs correctly with date X axis", () => {
    let graph = mockedPowerCurve.convertoToSerie();

    expect(graph).not.to.be.equal(null);

    expect(isDate(graph.x[0])).to.be.true;

    let mockedPowerCurveExplicitParseDate = new PowerCurve(
      curve.days,
      true,
      "test curve",
      true
    );

    graph = mockedPowerCurveExplicitParseDate.convertoToSerie();

    expect(graph).not.to.be.equal(null);

    expect(isDate(graph.x[0])).to.be.true;
  });
  it("Generates graphs correctly with string X axis", () => {
    let mockedPowerCurveStringXAxis = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );

    let graph = mockedPowerCurveStringXAxis.convertoToSerie();

    expect(graph).not.to.be.equal(null);
    expect(typeof graph.x[0]).to.be.equal("string");
  });
  it("Filters by dates correctly", () => {
    const startDate = new Date("2017-06-01");
    const endDate = new Date("2017-06-03");
    let filtered = new PowerCurve(
      mockedPowerCurve.filterByDates(startDate, endDate),
      false,
      "",
      false
    );

    expect(filtered).not.to.be.equal(null);

    expect(filtered.days[0].date).to.be.equal("2017-06-01");
    expect(filtered.days[filtered.days.length - 1].date).to.be.equal(
      "2017-06-03"
    );
    expect(filtered.days.length).to.be.equal(3);
  });

  it("Aggregates curves propertly", () => {
    let mockedPowerCurve = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );
    let mockedPowerCurveToAggregate = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );

    let aggregatedPowerCurve = mockedPowerCurve.aggregatePowerCurve(
      mockedPowerCurveToAggregate
    );

    expect(aggregatedPowerCurve.getTotalAcumulate()).to.be.equal(
      mockedPowerCurve.getTotalAcumulate() * 2
    );
  });
  it("Aggregates curves propertly with negative values", () => {
    let mockedPowerCurve = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );
    let mockedPowerCurveToAggregate = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );

    let aggregatedPowerCurve = mockedPowerCurve.aggregatePowerCurve(
      mockedPowerCurveToAggregate.applyMultiplier(-1)
    );

    expect(aggregatedPowerCurve.getTotalAcumulate()).to.be.lessThan(
      mockedPowerCurve.getTotalAcumulate()
    );
  });

  it("Applies multiplier curves propertly", () => {
    let mockedPowerCurve = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );
    expect(mockedPowerCurve.applyMultiplier(2).getTotalAcumulate()).to.be.equal(
      mockedPowerCurve.getTotalAcumulate() * 2
    );
  });
  it("Applies rotates correctly", () => {
    let mockedPowerCurve = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );
    const rotatedMockedCurve = mockedPowerCurve.rotateCurve({
      day: "01",
      month: "03",
    });
    if (rotatedMockedCurve) {
      expect(rotatedMockedCurve.days[0].date.split("-")[1]).to.be.equal("03") &&
        expect(rotatedMockedCurve.days[0].date.split("-")[2]).to.be.equal("01");
      expect(rotatedMockedCurve.days.length).to.be.equal(
        mockedPowerCurve.days.length
      );
    }
  });

  it("Aligns curves propertly", () => {
    let mockedPowerCurve = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );
    const rotatedMockedCurve = mockedPowerCurve.rotateCurve({
      day: "01",
      month: "03",
    });

    const alignedMockedCurve =
      rotatedMockedCurve?.alignPowerCurveDates(mockedPowerCurve);
    if (rotatedMockedCurve && alignedMockedCurve)
      expect(mockedPowerCurve.days[0].date).to.be.equal(
        alignedMockedCurve.days[0].date
      );
  });

  it("Aggregates curve by period propertly", () => {
    let mockedPowerCurve = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );
    const aggregatedByPeriod: any = mockedPowerCurve.aggregateByPeriod(
      periodDistributionMockup
    );
    expect(aggregatedByPeriod).not.to.be.equal(null);
    let periodValuesArray = Object.keys(aggregatedByPeriod).map(
      (hour) => aggregatedByPeriod[hour]
    );
    let totalPeriodAccumulate = periodValuesArray.reduce((a, b) => a + b, 0);
    expect(totalPeriodAccumulate).to.be.equal(
      mockedPowerCurve.getTotalAcumulate()
    );
  });

  it("Classify by years and months correctly", () => {
    let mockedPowerCurve = new PowerCurve(
      curve.days,
      true,
      "test curve",
      false
    );

    const classifiedByYearsAndMonths =
      mockedPowerCurve.classifyByYearsAndMonths();

    expect(classifiedByYearsAndMonths).not.to.be.equal(undefined);

    //aggregate all values and cehck it corresponds to original curva accumulated
    let classifiedAccumulated = new Increasable();
    for (let year in classifiedByYearsAndMonths) {
      const currentYear = classifiedByYearsAndMonths[year];
      for (let month in currentYear) {
        const currentMonthCurve = currentYear[month];
        classifiedAccumulated.increase(currentMonthCurve.getTotalAcumulate());
      }
    }

    expect(classifiedAccumulated.get()).to.be.equal(
      mockedPowerCurve.getTotalAcumulate()
    );
  });
});

const isDate = (date: any) => {
  if (Object.prototype.toString.call(date) === "[object Date]") {
    // it is a date
    if (isNaN(date.getTime())) {
      // d.valueOf() could also work
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};
