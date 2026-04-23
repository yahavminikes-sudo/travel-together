import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PostDetailView } from '@/components/features/PostDetailView';
import { PageError } from '@/components/ui/PageError';
import { PageLoader } from '@/components/ui/PageLoader';
import { useAuth } from '@/hooks/useAuth';
import { usePost, useDeletePost, useTogglePostLike } from '@/hooks/usePosts';

export const PostDetailContainer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { data: post, error: queryError, isLoading } = usePost(id);
  const deletePostMutation = useDeletePost();
  const toggleLikeMutation = useTogglePostLike();
  const error = queryError instanceof Error ? queryError.message : null;
  const fromPath = location.state?.from || '/';

  const handleDelete = async (postId: string) => {
    try {
      await deletePostMutation.mutateAsync(postId);
      navigate(fromPath);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleEdit = (postId: string) => {
    navigate(`/posts/${postId}/edit`);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !post || !id) {
    return (
      <PageError
        message={error || 'Post not found'}
        actionLabel="Go Back"
        onAction={() => navigate(fromPath)}
      />
    );
  }

  return (
    <PostDetailView
      currentUserId={currentUser?._id}
      post={post}
      onBack={() => navigate(fromPath)}
      onLikeToggle={(postId) => {
        void toggleLikeMutation.mutateAsync(postId);
      }}
      onDelete={currentUser?._id === post.authorId ? handleDelete : undefined}
      onEdit={currentUser?._id === post.authorId ? handleEdit : undefined}
    />
  );
};
