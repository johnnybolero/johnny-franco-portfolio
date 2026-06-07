import { useEffect, useRef } from 'react'

const SCROLL_RANGE = 1200
const SMOOTHING = 0.08
const BACKGROUND_MIN = 225
const BACKGROUND_SATURATION = 18

export function HeroFigurine() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const staticRef = useRef<HTMLImageElement>(null)
  const targetProgressRef = useRef(0)
  const smoothedProgressRef = useRef(0)
  const rafRef = useRef(0)
  const isMobile = window.innerWidth < 768

  useEffect(() => {
    // ── Mobile: slide right on scroll ──────────────────────────────
    if (isMobile) {
      const img = staticRef.current
      if (!img) return

      const SLIDE_START = 60   // px scrolled before slide begins
      const SLIDE_END = 300    // px scrolled when fully off screen

      const onScroll = () => {
        const y = window.scrollY
        const progress = Math.min(1, Math.max(0, (y - SLIDE_START) / (SLIDE_END - SLIDE_START)))
        const translateX = progress * 130  // slides 130% to the right
        const opacity = 1 - progress
        img.style.transform = `translateX(${translateX}%)`
        img.style.opacity = String(opacity)
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
      return () => window.removeEventListener('scroll', onScroll)
    }

    // ── Desktop: scroll-driven video rotation ──────────────────────
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const keyFrame = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(video, 0, 0, width, height)
      const imageData = ctx.getImageData(0, 0, width, height)
      const { data } = imageData
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        const min = Math.min(r, g, b)
        const max = Math.max(r, g, b)
        if (min > BACKGROUND_MIN && max - min < BACKGROUND_SATURATION) {
          data[i + 3] = 0
        }
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const seekToSmoothedTime = () => {
      const duration = video.duration
      if (!duration) return
      const clamped = Math.min(duration, Math.max(0, smoothedProgressRef.current * duration))
      if (Math.abs(video.currentTime - clamped) > 0.016) {
        video.currentTime = clamped
      } else if (video.readyState >= 2) {
        keyFrame()
      }
    }

    const render = () => {
      if (video.duration) {
        const target = Math.min(1, Math.max(0, targetProgressRef.current))
        smoothedProgressRef.current += (target - smoothedProgressRef.current) * SMOOTHING
        seekToSmoothedTime()
      }
      rafRef.current = requestAnimationFrame(render)
    }

    const onScroll = () => { targetProgressRef.current = window.scrollY / SCROLL_RANGE }
    const onLoadedMetadata = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      video.pause()
      onScroll()
      smoothedProgressRef.current = targetProgressRef.current
      video.currentTime = smoothedProgressRef.current * video.duration
    }
    const onSeeked = () => keyFrame()

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="hero__figurine">
      {!isMobile && (
        <>
          <video
            ref={videoRef}
            className="hero__figurine-video"
            src="/assets/johnnyrotate.mp4"
            muted
            playsInline
            preload="auto"
          />
          <canvas ref={canvasRef} className="hero__figurine-img hero__figurine-canvas" />
        </>
      )}
      {isMobile && (
        <img
          ref={staticRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_3ElIHjbwa8MreSuESdsMeQWVatB/hf_20260606_174406_1bdaf02c-9de3-43bf-b91d-497ac5a7903c.png"
          alt="Johnny Franco figurine"
          className="hero__figurine-img hero__figurine-static"
          style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }}
        />
      )}
    </div>
  )
}
