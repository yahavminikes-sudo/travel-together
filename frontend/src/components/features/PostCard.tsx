import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post } from '@shared/types/post.types';
import { LikeButton } from '../ui/LikeButton';

interface Props {
  post: Post;
  currentUserId?: string;
  onLikeToggle?: (postId: string) => void;
}

export const PostCard: React.FC<Props> = ({ post, currentUserId, onLikeToggle }) => {
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;
  const authorName = post.author?.username || 'Unknown Author';
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a link area
    e.stopPropagation();
    onLikeToggle?.(post._id);
  };

  return (
    <Card className="h-100 shadow-sm border-0 transition-transform hover-lift">
      {post.imageUrl && (
        <Card.Img 
          variant="top" 
          src={post.imageUrl} 
          alt={post.title} 
          style={{ height: '220px', objectFit: 'cover' }} 
        />
      )}
      <Card.Body className="d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0 fs-5 fw-bold line-clamp-2">
            <Link to={`/posts/${post._id}`} className="text-decoration-none text-dark stretched-link">
              {post.title}
            </Link>
          </Card.Title>
        </div>
        
        <Card.Subtitle className="mb-3 text-muted fs-6" style={{ zIndex: 2, position: 'relative' }}>
          By <span className="fw-medium text-dark">{authorName}</span>
          <span className="mx-2">&bull;</span>
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Card.Subtitle>
        
        <Card.Text className="flex-grow-1 text-secondary mb-4 line-clamp-3" style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden' 
        }}>
          {post.content}
        </Card.Text>
        
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-auto" style={{ zIndex: 2, position: 'relative' }}>
          <div className="d-flex flex-wrap gap-1">
            {post.tags?.map(tag => (
              <Badge key={tag} bg="light" text="secondary" className="border px-2 py-1 fw-normal">
                #{tag}
              </Badge>
            ))}
          </div>
          
          <div className="ms-sm-auto">
            <LikeButton 
              isLiked={isLiked} 
              likeCount={post.likes.length} 
              onClick={handleLikeClick}
              disabled={!currentUserId}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
