import { motion } from 'framer-motion'
import { MagneticButton } from '../ui/MagneticButton'

export const Hero = () => {
  const nameWords = 'SAAD HASSAN'.split(' ')
  const roleLine = 'MERN Stack Developer // SEO & Web Specialist'

  const containerVars = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4
      }
    }
  }

  const wordVars = {
    initial: { y: 100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.85, ease: [0.215, 0.61, 0.355, 1] as any }
    }
  }

  const fadeUpVars = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any, delay: 1.2 }
    }
  }

  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="hero" 
      className="relative min-h-screen w-full flex flex-col justify-between px-8 md:px-16 py-12 z-10 select-none overflow-hidden"
    >
      {/* Spacer to align content nicely */}
      <div className="flex justify-between items-center w-full">
        <motion.span 
          className="text-xs font-mono tracking-widest text-[#FF6B4A] uppercase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          DEVELOPER PORTFOLIO
        </motion.span>
        <motion.span 
          className="text-xs font-mono tracking-widest text-[#4A4A6A] hidden md:inline"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          SAAD.DEV // 2026
        </motion.span>
      </div>

      {/* Main typography content */}
      <div className="max-w-4xl self-start my-auto">
        <motion.div 
          className="overflow-hidden flex flex-wrap gap-x-4 md:gap-x-6 mb-2"
          variants={containerVars}
          initial="initial"
          animate="animate"
        >
          {nameWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-2">
              <motion.h1 
                className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter text-gradient uppercase font-heading"
                variants={wordVars}
              >
                {word}
              </motion.h1>
            </span>
          ))}
        </motion.div>

        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-[#4A4A6A] font-mono tracking-wide max-w-2xl mb-8"
          variants={fadeUpVars}
          initial="initial"
          animate="animate"
        >
          {roleLine}
        </motion.p>

        <motion.div
          variants={fadeUpVars}
          initial="initial"
          animate="animate"
        >
          <MagneticButton>
            <button
              onClick={handleScrollDown}
              className="px-6 py-3 bg-[#FF6B4A] border border-[#FF6B4A] text-sm tracking-wider font-mono uppercase text-white rounded-full hover:bg-transparent hover:text-[#FF6B4A] transition-all duration-300 shadow-[0_4px_20px_rgba(255,107,74,0.15)] cursor-pointer"
            >
              EXPLORE WORKS
            </button>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Footer: scroll indicator */}
      <div className="flex justify-between items-end w-full">
        <div className="text-[#4A4A6A] text-[10px] md:text-xs font-mono">
          BASED IN LAHORE, PAKISTAN
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 cursor-pointer text-[#4A4A6A] hover:text-[#FF6B4A]"
          onClick={handleScrollDown}
        >
          <span className="text-[10px] font-mono tracking-widest uppercase hidden md:inline">SCROLL TO DISCOVER</span>
          <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
        </motion.div>
      </div>
    </section>
  )
}
export default Hero
