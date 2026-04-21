import { IUserService } from '../entities/IServices';
import { IUserRepository } from '../entities/IRepositories';

export const createUserService = (deps: { userRepository: IUserRepository }): IUserService => {
  return {
    getUserProfile: async (userId: string) => {
      // Future: add additional logic (analytics, scrubbing data, appending followers) before returning
      return deps.userRepository.findById(userId);
    },
    getUserById: async (id: string) => {
      return deps.userRepository.findById(id);
    }
  };
};
