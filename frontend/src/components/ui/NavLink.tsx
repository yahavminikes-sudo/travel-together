import React from 'react';
import { NavLink as RouterNavLink, NavLinkProps as RouterNavLinkProps } from 'react-router-dom';
import clsx from 'clsx';

interface Props extends RouterNavLinkProps {
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string);
  children: React.ReactNode;
}

export const NavLink: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <RouterNavLink 
      className={(navProps) => clsx(
        'nav-link', 
        { active: navProps.isActive }, 
        typeof className === 'function' ? className(navProps) : className
      )}
      {...props}
    >
      {children}
    </RouterNavLink>
  );
};
