import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ClientTipologyDocument = ClientTipology & Document;

@Schema()
export class ClientTipology {
  constructor(name: string) {
    this.name = name;
  }
  _id?: string;

  @Prop()
  name: string;
}

export const ClientTipologySchema = SchemaFactory.createForClass(
  ClientTipology
);
