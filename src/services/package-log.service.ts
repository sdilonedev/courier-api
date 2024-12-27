import { PackageLog } from '@/database/entities/package-log.entity';
import { CreatePackageLogDto } from '@/dto/packages.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PackageLogService {
  constructor(
    @InjectRepository(PackageLog)
    private packagelogRepo: Repository<PackageLog>,
  ) {}

  async findById(id: PackageLog['id']) {
    return this.packagelogRepo.findOneByOrFail({ id });
  }

  async findByPackageId(
    packageId: PackageLog['packageId'],
  ): Promise<PackageLog[]> {
    return this.packagelogRepo.find({ where: { packageId } });
  }

  findAll() {
    return this.packagelogRepo.find();
  }

  async getLatestStatus(packageId: PackageLog['id']) {
    const logs = await this.packagelogRepo.find({ where: { packageId } });
    const now = new Date();

    const validLogs = logs.filter((log) => log.timestamp <= now);

    if (validLogs.length === 0) {
      return null;
    }

    const latestLog = validLogs.reduce((latest, log) => {
      return log.timestamp > latest.timestamp ? log : latest;
    });

    return latestLog;
  }

  create(dto: CreatePackageLogDto) {
    const packageLog = this.packagelogRepo.create(dto);
    return this.packagelogRepo.save(packageLog);
  }

  async update(
    id: PackageLog['id'],
    dto: CreatePackageLogDto,
  ): Promise<PackageLog> {
    const packageLog = await this.findById(id);
    return this.packagelogRepo.merge(packageLog, dto);
  }

  async delete(id: PackageLog['id']): Promise<boolean> {
    const packageLog = await this.findById(id);
    this.packagelogRepo.remove(packageLog);
    return true;
  }
}
