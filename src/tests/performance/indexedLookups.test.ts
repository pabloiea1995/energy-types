import { expect } from "chai";
import {
  applyProfileToConsumption,
  ConsumptionIntroductionModes,
} from "../../energy/calculations/applyProfileToConsumption";
import { cloneValuesList } from "../../energy/classes/curveLookups";
import { DayCurve, PowerCurve } from "../../energy/classes/powerCurve.class";
import { legacyApplyProfileToConsumption } from "../legacy/applyProfileToConsumption.legacy";
import { LegacyPowerCurve } from "../legacy/powerCurve.legacy";
import { curve as consumptionMockup } from "../powerCurves/consumptionCurveMockup";
import { mockedPeriodDistributionSolar } from "../powerCurves/mockedPeriodDistributionSolar";
import { profile as profileMockup } from "../powerCurves/mockedProfile";
import { periodDistributionMockup } from "../powerCurves/periodDistributionMockup";

/**
 * The optimized PowerCurve must give exactly what 0.0.127 gave (kept verbatim in
 * tests/legacy): same result, same changes to its inputs and the same error when the
 * input is malformed. Every check runs both versions on separate deep copies of the
 * same input and compares them with a serialization that tells NaN, -0, undefined and
 * key order apart.
 */

// ---------- exact comparison ----------

const deepCopy = (value: any): any => {
  if (Array.isArray(value)) return value.map(deepCopy);
  if (value && typeof value === "object") {
    const copy: any = {};
    for (const key of Object.keys(value)) copy[key] = deepCopy(value[key]);
    return copy;
  }
  return value;
};

const exact = (value: any): string => {
  if (value === undefined) return "undefined";
  if (typeof value === "number") {
    if (Number.isNaN(value)) return "NaN";
    if (Object.is(value, -0)) return "-0";
    return String(value);
  }
  if (Array.isArray(value)) return "[" + value.map(exact).join(",") + "]";
  if (value instanceof Date) return `Date(${value.getTime()})`;
  if (value && typeof value === "object") {
    return (
      "{" +
      Object.keys(value)
        .map((key) => JSON.stringify(key) + ":" + exact(value[key]))
        .join(",") +
      "}"
    );
  }
  return JSON.stringify(value);
};

// How many comparisons ended with a result and how many with the same error
export const outcomeCount = { result: 0, error: 0 };

const outcome = (run: () => any) => {
  // Both versions log the same warnings for malformed input: keep the test output readable
  const { log, warn, error } = console;
  console.log = console.warn = console.error = () => undefined;
  try {
    const result = { result: exact(run()) };
    outcomeCount.result++;
    return result;
  } catch (error: any) {
    outcomeCount.error++;
    return { error: `${error?.constructor?.name}: ${error?.message}` };
  } finally {
    Object.assign(console, { log, warn, error });
  }
};

/** Runs the legacy and the new version on copies of the same inputs and compares everything */
const expectSame = (
  inputs: any[],
  legacy: (...args: any[]) => any,
  current: (...args: any[]) => any
) => {
  const legacyInputs = deepCopy(inputs);
  const currentInputs = deepCopy(inputs);
  const before = outcome(() => legacy(...legacyInputs));
  const after = outcome(() => current(...currentInputs));
  expect(after).to.deep.equal(before);
  expect(exact(currentInputs)).to.equal(exact(legacyInputs));
};

const legacyCurve = (days: any) => new LegacyPowerCurve(days, false, "a", false);
const newCurve = (days: any) => new PowerCurve(days, false, "a", false);

// ---------- data ----------

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const buildYears = (years: number[], dateSuffix = "", valueFor?: (d: number, h: number) => number) => {
  const random = seeded(years[0] + dateSuffix.length);
  const days: DayCurve[] = [];
  for (const year of years) {
    const date = new Date(Date.UTC(year, 0, 1));
    let d = 0;
    while (date.getUTCFullYear() === year) {
      const valuesList: Record<string, number> = {};
      for (let h = 1; h <= 24; h++)
        valuesList[h] = valueFor ? valueFor(d, h) : Math.round(random() * 1000) / 100 - 2;
      days.push({ date: date.toISOString().slice(0, 10) + dateSuffix, valuesList });
      date.setUTCDate(date.getUTCDate() + 1);
      d++;
    }
  }
  return days;
};

