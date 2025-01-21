import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  userId: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  firstName: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  lastName: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  @ApiProperty({
    description: 'Gender of the user',
    example: 'male',
    enum: ['male', 'female', 'other'],
  })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'date', nullable: true })
  @ApiProperty({
    description: 'Date of birth of the user',
    example: '1990-01-01',
  })
  dateOfBirth: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Place of birth of the user',
    example: 'Paris',
    nullable: true,
  })
  placeOfBirth: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Region of residence of the user',
    example: 'Île-de-France',
    nullable: true,
  })
  region: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Department of residence of the user',
    example: '75',
    nullable: true,
  })
  departement: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Commune of residence of the user',
    example: 'Paris',
    nullable: true,
  })
  commune: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Full address of the user',
    example: '123 Main Street',
    nullable: true,
  })
  address: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: "Postal code of the user's address",
    example: '75001',
    nullable: true,
  })
  postalCode: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Country of residence of the user',
    example: 'France',
    nullable: true,
  })
  country: string;

  @Column({ default: 'true' })
  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
    default: true,
  })
  isActive: boolean;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Profile picture path',
    example: 'uploads/profile-1.jpg',
  })
  profilePicture: string;

  @ApiProperty({ description: 'email', example: 'test@domain.fr' })
  @Column({ nullable: false })
  email: string;

  @ApiProperty({ description: 'password', example: '******' })
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true }) // Peut être null si le token n'est pas généré
  refreshToken: string;

  @Column({ nullable: true })
  verificationCode: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  phoneNumber: string;
}
