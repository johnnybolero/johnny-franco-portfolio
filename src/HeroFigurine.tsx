import { useEffect, useRef } from 'react'

const SCROLL_RANGE = window.innerWidth < 768 ? 600 : 1200
const SMOOTHING = 0.08
const BACKGROUND_MIN = 225
const BACKGROUND_SATURATION = 18
export function HeroFigurine() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetProgressRef = useRef(0)
  const smoothedProgressRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
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
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const min = Math.min(r, g, b)
        const max = Math.max(r, g, b)
        const saturation = max - min
        const isBackground =
          min > BACKGROUND_MIN && saturation < BACKGROUND_SATURATION

        if (isBackground) {
          data[i + 3] = 0
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const seekToSmoothedTime = () => {
      const duration = video.duration
      if (!duration) return

      const targetTime = smoothedProgressRef.current * duration
      const clamped = Math.min(duration, Math.max(0, targetTime))

      if (Math.abs(video.currentTime - clamped) > 0.016) {
        video.currentTime = clamped
      } else if (video.readyState >= 2) {
        keyFrame()
      }
    }

    const render = () => {
      const duration = video.duration
      if (duration) {
        const target = Math.min(1, Math.max(0, targetProgressRef.current))
        smoothedProgressRef.current +=
          (target - smoothedProgressRef.current) * SMOOTHING
        seekToSmoothedTime()
      }

      rafRef.current = requestAnimationFrame(render)
    }

    const onScroll = () => {
      targetProgressRef.current = window.scrollY / SCROLL_RANGE
    }

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
      <video
        ref={videoRef}
        className="hero__figurine-video"
        src="/assets/johnnyrotate.mp4"
        muted
        playsInline
        preload="auto"
      />
      <canvas ref={canvasRef} className="hero__figurine-img hero__figurine-canvas" />
      <img
        src="https://d8j0ntlcm91z4.cloudfront.net/user_3ElIHjbwa8MreSuESdsMeQWVatB/hf_20260606_174406_1bdaf02c-9de3-43bf-b91d-497ac5a7903c.png"
        alt="Johnny Franco figurine"
        className="hero__figurine-img hero__figurine-static"
      />
    </div>
  )
}
