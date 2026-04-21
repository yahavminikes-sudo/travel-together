import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Post } from '@shared/types/post.types';
import { PostCard } from './PostCard';

interface PostsGridViewProps {
  currentUserId?: string;
  ctaLabel: string;
  ctaTo: string;
  emptyActionLabel?: string;
  emptyActionTo?: string;
  emptyMessage: string;
  posts: Post[];
  title: string;
}

export const PostsGridView: React.FC<PostsGridViewProps> = ({
  currentUserId,
  ctaLabel,
  ctaTo,
  emptyActionLabel,
  emptyActionTo,
  emptyMessage,
  posts,
  title,
}) => {
  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">{title}</h1>
        <Link to={ctaTo} className="btn btn-primary">
          {ctaLabel}
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5 mb-4">{emptyMessage}</p>
          {emptyActionLabel && emptyActionTo ? (
            <Link to={emptyActionTo} className="btn btn-outline-primary">
              {emptyActionLabel}
            </Link>
          ) : null}
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {posts.map((post) => (
            <Col key={post._id}>
              <PostCard post={post} currentUserId={currentUserId} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
