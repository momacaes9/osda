import { User } from '../entities/user.entity.js';
import type { UserInputModel, UserViewModel } from '../types/userInputModel.js';

export function inputModelToUser(input: UserInputModel): User {
  const user = new User();
  user.name = input.name.trim();
  user.email = input.email.trim().toLowerCase();
  user.language = input.language ?? 'en';
  return user;
}

export function UserToUserViewModelMapper(user: User): UserViewModel {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    language: user.language,
    createdAt: user.createdAt,
  };
}

export function UsersToUserViewModelsMappers(users: User[]): UserViewModel[] {
  return users.map(UserToUserViewModelMapper);
}