const periodsFor = (years: number[], dateSuffix = "T00:00:00.000Z") =>
  buildYears(years, dateSuffix, (d, h) => ((d % 7) >= 5 || h <= 8 ? 3 : h >= 18 && h <= 21 ? 1 : 2));

const year = buildYears([2025]);
const year2 = buildYears([2025], "", (d, h) => (h > 7 && h < 19 ? -(d % 5) : 0.3));
const twoYears = buildYears([2024, 2025]);
const periods = periodsFor([2024, 2025]);
const plainPeriods = periodsFor([2025], "");

// Small random curves with every awkward value a curve can carry
const edgeValues = [1.5, 0, -0, -2, NaN, Infinity, -Infinity, null, undefined, "3", true, 7];
const edgeDates = ["2025-01-01", "2025-01-02", "2025-01-02", "2025-01-03T00:00:00.000Z", "2025-02-01", "2024-01-01", "2025", "x-01-01"];
const randomCurves = (count: number, seed: number) => {
  const random = seeded(seed);
  const pick = <T>(list: T[]) => list[Math.floor(random() * list.length)];
  const curves: any[] = [];
  for (let c = 0; c < count; c++) {
    const days: any[] = [];
    const length = Math.floor(random() * 6);
    for (let d = 0; d < length; d++) {
      const roll = random();
      if (roll < 0.06) {
        days.push({ date: pick(edgeDates), valuesList: null });
        continue;
      }
      const valuesList: any = {};
      const hours = Math.floor(random() * 5);
      for (let h = 0; h < hours; h++) valuesList[pick(["1", "2", "3", "24", "25"])] = pick(edgeValues);
      days.push({ date: pick(edgeDates), valuesList });
    }
    curves.push(days);
  }
  return curves;
};
const fuzzA = randomCurves(300, 7);
const fuzzB = randomCurves(300, 11);
const fuzzPeriods = randomCurves(300, 13).map((days) =>
  days.map((day: any) => ({
    ...day,
    valuesList: day.valuesList && Object.keys(day.valuesList).reduce((acc: any, h) => ({ ...acc, [h]: (h.length % 3) + 1 }), {}),
  }))
);

// ---------- results ----------

