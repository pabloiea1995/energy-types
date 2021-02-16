/**
 * Defines the price of power rights in units of €/kW · day for each tariff period
 */
export class PowerPrices {
  constructor(language: "es" | "en") {
    this.units = {
      es: "€/kW · dia",
      en: "€/kW · day",
    }[language];
    this.p1 = undefined;
    this.p2 = undefined;
    this.p3 = undefined;
    this.p4 = undefined;
    this.p5 = undefined;
    this.p6 = undefined;
  }
  p1?: number;
  p2?: number;
  p3?: number;
  p4?: number;
  p5?: number;
  p6?: number;
  units: string;
}
