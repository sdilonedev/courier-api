import {
  CreatePackageDto,
  CreatePackageLogDto,
  UpdatePackageLogDto,
} from '@/dto/packages.dto';
import { PackageLogService } from '@/services/package-log.service';
import { PackageService } from '@/services/package.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('packages')
@Controller('packages')
export class PackageController {
  constructor(
    private packageService: PackageService,
    private logService: PackageLogService,
  ) {}

  @Get()
  getAll() {
    return this.packageService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.packageService.findById(id);
  }

  @Get(':id/shipping')
  getShippingPrice(@Param('id') id: string) {
    return this.packageService.getPackageShippingPrice(id);
  }

  @Get('user/:userId')
  getByUserId(@Param('userId') userId: string) {
    return this.packageService.getPackagesByUserId(userId);
  }

  @Get('tracking/:trackingNumber')
  getByTrackingNumber(@Param('trackingNumber') trackingNumber: string) {
    return this.packageService.findByTrackingNumber(trackingNumber);
  }

  @Post('create')
  createPackage(@Body() dto: CreatePackageDto) {
    return this.packageService.create(dto);
  }

  @Put(':id/update')
  updatePackage(@Param('id') id: string, @Body() dto: CreatePackageDto) {
    return this.packageService.update(id, dto);
  }

  @Post(':id/delete')
  deletePackage(@Param('id') id: string) {
    return this.packageService.delete(id);
  }

  @Get('log/:id')
  getPackageLog(@Param('id') id: string) {
    return this.logService.findByPackageId(id);
  }

  @Get('log/latest/:id')
  getLatestLog(@Param('id') id: string) {
    return this.logService.getLatestStatus(id);
  }

  @Post('log')
  createPackageLog(@Body() dto: CreatePackageLogDto) {
    return this.logService.create(dto);
  }

  @Put('log/:id/update')
  updatePackageLog(@Param('id') id: string, @Body() dto: UpdatePackageLogDto) {
    return this.logService.update(id, dto);
  }

  @Post('log/:id/delete')
  deletePackageLog(@Param('id') id: string) {
    return this.logService.delete(id);
  }
}
