import React from 'react';
import { Card, CardProps } from 'react-bootstrap';

export interface CustomCardProps extends Omit<CardProps, 'title' | 'subtitle'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  noBody?: boolean;
}

export const CustomCard: React.FC<CustomCardProps> = ({ title, subtitle, noBody, children, className, ...props }) => {
  return (
    <Card className={`shadow-sm mb-4 ${className || ''}`} {...props}>
      {noBody ? (
        children
      ) : (
        <Card.Body>
          {title && <Card.Title>{title}</Card.Title>}
          {subtitle && <Card.Subtitle className="mb-3 text-muted">{subtitle}</Card.Subtitle>}
          {children}
        </Card.Body>
      )}
    </Card>
  );
};
