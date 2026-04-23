import { Post } from '@travel-together/shared/types/post.types';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styles from './PostCard.module.css';

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
    <Card className={`${styles.card} h-100 shadow-sm border-0 overflow-hidden`}>
      {post.imageUrl && (
        <Link to={`/posts/${post._id}`} state={{ from: location.pathname }} className={styles.imageWrap}>
          <img src={post.imageUrl} alt={post.title} className={styles.image} />
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
          <h3 className={`${styles.title} mb-2`}>{post.title}</h3>
        </Link>

        <Card.Text className={`${styles.excerpt} mb-3`}>{post.content}</Card.Text>

        <div className="d-flex align-items-center justify-content-between mt-auto gap-3">
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
              <span className={styles.avatarFallback}>{authorFallback}</span>
            )}
            <span className={`${styles.author} text-truncate`}>{authorName}</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className={`${styles.like} ${isLiked ? styles.isLiked : ''}`}
              onClick={handleLikeClick}
              disabled={!currentUserId}
              title={currentUserId ? (isLiked ? 'Unlike' : 'Like') : 'Log in to like posts'}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={1.8} />
              <span>{post.likes.length}</span>
            </button>

            <Link to={`/posts/${post._id}#comments`} state={{ from: location.pathname }} className={styles.comments}>
              <MessageCircle size={16} />
              <span>{post.commentCount ?? 0}</span>
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
