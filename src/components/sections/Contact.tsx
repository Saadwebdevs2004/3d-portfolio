import { MagneticButton } from '../ui/MagneticButton'

export const Contact = () => {
  const emailAddress = 'mhassanubl@gmail.com'
  const phoneNumber = '+92-300-4185356'
  const locationText = 'Lahore, Pakistan'
  const linkedinUrl = 'https://linkedin.com'
  const githubUrl = 'https://github.com/Saadwebdevs2004'

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section 
      id="contact" 
      className="relative min-h-screen w-full flex flex-col justify-between px-8 md:px-16 pt-24 pb-8 z-10 overflow-hidden"
    >
      {/* Contact Content Grid */}
      <div className="max-w-6xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
        <div className="lg:col-span-7">
          <span className="text-xs font-mono tracking-widest text-[#00f0ff] uppercase mb-4 block">
            04 // GET IN TOUCH
          </span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase font-heading mb-6">
            Let's build <br />
            <span className="text-gradient-accent">something epic.</span>
          </h2>
          <p className="text-zinc-400 font-sans text-base md:text-lg max-w-lg leading-relaxed mb-8">
            Whether you want to discuss full-stack opportunities, SEO optimization strategy, or just talk tech, feel free to drop a message. My inbox is always open.
          </p>

          {/* Contact details list */}
          <div className="flex flex-col gap-4 mb-8 font-mono">
            <div className="group inline-flex items-center gap-2">
              <a 
                href={`mailto:${emailAddress}`}
                className="text-xl md:text-3xl text-white hover:text-[#00f0ff] transition-colors duration-300 border-b border-zinc-800 pb-2 relative overflow-hidden"
              >
                {emailAddress}
              </a>
              <svg className="w-6 h-6 text-zinc-500 group-hover:text-[#00f0ff] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </div>
            
            <div className="text-sm mt-2 flex flex-col sm:flex-row sm:gap-8 gap-4">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase tracking-widest mb-1">Phone</span>
                <a href={`tel:${phoneNumber}`} className="text-white hover:text-[#00f0ff] transition-colors">{phoneNumber}</a>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase tracking-widest mb-1">Location</span>
                <span className="text-white">{locationText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Magnetic Social Buttons Grid */}
        <div className="lg:col-span-5 flex flex-col md:flex-row lg:flex-col gap-6 items-start lg:items-end justify-center">
          <div className="flex gap-6">
            <MagneticButton>
              <a 
                href={`mailto:${emailAddress}`}
                className="w-16 h-16 rounded-full border border-zinc-800 bg-[#0a0a0f]/80 flex items-center justify-center text-zinc-400 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-colors shadow-lg cursor-pointer"
                title="Email Me"
              >
                <svg className="w-6 h-6 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            </MagneticButton>

            <MagneticButton>
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-16 h-16 rounded-full border border-zinc-800 bg-[#0a0a0f]/80 flex items-center justify-center text-zinc-400 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-colors shadow-lg cursor-pointer"
                title="LinkedIn Profile"
              >
                <svg className="w-6 h-6 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </MagneticButton>

            <MagneticButton>
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-16 h-16 rounded-full border border-zinc-800 bg-[#0a0a0f]/80 flex items-center justify-center text-zinc-400 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-colors shadow-lg cursor-pointer"
                title="GitHub Repositories"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Footer Block */}
      <div className="max-w-6xl w-full mx-auto mt-16 pt-8 border-t border-zinc-900/60 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 font-mono text-[10px] md:text-xs text-center md:text-left">
        <div>
          © 2026 Saad Hassan. All Rights Reserved.
        </div>
        
        <div className="flex gap-8">
          <span>DEVELOPED BY SAAD</span>
          <button 
            onClick={handleScrollToTop} 
            className="hover:text-[#00f0ff] flex items-center gap-1 cursor-pointer transition-colors"
          >
            BACK TO TOP ↑
          </button>
        </div>
      </div>
    </section>
  )
}
export default Contact
