import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useSmoothScroll } from './hooks/useSmoothScroll'
import SceneContainer from './components/3d/SceneContainer'
import Preloader from './components/ui/Preloader'
import CustomCursor from './components/ui/CustomCursor'

import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  // Global shared 3D parameters read by Canvas
  const progressRef = useRef({
    progress: 0.0,
    cameraX: 0.0,
    cameraY: 0.0,
    cameraZ: 5.0,
    noiseStrength: 0.2,
    rotationSpeed: 0.005,
    color1: '#FF6B4A', // Coral
    color2: '#9D8DF1', // Purple
    rotationY: 0.0
  })

  // Initialize smooth scroll & register ScrollTrigger
  useSmoothScroll()

  useEffect(() => {
    if (isLoading) return

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Hero -> About transition
      gsap.to(progressRef.current, {
        progress: 1.0,
        cameraX: -1.8, // Shift right
        cameraZ: 4.5,
        noiseStrength: 0.35,
        rotationSpeed: 0.015,
        color1: '#FF6B4A',
        color2: '#9D8DF1',
        rotationY: Math.PI * 0.7, // Tilted glass rotation
        scrollTrigger: {
          trigger: '#about',
          start: 'top bottom', // Start when about top is at viewport bottom
          end: 'top center',   // Fully transitioned when about top reaches center
          scrub: 0.5,
        }
      })

      // Projects -> Experience transition
      gsap.to(progressRef.current, {
        progress: 2.0,
        cameraX: 0.0,  // Centered in background
        cameraZ: 5.5,
        noiseStrength: 0.15,
        rotationSpeed: 0.003,
        color1: '#9D8DF1',
        color2: '#FF6B4A',
        rotationY: Math.PI * 2.2, // Continued rotation
        scrollTrigger: {
          trigger: '#experience',
          start: 'top bottom',
          end: 'top center',
          scrub: 0.5,
        }
      })

      // Experience -> Contact transition
      gsap.to(progressRef.current, {
        progress: 3.0,
        cameraX: 0.0,
        cameraZ: 6.5,
        noiseStrength: 0.45,
        rotationSpeed: 0.002,
        color1: '#FF6B4A',
        color2: '#9D8DF1',
        rotationY: Math.PI * 3.5, // Reassemble in footer with full rotation spin
        scrollTrigger: {
          trigger: '#contact',
          start: 'top bottom',
          end: 'top center',
          scrub: 0.5,
        }
      })
    })

    // Refresh ScrollTrigger to update positions
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      ctx.revert()
    }
  }, [isLoading])

  return (
    <main className="relative min-h-screen bg-[#FAF7F2] text-[#1A1A2E] overflow-x-hidden select-none">
      <CustomCursor />
      
      <Preloader onComplete={() => setIsLoading(false)} />
      
      {/* 3D Background scene */}
      {!isLoading && <SceneContainer progressRef={progressRef} />}

      {/* HTML Content */}
      <div className="relative z-10 w-full flex flex-col">
        <Hero />
        <About />
        <Projects progressRef={progressRef} />
        <Experience />
        <Contact />
      </div>
    </main>
  )
}

export default App
