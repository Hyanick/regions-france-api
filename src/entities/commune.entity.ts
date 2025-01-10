// src/entities/commune.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Departement } from './departement.entity';

@Entity()
export class Commune {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  nom: string;

  @Column({ type: 'varchar', length: 10 })
  codeDepartement: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @ManyToOne(() => Departement, departement => departement.code)
  @JoinColumn({ name: 'codeDepartement', referencedColumnName: 'code' })
  departement: Departement;
}
