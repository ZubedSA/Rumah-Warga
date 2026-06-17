"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./infrastructure/prisma/prisma.module");
const firebase_module_1 = require("./infrastructure/firebase/firebase.module");
const auth_module_1 = require("./modules/auth/auth.module");
const citizens_module_1 = require("./modules/citizens/citizens.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const letters_module_1 = require("./modules/letters/letters.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const onboarding_module_1 = require("./modules/onboarding/onboarding.module");
const finance_module_1 = require("./modules/finance/finance.module");
const superadmin_module_1 = require("./modules/superadmin/superadmin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            firebase_module_1.FirebaseModule,
            auth_module_1.AuthModule,
            citizens_module_1.CitizensModule,
            dashboard_module_1.DashboardModule,
            finance_module_1.FinanceModule,
            letters_module_1.LettersModule,
            notifications_module_1.NotificationsModule,
            onboarding_module_1.OnboardingModule,
            superadmin_module_1.SuperadminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map