describe("Optimized PowerCurve gives the same results as 0.0.127", function (this: any) {
  // The legacy version is the slow one: many combinations take a while
  this.timeout(300000);
  it("cloneValuesList equals JSON.parse(JSON.stringify()) for every kind of value", () => {
    const samples: any[] = [
      ...fuzzA.reduce((all: any[], days) => all.concat(days), []).map((day: any) => day.valuesList),
      { a: { nested: NaN } },
      { toJSON: () => ({ replaced: 1 }) },
      JSON.parse('{"__proto__": 1, "1": 2}'),
      [1, NaN],
      null,
      { 1: new Date(0) },
      { 1: Symbol("s"), 2: () => 1, 3: -0 },
    ];
    for (const sample of samples) {
      expect(outcome(() => cloneValuesList(sample))).to.deep.equal(
        outcome(() => JSON.parse(JSON.stringify(sample)))
      );
    }
    // JSON.parse(undefined) throws: so must the copy
    expect(outcome(() => cloneValuesList(undefined))).to.deep.equal(
      outcome(() => JSON.parse(JSON.stringify(undefined)))
    );
  });

  it("aggregatePowerCurve", () => {
    const cases = [
      [year, year2],
      [year2, twoYears],
      [consumptionMockup.days, year],
      [[], year],
      ...fuzzA.map((days, i) => [days, fuzzB[i]]),
    ];
    for (const [a, b] of cases) {
      expectSame(
        [a, b],
        (x, y) => legacyCurve(x).aggregatePowerCurve(legacyCurve(y)),
        (x, y) => newCurve(x).aggregatePowerCurve(newCurve(y))
      );
    }
    // Another curve missing or malformed fails the same way
    for (const bad of [undefined, { days: [null] }, { days: [{ valuesList: {} }] }]) {
      expectSame(
        [year.slice(0, 3)],
        (x) => legacyCurve(x).aggregatePowerCurve(bad as any),
        (x) => newCurve(x).aggregatePowerCurve(bad as any)
      );
    }
  });

  it("applyMultiplier, filterNegativeValues and filterPositiveValues", () => {
    for (const days of [year, twoYears, consumptionMockup.days, ...fuzzA, [{ date: "2025-01-01" }]]) {
      expectSame([days], (x) => legacyCurve(x).applyMultiplier(-1.7), (x) => newCurve(x).applyMultiplier(-1.7));
      expectSame([days], (x) => legacyCurve(x).applyMultiplier(0), (x) => newCurve(x).applyMultiplier(0));
      expectSame([days], (x) => legacyCurve(x).filterNegativeValues(), (x) => newCurve(x).filterNegativeValues());
      expectSame([days], (x) => legacyCurve(x).filterPositiveValues(), (x) => newCurve(x).filterPositiveValues());
    }
  });

  it("aggregateByPeriod", () => {
    const distributions: any[] = [periods, plainPeriods, periodDistributionMockup, mockedPeriodDistributionSolar, [], undefined, [{ valuesList: {} }], [{ date: 5 }], ...fuzzPeriods.slice(0, 100)];
    for (const days of [year, twoYears, consumptionMockup.days, ...fuzzA.slice(0, 60)]) {
      for (const distribution of distributions) {
        expectSame(
          [days, distribution],
          (x, p) => legacyCurve(x).aggregateByPeriod(p),
          (x, p) => newCurve(x).aggregateByPeriod(p)
        );
      }
    }
  });

  it("calculateStatistics, with and without period distribution", () => {
    const distributions: any[] = [undefined, periods, plainPeriods, periodDistributionMockup, [], [{ valuesList: {} }], ...fuzzPeriods.slice(0, 40)];
    for (const days of [year, twoYears, consumptionMockup.days, ...fuzzA.slice(0, 60)]) {
      for (const distribution of distributions) {
        expectSame(
          [days, distribution],
          (x, p) => legacyCurve(x).calculateStatistics(p),
          (x, p) => newCurve(x).calculateStatistics(p)
        );
      }
    }
  });

  it("alignPowerCurveDates, including the dates it rewrites in place", () => {
    const references = [buildYears([2030]), twoYears, consumptionMockup.days, [], ...fuzzB.slice(0, 100)];
    for (const days of [year, twoYears, consumptionMockup.days, ...fuzzA.slice(0, 100)]) {
      for (const reference of references) {
        expectSame(
          [days, reference],
          (x, r) => legacyCurve(x).alignPowerCurveDates(legacyCurve(r)),
          (x, r) => newCurve(x).alignPowerCurveDates(newCurve(r))
        );
      }
    }
    // Dates that do not split in three parts are rewritten and regrouped like before
    expectSame(
      [[{ date: "2025", valuesList: {} }, { date: "2024-01", valuesList: {} }], [{ date: "2023" }, { date: "2022-undefined-undefined" }, { date: "2021" }]],
      (x, r) => legacyCurve(x).alignPowerCurveDates(legacyCurve(r)),
      (x, r) => newCurve(x).alignPowerCurveDates(newCurve(r))
    );
  });

  it("most comparisons produce a result, not only matching errors", () => {
    // Counted over the checks above (each check runs both versions)
    expect(outcomeCount.result).to.be.greaterThan(outcomeCount.error * 3);
    console.log(`      ${outcomeCount.result / 2} results and ${outcomeCount.error / 2} errors compared`);
  });

  it("classifyByYearsAndMonths, rotateCurve and the rest keep working on the new class", () => {
    for (const days of [year, twoYears, consumptionMockup.days]) {
      expectSame([days], (x) => legacyCurve(x).classifyByYearsAndMonths(), (x) => newCurve(x).classifyByYearsAndMonths());
      expectSame([days], (x) => legacyCurve(x).rotateCurve({ day: "15", month: "06" }), (x) => newCurve(x).rotateCurve({ day: "15", month: "06" }));
      expectSame([days], (x) => legacyCurve(x).getTotalAcumulate(), (x) => newCurve(x).getTotalAcumulate());
    }
  });

  it("applyProfileToConsumption in every mode", () => {
    const profileDays = profileMockup.profile!;
    const fullYearProfile = buildYears([2025], "", (d, h) => 0.0001 + ((d * 24 + h) % 13) / 1e5);
    const modes: [string, any, any[], any][] = [
      [ConsumptionIntroductionModes.TOTAL_CONSUMPTION, 1000, profileDays, undefined],
      [ConsumptionIntroductionModes.MONTH_CONSUMPTION, { 2020: { 1: 100, 2: 200, 3: 300, 4: 400, 5: 500 } }, profileDays, undefined],
      [ConsumptionIntroductionModes.CONSUMPTION_BY_PERIOD, { p1: 1000, p2: 2000, p3: 3000 }, profileDays, mockedPeriodDistributionSolar],
      [ConsumptionIntroductionModes.CONSUMPTION_BY_PERIOD, { p1: 1000, p2: 2000, p3: 3000 }, fullYearProfile, periods],
      [ConsumptionIntroductionModes.CONSUMPTION_BY_PERIOD, { p1: 1000, p2: 2000, p3: 3000 }, fullYearProfile, plainPeriods],
    ];
    for (const fuzz of fuzzPeriods.slice(0, 60))
      modes.push([ConsumptionIntroductionModes.CONSUMPTION_BY_PERIOD, { p1: 1, p2: 2, p3: 3 }, profileDays.slice(0, 40), fuzz]);
    const silence = console.log;
    console.log = () => undefined;
    try {
      for (const [mode, consumption, profileInput, periodsInput] of modes) {
        expectSame(
          [profileInput, consumption, periodsInput],
          (p, c, d) => legacyApplyProfileToConsumption(mode as any, p, c, d),
          (p, c, d) => applyProfileToConsumption(mode as any, p, c, d)
        );
      }
    } finally {
      console.log = silence;
    }
  });
});

