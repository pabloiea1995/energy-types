import { Document } from "mongoose";
import { ClientInfo } from "./clientInfo.schema";
import { ConsumptionPoint } from "./consumptionPoint.schema";
import { Comment } from './comment.schema';
export declare type ClientDocument = Client & Document;
export declare class Client {
    constructor(clientInfo: ClientInfo, consumptionPoints: ConsumptionPoint[], sector: string, isOportunirty: boolean, creationTimestamp: string, comments: Comment[], state: OportunityStates);
    _id?: string;
    clientInfo: ClientInfo;
    consumptionPoints: ConsumptionPoint[];
    sector: string;
    isOportunity: boolean;
    creationTimestamp?: string;
    comments?: Comment[];
    state?: OportunityStates;
}
export declare const ClientSchema: import("mongoose").Schema<any, import("mongoose").Model<any>>;
export declare type OportunityStates = "pending" | "inprocess" | "aproved" | "rejected" | "canceled";
