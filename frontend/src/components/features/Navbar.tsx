import React from 'react';
import { Button, Container, Dropdown, Image, Nav, Navbar as BsNavbar } from 'react-bootstrap';
import { Compass, LogOut, PenSquare, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import type { User } from '@travel-together/shared/types/user.types';

interface Props {
  isAuthenticated?: boolean;
  onLogout?: () => void;
  currentUser?: User | null;
}

export const Navbar: React.FC<Props> = ({ isAuthenticated, onLogout, currentUser }) => {
  const navigate = useNavigate();
  const avatarFallback = currentUser?.username?.charAt(0).toUpperCase() ?? 'U';

  return (
    <BsNavbar expand="sm" className="navbar-brand-bar sticky-top py-2">
      <Container className="d-flex justify-content-between align-items-center">
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 m-0">
          <img src={logo} alt="Travel Together" style={{ height: 40 }} />
        </BsNavbar.Brand>

        <Nav className="d-flex flex-row align-items-center gap-2">
          <Button
            variant="link"
            className="text-decoration-none text-body d-flex align-items-center gap-1 px-2"
            onClick={() => navigate('/')}
          >
            <Compass size={16} />
            <span className="d-none d-sm-inline">Explore</span>
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                className="btn-accent d-flex align-items-center gap-1"
                size="sm"
                onClick={() => navigate('/posts/create')}
              >
                <PenSquare size={16} />
                <span className="d-none d-sm-inline">New Post</span>
              </Button>

              <Dropdown align="end">
                <Dropdown.Toggle
                  as="button"
                  className="btn btn-link p-0 border-0 navbar-avatar-toggle"
                  id="user-menu"
                >
                  {currentUser?.avatarUrl ? (
                    <Image
                      src={currentUser.avatarUrl}
                      alt={currentUser.username}
                      roundedCircle
                      width={36}
                      height={36}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <span className="navbar-avatar-fallback">{avatarFallback}</span>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate('/profile')}>
                    <UserIcon size={14} className="me-2" /> My Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/my-posts')}>
                    <PenSquare size={14} className="me-2" /> My Posts
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => {
                      onLogout?.();
                      navigate('/');
                    }}
                  >
                    <LogOut size={14} className="me-2" /> Log Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="link"
                size="sm"
                className="text-decoration-none text-body px-2"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button className="btn-primary" size="sm" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}
        </Nav>
      </Container>
    </BsNavbar>
  );
};
