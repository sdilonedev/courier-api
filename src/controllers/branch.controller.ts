import { CreateBranchDto, UpdateBranchDto } from '@/dto/branch.dto';
import { BranchService } from '@/services/branch.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('branches')
@Controller('branches')
export class BranchController {
  constructor(private branchService: BranchService) {}

  @Get()
  getAllBranches() {
    return this.branchService.getAllBranches();
  }

  @Get(':id')
  getBranchById(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.findById(id);
  }

  @Post('create')
  createBranch(@Body() dto: CreateBranchDto) {
    return this.branchService.create(dto);
  }

  @Put(':id/update')
  updateBranch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.branchService.update(id, dto);
  }

  @Post(':id/delete')
  deleteBranch(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.delete(id);
  }
}
