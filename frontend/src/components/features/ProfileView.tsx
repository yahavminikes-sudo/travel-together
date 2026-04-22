import React from 'react';
import { Container } from 'react-bootstrap';
import { AvatarSize, CustomAvatar } from '@/components/ui/CustomAvatar';
import { CustomCard } from '@/components/ui/CustomCard';
import { User } from '@travel-together/shared/types/user.types';

interface ProfileViewProps {
  user: User;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  return (
    <Container className="my-5" style={{ maxWidth: '600px' }}>
      <CustomCard className="shadow-sm border-0 text-center p-5">
        <div className="mb-4">
          <CustomAvatar
            imageUrl={user.avatarUrl}
            altText={user.username}
            size={AvatarSize.EXTRA_LARGE}
          />
        </div>

        <h2 className="fw-bold mb-1">{user.username}</h2>
        <p className="text-muted mb-4">{user.email}</p>

        {user.bio ? (
          <div className="bg-light p-4 rounded-3 text-start mb-4">
            <h5 className="fw-semibold mb-2">About me</h5>
            <p className="mb-0 text-secondary">{user.bio}</p>
          </div>
        ) : null}

        <div className="text-muted small">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </CustomCard>
    </Container>
  );
};
