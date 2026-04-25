import React from 'react';
import { useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { GoogleSignInButton } from '@/components/features/GoogleSignInButton';
import { loginSchema, LoginFormData } from '@travel-together/shared/schemas/authSchemas';
import logo from '@/assets/logo.png';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithGoogle } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

  const navigateAfterAuth = () => {
    const state = location.state as { from?: { pathname: string } } | null;
    const from = state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    setIsSubmitting(true);

    try {
      await login(data);
      navigateAfterAuth();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Failed to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setAuthError(null);
    setIsSubmitting(true);

    try {
      await signInWithGoogle({ credential });
      navigateAfterAuth();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Failed to sign in with Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 p-3">
      <Card className="w-100 shadow-sm" style={{ maxWidth: 440 }}>
        <Card.Body className="p-4">
          <div className="text-center mb-3">
            <img src={logo} alt="Travel Together" style={{ height: 64 }} className="mb-2 mx-auto d-block" />
            <h2 className="fw-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome Back
            </h2>
            <p className="text-muted-fg small mb-0">Sign in to continue your journey</p>
          </div>

          {authError && <Alert variant="danger">{authError}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                isInvalid={!!errors.email?.message}
                {...register('email')}
              />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                isInvalid={!!errors.password?.message}
                {...register('password')}
              />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>

          <div className="d-flex align-items-center gap-2 my-3">
            <hr className="flex-grow-1 m-0" />
            <span className="small text-muted-fg">or continue with</span>
            <hr className="flex-grow-1 m-0" />
          </div>

          <div className="d-flex justify-content-center">
            <GoogleSignInButton
              clientId={googleClientId}
              disabled={isSubmitting}
              onCredential={handleGoogleCredential}
              onError={setAuthError}
            />
          </div>

          <p className="text-center small text-muted-fg mt-3 mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="fw-medium" style={{ color: 'hsl(var(--primary))' }}>
              Sign Up
            </Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};
