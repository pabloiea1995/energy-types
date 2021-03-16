import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ClientTipology } from "./clientTypology.schema";

export type ClientInfoDocument = ClientInfo & Document;

@Schema()
export class ClientInfo {
  constructor(name: string, phoneNumber: string, email: string) {
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.email = email;
  }
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
  @Prop()
  addressCode?: string;
  @Prop()
  region?: string;

  @Prop({ type: Types.ObjectId, ref: ClientTipology.name })
  clientTypology?: ClientTipology;
}

export const ClientInfoSchema = SchemaFactory.createForClass(ClientInfo);
