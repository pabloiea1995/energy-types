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
exports.ConsumptionPointSchema = exports.ConsumptionPoint = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const consumption_schema_1 = require("../../energy/schemas/consumption.schema");
const contractInfo_schema_1 = require("./contractInfo.schema");
let ConsumptionPoint = class ConsumptionPoint {
    constructor(identifier, cups, isFrontierPoint, contractInfo, consumption, location) {
        this.identifier = identifier;
        this.cups = cups;
        this.isFrontierPoint = isFrontierPoint;
        this.contractInfo = contractInfo;
        this.consumption = consumption;
        this.location = location;
    }
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ConsumptionPoint.prototype, "identifier", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ConsumptionPoint.prototype, "cups", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Boolean)
], ConsumptionPoint.prototype, "isFrontierPoint", void 0);
__decorate([
    mongoose_1.Prop({ type: mongoose_2.Types.ObjectId, ref: contractInfo_schema_1.ContractInfo }) //TODO: Objeto con información sobre la comercializadora del contrato en vigor, tipo de contrato de suministro, vigencia, potencia contratada, precios de la energía
    ,
    __metadata("design:type", Array)
], ConsumptionPoint.prototype, "contractInfo", void 0);
__decorate([
    mongoose_1.Prop() //TODO: Objeto/clase con las informacion del consumo de este punto de consumo
    ,
    __metadata("design:type", consumption_schema_1.Consumption)
], ConsumptionPoint.prototype, "consumption", void 0);
__decorate([
    mongoose_1.Prop({
        type: String,
        enum: ['Point', "Polygon"],
    }),
    __metadata("design:type", Object)
], ConsumptionPoint.prototype, "location", void 0);
ConsumptionPoint = __decorate([
    mongoose_1.Schema(),
    __metadata("design:paramtypes", [String, String, Boolean, Array, consumption_schema_1.Consumption, Object])
], ConsumptionPoint);
exports.ConsumptionPoint = ConsumptionPoint;
exports.ConsumptionPointSchema = mongoose_1.SchemaFactory.createForClass(ConsumptionPoint);
