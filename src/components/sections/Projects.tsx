import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MagneticButton } from '../ui/MagneticButton'

interface ProjectsProps {
  progressRef: React.MutableRefObject<{
    progress: number
    cameraX: number
    cameraY: number
    cameraZ: number
    noiseStrength: number
    rotationSpeed: number
    color1: string
    color2: string
  }>
}

const projectsData = [
  {
    id: 1,
    title: 'Renovation-Connect',
    tagline: 'MERN & TypeScript Construction Platform',
    description:
      'A full-stack web platform connecting clients with renovation and interior design professionals. Features frontend/backend separation, REST API architecture, and TypeScript throughout. Final Year Project — NCBA&E University.',
    tech: ['TypeScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    github: 'https://github.com/Saadwebdevs2004/3d-portfolio',
    demo: 'https://github.com/Saadwebdevs2004',
    align: 'left' // text on left, 3D on right (cameraX = -1.8)
  },
  {
    id: 2,
    title: 'Weather Dashboard',
    tagline: 'Real-Time Climate Forecasting',
    description:
      'A real-time weather application showing current temperature and detailed forecasting data fetched via a REST API from OpenWeatherMap API.',
    tech: ['JavaScript', 'REST APIs', 'OpenWeatherMap API', 'HTML5', 'CSS3'],
    github: 'https://github.com/Saadwebdevs2004/3d-portfolio',
    demo: 'https://github.com/Saadwebdevs2004',
    align: 'right' // text on right, 3D on left (cameraX = 1.8)
  },
  {
    id: 3,
    title: 'To-Do List App',
    tagline: 'Minimalist State Taskboard',
    description:
      'A productivity-focused task management app with dynamic task addition/removal and persistent browser local storage state.',
    tech: ['JavaScript', 'HTML5', 'CSS3', 'LocalStorage'],
    github: 'https://github.com/Saadwebdevs2004/3d-portfolio',
    demo: 'https://github.com/Saadwebdevs2004',
    align: 'left' // text on left, 3D on right (cameraX = -1.8)
  }
]

export const Projects = ({ progressRef }: ProjectsProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const ch1Ref = useRef<HTMLDivElement>(null)
  const ch2Ref = useRef<HTMLDivElement>(null)
  const ch3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    const trigger = triggerRef.current
    const pinEl = pinRef.current
    const ch1 = ch1Ref.current
    const ch2 = ch2Ref.current
    const ch3 = ch3Ref.current

    if (!trigger || !pinEl || !ch1 || !ch2 || !ch3) return

    const ctx = gsap.context(() => {
      // Set initial states for chapter 2 and 3 (hidden/offset)
      gsap.set(ch2, { opacity: 0, y: 50, pointerEvents: 'none' })
      gsap.set(ch3, { opacity: 0, y: 50, pointerEvents: 'none' })

      // Create GSAP ScrollTrigger timeline for pinning and morphing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: '+=300%', // Scroll depth equal to 3 sections
          pin: pinEl,
          scrub: 1,
          anticipatePin: 1,
          onLeave: () => {
            // Return to centered grid state on scroll exit
            gsap.to(progressRef.current, {
              progress: 2.0,
              cameraX: 0.0,
              cameraZ: 5.5,
              noiseStrength: 0.15,
              color1: '#8b5cf6',
              color2: '#00f0ff',
              rotationY: Math.PI * 2.2,
              duration: 0.5
            })
          },
          onEnterBack: () => {
            // Re-establish chapter 3 parameters
            gsap.to(progressRef.current, {
              progress: 1.8,
              cameraX: -1.8,
              cameraZ: 4.5,
              noiseStrength: 0.25,
              color1: '#00f0ff',
              color2: '#ffffff',
              rotationY: Math.PI * 1.8,
              duration: 0.5
            })
          }
        }
      })

      // Chapter 1 -> Chapter 2 transition
      tl.to(progressRef.current, {
        progress: 1.1,
        cameraX: -1.8, // Push 3D mesh to the right
        cameraZ: 4.5,
        noiseStrength: 0.3,
        color1: '#00f0ff',
        color2: '#8b5cf6',
        rotationY: Math.PI * 0.9,
        duration: 0.2
      })
      .to(ch1, { opacity: 0, y: -50, pointerEvents: 'none', duration: 0.3 }, 'c1_out')
      .to(ch2, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.3 }, 'c1_out+=0.15')
      .to(progressRef.current, {
        progress: 1.5,
        cameraX: 1.8,  // Push 3D mesh to the left
        cameraZ: 4.8,
        noiseStrength: 0.45,
        color1: '#8b5cf6',
        color2: '#ff007f', // Reddish-purple vibe for Chapter 2
        rotationY: Math.PI * 1.4,
        duration: 0.4
      }, 'c1_out')

      // Chapter 2 -> Chapter 3 transition
      tl.to(ch2, { opacity: 0, y: -50, pointerEvents: 'none', duration: 0.3 }, 'c2_out')
      .to(ch3, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.3 }, 'c2_out+=0.15')
      .to(progressRef.current, {
        progress: 1.8,
        cameraX: -1.8, // Push 3D mesh to the right
        cameraZ: 4.5,
        noiseStrength: 0.25,
        color1: '#00f0ff',
        color2: '#ffffff', // Electric blue/white vibe for Chapter 3
        rotationY: Math.PI * 1.8,
        duration: 0.4
      }, 'c2_out')
      
      // Hold final slide brief scroll depth
      tl.to({}, { duration: 0.2 })
    }, triggerRef)

    return () => {
      ctx.revert()
    }
  }, [progressRef])

  return (
    <div ref={triggerRef} className="relative w-full bg-transparent" style={{ height: '400vh' }}>
      {/* Sticky container that gets pinned */}
      <div 
        ref={pinRef} 
        className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden z-10"
      >
        <div className="absolute inset-0 px-8 md:px-16 w-full max-w-6xl mx-auto flex items-center justify-center">
          
          {/* Chapter 1: Renovation-Connect */}
          <div 
            ref={ch1Ref} 
            className="absolute inset-0 flex items-center justify-between w-full h-full pointer-events-none"
          >
            <div className="max-w-xl text-left pointer-events-auto">
              <span className="text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-4 block">
                02 // SELECTED WORK
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight uppercase mb-2 font-heading">
                {projectsData[0].title}
              </h2>
              <p className="text-sm font-mono text-zinc-500 mb-6 uppercase tracking-wider">
                {projectsData[0].tagline}
              </p>
              <p className="text-zinc-400 font-sans text-base md:text-lg leading-relaxed mb-8">
                {projectsData[0].description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {projectsData[0].tech.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] md:text-xs font-mono rounded-full text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <MagneticButton>
                  <a 
                    href={projectsData[0].github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0f] border border-zinc-800 rounded-full hover:border-[#00f0ff] transition-colors text-xs font-mono text-white cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> GITHUB
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a 
                    href={projectsData[0].demo} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0f] border border-zinc-800 rounded-full hover:border-[#00f0ff] transition-colors text-xs font-mono text-white cursor-pointer"
                  >
                    <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> DEMO
                  </a>
                </MagneticButton>
              </div>
            </div>
            {/* Spacer for 3D mesh */}
            <div className="hidden lg:block lg:w-[45%] h-full" />
          </div>

          {/* Chapter 2: Weather Dashboard */}
          <div 
            ref={ch2Ref} 
            className="absolute inset-0 flex items-center justify-between w-full h-full pointer-events-none"
          >
            {/* Spacer for 3D mesh */}
            <div className="hidden lg:block lg:w-[45%] h-full" />

            <div className="max-w-xl text-left pointer-events-auto">
              <span className="text-xs font-mono tracking-widest text-[#8b5cf6] uppercase mb-4 block">
                02 // SELECTED WORK
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight uppercase mb-2 font-heading">
                {projectsData[1].title}
              </h2>
              <p className="text-sm font-mono text-zinc-500 mb-6 uppercase tracking-wider">
                {projectsData[1].tagline}
              </p>
              <p className="text-zinc-400 font-sans text-base md:text-lg leading-relaxed mb-8">
                {projectsData[1].description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {projectsData[1].tech.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] md:text-xs font-mono rounded-full text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <MagneticButton>
                  <a 
                    href={projectsData[1].github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0f] border border-zinc-800 rounded-full hover:border-[#8b5cf6] transition-colors text-xs font-mono text-white cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> GITHUB
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a 
                    href={projectsData[1].demo} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0f] border border-zinc-800 rounded-full hover:border-[#8b5cf6] transition-colors text-xs font-mono text-white cursor-pointer"
                  >
                    <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> DEMO
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Chapter 3: To-Do App */}
          <div 
            ref={ch3Ref} 
            className="absolute inset-0 flex items-center justify-between w-full h-full pointer-events-none"
          >
            <div className="max-w-xl text-left pointer-events-auto">
              <span className="text-xs font-mono tracking-widest text-white uppercase mb-4 block">
                02 // SELECTED WORK
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight uppercase mb-2 font-heading">
                {projectsData[2].title}
              </h2>
              <p className="text-sm font-mono text-zinc-500 mb-6 uppercase tracking-wider">
                {projectsData[2].tagline}
              </p>
              <p className="text-zinc-400 font-sans text-base md:text-lg leading-relaxed mb-8">
                {projectsData[2].description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {projectsData[2].tech.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] md:text-xs font-mono rounded-full text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <MagneticButton>
                  <a 
                    href={projectsData[2].github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0f] border border-zinc-800 rounded-full hover:border-white transition-colors text-xs font-mono text-white cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> GITHUB
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a 
                    href={projectsData[2].demo} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0f] border border-zinc-800 rounded-full hover:border-white transition-colors text-xs font-mono text-white cursor-pointer"
                  >
                    <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> DEMO
                  </a>
                </MagneticButton>
              </div>
            </div>
            {/* Spacer for 3D mesh */}
            <div className="hidden lg:block lg:w-[45%] h-full" />
          </div>

        </div>
      </div>
    </div>
  )
}
export default Projects
