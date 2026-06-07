import { useState } from 'react'
import './App.css'
import { HeroFigurine } from './HeroFigurine'
import { BlogSection } from './BlogSection'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site">
      {/* NAV */}
      <nav className="nav">
        <div className="nav__left">
          <a href="#work" className="nav__pill nav__pill--light">WORK</a>
          <a href="#about" className="nav__pill nav__pill--light">ABOUT</a>
          <a href="#blog" className="nav__pill nav__pill--light">BLOG</a>
        </div>
        <div className="nav__center">
          <span className="nav__logo">JAY FRANCO</span>
        </div>
        <div className="nav__right">
          <a href="https://shop.johnnyfranco.nyc/collections/all" target="_blank" rel="noopener noreferrer" className="nav__pill nav__pill--light">SHOP</a>
          <a href="mailto:hello@johnnyfranco.nyc" className="nav__pill nav__pill--dark">GET IN TOUCH</a>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="nav__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`nav__hamburger-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`nav__hamburger-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`nav__hamburger-bar ${menuOpen ? 'open' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <a href="#work" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>WORK</a>
        <a href="#blog" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>WRITING</a>
        <a href="https://shop.johnnyfranco.nyc/collections/all" target="_blank" rel="noopener noreferrer" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>SHOP</a>
        <a href="#about" className="mobile-menu__link" onClick={() => setMenuOpen(false)}>ABOUT</a>
        <a href="mailto:hello@johnnyfranco.nyc" className="mobile-menu__link mobile-menu__link--cta" onClick={() => setMenuOpen(false)}>GET IN TOUCH</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero__wordmark">
          <span className="hero__word">CREATIVE</span>
          <HeroFigurine />
        </div>
      </section>

      {/* WORK HEADING */}
      <section className="work-heading" id="work">
        <span className="wordmark">WORK</span>
      </section>

      {/* PROJECT GRID */}
      <section className="projects">
        <div className="projects__grid">
          {/* Full-width card */}
          <div className="project-card project-card--full">
            <span className="project-card__label">Love Feliz</span>
            <div className="project-card__image-wrap">
              <img
                className="project-card__image"
                src="https://cdn.shopify.com/s/files/1/0518/4566/0862/files/Love_Feliz.jpg?v=1760134667"
                alt="Love Feliz"
              />
            </div>
          </div>

          {/* Half-width cards */}
          <div className="project-card project-card--half">
            <span className="project-card__label">Family Fotos</span>
            <div className="project-card__image-wrap">
              <img
                className="project-card__image"
                src="https://cdn.shopify.com/s/files/1/0518/4566/0862/files/IMG_7475.jpg?v=1749992117"
                alt="Family Fotos"
              />
            </div>
          </div>

          <div className="project-card project-card--half">
            <span className="project-card__label">Johnny Franco</span>
            <div className="project-card__image-wrap">
              <img
                className="project-card__image"
                src="https://cdn.shopify.com/s/files/1/0518/4566/0862/files/IMG_2950.png?v=1767541652"
                alt="Johnny Franco"
              />
            </div>
          </div>

          <div className="project-card project-card--full project-card--text">
            <span className="project-card__title">Budget Quest</span>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <BlogSection />

      {/* BIO */}
      <section className="bio" id="about">
        <p className="bio__text">
          Johnny Franco is a New Yorker who has lived many lives — artist,
          designer, builder, dreamer. Born from a culture that turns struggle
          into beauty, he crafts work that moves between worlds: the street
          and the studio, the handmade and the digital, the personal and the
          universal.
        </p>
        <a href="mailto:hello@johnnyfranco.nyc" className="bio__cta">GET IN TOUCH</a>
      </section>

      {/* EMAIL WORDMARK */}
      <section className="email-section">
        <a href="mailto:hello@johnnyfranco.nyc" className="email-wordmark">
          HELLO@JOHNNYFRANCO.NYC
        </a>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__col">
          <span className="footer__heading">SOCIALS</span>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
          <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer">DRIBBBLE</a>
        </div>
        <div className="footer__col">
          <span className="footer__heading">PAGES</span>
          <a href="#">HOME</a>
          <a href="#work">WORK</a>
          <a href="#about">ABOUT</a>
        </div>
        <div className="footer__copy">
          ©JOHNNY FRANCO 2026
        </div>
      </footer>
    </div>
  )
}

export default App
