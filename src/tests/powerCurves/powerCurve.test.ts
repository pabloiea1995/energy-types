import { PowerCurve } from "../../energy/classes/powerCurve.class";
import { expect } from "chai";
import { curve } from "./consumptionCurveMockup";
import { periodDistributionMockup } from "./periodDistributionMockup";
import { AbstractByPeriodValuesDto } from "../../energy/dtos/AbstractByPeriodValuesDto";

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
