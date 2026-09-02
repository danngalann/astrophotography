import Gallery from "./components/gallery";
import { mediaItems } from "@/content/media";

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#">
          <span>Daniel Galán</span>
          <small>Astrophotography</small>
        </a>
        <nav aria-label="Main navigation">
          <a href="#gallery">Gallery</a>
          <a
            href="https://danngalann.com"
            target="_blank"
            rel="noreferrer"
          >
            Main portfolio
          </a>
          <a
            href="https://github.com/danngalann/astrophotography"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <section className="hero">
        <picture className="hero-image">
          <source
            srcSet="/media/images/veil-nebula/2048.webp"
            media="(min-width: 900px)"
          />
          <img
            src="/media/images/veil-nebula/1280.webp"
            alt=""
            width="12358"
            height="8048"
          />
        </picture>
        <div className="hero-vignette" />
        <div className="hero-copy">
          <span className="eyebrow">From Earth, looking outward</span>
          <h1>
            Light gathered
            <br />
            across time.
          </h1>
          <p>
            Deep-sky objects, quiet landscapes, and nights spent beneath the
            stars.
          </p>
          <a className="hero-link" href="#gallery">
            Explore the gallery <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-caption">
          <span>Eastern Veil Nebula</span>
          <span>NGC 6992 · Cygnus</span>
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2>The gallery</h2>
          </div>
          <p>
            Images and films from dark skies and long nights. Open any frame
            for the full-resolution view and capture notes.
          </p>
        </div>
        <Gallery items={mediaItems} />
      </section>

      <section className="about-section" id="about">
        <span className="eyebrow">About the work</span>
        <div className="about-grid">
          <h2>Patience, planning, and a little borrowed starlight.</h2>
          <div>
            <p>
              Astrophotography brings together astronomy, technology, and the
              stillness of being outside after dark. Some images here took
              minutes to make; others combine light gathered over several
              nights.
            </p>
            <p>
              This is an evolving archive. Acquisition details, integration
              time, and equipment notes are added as each project is
              documented.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Daniel Galán</span>
        <div className="footer-links">
          <a href="https://danngalann.com">Main portfolio</a>
          <a
            href="https://github.com/danngalann/astrophotography"
            target="_blank"
            rel="noreferrer"
          >
            Source code
          </a>
          <a
            href="https://www.instagram.com/astro__dann"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </footer>
    </main>
  );
}
