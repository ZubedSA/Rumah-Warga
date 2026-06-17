import Link from 'next/link';
import { ArrowRight, ShieldCheck, FileText, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/20 font-sans text-foreground">
      {/* Premium Light Ambient Background */}
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-pulse"></div>
      <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[150px] opacity-60 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[150px] opacity-70 animate-pulse animation-delay-4000"></div>

      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 sm:gap-3 text-slate-800">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] sm:rounded-[1.2rem] bg-gradient-violet flex items-center justify-center shadow-violet-soft shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <span>Rumah<span className="text-primary">Warga</span><span className="text-primary">.</span></span>
          </div>
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-500 hover:text-primary transition-colors tracking-wide uppercase">
              Sign In
            </Link>
            <Link href="/login" className="relative group block shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-violet rounded-full blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white border border-slate-100 text-primary px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase hover:bg-slate-50 transition-all duration-300 text-center">
                Get Started
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 md:pt-48 pb-20 md:pb-32 text-center flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 sm:space-x-3 bg-white rounded-full px-4 sm:px-6 py-2 sm:py-2.5 mb-8 md:mb-12 shadow-sm border border-slate-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-slate-600 tracking-[0.15em] uppercase">Premium RT/RW Platform</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.1] mb-6 md:mb-8 text-slate-800 px-2">
          Elevate Your <br className="hidden sm:block" />
          <span className="text-gradient-primary">
            Community Management
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 sm:mb-14 leading-relaxed font-medium tracking-wide px-4">
          Experience the most elegant, secure, and intuitive digital platform for modern neighborhoods. Simplify administration with unparalleled precision.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center w-full px-6 sm:px-0">
          <Link href="/login" className="group w-full sm:w-auto">
            <div className="flex items-center justify-center gap-3 h-14 sm:h-16 px-8 sm:px-10 text-sm sm:text-base rounded-full sm:rounded-[2rem] bg-gradient-violet text-white font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-violet-soft cursor-pointer w-full sm:w-auto">
              Experience Now <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] hover-lift group shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 sm:mb-4 tracking-tight">Impenetrable Security</h3>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">Your community's data is secured with enterprise-grade encryption. Peace of mind is our standard, not a luxury.</p>
          </div>
          
          <div className="bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] hover-lift group shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 sm:mb-4 tracking-tight">Frictionless Requests</h3>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">Process administrative letters with absolute elegance. One-tap approvals that respect your valuable time.</p>
          </div>
          
          <div className="bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] hover-lift group shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-3 sm:mb-4 tracking-tight">Dynamic Insights</h3>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">Visualize your neighborhood's metrics through breathtaking, distraction-free analytical interfaces.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
