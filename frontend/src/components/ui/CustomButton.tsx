import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';

export interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ isLoading, children, disabled, ...props }) => {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
