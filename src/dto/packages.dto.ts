import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum PackageStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

enum DeliveryTerms {
  HOME_DELIVERY = 'HOME_DELIVERY',
  BRANCH_PICKUP = 'BRANCH_PICKUP',
}

export class CreatePackageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trackingNumber: string;

  @ApiProperty({ enum: PackageStatus })
  @IsEnum(PackageStatus)
  @IsNotEmpty()
  currentStatus: PackageStatus;

  @ApiProperty({ enum: DeliveryTerms })
  @IsEnum(DeliveryTerms)
  @IsNotEmpty()
  deliveryTerms: DeliveryTerms;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  packageWeight: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class UpdatePackageDto extends CreatePackageDto {}

export class CreatePackageLogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  packageId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  statusDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  timestamp: Date;
}

export class UpdatePackageLogDto extends CreatePackageLogDto {}
