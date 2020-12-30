/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ConsumptionCurve, PowerCurve } from "../classes/powerCurve.class";

export type ConsumptionDocument = Consumption & Document;

@Schema({ strict: false })
export class Consumption {

  constructor(isComplete: boolean) {
    this.isComplete = isComplete
  }

  [year: number]: ConsumptionCurve;

  @Prop()
  isComplete: boolean;

  unit?: string 

  _id?: string

  

  
}

export const ConsumptionSchema = SchemaFactory.createForClass(Consumption);

