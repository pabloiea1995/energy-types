import { Document } from 'mongoose';
export declare type ClientInfoDocument = ClientInfo & Document;
export declare class ClientInfo {
    constructor(name: string, phoneNumber: string, email: string);
    _id?: string;
    name: string;
    phoneNumber: string;
    email: string;
}
export declare const ClientInfoSchema: import("mongoose").Schema<any, import("mongoose").Model<any>>;
