import React from 'react';
import { Badge, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post } from '@travel-together/shared/types/post.types';
import { CommentsContainer } from '@/containers/CommentsContainer';
import { LikeButton } from '@/components/ui/LikeButton';
import { CustomCard } from '@/components/ui/CustomCard';

interface PostDetailViewProps {
  currentUserId?: string;
  onBack: () => void;
  post: Post;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ currentUserId, onBack, post }) => {
  const canEdit = currentUserId === post.authorId;

  return (
    <Container className="my-5">
      <Button variant="link" className="text-decoration-none mb-3 px-0" onClick={onBack}>
        &larr; Back to posts
      </Button>

      <CustomCard className="border-0 shadow-sm mb-4">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="card-img-top"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        ) : null}
        <div className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <h1 className="fw-bold mb-0">{post.title}</h1>
            <LikeButton isLiked={false} likeCount={post.likes.length} onClick={() => {}} />
          </div>

          <div className="d-flex align-items-center mb-4 text-muted">
            <span className="fw-medium text-dark">{post.author?.username || 'Unknown'}</span>
            <span className="mx-2">&bull;</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {canEdit ? (
            <div className="mb-4">
              <Link to={`/posts/${post._id}/edit`} className="btn btn-outline-primary">
                Edit Post
              </Link>
            </div>
          ) : null}

          <p className="fs-5" style={{ whiteSpace: 'pre-wrap' }}>
            {post.content}
          </p>

          <div className="d-flex flex-wrap gap-2 mt-4">
            {post.tags?.map((tag) => (
              <Badge key={tag} bg="light" text="secondary" className="border px-3 py-2 fs-6 fw-normal">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </CustomCard>

      <CommentsContainer postId={post._id} />
    </Container>
  );
};
