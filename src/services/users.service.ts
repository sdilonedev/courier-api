import { User } from '@/database/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '@/dto/users.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: User['email']): Promise<User> {
    return this.usersRepo.findOneBy({ email });
  }

  async findById(id: User['id']): Promise<User> {
    return this.usersRepo.findOneByOrFail({ id });
  }

  getAllUsers(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      dto.password = await hash(dto.password, 10);

      const user = this.usersRepo.create(dto);
      return this.usersRepo.save(user);
    } catch {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async update(id: User['id'], dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (dto.password) dto.password = await hash(dto.password, 10);
    return this.usersRepo.merge(user, dto);
  }

  async delete(id: User['id']): Promise<boolean> {
    const user = await this.findById(id);
    this.usersRepo.remove(user);
    return true;
  }
}
