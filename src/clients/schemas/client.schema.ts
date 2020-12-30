import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ClientInfo } from "./clientInfo.schema";
import { ConsumptionPoint } from "./consumptionPoint.schema";
import { Comment } from './comment.schema'
export type ClientDocument = Client & Document;

@Schema()
export class Client {

  constructor(clientInfo: ClientInfo,
    consumptionPoints: ConsumptionPoint[],
    sector: string,
    isOportunirty: boolean,
    creationTimestamp: string,
    comments: Comment[],
    state: OportunityStates) {
    this.clientInfo = clientInfo;
    this.consumptionPoints = consumptionPoints;
    this.sector = sector;
    this.isOportunity = isOportunirty
    this.creationTimestamp = creationTimestamp
    this.comments = comments || []
    this.state = state || "pending"
  }

  _id?: string

  @Prop({ type: Types.ObjectId, ref: ClientInfo })
  clientInfo: ClientInfo;

  @Prop([ConsumptionPoint])
  consumptionPoints: ConsumptionPoint[];

  @Prop()
  sector: string;

  @Prop()
  isOportunity: boolean;

  @Prop()
  creationTimestamp?: string

  @Prop()
  comments?: Comment[]

  @Prop()
  state?: OportunityStates
}

export const ClientSchema = SchemaFactory.createForClass(Client);


export type OportunityStates = "pending" | "inprocess" | "aproved" | "rejected" | "canceled"