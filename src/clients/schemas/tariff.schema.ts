import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ClientInfo } from "./clientInfo.schema";
import { ConsumptionPoint } from "./consumptionPoint.schema";
import { Comment } from "./comment.schema";
import { EnergyMarketer } from "./energyMarketer.schema";
import { ContractedPower, PowerPrices } from "..";
export type TariffDocument = Tariff & Document;

@Schema()
export class Tariff {
  constructor() {}
  _id?: string;
  @Prop()
  name?: string;
  @Prop()
  phoneNumber?: string;
  @Prop({ type: Types.ObjectId, ref: EnergyMarketer.name })
  energyMarketer?: EnergyMarketer;
  @Prop()
  powerPrices: PowerPrices;
  @Prop()
  contractedPower: ContractedPower;
  @Prop()
  utilityType: "gas" | "electricity";
}

export const CommercialSchema = SchemaFactory.createForClass(Tariff);
