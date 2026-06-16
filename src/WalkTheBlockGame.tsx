import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

interface Artifact {
  id: string
  x: number
  name: string
  desc: string
  url: string
  internal?: boolean
  icon: string
  awning: string
}

const WORLD_WIDTH = 3600
const PLAYER_SPEED = 4.6
const INTERACT_RANGE = 110
const PLAYER_MIN_X = 50
const PLAYER_MAX_X = WORLD_WIDTH - 50

const ARTIFACTS: Artifact[] = [
  {
    id: 'love-feliz',
    x: 620,
    name: 'LOVE FELIZ',
    desc: 'An apparel collection blending streetwear with Johnny’s personal story.',
    url: 'https://shop.johnnyfranco.nyc/collections/apparel',
    icon: '🧥',
    awning: '#c0473e',
  },
  {
    id: 'family-fotos',
    x: 1500,
    name: 'FAMILY FOTOS',
    desc: 'A photo series celebrating family, memory, and home.',
    url: 'https://shop.johnnyfranco.nyc/products/untitled-jun14_22-25',
    icon: '📷',
    awning: '#2f7a64',
  },
  {
    id: 'johnny-franco',
    x: 2380,
    name: 'JOHNNY FRANCO',
    desc: 'Essays and reflections on art, identity, and the creative life.',
    url: 'https://johnnyoappleseed.substack.com',
    icon: '📰',
    awning: '#3a5fa8',
  },
  {
    id: 'budget-quest',
    x: 3180,
    name: 'BUDGET QUEST',
    desc: 'A retro-styled finance game that turns budgeting into an adventure.',
    url: '/budget-quest',
    internal: true,
    icon: '🕹️',
    awning: '#9b59c4',
  },
]

const FILLER_BUILDINGS = [
  { x: 240, width: 160, height: 280, color: '#5b4339' },
  { x: 940, width: 150, height: 320, color: '#43505e' },
  { x: 1150, width: 130, height: 260, color: '#5b4339' },
  { x: 1780, width: 160, height: 300, color: '#43505e' },
  { x: 2010, width: 140, height: 340, color: '#4a3a4f' },
  { x: 2650, width: 150, height: 290, color: '#5b4339' },
  { x: 2870, width: 130, height: 260, color: '#43505e' },
  { x: 3400, width: 160, height: 310, color: '#4a3a4f' },
]

const LAMP_X = [420, 1080, 1660, 2150, 2750, 3320]
const HYDRANT_X = [330, 1380, 2520]
const TREE_X = [800, 1950, 3050]

function Building({ x, width, height, color }: { x: number; width: number; height: number; color: string }) {
  const rows = Math.max(2, Math.floor((height - 40) / 56))
  const cols = Math.max(2, Math.floor((width - 24) / 46))
  const windows = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (r * cols + c + x) % 3 === 0
      windows.push(
        <div
          key={`${r}-${c}`}
          className={`wtb-window ${lit ? 'wtb-window--lit' : ''}`}
        />
      )
    }
  }
  return (
    <div
      className="wtb-building"
      style={{ left: x, width, height, background: color }}
    >
      <div
        className="wtb-window-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {windows}
      </div>
    </div>
  )
}

function Storefront({
  artifact,
  collected,
  isNear,
}: {
  artifact: Artifact
  collected: boolean
  isNear: boolean
}) {
  return (
    <div className="wtb-storefront" style={{ left: artifact.x - 110 }}>
      {!collected && (
        <div className={`wtb-marker ${isNear ? 'wtb-marker--near' : ''}`}>
          <span className="wtb-marker__icon">{artifact.icon}</span>
        </div>
      )}
      <div className="wtb-storefront__sign">{artifact.name}</div>
      <div
        className="wtb-storefront__awning"
        style={{ background: artifact.awning }}
      />
      <div className="wtb-storefront__building">
        <div className="wtb-storefront__window">
          <span className="wtb-storefront__window-icon">{artifact.icon}</span>
        </div>
        <div className="wtb-storefront__door" />
      </div>
      {collected && <div className="wtb-storefront__found">FOUND ✓</div>}
    </div>
  )
}

