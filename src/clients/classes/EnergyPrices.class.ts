/**
 * Defines the price of energy consumption in units of €/kWh for each tariff period
 */
export class EnergyPrices {
  constructor() {
    this.units = "€/kWh";
  }
  p1?: number;
  p2?: number;
  p3?: number;
  p4?: number;
  p5?: number;
  p6?: number;
  units: string;
}
