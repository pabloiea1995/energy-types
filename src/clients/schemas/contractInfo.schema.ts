import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ContractedPower } from "../classes/ContractedPower.class";
import { EnergyPrices } from "../classes/EnergyPrices.class";
import { PowerPrices } from "../classes/PowerPrices.class";
import { EnergyMarketer } from "./energyMarketer.schema";

export type ContractInfoDocument = ContractInfo & Document;

@Schema()
export class ContractInfo {

  constructor(energyMarketer: EnergyMarketer,type: string, tariffType: string, energyPrices: EnergyPrices, powerPrices: PowerPrices, 
    contractedPower: ContractedPower, startDate: string, endDate: string ){
    this.type = type;
    this.energyMarketer = energyMarketer;
    this.tariffType = tariffType
    this.energyPrices = energyPrices;
    this.powerPrices = powerPrices;
    this.contractedPower = contractedPower;
    this.startDate = startDate;
    this.endDate = endDate
  }

  _id?: string


  @Prop({ type: Types.ObjectId, ref: EnergyMarketer.name })
  energyMarketer?: EnergyMarketer;

  //Fijo o indexado
  @Prop()
  type: string;
  //tarifa ATR
  @Prop()
  tariffType: string;

  @Prop()
  energyPrices: EnergyPrices;

  @Prop()
  powerPrices: PowerPrices;

  @Prop()
  contractedPower: ContractedPower;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

}

export const ContractInfoSchema = SchemaFactory.createForClass(ContractInfo);
