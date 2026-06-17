import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { LettersService } from './letters.service';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('letters')
export class LettersController {
  constructor(private readonly lettersService: LettersService) {}

  @Post()
  create(@Req() req: any, @TenantId() tenantId: string, @Body() createLetterDto: CreateLetterDto) {
    return this.lettersService.create(req.user, tenantId, createLetterDto);
  }

  @Get()
  findAll(@Req() req: any, @TenantId() tenantId: string) {
    return this.lettersService.findAll(req.user, tenantId);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.lettersService.findOne(tenantId, id);
  }

  @Patch(':id')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateLetterDto: UpdateLetterDto) {
    return this.lettersService.update(tenantId, id, updateLetterDto);
  }
}
