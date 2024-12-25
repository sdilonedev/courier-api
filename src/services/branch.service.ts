import { Branch } from '@/database/entities/branch.entity';
import { CreateBranchDto, UpdateBranchDto } from '@/dto/branch.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private branchRepo: Repository<Branch>,
  ) {}

  async findById(id: Branch['id']): Promise<Branch> {
    return this.branchRepo.findOneByOrFail({ id });
  }

  getAllBranches(): Promise<Branch[]> {
    return this.branchRepo.find();
  }

  async create(dto: CreateBranchDto): Promise<Branch> {
    const branch = this.branchRepo.create(dto);
    return this.branchRepo.save(branch);
  }

  async update(id: Branch['id'], dto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findById(id);
    return this.branchRepo.merge(branch, dto);
  }

  async delete(id: Branch['id']): Promise<boolean> {
    const branch = await this.findById(id);
    this.branchRepo.remove(branch);
    return true;
  }
}
