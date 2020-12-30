"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSchema = exports.Client = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const clientInfo_schema_1 = require("./clientInfo.schema");
const consumptionPoint_schema_1 = require("./consumptionPoint.schema");
let Client = class Client {
    constructor(clientInfo, consumptionPoints, sector, isOportunirty, creationTimestamp, comments, state) {
        this.clientInfo = clientInfo;
        this.consumptionPoints = consumptionPoints;
        this.sector = sector;
        this.isOportunity = isOportunirty;
        this.creationTimestamp = creationTimestamp;
        this.comments = comments || [];
        this.state = state || "pending";
    }
};
__decorate([
    mongoose_1.Prop({ type: mongoose_2.Types.ObjectId, ref: clientInfo_schema_1.ClientInfo }),
    __metadata("design:type", clientInfo_schema_1.ClientInfo)
], Client.prototype, "clientInfo", void 0);
__decorate([
    mongoose_1.Prop([consumptionPoint_schema_1.ConsumptionPoint]),
    __metadata("design:type", Array)
], Client.prototype, "consumptionPoints", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Client.prototype, "sector", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Boolean)
], Client.prototype, "isOportunity", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Client.prototype, "creationTimestamp", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Array)
], Client.prototype, "comments", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Client.prototype, "state", void 0);
Client = __decorate([
    mongoose_1.Schema(),
    __metadata("design:paramtypes", [clientInfo_schema_1.ClientInfo, Array, String, Boolean, String, Array, String])
], Client);
exports.Client = Client;
exports.ClientSchema = mongoose_1.SchemaFactory.createForClass(Client);
