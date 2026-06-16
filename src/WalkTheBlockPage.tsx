import { useEffect } from 'react'
import './WalkTheBlockGame.css'
import { WalkTheBlockGame } from './WalkTheBlockGame'

export function WalkTheBlockPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <WalkTheBlockGame />
}
