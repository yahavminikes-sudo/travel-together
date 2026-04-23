import React from 'react';
import { Button } from 'react-bootstrap';
import { Heart } from 'lucide-react';

interface Props {
  isLiked: boolean;
  likeCount: number;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const LikeButton: React.FC<Props> = ({ isLiked, likeCount, onClick, disabled }) => {
  return (
    <Button
      variant={isLiked ? 'danger' : 'outline-danger'}
      onClick={onClick}
      disabled={disabled}
      className="d-inline-flex align-items-center gap-2 rounded-pill px-3 transition-all"
      size="sm"
      style={{ fontWeight: 500 }}
      title={disabled ? 'Log in to like posts' : isLiked ? 'Unlike' : 'Like'}
    >
      <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} strokeWidth={isLiked ? 0 : 2} />
      <span>{likeCount}</span>
    </Button>
  );
};
