/**
 * Defines the price of power rights in units of €/kW · day for each tariff period
 */
export declare class PowerPrices {
    constructor(language: "es" | "en");
    p1?: number;
    p2?: number;
    p3?: number;
    p4?: number;
    p5?: number;
    p6?: number;
    units: string;
}
