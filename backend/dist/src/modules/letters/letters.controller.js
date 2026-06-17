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
exports.LettersController = void 0;
const common_1 = require("@nestjs/common");
const letters_service_1 = require("./letters.service");
const create_letter_dto_1 = require("./dto/create-letter.dto");
const update_letter_dto_1 = require("./dto/update-letter.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const tenant_decorator_1 = require("../../common/decorators/tenant.decorator");
let LettersController = class LettersController {
    lettersService;
    constructor(lettersService) {
        this.lettersService = lettersService;
    }
    create(req, tenantId, createLetterDto) {
        return this.lettersService.create(req.user, tenantId, createLetterDto);
    }
    findAll(req, tenantId) {
        return this.lettersService.findAll(req.user, tenantId);
    }
    findOne(tenantId, id) {
        return this.lettersService.findOne(tenantId, id);
    }
    update(tenantId, id, updateLetterDto) {
        return this.lettersService.update(tenantId, id, updateLetterDto);
    }
};
exports.LettersController = LettersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_letter_dto_1.CreateLetterDto]),
    __metadata("design:returntype", void 0)
], LettersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, tenant_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LettersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LettersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, tenant_decorator_1.TenantId)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_letter_dto_1.UpdateLetterDto]),
    __metadata("design:returntype", void 0)
], LettersController.prototype, "update", null);
exports.LettersController = LettersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('letters'),
    __metadata("design:paramtypes", [letters_service_1.LettersService])
], LettersController);
//# sourceMappingURL=letters.controller.js.map