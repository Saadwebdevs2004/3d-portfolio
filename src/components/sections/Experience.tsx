import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Job {
  id: number
  role: string
  company: string
  period: string
  description: string[]
  tech: string[]
}

const experienceData: Job[] = [
  {
    id: 1,
    role: 'SEO & Web Development Specialist',
    company: 'AenZay Interiors & Architects',
    period: 'Sep 2025 – Present',
    description: [
      'Lead web development and SEO strategy for an interior design firm, managing website performance, content, and digital visibility.',
      'Implement technical SEO improvements including Core Web Vitals optimization, schema markup, and Google Business Profile management.',
      'Develop and maintain WordPress-based client websites, integrating plugins and ensuring cross-device compatibility.',
      'Collaborate with marketing and design teams to align web presence with brand identity and business goals.'
    ],
    tech: ['WordPress', 'SEO', 'JavaScript', 'Google Analytics', 'Core Web Vitals', 'Schema Markup']
  },
  {
    id: 2,
    role: 'Web Development Intern',
    company: 'AenZay Interiors & Architects',
    period: 'Jun 2025 – Sep 2025',
    description: [
      'Built and customized WordPress websites for interior design clients, focusing on responsive layouts and seamless UX.',
      'Implemented SEO best practices including on-page optimization and image compression to improve site ranking.',
      'Managed on-site content updates and tested website compatibility across multiple devices and browsers.',
      'Gained practical exposure to the IT workflow within the interior design and architecture industry.'
    ],
    tech: ['WordPress', 'SEO', 'HTML/CSS', 'UX Design', 'Cross-Device Testing']
  },
  {
    id: 3,
    role: 'Business Development Manager',
    company: 'Virtual Assistants Pakistan',
    period: 'Apr 2024 – Sep 2025',
    description: [
      'Led strategic business development initiatives including market analysis, lead pipeline management, and high-value deal closing.',
      'Managed end-to-end sales processes from prospecting to client onboarding, consistently meeting revenue growth targets.',
      'Mentored junior team members and coordinated with marketing and operations to align cross-functional strategies.',
      'Maintained key account relationships and reported performance metrics to senior leadership.'
    ],
    tech: ['Lead Management', 'CRM Tools', 'Sales Pipeline', 'Strategic Planning', 'Client Relations']
  },
  {
    id: 4,
    role: 'Business Development Executive',
    company: 'Virtual Assistants Pakistan',
    period: 'Apr 2022 – Mar 2024',
    description: [
      'Prospected and qualified leads via LinkedIn, email outreach, and cold calls; managed sales pipeline using CRM tools.',
      'Created customized proposals and presentations tailored to client needs, contributing directly to revenue growth.',
      'Collaborated with marketing teams to improve lead generation strategies and align outreach messaging.'
    ],
    tech: ['LinkedIn Prospecting', 'CRM Tools', 'Sales Pipeline', 'Proposal Drafting', 'Lead Generation']
  }
]

export const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const container = containerRef.current
    const line = lineRef.current
    const items = itemsRef.current

    if (!container || !line) return

    // 1. Animate SVG timeline line drawing from top to bottom
    const lineTrigger = gsap.fromTo(
      line,
      { attr: { y2: '0%' } },
      {
        attr: { y2: '100%' },
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 50%',
          end: 'bottom 70%',
          scrub: 0.5
        }
      }
    )

    // 2. Animate timeline nodes & cards reveal on scroll
    const triggers: ScrollTrigger[] = []
    items.forEach((item) => {
      if (!item) return
      
      const node = item.querySelector('.timeline-node')
      const card = item.querySelector('.timeline-card')

      if (node && card) {
        // Timeline node indicator scale and glow reveal
        const nodeTl = gsap.fromTo(
          node,
          { scale: 0, backgroundColor: '#0f0f15', borderColor: '#1c1c24' },
          {
            scale: 1,
            backgroundColor: '#030303',
            borderColor: '#00f0ff',
            scrollTrigger: {
              trigger: item,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        )

        // Card translation and opacity fade
        const cardTl = gsap.fromTo(
          card,
          { opacity: 0, x: item.classList.contains('flex-row-reverse') ? 50 : -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 70%',
              toggleActions: 'play none none reverse'
            }
          }
        )

        if (nodeTl.scrollTrigger) triggers.push(nodeTl.scrollTrigger)
        if (cardTl.scrollTrigger) triggers.push(cardTl.scrollTrigger)
      }
    })

    return () => {
      lineTrigger.kill()
      triggers.forEach(t => t.kill())
    }
  }, [])

  return (
    <section 
      ref={containerRef}
      id="experience" 
      className="relative min-h-screen w-full flex flex-col justify-center px-8 md:px-16 py-24 z-10 overflow-hidden"
    >
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex flex-col mb-16 text-left">
          <span className="text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-4">
            03 // RECENT BACKGROUND
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase font-heading">
            Professional <span className="text-gradient-accent">Timeline.</span>
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full mt-12 flex flex-col gap-16 md:gap-24">
          
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 pointer-events-none">
            {/* Background trace line */}
            <div className="absolute inset-0 bg-zinc-800/40" />
            
            {/* Animated SVG drawing line */}
            <svg className="absolute inset-0 w-full h-full">
              <line 
                ref={lineRef}
                x1="50%" 
                y1="0" 
                x2="50%" 
                y2="0" 
                stroke="#00f0ff" 
                strokeWidth="2"
                strokeLinecap="round"
                className="shadow-[0_0_10px_rgba(0,240,255,0.5)]"
              />
            </svg>
          </div>

          {/* Timeline Items */}
          {experienceData.map((job, index) => {
            const isEven = index % 2 === 0
            return (
              <div
                key={job.id}
                ref={(el) => { itemsRef.current[index] = el as HTMLDivElement }}
                className={`relative w-full flex flex-col md:flex-row items-start ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Visual Gap Spacer for desktop symmetry */}
                <div className="hidden md:block w-1/2" />

                {/* Timeline node marker */}
                <div className="absolute left-[20px] md:left-1/2 top-2 w-5 h-5 -translate-x-1/2 rounded-full border-2 border-zinc-800 bg-[#0f0f15] z-20 timeline-node flex items-center justify-center transition-all duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                </div>

                {/* Job Card */}
                <div className="w-full md:w-1/2 pl-12 md:pl-16 md:pr-16 text-left timeline-card">
                  <div className="glass-panel p-6 md:p-8 rounded-2xl border border-zinc-900 shadow-xl hover:border-zinc-800 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-300 relative overflow-hidden group">
                    
                    {/* Corner gradient glow */}
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br from-[#00f0ff]/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-[#8b5cf6]/10 transition-all duration-500" />
                    
                    <span className="text-xs font-mono text-[#00f0ff] tracking-widest uppercase mb-1 block">
                      {job.period}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase group-hover:text-[#00f0ff] transition-colors duration-300">
                      {job.role}
                    </h3>
                    <h4 className="text-sm font-mono text-zinc-400 uppercase tracking-widest mb-6">
                      {job.company}
                    </h4>

                    <ul className="text-zinc-400 font-sans text-sm space-y-3 leading-relaxed mb-6">
                      {job.description.map((desc, i) => (
                        <li key={i} className="relative pl-4">
                          <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-zinc-800 group-hover:bg-[#8b5cf6] transition-colors" />
                          {desc}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-900/60">
                      {job.tech.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-zinc-950 border border-zinc-900 text-[10px] font-mono text-zinc-400 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default Experience
