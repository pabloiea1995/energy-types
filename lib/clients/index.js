"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./schemas/client.schema"), exports);
__exportStar(require("./schemas/comment.schema"), exports);
__exportStar(require("./schemas/clientInfo.schema"), exports);
__exportStar(require("./schemas/consumptionPoint.schema"), exports);
__exportStar(require("./schemas/contractInfo.schema"), exports);
__exportStar(require("./schemas/energyMarketer.schema"), exports);
__exportStar(require("./classes/ContractedPower.class"), exports);
__exportStar(require("./classes/EnergyPrices.class"), exports);
__exportStar(require("./classes/PowerPrices.class"), exports);
/*
export interface Client {
    clientInfo: ClientInfo;

    consumptionPoints: ConsumptionPoint[];

    sector: string;

    isOportunity: boolean;
}

export interface ClientInfo {
    name: string;
    phoneNumber: string;
    email: string;
}

export interface ConsumptionPoint {
    identifier: string;

    cups: string;

    isFrontierPoint: boolean;

    contractInfo: ContractInfo[];

    consumption: Consumption;

    //@Prop() //TODO: Objeto/clase con las informacion de la portencia de este punto de consumo
    //power: Power;
}

export interface Consumption {


    [year: number]: ConsumptionCurve;

    isComplete: boolean;
}

export interface ConsumptionCurve {
    days?: DayCurve[];
    year?: number;
}

export interface DayCurve {
    unit?: string;
    date: string;
    valuesList: Record<string, number>;
}


export interface ContractInfo {
    energyMarketer?: EnergyMarketer;

    type: string;

    tariffType: string;

    energyPrices: EnergyPrices;

    powerPrices: PowerPrices;

    contractedPower: ContractedPower;

    startDate: Date;

    endDate: Date;
}

export interface EnergyMarketer {
    name: string;
}

export interface ContractedPower {
    p1?: number;
    p2?: number;
    p3?: number;
    p4?: number;
    p5?: number;
    p6?: number;
}

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

*/
