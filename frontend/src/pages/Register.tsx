import React from 'react';
import { useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, RegisterFormData } from '@travel-together/shared/schemas/authSchemas';
import logo from '@/assets/logo.png';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');

  React.useEffect(() => {
    setValue('confirmPassword', passwordValue, { shouldValidate: false });
  }, [passwordValue, setValue]);

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
    <Container className="d-flex align-items-center justify-content-center min-vh-100 p-3">
      <Card className="w-100 shadow-sm" style={{ maxWidth: 440 }}>
        <Card.Body className="p-4">
          <div className="text-center mb-3">
            <img
              src={logo}
              alt="Travel Together"
              style={{ height: 64 }}
              className="mb-2 mx-auto d-block"
            />
            <h2 className="fw-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Join the Journey
            </h2>
            <p className="text-muted-fg small mb-0">Create your account and start sharing</p>
          </div>

          {authError && <Alert variant="danger">{authError}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                isInvalid={!!errors.username?.message}
                {...register('username')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your@email.com"
                isInvalid={!!errors.email?.message}
                {...register('email')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                isInvalid={!!errors.password?.message}
                {...register('password')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <input type="hidden" {...register('confirmPassword')} />

            <Button type="submit" className="btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </Form>

          <p className="text-center small text-muted-fg mt-3 mb-0">
            Already have an account?{' '}
            <Link to="/login" className="fw-medium" style={{ color: 'hsl(var(--primary))' }}>
              Sign In
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};
