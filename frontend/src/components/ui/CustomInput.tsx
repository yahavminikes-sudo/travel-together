import { forwardRef } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { CustomLabel } from './CustomLabel';

export interface CustomInputProps extends FormControlProps {
  error?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  name?: string;
  label?: string;
  hint?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ error, id, className, type = 'text', label, hint, ...props }, ref) => {
    return (
      <Form.Group className="mb-3">
        {label && <CustomLabel htmlFor={id}>{label}</CustomLabel>}
        <Form.Control id={id} type={type} ref={ref} export isInvalid={!!error} className={className} {...props} />
        {hint && <Form.Text className="text-muted d-block mt-1">{hint}</Form.Text>}
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
      </Form.Group>
    );
  }
);
