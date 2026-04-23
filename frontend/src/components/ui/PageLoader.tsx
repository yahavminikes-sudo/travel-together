import React from 'react';
import { Container, Spinner } from 'react-bootstrap';

interface PageLoaderProps {
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ className = 'mt-5 text-center' }) => {
  return (
    <Container className={className}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
};
