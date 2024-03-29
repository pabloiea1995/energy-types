import { expect } from "chai";
import {
  applyProfileToConsumption,
  ConsumptionIntroductionModes,
} from "../../energy/calculations/applyProfileToConsumption";
import { PowerCurve } from "../../energy/classes/powerCurve.class";
import { mockedPeriodDistributionSolar } from "./mockedPeriodDistributionSolar";
import { profile } from "./mockedProfile";

describe("Applying profile to consumption distribution", () => {
  // console.log(result.statistics.weeklyhourlyAverageConsumption)
  // let years = Object.keys(mockedPowerCurve.classifyByYears())
  it("calculates method totalConsumption with no erros", () => {
    const result = applyProfileToConsumption(
      ConsumptionIntroductionModes.TOTAL_CONSUMPTION,
      profile.profile!,
      1000
    );
    //console.log(result?.days[0]);
    expect(result).not.to.be.equal(null);
    expect(result?.days[0]).not.to.be.equal(null);
    expect(result?.days[0].valuesList!["1"]).not.to.be.equal(null);
    expect(typeof result?.days[0].valuesList!["1"]).to.be.equal("number");
  });
  it("calculates method monthConsumption with no erros", () => {
    const result = applyProfileToConsumption(
      ConsumptionIntroductionModes.MONTH_CONSUMPTION,
      profile.profile!,
      {
        2020: {
          1: 1000,
          2: 1000,
          3: 1000,
          4: 1000,
          5: 1000,
        },
      }
    );
    //console.log(result?.days[0]);
    expect(result).not.to.be.equal(null);
    expect(result?.days[0]).not.to.be.equal(null);
    expect(result?.days[0].valuesList!["1"]).not.to.be.equal(null);
    expect(typeof result?.days[0].valuesList!["1"]).to.be.equal("number");
  });
  it("calculates method consumptionByPeriod with no erros", () => {
    const result = applyProfileToConsumption(
      ConsumptionIntroductionModes.CONSUMPTION_BY_PERIOD,
      profile.profile!,
      {
        p1: 1000,
        p2: 1000,
        p3: 1000,
      },
      mockedPeriodDistributionSolar
    );
    //console.log(result?.days[0]);
    expect(result).not.to.be.equal(null);
    expect(result?.days[0]).not.to.be.equal(null);
    expect(result?.days[0].valuesList!["1"]).not.to.be.equal(null);
    expect(typeof result?.days[0].valuesList!["1"]).to.be.equal("number");
    expect(Math.round(result?.getTotalAcumulate() || 0)).to.be.equal(3000);
  });
});
