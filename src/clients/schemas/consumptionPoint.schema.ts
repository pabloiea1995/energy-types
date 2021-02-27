import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GeoJsonObject, Point, Polygon } from "geojson";
import { Document, Types } from "mongoose";
import { Consumption } from "../../energy/schemas/consumption.schema";
import { ContractInfo } from "./contractInfo.schema";

export type ConsumptionPointDocument = ConsumptionPoint & Document;

@Schema()
export class ConsumptionPoint {
  constructor(
    identifier: string,
    cups: string,
    isFrontierPoint: boolean,
    contractInfo: ContractInfo[],
    consumption: Consumption,
    location: Point | Polygon
  ) {
    this.identifier = identifier;
    this.cups = cups;
    this.isFrontierPoint = isFrontierPoint;
    this.contractInfo = contractInfo;
    this.consumption = consumption;
    this.location = location;
  }

  _id?: string;

  @Prop()
  identifier: string;

  @Prop()
  cups: string;

  @Prop()
  isFrontierPoint: boolean;

  @Prop({ type: Types.ObjectId, ref: ContractInfo }) //TODO: Objeto con información sobre la comercializadora del contrato en vigor, tipo de contrato de suministro, vigencia, potencia contratada, precios de la energía
  contractInfo?: ContractInfo[];

  @Prop() //TODO: Objeto/clase con las informacion del consumo de este punto de consumo
  consumption?: Consumption;

  //@Prop() //TODO: Objeto/clase con las informacion de la portencia de este punto de consumo
  //power: Power;

  @Prop({
    type: String, // Don't do `{ location: { type: String } }`
    enum: ["Point", "Polygon"], // 'location.type' must be 'Point'
  })
  location?: Point | Polygon;
}

export const ConsumptionPointSchema = SchemaFactory.createForClass(
  ConsumptionPoint
);
