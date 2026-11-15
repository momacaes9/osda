import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserInputModel {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @IsOptional()
  @IsIn(['en', 'pt'])
  language?: string;
}

export interface UserViewModel {
  id: number;
  name: string;
  email: string;
  language: string;
  createdAt: Date;
}
