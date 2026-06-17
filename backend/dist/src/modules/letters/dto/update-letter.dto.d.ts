import { CreateLetterDto } from './create-letter.dto';
import { LetterStatus } from '@prisma/client';
declare const UpdateLetterDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateLetterDto>>;
export declare class UpdateLetterDto extends UpdateLetterDto_base {
    status?: LetterStatus;
    letterNumber?: string;
    pdfUrl?: string;
}
export {};
