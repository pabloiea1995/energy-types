"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const powerCurve_class_1 = require("../../energy/classes/powerCurve.class");
const chai_1 = require("chai");
const consumptionCurveMockup_1 = require("./consumptionCurveMockup");
const periodDistributionMockup_1 = require("./periodDistributionMockup");
const increaseable_1 = require("../../commons/increaseable");
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
    it("Filters by dates correctly", () => {
        const startDate = new Date("2017-06-01");
        const endDate = new Date("2017-06-03");
        let filtered = new powerCurve_class_1.PowerCurve(mockedPowerCurve.filterByDates(startDate, endDate), false, "", false);
        chai_1.expect(filtered).not.to.be.equal(null);
        chai_1.expect(filtered.days[0].date).to.be.equal("2017-06-01");
        chai_1.expect(filtered.days[filtered.days.length - 1].date).to.be.equal("2017-06-03");
        chai_1.expect(filtered.days.length).to.be.equal(3);
    });
    it("Aggregates curves propertly", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        let mockedPowerCurveToAggregate = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        let aggregatedPowerCurve = mockedPowerCurve.aggregatePowerCurve(mockedPowerCurveToAggregate);
        chai_1.expect(aggregatedPowerCurve.getTotalAcumulate()).to.be.equal(mockedPowerCurve.getTotalAcumulate() * 2);
    });
    it("Aggregates curves propertly with negative values", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        let mockedPowerCurveToAggregate = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        let aggregatedPowerCurve = mockedPowerCurve.aggregatePowerCurve(mockedPowerCurveToAggregate.applyMultiplier(-1));
        chai_1.expect(aggregatedPowerCurve.getTotalAcumulate()).to.be.lessThan(mockedPowerCurve.getTotalAcumulate());
    });
    it("Applies multiplier curves propertly", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        chai_1.expect(mockedPowerCurve.applyMultiplier(2).getTotalAcumulate()).to.be.equal(mockedPowerCurve.getTotalAcumulate() * 2);
    });
    it("Applies rotates correctly", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        const rotatedMockedCurve = mockedPowerCurve.rotateCurve({
            day: "01",
            month: "03",
        });
        if (rotatedMockedCurve) {
            chai_1.expect(rotatedMockedCurve.days[0].date.split("-")[1]).to.be.equal("03") &&
                chai_1.expect(rotatedMockedCurve.days[0].date.split("-")[2]).to.be.equal("01");
            chai_1.expect(rotatedMockedCurve.days.length).to.be.equal(mockedPowerCurve.days.length);
        }
    });
    it("Aligns curves propertly", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        const rotatedMockedCurve = mockedPowerCurve.rotateCurve({
            day: "01",
            month: "03",
        });
        const alignedMockedCurve = rotatedMockedCurve === null || rotatedMockedCurve === void 0 ? void 0 : rotatedMockedCurve.alignPowerCurveDates(mockedPowerCurve);
        if (rotatedMockedCurve && alignedMockedCurve)
            chai_1.expect(mockedPowerCurve.days[0].date).to.be.equal(alignedMockedCurve.days[0].date);
    });
    it("Aggregates curve by period propertly", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        const aggregatedByPeriod = mockedPowerCurve.aggregateByPeriod(periodDistributionMockup_1.periodDistributionMockup);
        chai_1.expect(aggregatedByPeriod).not.to.be.equal(null);
        let periodValuesArray = Object.keys(aggregatedByPeriod).map((hour) => aggregatedByPeriod[hour]);
        let totalPeriodAccumulate = periodValuesArray.reduce((a, b) => a + b, 0);
        chai_1.expect(totalPeriodAccumulate).to.be.equal(mockedPowerCurve.getTotalAcumulate());
    });
    it("Classify by years and months correctly", () => {
        let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve", false);
        const classifiedByYearsAndMonths = mockedPowerCurve.classifyByYearsAndMonths();
        chai_1.expect(classifiedByYearsAndMonths).not.to.be.equal(undefined);
        //aggregate all values and cehck it corresponds to original curva accumulated
        let classifiedAccumulated = new increaseable_1.Increasable();
        for (let year in classifiedByYearsAndMonths) {
            const currentYear = classifiedByYearsAndMonths[year];
            for (let month in currentYear) {
                const currentMonthCurve = currentYear[month];
                classifiedAccumulated.increase(currentMonthCurve.getTotalAcumulate());
            }
        }
        chai_1.expect(classifiedAccumulated.get()).to.be.equal(mockedPowerCurve.getTotalAcumulate());
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
