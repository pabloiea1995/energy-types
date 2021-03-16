import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ClientInfo } from "./clientInfo.schema";
import { ConsumptionPoint } from "./consumptionPoint.schema";
import { Comment } from "./comment.schema";
export type CommercialDocument = Commercial & Document;

@Schema()
export class Commercial {
  constructor() {}
  _id?: string;
  @Prop()
  name?: string;
  @Prop()
  phoneNumber?: string;
  @Prop()
  email?: string;
  @Prop()
  firstSurname?: string;
  @Prop()
  secondSurname?: string;
  @Prop()
  dniOrCif?: string;
  @Prop()
  address?: string;
  @Prop()
  city?: string;
}

export const CommercialSchema = SchemaFactory.createForClass(Commercial);
