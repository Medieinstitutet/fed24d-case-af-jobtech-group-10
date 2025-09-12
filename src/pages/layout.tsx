import { FooterVariation } from '@digi/arbetsformedlingen';
import {
  DigiFooter,
  DigiHeader,
  DigiHeaderNavigation,
  DigiHeaderNavigationItem,
} from '@digi/arbetsformedlingen-react';
import { Link, NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <DigiHeader afSystemName="TechStart" afHideSystemName={false} afMenuButtonText="Meny">
        <NavLink to="/" slot="header-logo" aria-label="TechStart startsida">
          <img
            slot="header-logo"
            src="/circular_techstart_logo.png"
            className="header-logo"
            alt="TechStart logga"
          />
        </NavLink>

        <div slot="header-content">
          <DigiHeaderNavigation>
            <DigiHeaderNavigationItem afCurrentPage={true}>
              <NavLink to="/">Hem</NavLink>
            </DigiHeaderNavigationItem>
            <DigiHeaderNavigationItem>
              <NavLink to="/search">Sök jobb</NavLink>
            </DigiHeaderNavigationItem>
            <DigiHeaderNavigationItem>
              <NavLink to="/about">Om oss</NavLink>
            </DigiHeaderNavigationItem>
          </DigiHeaderNavigation>
        </div>
      </DigiHeader>

      {/* Page content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <DigiFooter afVariation={FooterVariation.SMALL}>
        <div slot="content-bottom-left" className="footer-content">
          <p>TechStart &copy; 2025</p>
          <Link to="/">
            <img src="/circular_techstart_logo.png" className="footer-logo" alt="TechStart logga" />
          </Link>
        </div>
      </DigiFooter>
    </>
  );
}
