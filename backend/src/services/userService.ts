import { IUserService } from '../entities/IServices';
import { IUserRepository } from '../entities/IRepositories';
import { UpdateProfileDto } from '@travel-together/shared/types/user.types';

export const createUserService = ({ userRepository }: { userRepository: IUserRepository }): IUserService => {
  return {
    getUserProfile: async (userId: string) => {
      // Future: add additional logic (analytics, scrubbing data, appending followers) before returning
      return userRepository.findById(userId);
    },
    getUserById: async (id: string) => {
      return userRepository.findById(id);
    },
    updateUserProfile: async (userId: string, updates: UpdateProfileDto) => {
      return userRepository.update(userId, {
        avatarUrl: updates.avatarUrl,
        username: updates.username
      });
    }
  };
};
