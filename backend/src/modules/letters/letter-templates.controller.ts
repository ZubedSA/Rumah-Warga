import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LetterTemplatesService } from './letter-templates.service';
import { CreateLetterTemplateDto } from './dto/create-letter-template.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('letter-templates')
export class LetterTemplatesController {
  constructor(private readonly letterTemplatesService: LetterTemplatesService) {}

  @Post()
  create(@TenantId() tenantId: string, @Body() createLetterTemplateDto: CreateLetterTemplateDto) {
    return this.letterTemplatesService.create(tenantId, createLetterTemplateDto);
  }

  @Get()
  findAll(@TenantId() tenantId: string) {
    return this.letterTemplatesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.letterTemplatesService.findOne(tenantId, id);
  }

  @Patch(':id')
  update(@TenantId() tenantId: string, @Param('id') id: string, @Body() updateLetterTemplateDto: Partial<CreateLetterTemplateDto>) {
    return this.letterTemplatesService.update(tenantId, id, updateLetterTemplateDto);
  }

  @Delete(':id')
  remove(@TenantId() tenantId: string, @Param('id') id: string) {
    return this.letterTemplatesService.remove(tenantId, id);
  }
}
