import { Document } from "mongoose";
import { ContractedPower } from "../classes/ContractedPower.class";
import { EnergyPrices } from "../classes/EnergyPrices.class";
import { PowerPrices } from "../classes/PowerPrices.class";
import { EnergyMarketer } from "./energyMarketer.schema";
export declare type ContractInfoDocument = ContractInfo & Document;
export declare class ContractInfo {
    constructor(energyMarketer: EnergyMarketer, type: string, tariffType: string, energyPrices: EnergyPrices, powerPrices: PowerPrices, contractedPower: ContractedPower, startDate: string, endDate: string);
    _id?: string;
    energyMarketer?: EnergyMarketer;
    type: string;
    tariffType: string;
    energyPrices: EnergyPrices;
    powerPrices: PowerPrices;
    contractedPower: ContractedPower;
    startDate: string;
    endDate: string;
}
export declare const ContractInfoSchema: import("mongoose").Schema<any, import("mongoose").Model<any>>;
