import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProfileView } from '@/components/features/ProfileView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { getUserById } from '@/api';
import { useAuth } from '@/hooks/useAuth';
import { usePosts, useTogglePostLike } from '@/hooks/usePosts';

export const UserProfileContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isInitializing } = useAuth();
  const { data: posts = [], error: postsError, isLoading: isPostsLoading } = usePosts();
  const toggleLikeMutation = useTogglePostLike();
  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: ({ signal }) => getUserById(id as string, signal),
    enabled: !!id,
  });

  if (isInitializing || isUserLoading || isPostsLoading) {
    return <PageLoader />;
  }

  if (!id || userError || postsError || !user) {
    const message =
      (userError instanceof Error && userError.message) ||
      (postsError instanceof Error && postsError.message) ||
      'User not found.';

    return <PageError message={message} />;
  }

  const userPosts = posts.filter((post) => post.authorId === id);

  return (
    <ProfileView
      currentUserId={currentUser?._id}
      isEditable={false}
      onLikeToggle={(postId) => {
        void toggleLikeMutation.mutateAsync(postId);
      }}
      postCount={userPosts.length}
      posts={userPosts}
      user={user}
    />
  );
};
