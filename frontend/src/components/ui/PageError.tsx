import React from 'react';
import { Alert, Button, Container } from 'react-bootstrap';

interface PageErrorProps {
  actionLabel?: string;
  className?: string;
  message: string;
  onAction?: () => void;
}

export const PageError: React.FC<PageErrorProps> = ({ actionLabel, className = 'mt-5', message, onAction }) => {
  return (
    <Container className={className}>
      <Alert variant="danger">{message}</Alert>
      {onAction && actionLabel ? (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Container>
  );
};
