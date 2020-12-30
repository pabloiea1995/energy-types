import { Document } from "mongoose";
export declare type CommentDocument = Comment & Document;
export declare class Comment {
    constructor(author: string, content: string, response?: Comment[], timestamp?: string, _id?: string);
    _id?: string;
    author: string;
    timestamp: string;
    content: string;
    response?: Comment[];
}
export declare const CommentSchema: import("mongoose").Schema<any, import("mongoose").Model<any>>;
