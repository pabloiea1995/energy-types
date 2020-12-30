"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerPrices = void 0;
/**
 * Defines the price of power rights in units of €/kW · day for each tariff period
 */
class PowerPrices {
    constructor(language) {
        this.units = {
            "es": "€/kW · dia",
            "en": "€/kW · day",
        }[language];
    }
}
exports.PowerPrices = PowerPrices;
