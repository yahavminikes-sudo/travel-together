import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CustomButton } from '../components/ui/CustomButton'; 

export const NotFound: React.FC = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '60vh' }}>
      <h1 className="display-1 fw-bold text-primary mb-3">404</h1>
      <h2 className="mb-4 fw-medium text-dark">Page Not Found</h2>
      <p className="text-muted mb-5 fs-5 max-w-md">
        Oops! The page you're looking for seems to have wandered off the map.
      </p>
      <Link to="/" className="text-decoration-none">
        <CustomButton variant="primary" className="px-4 py-2">
          Return Home
        </CustomButton>
      </Link>
    </Container>
  );
};
