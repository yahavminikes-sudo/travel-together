import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import { Post } from '@travel-together/shared/types/post.types';

interface Props {
  post: Post;
  currentUserId?: string;
  onLikeToggle?: (postId: string) => void;
}

export const PostCard: React.FC<Props> = ({ post, currentUserId, onLikeToggle }) => {
  const location = useLocation();
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;
  const authorName = post.author?.username || 'Unknown Author';
  const authorFallback = authorName.charAt(0).toUpperCase();
  const metaLabel = post.destination;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLikeToggle?.(post._id);
  };

  return (
    <Card className="travel-post-card h-100 shadow-sm border-0 overflow-hidden">
      {post.imageUrl && (
        <Link to={`/posts/${post._id}`} state={{ from: location.pathname }} className="travel-post-image-wrap">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="travel-post-image"
          />
        </Link>
      )}
      <Card.Body className="d-flex flex-column p-3 p-md-4">
        {metaLabel ? (
          <div className="d-flex align-items-center gap-1 mb-2 small fw-medium text-accent-brand">
            <MapPin size={12} />
            <span>{metaLabel}</span>
          </div>
        ) : null}

        <Link to={`/posts/${post._id}`} state={{ from: location.pathname }} className="text-decoration-none text-body">
          <h3 className="travel-post-title mb-2">{post.title}</h3>
        </Link>

        <Card.Text className="travel-post-excerpt mb-3">
          {post.content}
        </Card.Text>

        <div className="d-flex align-items-center justify-content-between mt-auto gap-3">
          {post.author?._id ? (
            <Link
              to={`/profile/${post.author._id}`}
              className="d-flex align-items-center gap-2 min-w-0 text-decoration-none text-body"
            >
              {post.author?.avatarUrl ? (
                <Image
                  src={post.author.avatarUrl}
                  alt={authorName}
                  roundedCircle
                  width={28}
                  height={28}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <span className="travel-post-avatar-fallback">{authorFallback}</span>
              )}
              <span className="travel-post-author text-truncate">{authorName}</span>
            </Link>
          ) : (
            <div className="d-flex align-items-center gap-2 min-w-0">
              {post.author?.avatarUrl ? (
                <Image
                  src={post.author.avatarUrl}
                  alt={authorName}
                  roundedCircle
                  width={28}
                  height={28}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <span className="travel-post-avatar-fallback">{authorFallback}</span>
              )}
              <span className="travel-post-author text-truncate">{authorName}</span>
            </div>
          )}

          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className={`travel-post-like ${isLiked ? 'is-liked' : ''}`}
              onClick={handleLikeClick}
              disabled={!currentUserId}
              title={currentUserId ? (isLiked ? 'Unlike' : 'Like') : 'Log in to like posts'}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={1.8} />
              <span>{post.likes.length}</span>
            </button>

            <Link to={`/posts/${post._id}#comments`} state={{ from: location.pathname }} className="travel-post-comments">
              <MessageCircle size={16} />
              <span>{post.commentCount ?? 0}</span>
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