export function WalkTheBlockGame() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const skylineRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const spriteRef = useRef<HTMLImageElement>(null)

  const playerXRef = useRef(80)
  const keysRef = useRef({ left: false, right: false })
  const facingRef = useRef<'left' | 'right'>('right')
  const movingRef = useRef(false)
  const rafRef = useRef(0)
  const pausedRef = useRef(true)

  const [collected, setCollected] = useState<Record<string, boolean>>({})
  const [nearId, setNearId] = useState<string | null>(null)
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null)
  const [showIntro, setShowIntro] = useState(true)
  const [finished, setFinished] = useState(false)
  const nearIdRef = useRef<string | null>(null)

  const collectedCount = Object.keys(collected).length

  const interact = useCallback(() => {
    const id = nearIdRef.current
    if (!id) return
    const artifact = ARTIFACTS.find((a) => a.id === id)
    if (!artifact) return
    setActiveArtifact(artifact)
  }, [])

  const closeModal = useCallback(() => {
    if (activeArtifact) {
      setCollected((prev) => {
        if (prev[activeArtifact.id]) return prev
        const next = { ...prev, [activeArtifact.id]: true }
        if (Object.keys(next).length === ARTIFACTS.length) {
          setFinished(true)
        }
        return next
      })
    }
    setActiveArtifact(null)
  }, [activeArtifact])

  const startGame = useCallback(() => {
    setShowIntro(false)
  }, [])

  const resetGame = useCallback(() => {
    playerXRef.current = 80
    setCollected({})
    setFinished(false)
    setActiveArtifact(null)
  }, [])

  // Pause flag reflects whether the game loop should move the player
  useEffect(() => {
    pausedRef.current = showIntro || !!activeArtifact || finished
  }, [showIntro, activeArtifact, finished])

  // Keyboard input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true
      if (e.code === 'Space' || e.code === 'KeyE') {
        e.preventDefault()
        if (showIntro) startGame()
        else if (!activeArtifact) interact()
      }
      if (e.code === 'Escape' && activeArtifact) closeModal()
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [showIntro, activeArtifact, interact, startGame, closeModal])

  // Game loop
  useEffect(() => {
    const render = () => {
      const viewport = viewportRef.current
      const world = worldRef.current
      const skyline = skylineRef.current
      const player = playerRef.current
      const sprite = spriteRef.current
      if (!viewport || !world || !player || !sprite) {
        rafRef.current = requestAnimationFrame(render)
        return
      }

      if (!pausedRef.current) {
        const { left, right } = keysRef.current
        let moving = false
        if (left && !right) {
          playerXRef.current -= PLAYER_SPEED
          facingRef.current = 'left'
          moving = true
        } else if (right && !left) {
          playerXRef.current += PLAYER_SPEED
          facingRef.current = 'right'
          moving = true
        }
        playerXRef.current = Math.min(PLAYER_MAX_X, Math.max(PLAYER_MIN_X, playerXRef.current))
        movingRef.current = moving
      }

      const viewportWidth = viewport.clientWidth
      const camera = Math.min(
        WORLD_WIDTH - viewportWidth,
        Math.max(0, playerXRef.current - viewportWidth / 2)
      )
      world.style.transform = `translateX(${-camera}px)`
      if (skyline) skyline.style.transform = `translateX(${-camera * 0.35}px)`
      player.style.left = `${playerXRef.current}px`

      sprite.classList.toggle('wtb-sprite--facing-left', facingRef.current === 'left')
      sprite.classList.toggle('wtb-sprite--walking', movingRef.current && !pausedRef.current)

      let closest: { id: string; dist: number } | null = null
      for (const a of ARTIFACTS) {
        const dist = Math.abs(a.x - playerXRef.current)
        if (dist < INTERACT_RANGE && (!closest || dist < closest.dist)) {
          closest = { id: a.id, dist }
        }
      }
      const newNearId = closest ? closest.id : null
      if (newNearId !== nearIdRef.current) {
        nearIdRef.current = newNearId
        setNearId(newNearId)
      }

      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleTouchStart = (dir: 'left' | 'right') => {
    keysRef.current[dir] = true
  }
  const handleTouchEnd = (dir: 'left' | 'right') => {
    keysRef.current[dir] = false
  }

  return (
    <div className="wtb-page">
      <nav className="wtb-nav">
        <Link to="/" className="wtb-nav__back">← BACK</Link>
      </nav>

      <div className="wtb-hud">
        <span className="wtb-hud__count">{collectedCount}/{ARTIFACTS.length} ARTIFACTS</span>
        <div className="wtb-hud__dots">
          {ARTIFACTS.map((a) => (
            <span
              key={a.id}
              className={`wtb-hud__dot ${collected[a.id] ? 'wtb-hud__dot--found' : ''}`}
            >
              {a.icon}
            </span>
          ))}
        </div>
      </div>

      <div className="wtb-viewport" ref={viewportRef}>
        <div className="wtb-sky" />
        <div className="wtb-skyline" ref={skylineRef}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="wtb-skyline__building"
              style={{ left: i * 320, height: 120 + (i % 5) * 40, width: 180 }}
            />
          ))}
        </div>
        <div className="wtb-world" ref={worldRef} style={{ width: WORLD_WIDTH }}>
          <div className="wtb-sidewalk" style={{ width: WORLD_WIDTH }} />

          {FILLER_BUILDINGS.map((b, i) => (
            <Building key={i} x={b.x} width={b.width} height={b.height} color={b.color} />
          ))}

          {ARTIFACTS.map((a) => (
            <Storefront
              key={a.id}
              artifact={a}
              collected={!!collected[a.id]}
              isNear={nearId === a.id}
            />
          ))}

          {LAMP_X.map((x, i) => (
            <div key={i} className="wtb-lamp" style={{ left: x }} />
          ))}
          {HYDRANT_X.map((x, i) => (
            <div key={i} className="wtb-hydrant" style={{ left: x }} />
          ))}
          {TREE_X.map((x, i) => (
            <div key={i} className="wtb-tree" style={{ left: x }} />
          ))}

          <div className="wtb-home" style={{ left: 0 }}>
            <span className="wtb-home__label">HOME</span>
          </div>
          <div className="wtb-subway" style={{ left: WORLD_WIDTH - 220 }}>
            <span className="wtb-subway__label">END OF THE BLOCK</span>
          </div>

          <div className="wtb-player" ref={playerRef}>
            <div className="wtb-player__shadow" />
            <img
              ref={spriteRef}
              src="/assets/figurine.png"
              alt="Johnny figurine"
              className="wtb-sprite"
            />
          </div>
        </div>
      </div>

      {nearId && !activeArtifact && !showIntro && !finished && (
        <div className="wtb-prompt">
          PRESS <kbd>SPACE</kbd> OR TAP <span className="wtb-prompt__btn">◉</span> TO INSPECT
        </div>
      )}

      <div className="wtb-controls">
        <button
          className="wtb-controls__btn"
          onPointerDown={() => handleTouchStart('left')}
          onPointerUp={() => handleTouchEnd('left')}
          onPointerLeave={() => handleTouchEnd('left')}
          aria-label="Move left"
        >
          ◀
        </button>
        <button
          className={`wtb-controls__btn wtb-controls__btn--interact ${nearId ? 'wtb-controls__btn--active' : ''}`}
          onClick={interact}
          aria-label="Inspect"
        >
          ◉
        </button>
        <button
          className="wtb-controls__btn"
          onPointerDown={() => handleTouchStart('right')}
          onPointerUp={() => handleTouchEnd('right')}
          onPointerLeave={() => handleTouchEnd('right')}
          aria-label="Move right"
        >
          ▶
        </button>
      </div>

      {showIntro && (
        <div className="wtb-overlay">
          <div className="wtb-overlay__card">
            <h1 className="wtb-overlay__title">WALK THE BLOCK</h1>
            <p className="wtb-overlay__desc">
              Explore Johnny's New York corner and track down the four artifacts
              hidden behind his projects — one storefront at a time.
            </p>
            <ul className="wtb-overlay__list">
              <li><kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd> to walk</li>
              <li><kbd>SPACE</kbd> or <kbd>E</kbd> to inspect an artifact</li>
              <li>On mobile, use the on-screen buttons</li>
            </ul>
            <button className="wtb-btn" onClick={startGame}>▶ START WALKING</button>
          </div>
        </div>
      )}

      {activeArtifact && (
        <div className="wtb-overlay" onClick={closeModal}>
          <div className="wtb-overlay__card" onClick={(e) => e.stopPropagation()}>
            <span className="wtb-overlay__icon">{activeArtifact.icon}</span>
            <h2 className="wtb-overlay__title wtb-overlay__title--sm">{activeArtifact.name}</h2>
            <p className="wtb-overlay__desc">{activeArtifact.desc}</p>
            <div className="wtb-overlay__actions">
              {activeArtifact.internal ? (
                <Link to={activeArtifact.url} className="wtb-btn">VISIT →</Link>
              ) : (
                <a href={activeArtifact.url} target="_blank" rel="noopener noreferrer" className="wtb-btn">
                  VISIT →
                </a>
              )}
              <button className="wtb-btn wtb-btn--ghost" onClick={closeModal}>CONTINUE WALKING</button>
            </div>
          </div>
        </div>
      )}

      {finished && (
        <div className="wtb-overlay">
          <div className="wtb-overlay__card">
            <h1 className="wtb-overlay__title">YOU FOUND THE WHOLE BLOCK</h1>
            <p className="wtb-overlay__desc">
              Four artifacts, four projects. Thanks for walking through Johnny's New York.
            </p>
            <div className="wtb-overlay__links">
              {ARTIFACTS.map((a) =>
                a.internal ? (
                  <Link key={a.id} to={a.url} className="wtb-overlay__link">{a.icon} {a.name}</Link>
                ) : (
                  <a key={a.id} href={a.url} target="_blank" rel="noopener noreferrer" className="wtb-overlay__link">
                    {a.icon} {a.name}
                  </a>
                )
              )}
            </div>
            <div className="wtb-overlay__actions">
              <button className="wtb-btn" onClick={resetGame}>↻ PLAY AGAIN</button>
              <Link to="/" className="wtb-btn wtb-btn--ghost">BACK TO PORTFOLIO</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
