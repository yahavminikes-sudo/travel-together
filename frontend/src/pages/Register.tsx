import React from 'react';
import { useState } from 'react';
import { Container, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CustomCard } from '../components/ui/CustomCard';
import { CustomInput } from '../components/ui/CustomInput';
import { CustomButton } from '../components/ui/CustomButton';
import { registerSchema, RegisterFormData } from '@travel-together/shared/schemas/authSchemas';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    setIsSubmitting(true);

    try {
      await registerUser({
        email: data.email,
        password: data.password,
        username: data.username,
      });
      navigate('/');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Failed to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '450px', width: '100%' }}>
        <CustomCard className="shadow-sm border-0 p-4">
          <h2 className="text-center mb-4 fw-bold">Create an Account</h2>
          
          {authError && <Alert variant="danger">{authError}</Alert>}
          
          <Form onSubmit={handleSubmit(onSubmit)}>
            <CustomInput
              label="Username"
              type="text"
              placeholder="Choose a username"
              error={errors.username?.message}
              {...register('username')}
            />
            
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
              placeholder="Create a password"
              error={errors.password?.message}
              {...register('password')}
            />

            <CustomInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            
            <CustomButton 
              type="submit" 
              className="w-100 mt-4 py-2 fw-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Register'}
            </CustomButton>
          </Form>
          
          <div className="text-center mt-4">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-decoration-none fw-medium">Sign in here</Link>
          </div>
        </CustomCard>
      </div>
    </Container>
  );
};
