import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete: () => void
}

const bootLogs = [
  'INITIALIZING QUANTUM CANVAS...',
  'CONNECTING TO 3D RENDERING PIPELINE...',
  'SYNCHRONIZING GSAP SCROLL TRIGGERS...',
  'INJECTING LENIS SMOOTH MOMENTUM...',
  'LOADING PORTFOLIO MODULES...',
  'ESTABLISHING SECURE CONNECTION...',
  'SYSTEM READY. ENJOY THE EXPERIENCE.'
]

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0)
  const [logIndex, setLogIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Progress counter animation
    const duration = 2000 // 2 seconds
    const intervalTime = 30
    const totalSteps = duration / intervalTime
    let currentStep = 0

    const progressInterval = setInterval(() => {
      currentStep++
      const nextProgress = Math.min(Math.round((currentStep / totalSteps) * 100), 100)
      setProgress(nextProgress)

      if (nextProgress >= 100) {
        clearInterval(progressInterval)
        setTimeout(() => {
          setIsDone(true)
          setTimeout(onComplete, 600) // Call onComplete after exit animation
        }, 400)
      }
    }, intervalTime)

    return () => clearInterval(progressInterval)
  }, [onComplete])

  useEffect(() => {
    // Cycle through terminal boot logs
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev < bootLogs.length - 1 ? prev + 1 : prev))
    }, 280)

    return () => clearInterval(logInterval)
  }, [])

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 w-screen h-screen bg-[#030303] z-[9999] flex flex-col justify-between p-8 md:p-16 font-mono text-xs select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Header */}
          <div className="flex justify-between items-center text-zinc-500">
            <div>ANTIGRAVITY SYSTEM V4.3.2</div>
            <div className="animate-pulse">ONLINE</div>
          </div>

          {/* Middle: Glitchy percentage and logs */}
          <div className="flex flex-col items-center md:items-start max-w-xl self-center w-full">
            <motion.h1 
              className="text-8xl md:text-9xl font-bold tracking-tighter text-gradient-accent mb-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {progress}%
            </motion.h1>

            <div className="h-6 overflow-hidden w-full text-zinc-400">
              <motion.div
                key={logIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-[#00f0ff] uppercase tracking-widest text-[10px] md:text-xs"
              >
                {bootLogs[logIndex]}
              </motion.div>
            </div>

            {/* Simulated thin progress bar */}
            <div className="w-full h-[1px] bg-zinc-800 mt-4 relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#00f0ff]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-zinc-600 gap-2 md:gap-0">
            <div>DEVELOPER PORTFOLIO // SAAD HASSAN</div>
            <div>[ © 2026 ]</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default Preloader
