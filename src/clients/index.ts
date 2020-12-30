export * from './schemas/client.schema'
export * from './schemas/comment.schema'
export * from './schemas/clientInfo.schema'
export * from './schemas/consumptionPoint.schema'
export * from './schemas/contractInfo.schema'
export * from './schemas/energyMarketer.schema'
export * from './classes/ContractedPower.class'
export * from './classes/EnergyPrices.class'
export * from './classes/PowerPrices.class'

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
