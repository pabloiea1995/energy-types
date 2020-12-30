import { Document } from "mongoose";
export declare type EnergyMarketerDocument = EnergyMarketer & Document;
export declare class EnergyMarketer {
    constructor(name: string);
    _id?: string;
    name: string;
}
export declare const EnergyMarketerSchema: import("mongoose").Schema<any, import("mongoose").Model<any>>;
