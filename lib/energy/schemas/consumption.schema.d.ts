import { Document } from "mongoose";
import { ConsumptionCurve } from "../classes/powerCurve.class";
export declare type ConsumptionDocument = Consumption & Document;
export declare class Consumption {
    constructor(isComplete: boolean);
    [year: number]: ConsumptionCurve;
    isComplete: boolean;
    unit?: string;
    _id?: string;
}
export declare const ConsumptionSchema: import("mongoose").Schema<any, import("mongoose").Model<any>>;
