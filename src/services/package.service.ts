import { Package } from '@/database/entities/package.entity';
import { CreatePackageDto } from '@/dto/packages.dto';
import { ShipinngDetails } from '@/interfaces/shipping.details';
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
    const { packageWeight, deliveryAddress } = await this.findById(id);

    return this.calculateShippingCost({
      packagePrice: 0,
      weight: packageWeight,
      origin: 'US',
      destination: deliveryAddress,
    });
  }

  getRawData() {
    return this.packageRepo.query('SELECT * FROM packages');
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

  private calculateShippingCost(details: ShipinngDetails) {
    const exchangeRate = 55;
    const baseRatePerPound = 10;
    const airportFee = 17.52;
    const fuelCharge = 69.08;
    const dgaServices = 13.62;
    const insurance = -0.01;

    const grossFreight = baseRatePerPound * details.weight;
    const taxFreight = grossFreight * 0.18; // Ejemplo de impuesto del 18%
    const netFreight = grossFreight + taxFreight;

    const totalGross =
      grossFreight + airportFee + fuelCharge + insurance + dgaServices;
    const totalTax = taxFreight;
    const totalNet = totalGross + totalTax;

    const totalCost = totalNet * exchangeRate;

    const breakdown = [
      {
        product: 'FLETE COURIER',
        gross: grossFreight,
        tax: taxFreight,
        net: netFreight,
      },
      { product: 'AIRPORT FEE', gross: airportFee, tax: 0, net: airportFee },
      { product: 'COMBUSTIBLE', gross: fuelCharge, tax: 0, net: fuelCharge },
      {
        product: 'SEGURO NO INCLUIDO',
        gross: insurance,
        tax: 0,
        net: insurance,
      },
      {
        product: 'SERVICIOS DGA',
        gross: dgaServices,
        tax: 0,
        net: dgaServices,
      },
    ];

    return { totalCost, breakdown };
  }
}
