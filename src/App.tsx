import './App.css'
import { HeroFigurine } from './HeroFigurine'
import { BlogSection } from './BlogSection'

function App() {
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
          <a href="https://johnny-franco.myshopify.com/collections/all" target="_blank" rel="noopener noreferrer" className="nav__pill nav__pill--light">SHOP</a>
          <a href="mailto:hello@johnnyfranco.nyc" className="nav__pill nav__pill--dark">GET IN TOUCH</a>
        </div>
      </nav>

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
