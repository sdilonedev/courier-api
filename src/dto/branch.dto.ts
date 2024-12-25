import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  branchName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  branchAddress?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  branchCity: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contactNumber?: string;
}

export class UpdateBranchDto extends CreateBranchDto {}
