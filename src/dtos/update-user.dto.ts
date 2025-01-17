import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  Length,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName?: string;

  @ApiProperty({
    description: 'Gender of the user',
    example: 'male',
    enum: ['male', 'female', 'other'],
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'], {
    message: 'Gender must be one of male, female, or other',
  })
  gender?: 'male' | 'female' | 'other';

  @ApiProperty({
    description: 'Date of birth of the user',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Place of birth of the user',
    example: 'Paris',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  placeOfBirth?: string;

  @ApiProperty({
    description: 'Region of residence of the user',
    example: 'Île-de-France',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  region?: string;

  @ApiProperty({
    description: 'Department of residence of the user',
    example: '75',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  departement?: string;

  @ApiProperty({
    description: 'Commune of residence of the user',
    example: 'Paris',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  commune?: string;

  @ApiProperty({
    description: 'Full address of the user',
    example: '123 Main Street',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  address?: string;

  @ApiProperty({
    description: "Postal code of the user's address",
    example: '75001',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  postalCode?: string;

  @ApiProperty({
    description: 'Country of residence of the user',
    example: 'France',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  country?: string;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsString()
  isActive?: string;
}
