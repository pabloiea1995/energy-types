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
exports.ContractInfoSchema = exports.ContractInfo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ContractedPower_class_1 = require("../classes/ContractedPower.class");
const EnergyPrices_class_1 = require("../classes/EnergyPrices.class");
const PowerPrices_class_1 = require("../classes/PowerPrices.class");
const commercial_schema_1 = require("./commercial.schema");
const energyMarketer_schema_1 = require("./energyMarketer.schema");
let ContractInfo = class ContractInfo {
    constructor(energyMarketer, type, tariffType, energyPrices, powerPrices, contractedPower, startDate, endDate) {
        this.type = type;
        this.energyMarketer = energyMarketer;
        this.tariffType = tariffType;
        this.energyPrices = energyPrices;
        this.powerPrices = powerPrices;
        this.contractedPower = contractedPower;
        this.startDate = startDate;
        this.endDate = endDate;
    }
};
__decorate([
    mongoose_1.Prop({ type: mongoose_2.Types.ObjectId, ref: energyMarketer_schema_1.EnergyMarketer.name }),
    __metadata("design:type", energyMarketer_schema_1.EnergyMarketer)
], ContractInfo.prototype, "energyMarketer", void 0);
__decorate([
    mongoose_1.Prop({ type: mongoose_2.Types.ObjectId, ref: commercial_schema_1.Commercial }),
    __metadata("design:type", energyMarketer_schema_1.EnergyMarketer)
], ContractInfo.prototype, "commercial", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "type", void 0);
__decorate([
    mongoose_1.Prop({ type: String }),
    __metadata("design:type", String)
], ContractInfo.prototype, "utilityType", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "tariffType", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", EnergyPrices_class_1.EnergyPrices)
], ContractInfo.prototype, "energyPrices", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", PowerPrices_class_1.PowerPrices)
], ContractInfo.prototype, "powerPrices", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", ContractedPower_class_1.ContractedPower)
], ContractInfo.prototype, "contractedPower", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "startDate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "endDate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "signingDate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "lastStateChangeDate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "state", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "contractNumber", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "fee", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "electricityService", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "gasService", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "anualConsumption", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ContractInfo.prototype, "anualConsumptionUnit", void 0);
ContractInfo = __decorate([
    mongoose_1.Schema(),
    __metadata("design:paramtypes", [energyMarketer_schema_1.EnergyMarketer, String, String, EnergyPrices_class_1.EnergyPrices,
        PowerPrices_class_1.PowerPrices,
        ContractedPower_class_1.ContractedPower, String, String])
], ContractInfo);
exports.ContractInfo = ContractInfo;
exports.ContractInfoSchema = mongoose_1.SchemaFactory.createForClass(ContractInfo);
