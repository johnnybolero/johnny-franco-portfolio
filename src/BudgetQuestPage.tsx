import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './BudgetQuestPage.css'

const GAME_URL = 'https://celebrated-rabanadas-8819a1.netlify.app'

export function BudgetQuestPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bq-page">
      {/* Back nav */}
      <nav className="bq-nav">
        <Link to="/" className="bq-nav__back">← BACK</Link>
        <span className="bq-nav__logo">JAY FRANCO</span>
      </nav>

      {/* Hero */}
      <section className="bq-hero">
        <div className="bq-scanlines" />
        <p className="bq-hero__sub">LEVEL UP YOUR FINANCES</p>
        <h1 className="bq-hero__title">BUDGET<br />QUEST</h1>
        <p className="bq-hero__desc">
          A retro-styled personal finance game that turns budgeting into an adventure.
          Track your gold, slay your expenses, and level up your savings — one quest at a time.
        </p>
        <a href={GAME_URL} target="_blank" rel="noopener noreferrer" className="bq-btn bq-btn--primary">
          ▶ PLAY NOW
        </a>
      </section>

      {/* Features */}
      <section className="bq-features">
        <div className="bq-feature">
          <span className="bq-feature__icon">⚔️</span>
          <h3 className="bq-feature__title">TRACK EXPENSES</h3>
          <p className="bq-feature__desc">Log every battle against your budget and see where your gold is going.</p>
        </div>
        <div className="bq-feature">
          <span className="bq-feature__icon">🏆</span>
          <h3 className="bq-feature__title">SET GOALS</h3>
          <p className="bq-feature__desc">Choose your quest — save for a trip, pay off debt, build your treasury.</p>
        </div>
        <div className="bq-feature">
          <span className="bq-feature__icon">📊</span>
          <h3 className="bq-feature__title">LEVEL UP</h3>
          <p className="bq-feature__desc">Watch your financial power grow with every smart money move you make.</p>
        </div>
      </section>

      {/* Install instructions */}
      <section className="bq-install">
        <h2 className="bq-install__title">SAVE TO YOUR DEVICE</h2>
        <p className="bq-install__subtitle">Play Budget Quest like a native app — no download required.</p>

        <div className="bq-install__grid">
          <div className="bq-install__card">
            <span className="bq-install__platform">📱 iPHONE / iPAD</span>
            <ol className="bq-install__steps">
              <li>Open <a href={GAME_URL} target="_blank" rel="noopener noreferrer">{GAME_URL.replace('https://', '')}</a> in <strong>Safari</strong></li>
              <li>Tap the <strong>Share</strong> button <span className="bq-icon">⎙</span> at the bottom</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>Add</strong> — it appears on your home screen like an app</li>
            </ol>
          </div>

          <div className="bq-install__card">
            <span className="bq-install__platform">🤖 ANDROID</span>
            <ol className="bq-install__steps">
              <li>Open <a href={GAME_URL} target="_blank" rel="noopener noreferrer">{GAME_URL.replace('https://', '')}</a> in <strong>Chrome</strong></li>
              <li>Tap the <strong>three-dot menu</strong> ⋮ in the top right</li>
              <li>Tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>Add</strong> — it appears on your home screen like an app</li>
            </ol>
          </div>

          <div className="bq-install__card">
            <span className="bq-install__platform">💻 DESKTOP</span>
            <ol className="bq-install__steps">
              <li>Open <a href={GAME_URL} target="_blank" rel="noopener noreferrer">{GAME_URL.replace('https://', '')}</a> in <strong>Chrome</strong></li>
              <li>Click the <strong>install icon</strong> ⊕ in the address bar (far right)</li>
              <li>Click <strong>"Install"</strong> in the popup</li>
              <li>Budget Quest opens as its own window on your desktop</li>
            </ol>
          </div>
        </div>

        <a href={GAME_URL} target="_blank" rel="noopener noreferrer" className="bq-btn bq-btn--primary bq-btn--lg">
          ▶ PLAY BUDGET QUEST
        </a>
      </section>

      {/* Footer */}
      <footer className="bq-footer">
        <Link to="/" className="bq-footer__back">← BACK TO PORTFOLIO</Link>
        <span className="bq-footer__copy">©JOHNNY FRANCO 2026</span>
      </footer>
    </div>
  )
}
