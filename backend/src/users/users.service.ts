import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async getPartner(userId: number): Promise<User> {
    // Since we only have two users, return the other one
    const partnerId = userId === 1 ? 2 : 1;
    return this.usersRepository.findOne({ 
      where: { id: partnerId },
      select: ['id', 'name', 'email', 'avatar_url', 'created_at']
    });
  }
}