import { Document } from "mongoose";
import { ClientTipology } from "./clientTypology.schema";
export declare type ClientInfoDocument = ClientInfo & Document;
export declare class ClientInfo {
    constructor(name: string, phoneNumber: string, email: string);
    _id?: string;
    name?: string;
    phoneNumber?: string;
    email?: string;
    firstSurname?: string;
    secondSurname?: string;
    dniOrCif?: string;
    address?: string;
    city?: string;
    addressCode?: string;
    region?: string;
    clientTypology?: ClientTipology;
}
export declare const ClientInfoSchema: import("mongoose").Schema<any, import("mongoose").Model<any>>;
