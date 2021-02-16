"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const powerCurve_class_1 = require("../../energy/classes/powerCurve.class");
const chai_1 = require("chai");
const consumptionCurveMockup_1 = require("./consumptionCurveMockup");
const periodDistributionMockup_1 = require("./periodDistributionMockup");
//statistics tests
describe("Power curve statistics calculation", () => {
    let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve");
    let result = mockedPowerCurve.calculateStatistics(periodDistributionMockup_1.periodDistributionMockup);
    // console.log(result.statistics.weeklyhourlyAverageConsumption)
    // let years = Object.keys(mockedPowerCurve.classifyByYears())
    it("calculates with no errors", () => {
        chai_1.expect(result).not.to.be.equal(null);
    });
    it("calculates all properties", () => {
        chai_1.expect(result.statistics.dailyAccumulate).not.to.be.equal(null);
        chai_1.expect(result.statistics.anualMonthAccumulate).not.to.be.equal(null);
        chai_1.expect(result.statistics.anualMonthCount).not.to.be.equal(null);
        chai_1.expect(result.statistics.anualMonthlyAverage).not.to.be.equal(null);
        chai_1.expect(result.statistics.periodoAgregattion).not.to.be.equal(null);
        chai_1.expect(result.statistics.hourlyPeriodDistribution).not.to.be.equal(null);
        chai_1.expect(result.statistics.weeklyhourlyAverageConsumption).not.to.be.equal(null);
        chai_1.expect(result.statistics.weeklyAverage).not.to.be.equal(null);
        chai_1.expect(result.statistics.hourlyAverage).not.to.be.equal(null);
        chai_1.expect(result.statistics.min).not.to.be.equal(null);
        chai_1.expect(result.statistics.max).not.to.be.equal(null);
        chai_1.expect(result.statistics.dailyAccumulate).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.anualMonthAccumulate).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.anualMonthCount).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.anualMonthlyAverage).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.periodoAgregattion).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.hourlyPeriodDistribution).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.weeklyhourlyAverageConsumption).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.weeklyAverage).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.hourlyAverage).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.min).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.max).not.to.be.equal(undefined);
        chai_1.expect(result.statistics.dailyAccumulate).not.to.be.equal({});
        chai_1.expect(result.statistics.anualMonthAccumulate).not.to.be.equal({});
        chai_1.expect(result.statistics.anualMonthCount).not.to.be.equal({});
        chai_1.expect(result.statistics.anualMonthlyAverage).not.to.be.equal({});
        chai_1.expect(result.statistics.periodoAgregattion).not.to.be.equal({});
        chai_1.expect(result.statistics.hourlyPeriodDistribution).not.to.be.equal({});
        chai_1.expect(result.statistics.weeklyhourlyAverageConsumption).not.to.be.equal({});
        chai_1.expect(result.statistics.weeklyAverage).not.to.be.equal({});
        chai_1.expect(result.statistics.hourlyAverage).not.to.be.equal({});
        chai_1.expect(result.statistics.min).not.to.be.equal({});
        chai_1.expect(result.statistics.max).not.to.be.equal({});
    });
    it("Generates graphs correctly", () => {
        let graph = mockedPowerCurve.convertoToSerie();
        chai_1.expect(graph).not.to.be.equal(null);
        chai_1.expect(graph.x.length).to.be.equal(graph.y.length);
        chai_1.expect(graph.xDailyAverage.length).to.be.equal(graph.yDailyAverage.length);
    });
    it("Generates graphs correctly with date X axis", () => {
        let graph = mockedPowerCurve.convertoToSerie();
        chai_1.expect(graph).not.to.be.equal(null);
        chai_1.expect(isDate(graph.x[0])).to.be.true;
        let mockedPowerCurveExplicitParseDate = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", true);
        graph = mockedPowerCurveExplicitParseDate.convertoToSerie();
        chai_1.expect(graph).not.to.be.equal(null);
        chai_1.expect(isDate(graph.x[0])).to.be.true;
    });
    it("Generates graphs correctly with string X axis", () => {
        let mockedPowerCurveStringXAxis = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        let graph = mockedPowerCurveStringXAxis.convertoToSerie();
        chai_1.expect(graph).not.to.be.equal(null);
        chai_1.expect(typeof graph.x[0]).to.be.equal("string");
    });
    it("Aggregates curves propertly", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        let mockedPowerCurveToAggregate = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        let aggregatedPowerCurve = mockedPowerCurve.aggregatePowerCurve(mockedPowerCurveToAggregate);
        chai_1.expect(aggregatedPowerCurve.getTotalAcumulate()).to.be.equal(mockedPowerCurve.getTotalAcumulate() * 2);
    });
    it("Applies multiplier curves propertly", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        chai_1.expect(mockedPowerCurve.applyMultiplier(2).getTotalAcumulate()).to.be.equal(mockedPowerCurve.getTotalAcumulate() * 2);
    });
    it("Aggregates curve by period propertly", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        const aggregatedByPeriod = mockedPowerCurve.aggregateByPeriod(periodDistributionMockup_1.periodDistributionMockup);
        chai_1.expect(aggregatedByPeriod).not.to.be.equal(null);
        let periodValuesArray = Object.keys(aggregatedByPeriod).map((hour) => aggregatedByPeriod[hour]);
        let totalPeriodAccumulate = periodValuesArray.reduce((a, b) => a + b, 0);
        chai_1.expect(totalPeriodAccumulate).to.be.equal(mockedPowerCurve.getTotalAcumulate());
    });
});
const isDate = (date) => {
    if (Object.prototype.toString.call(date) === "[object Date]") {
        // it is a date
        if (isNaN(date.getTime())) {
            // d.valueOf() could also work
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
};
