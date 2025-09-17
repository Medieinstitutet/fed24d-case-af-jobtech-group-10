import { FooterVariation } from '@digi/arbetsformedlingen';
import {
  DigiFooter,
  DigiHeader,
  DigiHeaderNavigation,
  DigiHeaderNavigationItem,
} from '@digi/arbetsformedlingen-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <DigiHeader afSystemName="TechStart" afHideSystemName={false} afMenuButtonText="Meny">
        <NavLink to="/" slot="header-logo" aria-label="TechStart startsida">
          <img src="/circular_techstart_logo.png" className="header-logo" alt="TechStart logga" />
        </NavLink>

        <div slot="header-content">
          <DigiHeaderNavigation af-close-button-text="Stäng">
            <DigiHeaderNavigationItem afCurrentPage={path === '/'}>
              <NavLink to="/">Hem</NavLink>
            </DigiHeaderNavigationItem>
            <DigiHeaderNavigationItem afCurrentPage={path.startsWith('/search')}>
              <NavLink to="/search">Sök jobb</NavLink>
            </DigiHeaderNavigationItem>
            <DigiHeaderNavigationItem afCurrentPage={path.startsWith('/about')}>
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
        <div slot="content-bottom-left">
          <p className="footer-content">TechStart &copy; 2025</p>
          <Link to="/">
            <img src="/circular_techstart_logo.png" className="footer-logo" alt="TechStart logga" />
          </Link>
        </div>
        <div slot="content-bottom-right" className="footer-content">
          <p>Följ vår projekt på</p>
          <a
            href="https://github.com/Medieinstitutet/fed24d-case-af-jobtech-group-10/tree/dev?tab=readme-ov-file"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </DigiFooter>
    </>
  );
}
