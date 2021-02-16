import { PowerCurve } from "../../energy/classes/powerCurve.class";
import { expect } from "chai";
import { solarStudy } from "./mockedSolarStudy";
import { mockedPeriodDistributionSolar } from "./mockedPeriodDistributionSolar";
import { AbstractByPeriodValuesDto } from "../../energy/dtos/AbstractByPeriodValuesDto";
import { SolarResultCalculator, SolarStudy } from "../../solar";

describe("Power curve statistics calculation", () => {
  let mockedStudy = solarStudy as SolarStudy;

  mockedStudy.consumption = new PowerCurve(
    mockedStudy.consumption!.days,
    false,
    "test study consumption",
    true
  );
  mockedStudy.surfaces![0].production = new PowerCurve(
    mockedStudy.surfaces![0].production!.days,
    false,
    "test study production",
    true
  );
  const resultCalculator = new SolarResultCalculator(mockedStudy);
  const result = resultCalculator.calculateResults(
    mockedPeriodDistributionSolar
  );

  it("Calculates raw spending results propertly", () => {
    expect(result?.totalRawSpending).not.to.be.equal(0);
    expect(result?.totalRawSpendingByPeriod?.p1).not.to.be.equal(0);
    expect(result?.totalRawSpendingByPeriod?.p1).not.to.be.equal(undefined);
    expect(result?.totalRawSpendingByPeriod?.p1).not.to.be.equal(null);
    expect(result?.totalRawSpendingByPeriod?.p1).not.to.be.equal(NaN);
  });

  it("Calculates  excesses results propertly", () => {
    expect(result?.totalExcesses).not.to.be.equal(0);
    expect(result?.totalExcessesByPeriod?.p1).not.to.be.equal(0);
    expect(result?.totalExcessesByPeriod?.p1).not.to.be.equal(undefined);
    expect(result?.totalExcessesByPeriod?.p1).not.to.be.equal(null);
    expect(result?.totalExcessesByPeriod?.p1).not.to.be.equal(NaN);
  });
  it("Calculates  production results propertly", () => {
    expect(result?.totalProduction).not.to.be.equal(0);
  });

  it("Calculates savings results propertly", () => {
    expect(result?.totalSavings).not.to.be.equal(0);
    expect(result?.totalSavingsByPeriod?.p1).not.to.be.equal(0);
    expect(result?.totalSavingsByPeriod?.p1).not.to.be.equal(undefined);
    expect(result?.totalSavingsByPeriod?.p1).not.to.be.equal(null);
    expect(result?.totalSavingsByPeriod?.p1).not.to.be.equal(NaN);
  });
  it("Calculates net spending results propertly", () => {
    expect(result?.totalNetSpending).not.to.be.equal(0);
    expect(result?.totalNetSpendingByPeriod?.p1).not.to.be.equal(0);
    expect(result?.totalNetSpendingByPeriod?.p1).not.to.be.equal(undefined);
    expect(result?.totalNetSpendingByPeriod?.p1).not.to.be.equal(null);
    expect(result?.totalNetSpendingByPeriod?.p1).not.to.be.equal(NaN);
  });
});
