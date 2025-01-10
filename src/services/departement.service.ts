// src/services/departement.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Departement } from 'src/entities/departement.entity';
import { Repository } from 'typeorm';


@Injectable()
export class DepartementService {
  constructor(
    @InjectRepository(Departement)
    private departementRepository: Repository<Departement>,
  ) {}

  async findAll(): Promise<Departement[]> {
    return this.departementRepository.find();
  }

  async findByRegion(codeRegion: string): Promise<Departement[]> {
    return this.departementRepository.find({ where: { codeRegion } });
  }
}
