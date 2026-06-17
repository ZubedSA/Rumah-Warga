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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitizensController = void 0;
const common_1 = require("@nestjs/common");
const citizens_service_1 = require("./citizens.service");
const create_citizen_dto_1 = require("./dto/create-citizen.dto");
const update_citizen_dto_1 = require("./dto/update-citizen.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
let CitizensController = class CitizensController {
    citizensService;
    constructor(citizensService) {
        this.citizensService = citizensService;
    }
    create(tenantId, createCitizenDto) {
        return this.citizensService.create(tenantId, createCitizenDto);
    }
    findAll(tenantId) {
        return this.citizensService.findAll(tenantId);
    }
    findOne(tenantId, id) {
        return this.citizensService.findOne(tenantId, id);
    }
    update(tenantId, id, updateCitizenDto) {
        return this.citizensService.update(tenantId, id, updateCitizenDto);
    }
    remove(tenantId, id) {
        return this.citizensService.remove(tenantId, id);
    }
};
exports.CitizensController = CitizensController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_citizen_dto_1.CreateCitizenDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_citizen_dto_1.UpdateCitizenDto]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CitizensController.prototype, "remove", null);
exports.CitizensController = CitizensController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('citizens'),
    __metadata("design:paramtypes", [citizens_service_1.CitizensService])
], CitizensController);
//# sourceMappingURL=citizens.controller.js.map