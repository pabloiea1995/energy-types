"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerPrices = void 0;
/**
 * Defines the price of power rights in units of €/kW · day for each tariff period
 */
class PowerPrices {
    constructor(language) {
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
}
exports.PowerPrices = PowerPrices;
