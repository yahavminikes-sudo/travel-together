import { forwardRef } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';

export interface CustomInputProps extends FormControlProps {
  error?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  name?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({ error, id, className, type = 'text', ...props }, ref) => {
  return (
    <>
      <Form.Control
        id={id}
        type={type}
        ref={ref as any}
        isInvalid={!!error}
        className={className}
        {...props}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </>
  );
});

CustomInput.displayName = 'CustomInput';

export default CustomInput;
