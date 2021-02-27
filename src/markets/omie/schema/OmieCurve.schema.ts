import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { DayCurve } from "../../../energy/classes/powerCurve.class";
import { OmieMarket } from "../markets";
export type OmieCurveDocument = DayCurve & Document;
@Schema({ strict: false })
export class OmieCurve {
  constructor(market: OmieMarket, dayCurve: DayCurve) {
    this.market = market;
    this.dayCurve = dayCurve;
  }

  _id?: string;

  @Prop()
  market: OmieMarket;

  dayCurve: DayCurve;
}

export const OmieCurveSchema = SchemaFactory.createForClass(OmieCurve);
