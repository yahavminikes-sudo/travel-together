import React from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Post } from '@travel-together/shared/types/post.types';
import { CommentsContainer } from '@/containers/CommentsContainer';
import { LikeButton } from '@/components/ui/LikeButton';

interface PostDetailViewProps {
  currentUserId?: string;
  onBack: () => void;
  post: Post;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ currentUserId, onBack, post, onDelete, onEdit }) => {
  const isOwner = currentUserId === post.authorId;
  const authorName = post.author?.username || 'Unknown';
  const postDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete?.(post._id);
    }
  };

  const handleEdit = () => {
    onEdit?.(post._id);
  };

  return (
    <Container className="py-4" style={{ maxWidth: 800 }}>
      <Button
        variant="link"
        className="text-decoration-none text-body mb-3 p-0 d-flex align-items-center gap-1"
        onClick={onBack}
      >
        <ArrowLeft size={16} /> Back
      </Button>

      <div className="rounded overflow-hidden mb-4">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} style={{ width: '100%', maxHeight: 450, objectFit: 'cover' }} />
        ) : null}
      </div>

      <div>
        <div className="d-flex align-items-center gap-1 small fw-medium text-accent-brand mb-2">
          <MapPin size={14} />
          {post.destination}
        </div>

        <h1 className="fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem' }}>
          {post.title}
        </h1>

        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <Link
            to={`/profile/${post.author?._id}`}
            className="d-flex align-items-center gap-2 text-decoration-none text-body"
          >
            {post.author?.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={authorName}
                roundedCircle
                width={36}
                height={36}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <span className="travel-post-avatar-fallback" style={{ width: 36, height: 36, fontSize: '1rem' }}>
                {authorName.charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <p className="small fw-medium mb-0">{authorName}</p>
              <p className="small text-muted-fg mb-0">{postDate}</p>
            </div>
          </Link>

          <div className="d-flex align-items-center gap-3">
            <LikeButton isLiked={false} likeCount={post.likes.length} onClick={() => {}} disabled={!currentUserId} />
            <Link
              to={`/posts/${post._id}#comments`}
              className="d-flex align-items-center gap-1 small text-muted-fg text-decoration-none"
            >
              <MessageCircle size={16} /> {post.commentCount ?? 0} comments
            </Link>
          </div>
        </div>

        {isOwner && (onEdit || onDelete) && (
          <div className="d-flex gap-2 mb-3">
            {onEdit && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleEdit}
                className="d-flex align-items-center gap-1"
              >
                <Pencil size={12} /> Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDelete}
                className="d-flex align-items-center gap-1"
              >
                <Trash2 size={12} /> Delete
              </Button>
            )}
          </div>
        )}

        <div className="mt-4">
          <p className="fs-6" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontWeight: 300 }}>
            {post.content}
          </p>
        </div>
      </div>

      <section id="comments" className="mt-5">
        <div className="d-flex align-items-center gap-2 mb-3">
          <MessageCircle size={18} />
          <h2 className="mb-0 fs-4">Comments ({post.commentCount ?? 0})</h2>
        </div>
        <CommentsContainer postId={post._id} />
      </section>
    </Container>
  );
};
