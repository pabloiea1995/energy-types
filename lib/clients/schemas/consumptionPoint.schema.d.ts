import { Point, Polygon } from "geojson";
import { Document } from "mongoose";
import { Consumption } from "../../energy/schemas/consumption.schema";
import { ContractInfo } from "./contractInfo.schema";
export declare type ConsumptionPointDocument = ConsumptionPoint & Document;
export declare class ConsumptionPoint {
    constructor(identifier: string, cups: string, isFrontierPoint: boolean, contractInfo: ContractInfo[], consumption: Consumption, location: Point | Polygon);
    _id?: string;
    identifier: string;
    cups: string;
    isFrontierPoint: boolean;
    contractInfo?: ContractInfo[];
    consumption?: Consumption;
    location?: Point | Polygon;
}
export declare const ConsumptionPointSchema: import("mongoose").Schema<any, import("mongoose").Model<any>>;
