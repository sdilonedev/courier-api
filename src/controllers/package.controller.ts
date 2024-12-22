import { CreatePackageDto } from '@/dto/packages.dto';
import { PackageService } from '@/services/package.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('packages')
@Controller('packages')
export class PackageController {
  constructor(private packageService: PackageService) {}

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

  @ApiExcludeEndpoint()
  @Get('raw')
  getRawData() {
    return this.packageService.getRawData();
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
}
