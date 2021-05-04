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
exports.ClientInfoSchema = exports.ClientInfo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const clientTypology_schema_1 = require("./clientTypology.schema");
let ClientInfo = class ClientInfo {
    constructor(name, phoneNumber, email) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "phoneNumber", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "email", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "firstSurname", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "secondSurname", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "dniOrCif", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "address", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "city", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "addressCode", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], ClientInfo.prototype, "region", void 0);
__decorate([
    mongoose_1.Prop({ type: mongoose_2.Types.ObjectId, ref: clientTypology_schema_1.ClientTipology.name }),
    __metadata("design:type", clientTypology_schema_1.ClientTipology)
], ClientInfo.prototype, "clientTypology", void 0);
ClientInfo = __decorate([
    mongoose_1.Schema(),
    __metadata("design:paramtypes", [String, String, String])
], ClientInfo);
exports.ClientInfo = ClientInfo;
exports.ClientInfoSchema = mongoose_1.SchemaFactory.createForClass(ClientInfo);
