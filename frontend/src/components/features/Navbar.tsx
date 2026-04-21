import React from 'react';
import { Navbar as BsNavbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavLink } from '../ui/NavLink';

interface Props {
  isAuthenticated?: boolean;
  onLogout?: () => void;
  username?: string;
}

export const Navbar: React.FC<Props> = ({ isAuthenticated, onLogout, username }) => {
  return (
    <BsNavbar bg="white" expand="lg" className="shadow-sm mb-4 border-bottom sticky-top">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
          Travel Together
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/">Home</NavLink>
            {isAuthenticated && <NavLink to="/my-posts">My Posts</NavLink>}
          </Nav>
          <Nav className="align-items-lg-center">
            {isAuthenticated ? (
              <>
                <BsNavbar.Text className="me-3 mb-2 mb-lg-0">
                  Signed in as: <strong className="text-dark">{username}</strong>
                </BsNavbar.Text>
                <Button variant="outline-danger" onClick={onLogout} size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register" className="ms-lg-2 mt-2 mt-lg-0 btn btn-primary text-white text-decoration-none">
                  Register
                </NavLink>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};