// ---------- speed ----------

const timeOf = (run: () => void, minMs = 150) => {
  run();
  let runs = 0;
  const start = process.hrtime();
  let elapsed = 0;
  do {
    run();
    runs++;
    const [s, ns] = process.hrtime(start);
    elapsed = s * 1000 + ns / 1e6;
  } while (elapsed < minMs);
  return elapsed / runs;
};

describe("Optimized PowerCurve is faster than 0.0.127 on one year of hourly data", function (this: any) {
  this.timeout(120000);
  const rows: string[] = [];

  const compare = (name: string, minSpeedup: number, legacy: () => void, current: () => void) => {
    it(`${name} (at least ${minSpeedup}x)`, () => {
      const before = timeOf(legacy);
      const now = timeOf(current);
      rows.push(`      ${name.padEnd(32)} ${before.toFixed(2).padStart(8)} ms ${now.toFixed(2).padStart(7)} ms ${(before / now).toFixed(1).padStart(7)}x`);
      expect(before / now).to.be.at.least(minSpeedup);
    });
  };

  const lA = legacyCurve(year), lB = legacyCurve(year2), nA = newCurve(year), nB = newCurve(year2);
  compare("aggregatePowerCurve", 5, () => lA.aggregatePowerCurve(lB), () => nA.aggregatePowerCurve(nB));
  compare("aggregateByPeriod", 5, () => lA.aggregateByPeriod(periods), () => nA.aggregateByPeriod(periods));
  compare("calculateStatistics with periods", 5, () => lA.calculateStatistics(periods), () => nA.calculateStatistics(periods));
  compare("alignPowerCurveDates", 5, () => legacyCurve(deepCopy(year)).alignPowerCurveDates(lB), () => newCurve(deepCopy(year)).alignPowerCurveDates(nB));
  compare("applyMultiplier", 1.5, () => lA.applyMultiplier(2), () => nA.applyMultiplier(2));
  compare("filterNegativeValues", 1.5, () => lA.filterNegativeValues(), () => nA.filterNegativeValues());
  const fullYearProfile = buildYears([2025], "", (d, h) => 0.0001 + ((d * 24 + h) % 13) / 1e5);
  const byPeriod = { p1: 1000, p2: 2000, p3: 3000 };
  const quiet = (run: () => void) => () => {
    const log = console.log;
    console.log = () => undefined;
    try {
      run();
    } finally {
      console.log = log;
    }
  };
  compare(
    "applyProfileToConsumption by period",
    5,
    quiet(() => legacyApplyProfileToConsumption("consumptionByPeriod" as any, fullYearProfile, byPeriod, periods)),
    quiet(() => applyProfileToConsumption(ConsumptionIntroductionModes.CONSUMPTION_BY_PERIOD, fullYearProfile, byPeriod, periods))
  );
  it("prints the comparison", () => {
    console.log("\n      operation                          0.0.127      now   speedup\n" + rows.join("\n"));
  });
});
