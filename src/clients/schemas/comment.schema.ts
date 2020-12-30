import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type CommentDocument = Comment & Document;

@Schema()
export class Comment {

    constructor(author:string, content: string, response?: Comment[],timestamp?: string , _id?:string  ){
        this.author =  author;
        this.timestamp = timestamp || new Date().toISOString()
        this.content = content;
        this.response = response || []
        this._id = _id 
    }
    _id?: string

    @Prop()
    author: string;

    @Prop()
    timestamp: string;

    @Prop()
    content: string;

    @Prop()
    response?: Comment[]


   


}

export const CommentSchema = SchemaFactory.createForClass(Comment);
