import {PowerCurve } from '../../energy/classes/powerCurve.class'
import { expect } from 'chai';
import {curve} from './consumptionCurveMockup'



//statistics tests
describe('Power curve statistics calculation', ()=> {
    
    let mockedPowerCurve = new PowerCurve(curve.days,true, "test curve")

    let result = mockedPowerCurve.calculateStatistics(null)
   // console.log(result.statistics.weeklyhourlyAverageConsumption)
    // let years = Object.keys(mockedPowerCurve.classifyByYears())
    it('calculates with no errors', ()=> {


        


        expect(result).not.to.be.equal(null)
        
        
    


    })
    it('calculates all properties', ()=> {

        expect(result.statistics.dailyAccumulate).not.to.be.equal(null);
        expect(result.statistics.anualMonthAccumulate).not.to.be.equal(null);
        expect(result.statistics.anualMonthCount).not.to.be.equal(null);
        expect(result.statistics.anualMonthlyAverage).not.to.be.equal(null);
        expect(result.statistics.periodoAgregattion).not.to.be.equal(null);
        expect(result.statistics.hourlyPeriodDistribution).not.to.be.equal(null);
        expect(result.statistics.weeklyhourlyAverageConsumption).not.to.be.equal(null);
        expect(result.statistics.weeklyAverage).not.to.be.equal(null);
        expect(result.statistics.hourlyAverage).not.to.be.equal(null);
        expect(result.statistics.min).not.to.be.equal(null);
        expect(result.statistics.max).not.to.be.equal(null);

        expect(result.statistics.dailyAccumulate).not.to.be.equal(undefined);
        expect(result.statistics.anualMonthAccumulate).not.to.be.equal(undefined);
        expect(result.statistics.anualMonthCount).not.to.be.equal(undefined);
        expect(result.statistics.anualMonthlyAverage).not.to.be.equal(undefined);
        expect(result.statistics.periodoAgregattion).not.to.be.equal(undefined);
        expect(result.statistics.hourlyPeriodDistribution).not.to.be.equal(undefined);
        expect(result.statistics.weeklyhourlyAverageConsumption).not.to.be.equal(undefined);
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
        expect(result.statistics.weeklyhourlyAverageConsumption).not.to.be.equal({});
        expect(result.statistics.weeklyAverage).not.to.be.equal({});
        expect(result.statistics.hourlyAverage).not.to.be.equal({});
        expect(result.statistics.min).not.to.be.equal({});
        expect(result.statistics.max).not.to.be.equal({});

    })
    
})
