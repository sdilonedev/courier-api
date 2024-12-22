import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum AccountType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
}
enum GenderType {
  MALE = 'Male',
  WOMAN = 'Woman',
}

export class CreateUserDto {
  @ApiProperty()
  @IsEnum(AccountType)
  @IsNotEmpty()
  accountType: AccountType;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  associatedBranchId: number;
}

export class UpdateUserDto extends CreateUserDto {}
