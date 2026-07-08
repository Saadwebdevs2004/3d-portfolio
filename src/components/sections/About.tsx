import { motion } from 'framer-motion'

const skills = [
  { name: 'React', category: 'Frontend', level: '90%', color: '#FF6B4A' }, // Coral
  { name: 'TypeScript', category: 'Frontend', level: '85%', color: '#FF6B4A' },
  { name: 'Tailwind CSS', category: 'Frontend', level: '95%', color: '#FF6B4A' },
  { name: 'Node.js', category: 'Backend', level: '80%', color: '#9D8DF1' }, // Soft Purple
  { name: 'Express', category: 'Backend', level: '85%', color: '#9D8DF1' },
  { name: 'MongoDB', category: 'Backend', level: '75%', color: '#9D8DF1' },
  { name: 'SEO & Marketing', category: 'Specialty', level: '90%', color: '#4ECDC4' }, // Sky/Teal
  { name: 'WordPress', category: 'Web Dev', level: '85%', color: '#4ECDC4' },
]

export const About = () => {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVars = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' as any }
    }
  }

  return (
    <section 
      id="about" 
      className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-16 py-24 z-10 overflow-hidden"
    >
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Summary text */}
        <motion.div 
          className="lg:col-span-7 flex flex-col"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          variants={containerVars}
        >
          <motion.span 
            className="text-xs font-mono tracking-widest text-[#FFC93C] uppercase mb-4"
            variants={itemVars}
          >
            01 // PROFILE SUMMARY
          </motion.span>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A2E] mb-6 uppercase font-heading"
            variants={itemVars}
          >
            Bridging Design, Code, <br />
            <span className="text-gradient-accent">and Growth.</span>
          </motion.h2>

          <motion.div 
            className="text-[#4A4A6A] font-sans text-base md:text-lg space-y-6 leading-relaxed mb-8"
            variants={itemVars}
          >
            <p>
              I am a fresh Computer Science graduate with a strong passion for building interactive, scalable web solutions. 
              Equipped with deep proficiency in the <span className="text-[#1A1A2E] font-semibold">MERN Stack (React, Node, Express, MongoDB)</span> 
              and <span className="text-[#1A1A2E] font-semibold">TypeScript</span>, I specialize in crafting performant applications that stand out visually and functionally.
            </p>
            <p>
              Currently working as an <span className="text-[#1A1A2E] font-semibold">SEO & Web Development Specialist</span>, I merge search-optimized strategies with pixel-perfect development. 
              My unique background allows me to design web architectures that are not only engineering masterpieces but are also built to rank and convert right out of the box.
            </p>
            
            <div className="pt-6 border-t border-[#1A1A2E]/10 mt-6">
              <h4 className="text-xs font-mono tracking-widest text-[#FFC93C] uppercase mb-4">EDUCATION</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex justify-between text-[#1A1A2E] font-semibold">
                    <span>BSc Computer Science</span>
                    <span className="text-[#4A4A6A] font-normal">2022 – 2026</span>
                  </div>
                  <p className="text-[#4A4A6A] text-xs mt-0.5">NCBA&E University, Lahore</p>
                </div>
                <div>
                  <div className="flex justify-between text-[#1A1A2E] font-semibold">
                    <span>Intermediate (ICS)</span>
                    <span className="text-[#4A4A6A] font-normal">2020 – 2022</span>
                  </div>
                  <p className="text-[#4A4A6A] text-xs mt-0.5">Unique College, Lahore</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Empty spacer block to make room for R3F Canvas */}
        <div className="hidden lg:block lg:col-span-5 h-[300px]" />
      </div>

      {/* Skills Sub-section */}
      <div className="max-w-6xl w-full mx-auto mt-16">
        <motion.div 
          className="w-full h-[1px] bg-[#1A1A2E]/15 mb-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <span className="text-xs font-mono tracking-widest text-[#4A4A6A] uppercase">
              TECH STACK & CORE SKILLS
            </span>
          </div>

          <div className="md:col-span-9">
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
              variants={containerVars}
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={itemVars}
                  className="glass-panel p-5 rounded-2xl flex flex-col justify-between h-[120px] transition-all duration-300 group hover:border-[#FFC93C]/40 hover:shadow-[0_10px_30px_rgba(255,201,60,0.15)] cursor-default relative overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  {/* Subtle hover background glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${skill.color} 0%, transparent 70%)` }}
                  />
                  
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono tracking-widest text-[#4A4A6A] uppercase">
                      {skill.category}
                    </span>
                    <span 
                      className="text-[10px] font-mono"
                      style={{ color: skill.color }}
                    >
                      {skill.level}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-[#1A1A2E] font-bold tracking-tight text-lg group-hover:text-[#FFC93C] transition-colors duration-300">
                      {skill.name}
                    </h3>
                    {/* Glowing indicator line */}
                    <div className="w-full h-[1px] bg-[#1A1A2E]/10 mt-2 relative overflow-hidden">
                      <div 
                        className="absolute h-full top-0 left-0 transition-transform duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100 w-full"
                        style={{ backgroundColor: skill.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default About
