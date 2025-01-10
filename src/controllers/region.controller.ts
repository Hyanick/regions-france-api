// src/controllers/region.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { RegionService } from 'src/services/region.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Region } from 'src/entities/region.entity';


@ApiTags('regions')
@Controller('/api/regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir la liste des régions' })
  @ApiResponse({ status: 200, description: 'Liste des régions récupérée avec succès', type: [Region] })
  async findAll() {
    return this.regionService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Obtenir une région par son code' })
  @ApiResponse({ status: 200, description: 'Région récupérée avec succès', type: Region })
  @ApiResponse({ status: 404, description: 'Région non trouvée' })
  async findOne(@Param('code') code: string) {
    return this.regionService.findOne(code);
  }
}
