"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#gallery", label: "Gallery" },
  { href: "https://danngalann.com", label: "Main portfolio", external: true },
  {
    href: "https://github.com/danngalann/astrophotography",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://www.instagram.com/astro__dann",
    label: "Instagram",
    external: true,
  },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="wordmark" href="#">
        <span>Daniel Galán</span>
        <small>Astrophotography</small>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <a
            href={link.href}
            key={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>

      <div
        className={menuOpen ? "mobile-drawer open" : "mobile-drawer"}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {links.map((link, index) => (
            <a
              href={link.href}
              key={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              tabIndex={menuOpen ? undefined : -1}
              onClick={() => setMenuOpen(false)}
            >
              <span>0{index + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>
        <small>From Earth, looking outward</small>
      </div>
    </header>
  );
}
