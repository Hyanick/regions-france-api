// src/entities/departement.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Region } from './region.entity';

@Entity()
export class Departement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  nom: string;

  @Column({ type: 'varchar', length: 10 })
  codeRegion: string;

  @ManyToOne(() => Region, region => region.code)
  @JoinColumn({ name: 'codeRegion', referencedColumnName: 'code' })
  region: Region;
}
