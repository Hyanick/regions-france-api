// src/controllers/departement.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { DepartementService } from 'src/services/departement.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Departement } from 'src/entities/departement.entity';


@ApiTags('departements')
@Controller('/api/departements')
export class DepartementController {
  constructor(private readonly departementService: DepartementService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir la liste des départements' })
  @ApiResponse({ status: 200, description: 'Liste des départements récupérée avec succès', type: [Departement] })
  async findAll() {
    return this.departementService.findAll();
  }

  @Get('region/:codeRegion')
  @ApiOperation({ summary: 'Obtenir les départements par région' })
  @ApiResponse({ status: 200, description: 'Départements récupérés avec succès', type: [Departement] })
  @ApiResponse({ status: 404, description: 'Aucun département trouvé pour cette région' })
  async findByRegion(@Param('codeRegion') codeRegion: string) {
    return this.departementService.findByRegion(codeRegion);
  }
}
