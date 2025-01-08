import { BASE_RATE_PER_POUND, FEES, TAX_RATE } from '@/constants';
import { Package } from '@/database/entities/package.entity';
import { CreatePackageDto } from '@/dto/packages.dto';
import {
  CostBreakdownItem,
  ShippingDetails,
  ShippingCostResult,
} from '@/interfaces/shipping.details';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private packageRepo: Repository<Package>,
  ) {}

  async findById(id: Package['id']): Promise<Package> {
    return this.packageRepo.findOneByOrFail({ id });
  }

  async findByTrackingNumber(
    trackingNumber: Package['trackingNumber'],
  ): Promise<Package> {
    return this.packageRepo.findOneByOrFail({ trackingNumber });
  }

  findAll(): Promise<Package[]> {
    return this.packageRepo.find();
  }

  async getPackagesByUserId(userId: Package['userId']): Promise<Package[]> {
    return this.packageRepo.find({ where: { userId } });
  }

  async getPackageShippingPrice(id: Package['id']): Promise<any> {
    const { packageWeight } = await this.findById(id);

    return this.calculateShippingCost({
      weight: packageWeight,
    });
  }

  create(dto: CreatePackageDto): Promise<Package> {
    const user = this.packageRepo.create(dto);
    return this.packageRepo.save(user);
  }

  async update(id: Package['id'], dto: CreatePackageDto): Promise<Package> {
    const packageToUpdate = await this.findById(id);
    return this.packageRepo.merge(packageToUpdate, dto);
  }

  async delete(id: Package['id']): Promise<boolean> {
    const packageToDelete = await this.findById(id);
    this.packageRepo.remove(packageToDelete);
    return true;
  }
  private calculateTax = (amount: number): number => amount * TAX_RATE;

  private createBreakdownItem = (
    product: string,
    gross: number,
    tax: number,
  ): CostBreakdownItem => ({
    product,
    gross,
    tax,
    net: gross + tax,
  });

  private calculateShippingCost = (
    details: ShippingDetails,
  ): ShippingCostResult => {
    const { weight } = details;

    const grossFreight = BASE_RATE_PER_POUND * weight;
    const taxFreight = this.calculateTax(grossFreight);

    const totalGross =
      grossFreight +
      FEES.AIRPORT_FEE +
      FEES.FUEL_CHARGE +
      FEES.INSURANCE +
      FEES.DGA_SERVICES;

    const totalTax = taxFreight;
    const totalNet = totalGross + totalTax;

    const totalCost = totalNet;

    const breakdown: CostBreakdownItem[] = [
      this.createBreakdownItem('FLETE COURIER', grossFreight, taxFreight),
      this.createBreakdownItem('AIRPORT FEE', FEES.AIRPORT_FEE, 0),
      this.createBreakdownItem('COMBUSTIBLE', FEES.FUEL_CHARGE, 0),
      this.createBreakdownItem('SEGURO NO INCLUIDO', FEES.INSURANCE, 0),
      this.createBreakdownItem('SERVICIOS DGA', FEES.DGA_SERVICES, 0),
    ];

    return { totalCost, breakdown };
  };
}
