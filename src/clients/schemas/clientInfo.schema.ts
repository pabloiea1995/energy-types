import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientInfoDocument = ClientInfo & Document;

@Schema()
export class ClientInfo {
  constructor(name: string, phoneNumber: string,  email: string){
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.email = email
  }
  _id?: string

  @Prop()
  name: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  email: string;
}

export const ClientInfoSchema = SchemaFactory.createForClass(ClientInfo);
