import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type EnergyMarketerDocument = EnergyMarketer & Document;

@Schema()
export class EnergyMarketer {

  constructor(name: string){
    this.name = name
  }
  _id?: string

  
  @Prop()
  name: string;
}

export const EnergyMarketerSchema = SchemaFactory.createForClass(
  EnergyMarketer
);
