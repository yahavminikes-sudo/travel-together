import React from 'react';
import { Form } from 'react-bootstrap';

export type CustomLabelProps = React.ComponentProps<typeof Form.Label> & {
  required?: boolean;
};

export const CustomLabel: React.FC<CustomLabelProps> = ({ required, children, className, ...props }) => {
  return (
    <Form.Label className={`fw-semibold mb-1 ${className || ''}`} {...props}>
      {children}
      {required && <span className="text-danger ms-1">*</span>}
    </Form.Label>
  );
};
