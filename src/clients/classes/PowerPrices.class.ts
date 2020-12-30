/**
 * Defines the price of power rights in units of €/kW · day for each tariff period
 */
export class PowerPrices {
  constructor(language: "es" | "en") {
    this.units = {
      "es": "€/kW · dia",
      "en": "€/kW · day",
    }[language];
  }
  p1?: number;
  p2?: number;
  p3?: number;
  p4?: number;
  p5?: number;
  p6?: number;
  units: string;
}
