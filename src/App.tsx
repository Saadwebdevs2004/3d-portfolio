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
    progress: 0.0, // 0 = Sphere, 1 = Torus Knot, 2 = Grid
    cameraX: 0.0,
    cameraY: 0.0,
    cameraZ: 5.0,
    noiseStrength: 0.2,
    rotationSpeed: 0.005,
    color1: '#00f0ff',
    color2: '#8b5cf6'
  })

  // Initialize smooth scroll & register ScrollTrigger
  useSmoothScroll()

  useEffect(() => {
    if (isLoading) return

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    // Hero -> About transition
    const trigger1 = gsap.to(progressRef.current, {
      progress: 1.0, // Morph to Torus Knot
      cameraX: -1.8, // Shift right
      cameraZ: 4.5,
      noiseStrength: 0.35,
      rotationSpeed: 0.015,
      color1: '#00f0ff',
      color2: '#8b5cf6',
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom', // Start when about top is at viewport bottom
        end: 'top center',   // Fully transitioned when about top reaches center
        scrub: 0.5,
      }
    })

    // Projects -> Experience transition
    const trigger2 = gsap.to(progressRef.current, {
      progress: 2.0, // Morph to wavy grid
      cameraX: 0.0,  // Centered in background
      cameraZ: 5.5,
      noiseStrength: 0.15,
      rotationSpeed: 0.003,
      color1: '#8b5cf6',
      color2: '#00f0ff',
      scrollTrigger: {
        trigger: '#experience',
        start: 'top bottom',
        end: 'top center',
        scrub: 0.5,
      }
    })

    // Experience -> Contact transition
    const trigger3 = gsap.to(progressRef.current, {
      progress: 0.0, // Morph back to slow particle sphere
      cameraX: 0.0,
      cameraZ: 6.5,
      noiseStrength: 0.45, // High noise for dispersed space dust look
      rotationSpeed: 0.002,
      color1: '#00f0ff',
      color2: '#8b5cf6',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'top center',
        scrub: 0.5,
      }
    })

    // Refresh ScrollTrigger to update positions
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    return () => {
      clearTimeout(timeoutId)
      trigger1.scrollTrigger?.kill()
      trigger2.scrollTrigger?.kill()
      trigger3.scrollTrigger?.kill()
      trigger1.kill()
      trigger2.kill()
      trigger3.kill()
    }
  }, [isLoading])

  return (
    <main className="relative min-h-screen bg-[#030303] text-zinc-100 overflow-x-hidden select-none">
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
