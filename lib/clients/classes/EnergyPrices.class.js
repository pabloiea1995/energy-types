"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyPrices = void 0;
/**
 * Defines the price of energy consumption in units of €/kWh for each tariff period
 */
class EnergyPrices {
    constructor() {
        this.units = "€/kWh";
        this.p1 = undefined;
        this.p2 = undefined;
        this.p3 = undefined;
        this.p4 = undefined;
        this.p5 = undefined;
        this.p6 = undefined;
    }
}
exports.EnergyPrices = EnergyPrices;
