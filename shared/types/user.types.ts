export interface User {
  _id?: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  username: string;
  avatarUrl?: string;
}
