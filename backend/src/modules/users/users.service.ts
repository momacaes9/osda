import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { PasswordService } from '../authentication/password.service.js';
import type { UserInputModel, UserViewModel } from './types/userInputModel.js';
import {
  inputModelToUser,
  UsersToUserViewModelsMappers,
  UserToUserViewModelMapper,
} from './mappers/inputModelToUser.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async get(): Promise<UserViewModel[]> {
    const users = await this.userRepository.find();
    return UsersToUserViewModelsMappers(users);
  }

  async getOneById(id: number): Promise<UserViewModel> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserToUserViewModelMapper(user);
  }

  async getAndValidateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async createUser(userInput: UserInputModel): Promise<UserViewModel> {
    const exists = await this.userRepository.findOne({
      where: { email: userInput.email.trim().toLowerCase() },
    });
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      userInput.password,
    );

    const mappedUser = inputModelToUser(userInput);

    mappedUser.password = hashedPassword;

    const saved = await this.userRepository.save(mappedUser);
    return UserToUserViewModelMapper(saved);
  }

  async updateLanguage(id: number, language: string): Promise<UserViewModel> {
    await this.userRepository.update({ id }, { language: language === 'pt' ? 'pt' : 'en' });
    return this.getOneById(id);
  }
}
