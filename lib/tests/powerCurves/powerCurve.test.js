"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const powerCurve_class_1 = require("../../energy/classes/powerCurve.class");
const chai_1 = require("chai");
const consumptionCurveMockup_1 = require("./consumptionCurveMockup");
//statistics tests
describe('Power curve statistics calculation', () => {
    let mockedPowerCurve = new powerCurve_class_1.PowerCurve(consumptionCurveMockup_1.curve.days, true, "test curve");
    let result = mockedPowerCurve.calculateStatistics(null);
    // console.log(result.statistics.weeklyhourlyAverageConsumption)
    // let years = Object.keys(mockedPowerCurve.classifyByYears())
    it('calculates with no errors', () => {
        chai_1.expect(result).not.to.be.equal(null);
    });
    it('calculates all properties', () => {
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
});
