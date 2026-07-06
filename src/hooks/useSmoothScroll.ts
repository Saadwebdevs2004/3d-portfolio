import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useSmoothScroll = () => {
  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const tickHandler = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickHandler)
    gsap.ticker.lagSmoothing(0)

    // Store lenis globally for access in other components if needed
    ;(window as any).lenis = lenis

    // Refresh ScrollTrigger on mount to ensure correct offsets
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      gsap.ticker.remove(tickHandler)
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])
}
