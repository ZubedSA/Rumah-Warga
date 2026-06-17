"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCitizenDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_citizen_dto_1 = require("./create-citizen.dto");
class UpdateCitizenDto extends (0, mapped_types_1.PartialType)(create_citizen_dto_1.CreateCitizenDto) {
}
exports.UpdateCitizenDto = UpdateCitizenDto;
//# sourceMappingURL=update-citizen.dto.js.map