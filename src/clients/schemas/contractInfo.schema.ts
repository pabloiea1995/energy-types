import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ContractedPower } from "../classes/ContractedPower.class";
import { EnergyPrices } from "../classes/EnergyPrices.class";
import { PowerPrices } from "../classes/PowerPrices.class";
import { Commercial } from "./commercial.schema";
import { EnergyMarketer } from "./energyMarketer.schema";

export type ContractInfoDocument = ContractInfo & Document;

@Schema()
export class ContractInfo {
  constructor(
    energyMarketer: EnergyMarketer,
    type: string,
    tariffType: string,
    energyPrices: EnergyPrices,
    powerPrices: PowerPrices,
    contractedPower: ContractedPower,
    startDate: string,
    endDate: string
  ) {
    this.type = type;
    this.energyMarketer = energyMarketer;
    this.tariffType = tariffType;
    this.energyPrices = energyPrices;
    this.powerPrices = powerPrices;
    this.contractedPower = contractedPower;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  _id?: string;

  @Prop({ type: Types.ObjectId, ref: EnergyMarketer.name })
  energyMarketer?: EnergyMarketer;

  @Prop({ type: Types.ObjectId, ref: Commercial })
  commercial?: EnergyMarketer;
  //Fijo o indexado
  @Prop()
  type: string;
  @Prop({ type: String })
  utilityType?: "gas" | "electricity";
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
  startDate?: string;
  @Prop()
  endDate?: string;
  @Prop()
  signingDate?: string;
  @Prop()
  lastStateChangeDate?: string;
  @Prop()
  state?: string;
  @Prop()
  contractNumber?: string;
  @Prop()
  fee?: string;
  @Prop()
  electricityService?: string;
  @Prop()
  gasService?: string;
  @Prop()
  anualConsumption?: string;
  @Prop()
  anualConsumptionUnit?: string;

  //TODO: Tariff
  //TODO: Agent
}

export const ContractInfoSchema = SchemaFactory.createForClass(ContractInfo);
