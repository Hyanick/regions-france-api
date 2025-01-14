import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  lastName?: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'], {
    message: 'Gender must be one of male, female, or other',
  })
  gender?: 'male' | 'female' | 'other';

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  placeOfBirth?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  region?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  departement?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  commune?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  postalCode?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  country?: string;

  @IsOptional()
  @IsString()
  isActive?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
