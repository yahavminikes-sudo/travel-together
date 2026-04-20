import React from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLoginMutation } from '../api/mutations/useLoginMutation';
import { CustomCard } from '../components/ui/CustomCard';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import { loginSchema, LoginFormData } from '../../../shared/schemas/authSchemas';



export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const mutation = useLoginMutation({
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      const state = location.state as { from?: { pathname: string } } | null;
      const from = state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  const isSubmitting = mutation.isPending;
  const authError = mutation.isError ? mutation.error.message : null;

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <CustomCard className="shadow-sm border-0 p-4">
          <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
          
          {authError && <Alert variant="danger">{authError}</Alert>}
          
          <Form onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              label="Email address"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email')}
            />
            
            <CustomInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password')}
            />
            
            <CustomButton 
              type="submit" 
              className="w-100 mt-4 py-2 fw-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </CustomButton>
          </Form>
          
          <div className="text-center mt-4">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" className="text-decoration-none fw-medium">Register here</Link>
          </div>
        </CustomCard>
      </div>
    </Container>
  );
};
