// src/controllers/commune.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { CommuneService } from 'src/services/commune.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Commune } from 'src/entities/commune.entity';


@ApiTags('communes')
@Controller('/api/communes')
export class CommuneController {
  constructor(private readonly communeService: CommuneService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir la liste des communes' })
  @ApiResponse({ status: 200, description: 'Liste des communes récupérée avec succès', type: [Commune] })
  async findAll() {
    return this.communeService.findAll();
  }

  @Get('departement/:codeDepartement')
  @ApiOperation({ summary: 'Obtenir les communes d\'un département' })
  @ApiResponse({ status: 200, description: 'Communes récupérées avec succès', type: [Commune] })
  @ApiResponse({ status: 404, description: 'Aucune commune trouvée pour ce département' })
  async findByDepartement(@Param('codeDepartement') codeDepartement: string) {
    return this.communeService.findByDepartement(codeDepartement);
  }
}
