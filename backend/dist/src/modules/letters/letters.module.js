"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LettersModule = void 0;
const common_1 = require("@nestjs/common");
const letters_service_1 = require("./letters.service");
const letters_controller_1 = require("./letters.controller");
const letter_templates_service_1 = require("./letter-templates.service");
const letter_templates_controller_1 = require("./letter-templates.controller");
const prisma_module_1 = require("../../infrastructure/prisma/prisma.module");
const notifications_module_1 = require("../notifications/notifications.module");
let LettersModule = class LettersModule {
};
exports.LettersModule = LettersModule;
exports.LettersModule = LettersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notifications_module_1.NotificationsModule],
        controllers: [letters_controller_1.LettersController, letter_templates_controller_1.LetterTemplatesController],
        providers: [letters_service_1.LettersService, letter_templates_service_1.LetterTemplatesService],
    })
], LettersModule);
//# sourceMappingURL=letters.module.js.map