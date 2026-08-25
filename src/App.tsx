/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  ArrowLeft, X, Home, FileText, User, Settings, HelpCircle,
  Info, Lightbulb, ShieldCheck, Minus, Plus, 
  ArrowRight, EyeOff, Shield, Sliders, Calendar, 
  Bookmark, Check, ChevronDown, LayoutGrid,
  Moon, Sun, Phone, MessageSquare, Briefcase, Play, CreditCard
} from 'lucide-react';
import { Chatbot } from './components/Chatbot';
import { ReviewCarousel } from './components/ReviewCarousel';

// Initialize Stripe
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) 
  : null;

export type DesignType = {
  title: string;
  desc: string;
  imgUrl: string;
};

export default function App() {
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [windowCount, setWindowCount] = useState(1);
  const [privacyLevel, setPrivacyLevel] = useState(50);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<DesignType | null>(null);
  const [filmCategory, setFilmCategory] = useState<'frosted' | 'oneway' | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const nextStep = () => setStep(s => Math.min(3, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="min-h-screen bg-surface-bg text-text-main font-body pb-32 overflow-x-hidden transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-bg/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between transition-colors duration-300">
        <button onClick={prevStep} className={`text-brand-dark hover:opacity-70 transition-opacity p-2 -ml-2 ${step === 0 ? 'invisible' : ''}`}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center justify-center">
          <img 
            src={isDark ? "https://live.staticflickr.com/65535/55185118963_f42a70897c_o.png" : "https://live.staticflickr.com/65535/55187130150_67854d774c_o.png"} 
            alt="Brightside Logo" 
            className="h-10 sm:h-12 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center gap-2 -mr-2">
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="text-brand-dark hover:opacity-70 transition-opacity p-2"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="text-brand-dark hover:opacity-70 transition-opacity p-2">
            <div className="flex flex-col gap-1.5 w-6">
              <div className="h-0.5 w-full bg-current rounded-full"></div>
              <div className="h-0.5 w-full bg-current rounded-full"></div>
              <div className="h-0.5 w-full bg-current rounded-full"></div>
            </div>
          </button>
        </div>
      </header>
      
      {/* Subtle separator */}
      <div className="h-[1px] w-full bg-surface-highest/50"></div>

      <main className="max-w-2xl mx-auto px-6 pt-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <Step0 onNext={nextStep} onOpenChat={() => setIsChatOpen(true)} />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <Step1 
                onNext={() => setStep(2)} 
                filmCategory={filmCategory} 
                setFilmCategory={setFilmCategory} 
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <Step2 filmCategory={filmCategory} selectedDesign={selectedDesign} setSelectedDesign={setSelectedDesign} onNext={nextStep} onBack={() => setStep(1)} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <Step3 onNext={() => setStep(4)} onBack={() => setStep(2)} windowCount={windowCount} setWindowCount={setWindowCount} privacyLevel={privacyLevel} setPrivacyLevel={setPrivacyLevel} />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <Step4 windowCount={windowCount} privacyLevel={privacyLevel} selectedDesign={selectedDesign} onPlaceOrder={() => setStep(7)} />
            </motion.div>
          )}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <AboutUs />
            </motion.div>
          )}
          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <WhyUs />
            </motion.div>
          )}
          {step === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              <CheckoutPage 
                windowCount={windowCount} 
                privacyLevel={privacyLevel} 
                selectedDesign={selectedDesign} 
                onConfirm={() => setStep(8)} 
                onBack={() => setStep(4)} 
              />
            </motion.div>
          )}
          {step === 8 && (
            <motion.div key="step8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              <OrderSuccessPage onBack={() => setStep(0)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-bg/80 backdrop-blur-2xl border-t border-surface-highest/50 px-6 py-4 flex justify-between items-center z-50 rounded-t-[2rem] shadow-[0_-20px_40px_rgba(46,47,44,0.03)] pb-8">
        <NavItem icon={<Home size={24} strokeWidth={1.5} />} label="Home" active={step === 0} onClick={() => setStep(0)} />
        <NavItem icon={<FileText size={24} strokeWidth={2} />} label="Quotes" active={step > 0 && step < 5} onClick={() => setStep(1)} />
        <NavItem icon={<Info size={24} strokeWidth={1.5} />} label="About Us" active={step === 5} onClick={() => setStep(5)} />
        <NavItem icon={<HelpCircle size={24} strokeWidth={1.5} />} label="Why Us" active={step === 6} onClick={() => setStep(6)} />
      </nav>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-black scale-105' : 'text-text-muted hover:text-black'}`}>
      <div className={`transition-all duration-300 ${active ? 'bg-brand-lime p-3 rounded-2xl shadow-lg shadow-brand-lime/20' : 'p-2'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ProgressBar({ step, total, label }: { step: number, total: number, label: string }) {
  const percentage = (step / total) * 100;
  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-3">
        <span className="font-headline font-bold text-brand-dark text-[10px] tracking-widest uppercase">Step {step} of {total}</span>
        <span className="text-text-muted text-[10px] font-semibold">{label}</span>
      </div>
      <div className="h-2 w-full bg-surface-highest rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-brand-lime rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// --- STEPS ---

function Step0({ onNext, onOpenChat }: { onNext: () => void, onOpenChat: () => void }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showAreas, setShowAreas] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAreas(prev => !prev);
    }, 2500); // toggle every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col -mt-8 -mx-6">
      {/* Hero Section */}
      <div className="relative bg-brand-lime pt-16 pb-28 px-6 rounded-b-[2.5rem] overflow-hidden mb-8 shadow-lg min-h-[400px] flex flex-col justify-start">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-black">
          <motion.img
            src="https://i.ibb.co/LzcC6gVn/Green-tech-service-and-van-display.png"
            alt="Installation Background"
            referrerPolicy="no-referrer"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={isImageLoaded ? { opacity: 0.6, scale: 1 } : { opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'grayscale(30%) contrast(1.1)' }}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

        <motion.div 
          initial="hidden"
          animate={isImageLoaded ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
              }
            }
          }}
          className="relative z-10 flex flex-col items-end text-right w-full -mt-12 min-h-[120px]"
        >
          <AnimatePresence mode="wait">
            {!showAreas ? (
              <motion.div 
                key="glazing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-end"
              >
                <h1 className="font-headline text-3xl font-black text-white tracking-tight leading-[1.05] mb-2 uppercase drop-shadow-md">
                  Static Glazing<br/>
                  <span className="text-brand-lime drop-shadow-sm">Installation</span>
                </h1>
                <h2 className="font-headline text-xs font-bold text-white/80 tracking-widest uppercase mb-4 drop-shadow-md">
                  Window Privacy Film
                </h2>
              </motion.div>
            ) : (
              <motion.div 
                key="areas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-end"
              >
                <h1 className="font-headline text-3xl font-black text-white tracking-tight leading-[1.05] mb-2 uppercase drop-shadow-md">
                  Areas <span className="text-brand-lime drop-shadow-sm">Covered</span>
                </h1>
                <h2 className="font-headline text-xs font-bold text-white/80 tracking-widest uppercase mb-4 drop-shadow-md">
                  Margate, Broadstairs, Ramsgate & more
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        className="flex justify-center gap-3 relative z-20 mb-10 px-6"
      >
        <motion.button 
          onClick={onNext} 
          animate={{ 
            boxShadow: [
              "0px 8px 20px rgba(180,207,82,0.3)",
              "0px 12px 25px rgba(180,207,82,0.5)",
              "0px 8px 20px rgba(180,207,82,0.3)"
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="bg-brand-lime text-black font-headline font-extrabold text-sm py-3 px-6 rounded-xl hover:bg-[#b4cf52] border border-white/20 flex items-center justify-center gap-2 flex-1 shadow-lg"
        >
          Start Quote <ArrowRight size={18} />
        </motion.button>

        <motion.button 
          onClick={onOpenChat}
          className="bg-surface-bg text-text-main font-headline font-bold text-sm py-3 px-5 rounded-xl border border-surface-highest flex items-center justify-center gap-2 shadow-lg hover:bg-surface-highest transition-colors"
        >
          <MessageSquare size={18} className="text-brand-lime" /> CHAT WITH US
        </motion.button>
      </motion.div>

      {/* Trust/Reviews Carousel */}
      <ReviewCarousel />

      <div className="px-6 pb-20">
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-headline text-xl font-extrabold text-center mb-8 leading-tight text-white"
        >
          Simply Pick Your Style,<br/>
          <span className="text-brand-lime">We Take Care of the Rest.</span>
        </motion.h3>

        {/* How it Works Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="mb-12 bg-surface-low p-6 rounded-3xl border border-surface-highest/50 shadow-sm"
        >
          <h4 className="font-headline text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Info size={20} className="text-brand-lime" />
            How it Works
          </h4>
          <ul className="space-y-3 text-sm font-medium text-text-muted">
            <li className="flex items-start gap-3">
              <Check size={18} className="text-brand-lime shrink-0 mt-0.5" />
              <span><strong className="text-white">Static Tech™</strong> – Non-adhesive, non-residue suction</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={18} className="text-brand-lime shrink-0 mt-0.5" />
              <span>Perfect for renters & homeowners alike</span>
            </li>
            <li className="flex items-start gap-3">
              <Check size={18} className="text-brand-lime shrink-0 mt-0.5" />
              <span>Precision custom cut to your exact measurements</span>
            </li>
          </ul>
        </motion.div>

        {/* Numbered Timeline */}
        <div className="relative pl-2 space-y-8 mb-12">
          {/* Vertical Line */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 1, delay: 0.7, ease: "easeInOut" }}
            className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-brand-lime via-brand-lime/50 to-transparent origin-top"
          ></motion.div>

          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="relative z-10 flex items-start gap-5"
          >
            <div className="w-10 h-10 rounded-full bg-surface-high border-2 border-brand-lime flex items-center justify-center font-headline font-bold text-brand-lime shrink-0 shadow-[0_0_15px_rgba(180,207,82,0.15)]">1</div>
            <div className="pt-2 w-full">
              <p className="font-bold text-base text-white mb-3">SELECT DESIGN</p>
              <div className="flex gap-3">
                <div className="w-14 h-14 bg-surface-highest rounded-xl border-2 border-surface-highest overflow-hidden hover:border-brand-lime transition-colors">
                  <img src="https://i.ibb.co/HLZCS7Zp/Chat-GPT-Image-Mar-17-2026-05-04-40-PM.png" alt="Stripes" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="w-14 h-14 bg-surface-highest rounded-xl border-2 border-surface-highest overflow-hidden hover:border-brand-lime transition-colors">
                  <img src="https://i.ibb.co/vvjtVcjV/stripe.png" alt="Frosted" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="w-14 h-14 bg-surface-highest rounded-xl border-2 border-surface-highest overflow-hidden hover:border-brand-lime transition-colors">
                  <img src="https://i.ibb.co/wNz9X34w/Untitled-3.png" alt="Brick" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="relative z-10 flex items-start gap-5"
          >
            <div className="w-10 h-10 rounded-full bg-surface-high border-2 border-brand-lime flex items-center justify-center font-headline font-bold text-brand-lime shrink-0 shadow-[0_0_15px_rgba(180,207,82,0.15)]">2</div>
            <div className="pt-2">
              <p className="font-bold text-base text-white mb-1">MEASUREMENT</p>
              <p className="text-sm text-text-muted">Input Dimensions (W/H, cm)</p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="relative z-10 flex items-start gap-5"
          >
            <div className="w-10 h-10 rounded-full bg-brand-lime border-2 border-brand-lime flex items-center justify-center font-headline font-bold text-black shrink-0 shadow-[0_0_15px_rgba(180,207,82,0.3)]">3</div>
            <div className="pt-2">
              <p className="font-bold text-base text-white mb-1">CALCULATE PRICE</p>
              <p className="text-sm text-text-muted">Instant, Free Quote</p>
            </div>
          </motion.div>
        </div>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
          onClick={onNext} 
          className="w-full bg-brand-lime text-black font-headline font-extrabold text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(180,207,82,0.25)] hover:bg-[#b4cf52] hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 mb-8"
        >
          START YOUR PRECISION QUOTE <ArrowRight size={20} />
        </motion.button>

        {/* Testimonial Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
          className="w-full rounded-2xl overflow-hidden relative group cursor-pointer border border-surface-highest/30 shadow-lg"
          onClick={() => setIsVideoPlaying(true)}
        >
          <div className="aspect-video relative bg-black">
            {isVideoPlaying ? (
              <video 
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
                autoPlay 
                controls 
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <img 
                  src="https://live.staticflickr.com/31337/55185464560_a2453c94c2_z.jpg" 
                  alt="Customer Testimonial" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-lime/90 text-black flex items-center justify-center shadow-[0_0_30px_rgba(180,207,82,0.4)] group-hover:scale-110 transition-transform">
                    <Play size={28} className="ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-bold text-sm">"The precision fit is incredible..."</p>
                  <p className="text-brand-lime text-xs font-medium">Sarah T. — Verified Customer</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Step1({ onNext, filmCategory, setFilmCategory }: { onNext: () => void, filmCategory: 'frosted' | 'oneway' | null, setFilmCategory: (c: 'frosted' | 'oneway') => void }) {
  return (
    <div className="flex flex-col">
      <ProgressBar step={1} total={3} label="Step 1 of 3" />
      
      {/* Choose Your Window Style */}
      <div className="mb-10 mt-6">
        <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-text-main tracking-tight leading-tight mb-4">
          Choose Your Window Style
        </h2>
        <p className="text-text-muted text-sm leading-relaxed max-w-md">
          Select the base type of film for your windows.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <div 
          className={`bg-surface-bg rounded-3xl p-4 md:p-6 border-2 cursor-pointer transition-all flex flex-col ${filmCategory === 'frosted' ? 'border-brand-lime shadow-[0_0_20px_rgba(180,207,82,0.2)]' : 'border-transparent hover:border-brand-lime/30'}`}
          onClick={() => {
            setFilmCategory('frosted');
          }}
        >
          <div className="w-full aspect-square bg-surface-highest rounded-xl mb-4 overflow-hidden relative">
             <img src="https://i.ibb.co/vvjtVcjV/stripe.png" alt="Frosted" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <h3 className="font-headline font-bold text-lg mb-2">Frosted</h3>
          <p className="text-xs text-text-muted">Classic privacy by diffusing light.</p>
        </div>
        
        <div 
          className={`bg-surface-bg rounded-3xl p-4 md:p-6 border-2 cursor-pointer transition-all flex flex-col ${filmCategory === 'oneway' ? 'border-brand-lime shadow-[0_0_20px_rgba(180,207,82,0.2)]' : 'border-transparent hover:border-brand-lime/30'}`}
          onClick={() => {
            setFilmCategory('oneway');
          }}
        >
          <div className="w-full aspect-square bg-surface-highest rounded-xl mb-4 overflow-hidden relative">
            <img src="https://live.staticflickr.com/65535/55185348105_72df732011_b.jpg" alt="One Way" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <h3 className="font-headline font-bold text-lg mb-2">One-Way</h3>
          <p className="text-xs text-text-muted">Daytime privacy with a reflective surface.</p>
        </div>
      </div>

      <button onClick={() => {
        if (!filmCategory) {
          setFilmCategory('frosted');
        }
        onNext();
      }} className="w-full bg-brand-lime text-black font-headline font-extrabold text-sm py-4 rounded-full shadow-[0_0_15px_rgba(180,207,82,0.5)] animate-pulse hover:bg-[#b4cf52] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 mb-12">
        Next <ArrowRight size={18} />
      </button>

      {/* Info Cards */}
      <div className="space-y-3">
        <InfoCard icon={<Lightbulb size={18} />} title="Not Sure?" desc="You can always change your mind before finalizing your quote." />
      </div>
    </div>
  );
}


function Step3({ onNext, onBack, windowCount, setWindowCount, privacyLevel, setPrivacyLevel }: { onNext: () => void, onBack: () => void, windowCount: number, setWindowCount: (c: number) => void, privacyLevel: number, setPrivacyLevel: (p: number) => void }) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "Enter the approximate measurements for your two-pane window replacement. Accuracy helps us provide a better estimate.",
    "Measure from the inside edge of the window frame for the most accurate dimensions.",
    "Don't worry if it's not perfect—our installers will do a final measure before production."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePrivacyFromPointer(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updatePrivacyFromPointer(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const updatePrivacyFromPointer = (e: React.PointerEvent) => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const percentage = 100 - (y / rect.height) * 100;
    setPrivacyLevel(Math.max(0, Math.min(100, Math.round(percentage))));
  };

  return (
    <div className="flex flex-col">
      <ProgressBar step={3} total={3} label="Step 3 of 3" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 mt-6"
      >
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-text-main tracking-tight mb-1.5">
          Window <span className="text-brand-lime">Dimensions</span>
        </h1>
        <div className="relative h-[40px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-text-muted text-sm leading-snug max-w-md absolute inset-0"
            >
              {tips[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Diagram Area with Side Slider */}
      <div className="bg-surface-low rounded-[2rem] p-8 mb-12 flex justify-center items-center relative overflow-hidden gap-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-lime/5 to-transparent"></div>
        
        {/* Vertical Slider */}
        <div className="relative h-64 flex flex-col items-center z-20">
          <span className="text-[10px] font-bold text-brand-dark bg-brand-lime/20 px-2 py-1 rounded-md mb-2">{privacyLevel}%</span>
          <input
            type="range"
            min="0"
            max="100"
            value={privacyLevel}
            onChange={(e) => setPrivacyLevel(Number(e.target.value))}
            className="h-full w-2 bg-surface-highest rounded-lg appearance-none cursor-pointer accent-brand-lime"
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' } as any}
          />
          <label className="font-bold text-[10px] text-text-muted mt-2 uppercase tracking-wider text-center w-16">
            Height
          </label>
        </div>

        <div className="relative w-64 h-64 z-10 my-4">
          {/* Window Frame Outer */}
          <div 
            ref={windowRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="absolute inset-0 border-[12px] border-[#ffffff] rounded-lg bg-[#e8e8e8] flex gap-2 shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),0_15px_35px_rgba(0,0,0,0.2)] p-1 cursor-ns-resize touch-none"
          >
            {/* Left Pane Outer */}
            <div className="flex-[0.48] bg-[#f8f8f8] rounded-sm border-[4px] border-[#ffffff] relative shadow-[inset_0_0_8px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-none">
              {/* "Outside" Background */}
              <div className="absolute inset-0 overflow-hidden">
                <img src="https://live.staticflickr.com/65535/55185348105_72df732011_b.jpg" alt="Outside" className="absolute top-[-16px] left-[-16px] w-64 h-64 object-cover max-w-none" referrerPolicy="no-referrer" />
                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/40 pointer-events-none"></div>
                <div className="absolute -inset-full top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 transform translate-x-1/4 pointer-events-none"></div>
              </div>

              {/* Frosted Film */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t-[1.5px] border-white/80 flex items-center justify-center shadow-[0_-2px_10px_rgba(255,255,255,0.3)] overflow-hidden"
                animate={{ height: `${privacyLevel}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Film Texture */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                {/* Stripes */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, rgba(255,255,255,0.9) 8px, rgba(255,255,255,0.9) 16px)' }}></div>
                
                {/* Shimmer Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2 }}
                />
                
                {/* Privacy Number Badge */}
                {privacyLevel > 15 && (
                  <div className="relative z-20 bg-brand-lime text-black text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md backdrop-blur-md border border-brand-lime/50 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-black/80 animate-pulse"></div>
                    {privacyLevel}%
                  </div>
                )}
              </motion.div>

              {/* Handle */}
              <div className="absolute top-1/2 -right-1.5 w-3 h-14 bg-gradient-to-b from-[#f0f0f0] via-[#d0d0d0] to-[#b0b0b0] rounded-l-md -translate-y-1/2 shadow-[-2px_0_5px_rgba(0,0,0,0.2)] z-10 border-y border-l border-[#a0a0a0]"></div>
            </div>

            {/* Right Pane Outer */}
            <div className="flex-[0.52] bg-[#f8f8f8] rounded-sm border-[4px] border-[#ffffff] relative shadow-[inset_0_0_8px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-none">
              {/* "Outside" Background */}
              <div className="absolute inset-0 overflow-hidden">
                <img src="https://live.staticflickr.com/65535/55185348105_72df732011_b.jpg" alt="Outside" className="absolute top-[-16px] right-[-16px] w-64 h-64 object-cover max-w-none" referrerPolicy="no-referrer" />
                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/40 pointer-events-none"></div>
                <div className="absolute -inset-full top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 transform translate-x-1/4 pointer-events-none"></div>
              </div>

              {/* Frosted Film */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t-[1.5px] border-white/80 flex items-center justify-center shadow-[0_-2px_10px_rgba(255,255,255,0.3)] overflow-hidden"
                animate={{ height: `${privacyLevel}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Film Texture */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                {/* Stripes */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, rgba(255,255,255,0.9) 8px, rgba(255,255,255,0.9) 16px)' }}></div>
                
                {/* Shimmer Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2, delay: 0.5 }}
                />
              </motion.div>
            </div>
          </div>
          
          {/* Height Line */}
          <div className="absolute -right-5 top-0 bottom-0 flex flex-col items-center">
            <div className="w-px h-full bg-brand-lime relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-brand-lime rotate-45"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-brand-lime -rotate-45"></div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 bg-surface-bg px-1.5 py-1 rounded text-[8px] font-bold text-brand-dark shadow-sm whitespace-nowrap z-20">
              {height ? `${height} cm` : 'Height'}
            </div>
          </div>
          
          {/* Width Line */}
          <div className="absolute -bottom-8 left-0 right-0 flex items-center">
            <div className="h-px w-full bg-brand-lime relative">
              <div className="absolute -left-1 -top-1 w-2 h-2 border-b-2 border-l-2 border-brand-lime rotate-45"></div>
              <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-brand-lime rotate-45"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bg-surface-bg px-2 py-1 rounded text-[8px] font-bold text-brand-dark shadow-sm whitespace-nowrap">
              {width ? `${width} cm` : 'Width'}
            </div>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-6 mb-10">
        <div>
          <label className="block font-bold text-xs mb-2 ml-1">Width (cm)</label>
          <input 
            type="number" 
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g. 120" 
            className="w-full bg-surface-highest/50 border-none rounded-2xl p-4 text-base focus:ring-2 focus:ring-brand-lime outline-none transition-shadow placeholder:text-text-muted/50 font-medium" 
          />
        </div>
        <div>
          <label className="block font-bold text-xs mb-2 ml-1">Height (cm)</label>
          <input 
            type="number" 
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 150" 
            className="w-full bg-surface-highest/50 border-none rounded-2xl p-4 text-base focus:ring-2 focus:ring-brand-lime outline-none transition-shadow placeholder:text-text-muted/50 font-medium" 
          />
        </div>
      </div>

      {/* Counter */}
      <div className="bg-surface-low p-6 rounded-[2rem] mb-10">
        <label className="block font-bold text-xs mb-4 text-center">Number of Windows</label>
        <div className="flex items-center justify-between bg-surface-bg rounded-full p-2 border border-surface-highest/50">
          <button onClick={() => setWindowCount(Math.max(1, windowCount - 1))} className="w-10 h-10 flex items-center justify-center bg-surface-high rounded-full hover:bg-surface-highest transition-colors active:scale-95">
            <Minus size={18} />
          </button>
          <span className="font-headline text-lg font-extrabold">{windowCount}</span>
          <button onClick={() => setWindowCount(windowCount + 1)} className="w-10 h-10 flex items-center justify-center bg-brand-lime rounded-full hover:bg-[#b4cf52] transition-colors active:scale-95 text-black">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-12">
        <button onClick={onBack} className="w-1/3 bg-surface-high text-text-main font-headline font-extrabold text-sm py-4 rounded-full shadow-sm hover:bg-surface-highest transition-all active:scale-95 flex items-center justify-center">
          Back
        </button>
        <button onClick={onNext} className="w-2/3 bg-brand-lime text-black font-headline font-extrabold text-sm py-4 rounded-full shadow-[0_0_15px_rgba(180,207,82,0.5)] animate-pulse hover:bg-[#b4cf52] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2">
          View Quote <ArrowRight size={18} />
        </button>
      </div>

      {/* Info Cards */}
      <div className="space-y-3">
        <InfoCard icon={<LayoutGrid size={18} />} title="Standard Sizing" desc="Most modern home windows range from 60cm to 180cm in width." />
        <InfoCard icon={<Lightbulb size={18} />} title="Brightside Tip" desc="Measure from the inside frame for the most accurate quote." />
        <InfoCard icon={<ShieldCheck size={18} />} title="Price Lock" desc="Quotes are valid for 30 days after measurements are confirmed." />
      </div>
    </div>
  );
}


function InfoCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-surface-low p-4 rounded-2xl flex items-start gap-3 border-l-4 border-brand-lime">
      <div className="p-2 bg-brand-lime/10 rounded-xl text-brand-dark shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-xs mb-1">{title}</h4>
        <p className="text-[10px] text-text-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function DesignCard({ title, desc, imgUrl, popular, selected, onSelect }: { title: string, desc: string, imgUrl: string, popular?: boolean, selected?: boolean, onSelect: () => void, key?: string | number }) {
  return (
    <div 
      className={`bg-surface-bg rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(46,47,44,0.04)] hover:shadow-[0_20px_40px_rgba(198,225,90,0.1)] transition-all duration-500 border-2 flex flex-col group cursor-pointer ${selected ? 'border-brand-lime shadow-[0_0_20px_rgba(180,207,82,0.2)]' : 'border-transparent hover:border-brand-lime/30'}`}
      onClick={onSelect}
    >
      <div className="aspect-square relative overflow-hidden bg-surface-highest">
        <img src={imgUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
        {popular && (
          <div className="absolute top-3 right-3 bg-brand-lime text-black px-2 py-1 rounded-full text-[8px] font-extrabold uppercase tracking-widest shadow-lg">
            Popular
          </div>
        )}
      </div>
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <h3 className="font-headline font-bold text-base md:text-lg mb-2">{title}</h3>
        <p className="font-body text-[10px] md:text-xs text-text-muted mb-4 flex-grow leading-relaxed line-clamp-3">{desc}</p>
        <button className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all active:scale-95 ${selected ? 'bg-brand-lime text-black shadow-md shadow-brand-lime/20' : 'bg-surface-high text-text-main hover:bg-brand-lime hover:text-black'}`}>
          {selected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
}

function Step2({ filmCategory, selectedDesign, setSelectedDesign, onNext, onBack }: { filmCategory: 'frosted' | 'oneway' | null, selectedDesign: DesignType | null, setSelectedDesign: (d: DesignType) => void, onNext: () => void, onBack: () => void }) {
  const frostedDesigns = [
    { title: "Stripes", desc: "Classic linear pattern for privacy. Ideal for office dividers.", imgUrl: "https://i.ibb.co/HLZCS7Zp/Chat-GPT-Image-Mar-17-2026-05-04-40-PM.png", popular: true },
    { title: "Frosted", desc: "Maximum privacy with high light transmission. The architectural standard.", imgUrl: "https://i.ibb.co/vvjtVcjV/stripe.png" },
    { title: "Brick Style", desc: "Geometric staggered pattern providing a unique textured look.", imgUrl: "https://i.ibb.co/wNz9X34w/Untitled-3.png" },
    { title: "Geometric", desc: "Modern intersecting lines creating a sophisticated privacy barrier.", imgUrl: "https://live.staticflickr.com/65535/55177673305_8bfbda1dec_z.jpg" },
    { title: "Reeded", desc: "Vertical fluted glass effect for a vintage yet contemporary feel.", imgUrl: "https://live.staticflickr.com/65535/55177271926_3f99312d6d_z.jpg" },
    { title: "Dusted", desc: "Subtle sandblasted appearance for elegant, understated privacy.", imgUrl: "https://live.staticflickr.com/65535/55177271941_280b8f8fc6_z.jpg" }
  ];

  const onewayDesigns = [
    { title: "Silver Blue", desc: "Sleek metallic blue finish. Excellent heat rejection.", imgUrl: "https://live.staticflickr.com/65535/55185348105_72df732011_b.jpg", popular: true },
    { title: "Bronze Tan", desc: "Warm bronze reflection. Ideal for traditional architecture.", imgUrl: "https://live.staticflickr.com/65535/55177673305_8bfbda1dec_z.jpg" },
    { title: "Charcoal Black", desc: "Deep black mirror effect. Maximum glare reduction.", imgUrl: "https://live.staticflickr.com/65535/55177271941_280b8f8fc6_z.jpg" }
  ];

  const designs = filmCategory === 'oneway' ? onewayDesigns : frostedDesigns;

  return (
    <div className="flex flex-col">
      <ProgressBar step={2} total={3} label="Step 2 of 3" />
      
      <div className="mb-10 mt-4">
        <div className="inline-block px-3 py-1 bg-brand-lime/10 rounded-lg mb-4">
          <span className="text-[8px] font-bold uppercase tracking-widest text-brand-dark">{filmCategory === 'oneway' ? 'One-Way Colors' : 'Custom Designs'}</span>
        </div>
        <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-text-main tracking-tight leading-tight mb-4">
          {filmCategory === 'oneway' ? 'Choose Your Color' : 'Choose Your Design'}
        </h2>
        <p className="text-text-muted text-sm leading-relaxed max-w-md">
          {filmCategory === 'oneway' 
            ? 'Select a reflective finish that matches your exterior.' 
            : 'Select a window film pattern that complements your architectural style.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        {designs.map((design) => (
          <DesignCard
            key={design.title}
            title={design.title}
            desc={design.desc}
            imgUrl={design.imgUrl}
            popular={design.popular}
            selected={selectedDesign?.title === design.title}
            onSelect={() => {
              setSelectedDesign(design);
              setTimeout(onNext, 200);
            }}
          />
        ))}
      </div>

      {filmCategory === 'frosted' && (
        <button className="mx-auto flex items-center gap-2 px-6 py-3 text-sm bg-surface-bg border-2 border-brand-lime/30 text-text-main font-bold rounded-full hover:bg-brand-lime/10 transition-colors active:scale-95 mb-16">
          More designs <ChevronDown size={16} className="text-brand-lime" />
        </button>
      )}
    </div>
  );
}

function Step4({ windowCount, privacyLevel, selectedDesign, onPlaceOrder }: { windowCount: number, privacyLevel: number, selectedDesign: DesignType | null, onPlaceOrder: () => void }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const totalPrice = windowCount * 30;

  useEffect(() => {
    const controls = animate(count, totalPrice, { duration: 2, ease: "easeOut" });
    return () => controls.stop();
  }, [totalPrice]);

  return (
    <div className="flex flex-col -mt-8 -mx-6">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img src={selectedDesign?.imgUrl || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200"} alt={selectedDesign?.title || "Interior"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        
        {/* Floating Card */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-surface-bg/90 backdrop-blur-xl rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-brand-lime" />
              <span className="font-bold text-[8px] uppercase tracking-widest text-text-muted">Pattern Selected</span>
            </div>
            <h2 className="font-headline text-xl font-extrabold text-text-main mb-2">{selectedDesign?.title || "Geometric Frost"}</h2>
            <p className="text-xs text-text-muted mb-4">{selectedDesign?.desc || "High-precision laser cut privacy film with 85% light transmission."}</p>
            
            {/* Privacy Level Indicator */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between bg-surface-low rounded-lg p-3 border border-surface-highest/30">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Windows Selected</span>
                <span className="text-xs font-extrabold text-brand-lime bg-brand-lime/10 px-2 py-1 rounded">{windowCount}</span>
              </div>
              <div className="flex items-center justify-between bg-surface-low rounded-lg p-3 border border-surface-highest/30">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Privacy Height</span>
                <span className="text-xs font-extrabold text-brand-lime bg-brand-lime/10 px-2 py-1 rounded">{privacyLevel}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-10 pb-20">
        <div className="mb-8">
          <span className="font-bold text-brand-lime tracking-[0.2em] uppercase text-[8px] mb-2 block">Final Quote</span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="font-headline text-4xl font-extrabold tracking-tighter text-text-main mb-3"
          >
            Total Price: £<motion.span>{rounded}</motion.span>
          </motion.h1>
          <p className="text-sm text-text-muted flex items-start gap-2 leading-relaxed">
            <Info size={20} className="text-brand-lime shrink-0 mt-0.5" />
            Includes film and installation estimate
          </p>
        </div>

        <div className="grid gap-4 mb-10">
          <div className="bg-surface-low rounded-3xl p-6">
            <LayoutGrid size={24} className="text-brand-lime mb-4" />
            <h4 className="font-headline font-bold text-base mb-1">Dimensions</h4>
            <p className="text-xs text-text-muted leading-relaxed">200cm x 150cm<br/>Standard Residential Fit</p>
          </div>
          <div className="bg-surface-low rounded-3xl p-6">
            <Calendar size={24} className="text-brand-lime mb-4" />
            <h4 className="font-headline font-bold text-base mb-1">Availability</h4>
            <p className="text-xs text-text-muted leading-relaxed">Earliest installation:<br/>Tuesday, 24th Oct</p>
          </div>
        </div>

        <div className="bg-surface-bg border border-surface-highest rounded-3xl p-6 shadow-sm">
          <h4 className="font-headline font-bold text-lg mb-6">Ready to proceed?</h4>
          <div className="space-y-3 mb-6">
            <button 
              onClick={onPlaceOrder}
              className="w-full bg-brand-lime text-black font-bold text-sm py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#b4cf52] transition-transform active:scale-95 shadow-[0_0_15px_rgba(180,207,82,0.5)] animate-pulse"
            >
              Place Order <ArrowRight size={18} />
            </button>
            <button className="w-full bg-surface-high text-text-main font-bold text-sm py-4 rounded-full flex items-center justify-center gap-2 hover:bg-surface-highest transition-transform active:scale-95">
              Save Quote <Bookmark size={18} />
            </button>
          </div>
          
          <div className="pt-6 border-t border-surface-highest flex items-start gap-4">
            <div className="bg-brand-lime/10 p-2.5 rounded-xl shrink-0">
              <Shield size={20} className="text-brand-dark" />
            </div>
            <div>
              <p className="font-bold text-xs text-text-main mb-1">Brightside Guarantee</p>
              <p className="text-[10px] text-text-muted leading-relaxed">Quotes are valid for 30 days. Professional installation included in the estimate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ onConfirm, amount }: { onConfirm: () => void, amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We don't actually want to redirect in this demo, so we handle it manually
        // or we can just simulate success if we prevent default redirect
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else {
      // Payment succeeded
      setIsProcessing(false);
      onConfirm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface-low p-4 rounded-xl border border-surface-highest">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      
      {errorMessage && (
        <div className="text-red-500 text-sm font-medium px-2">{errorMessage}</div>
      )}

      <button 
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-brand-lime text-black font-bold text-sm py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#b4cf52] transition-transform active:scale-95 shadow-[0_0_15px_rgba(180,207,82,0.5)] animate-pulse disabled:opacity-50 disabled:animate-none"
      >
        {isProcessing ? "Processing..." : `Pay £${amount} & Confirm`} <ArrowRight size={18} />
      </button>
    </form>
  );
}

function CheckoutPage({ windowCount, privacyLevel, selectedDesign, onConfirm, onBack }: { windowCount: number, privacyLevel: number, selectedDesign: DesignType | null, onConfirm: () => void, onBack: () => void }) {
  const totalPrice = windowCount * 30;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isKeyMissing, setIsKeyMissing] = useState(false);

  useEffect(() => {
    if (!stripePromise) {
      setIsKeyMissing(true);
      return;
    }

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else if (data.error) {
          console.error("Stripe error:", data.error);
          setIsKeyMissing(true);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch payment intent:", err);
        setIsKeyMissing(true);
      });
  }, [totalPrice]);
  
  return (
    <div className="flex flex-col -mt-8 -mx-6 pb-20">
      <div className="px-6 pt-6 pb-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-surface-low rounded-full hover:bg-surface-highest transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-headline text-2xl font-extrabold">Checkout</h2>
      </div>

      <div className="px-6 space-y-8">
        {/* Order Summary */}
        <div className="bg-surface-low rounded-3xl p-6 border border-surface-highest/50 shadow-sm">
          <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
            <FileText size={20} className="text-brand-lime" /> Order Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Design</span>
              <span className="font-bold">{selectedDesign?.title || "Geometric Frost"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Windows</span>
              <span className="font-bold">{windowCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Privacy Level</span>
              <span className="font-bold">{privacyLevel}%</span>
            </div>
            <div className="pt-3 border-t border-surface-highest flex justify-between items-center">
              <span className="font-bold">Total Estimate</span>
              <span className="font-headline text-xl font-extrabold text-brand-lime">£{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Contact & Address Form */}
        <div>
          <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
            <User size={20} className="text-brand-lime" /> Your Details
          </h3>
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full bg-surface-low border border-surface-highest rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-lime outline-none transition-shadow placeholder:text-text-muted" />
            <input type="email" placeholder="Email Address" className="w-full bg-surface-low border border-surface-highest rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-lime outline-none transition-shadow placeholder:text-text-muted" />
            <input type="tel" placeholder="Phone Number" className="w-full bg-surface-low border border-surface-highest rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-lime outline-none transition-shadow placeholder:text-text-muted" />
            <input type="text" placeholder="Address Line 1" className="w-full bg-surface-low border border-surface-highest rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-lime outline-none transition-shadow placeholder:text-text-muted" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="City" className="w-full bg-surface-low border border-surface-highest rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-lime outline-none transition-shadow placeholder:text-text-muted" />
              <input type="text" placeholder="Postcode" className="w-full bg-surface-low border border-surface-highest rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-lime outline-none transition-shadow placeholder:text-text-muted" />
            </div>
          </div>
        </div>

        {/* Installation Booking */}
        <div>
          <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-brand-lime" /> Book Installation
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 ml-1">Preferred Date</label>
              <input type="date" className="w-full bg-surface-low border border-surface-highest rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-lime outline-none transition-shadow text-text-main" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 ml-1">Preferred Time</label>
              <select className="w-full bg-surface-low border border-surface-highest rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-lime outline-none transition-shadow text-text-main appearance-none">
                <option value="">Select a time slot</option>
                <option value="morning">Morning (9am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 4pm)</option>
                <option value="evening">Evening (4pm - 7pm)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div>
          <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
            <CreditCard size={20} className="text-brand-lime" /> Payment
          </h3>
          
          {isKeyMissing ? (
            <div className="bg-surface-low p-6 rounded-2xl border border-yellow-500/30 text-center">
              <p className="text-sm text-text-muted mb-4">
                Stripe keys are not configured. Please add <code className="text-brand-lime">STRIPE_SECRET_KEY</code> and <code className="text-brand-lime">VITE_STRIPE_PUBLISHABLE_KEY</code> to your environment variables to enable payments.
              </p>
              <button 
                onClick={onConfirm}
                className="w-full bg-surface-high text-text-main font-bold text-sm py-4 rounded-full flex items-center justify-center gap-2 hover:bg-surface-highest transition-transform active:scale-95"
              >
                Skip Payment (Demo Mode) <ArrowRight size={18} />
              </button>
            </div>
          ) : clientSecret && stripePromise ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#b4cf52' } } }}>
              <CheckoutForm onConfirm={onConfirm} amount={totalPrice} />
            </Elements>
          ) : (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderSuccessPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 bg-brand-lime/20 rounded-full flex items-center justify-center mb-6"
      >
        <div className="w-16 h-16 bg-brand-lime rounded-full flex items-center justify-center text-black shadow-lg shadow-brand-lime/30">
          <ShieldCheck size={32} />
        </div>
      </motion.div>
      <h2 className="font-headline text-3xl font-extrabold mb-4">Order Received!</h2>
      <p className="text-text-muted mb-8 max-w-sm">
        Thank you for choosing Brightside. We've received your request and our team will be in touch shortly to confirm your installation date.
      </p>
      <button 
        onClick={onBack}
        className="bg-surface-high text-text-main font-bold py-3 px-8 rounded-full hover:bg-surface-highest transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
}

function AboutUs() {
  return (
    <div className="flex flex-col -mt-8 -mx-6">
      {/* Hero Section */}
      <div className="relative bg-brand-lime pt-16 pb-20 px-6 rounded-b-[2.5rem] overflow-hidden mb-8 shadow-lg min-h-[300px] flex flex-col justify-center">
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" 
            alt="About Us" 
            className="absolute inset-0 w-full h-full object-cover opacity-50" 
            referrerPolicy="no-referrer" 
          />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center mt-4">
          <h1 className="font-headline text-3xl font-black text-white tracking-tight leading-[1.05] mb-2 uppercase drop-shadow-md">
            About <span className="text-brand-lime">Us</span>
          </h1>
          <p className="text-white/90 text-sm max-w-md mt-4 font-medium leading-relaxed">
            We specialize in premium static glazing and window privacy films. Our mission is to provide beautiful, non-adhesive solutions for renters and homeowners alike.
          </p>
        </div>
      </div>
      
      <div className="px-6 pb-20 space-y-6">
        <div className="bg-surface-low p-6 rounded-3xl border border-surface-highest/50 shadow-sm">
          <h3 className="font-headline text-xl font-bold text-text-main mb-3 flex items-center gap-2">
            <ShieldCheck className="text-brand-lime" size={24} /> Our Guarantee
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Every installation comes with our Brightside Guarantee. We ensure perfect custom fits with our Static Tech™ non-residue suction films.
          </p>
        </div>
        <div className="bg-surface-low p-6 rounded-3xl border border-surface-highest/50 shadow-sm">
          <h3 className="font-headline text-xl font-bold text-text-main mb-3 flex items-center gap-2">
            <User className="text-brand-lime" size={24} /> Our Team
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Based in Broadstairs, Margate, and Ramsgate, our expert installers are dedicated to transforming your spaces with precision and care.
          </p>
        </div>
      </div>
    </div>
  );
}

function WhyUs() {
  return (
    <div className="flex flex-col -mt-8 -mx-6">
      {/* Hero Section */}
      <div className="relative bg-brand-lime pt-16 pb-20 px-6 rounded-b-[2.5rem] overflow-hidden mb-8 shadow-lg min-h-[300px] flex flex-col justify-center">
        <div className="absolute inset-0 z-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?auto=format&fit=crop&q=80&w=1200" 
            alt="Why Us" 
            className="absolute inset-0 w-full h-full object-cover opacity-50" 
            referrerPolicy="no-referrer" 
          />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center mt-4">
          <h1 className="font-headline text-3xl font-black text-white tracking-tight leading-[1.05] mb-2 uppercase drop-shadow-md">
            Why <span className="text-brand-lime">Us</span>
          </h1>
          <p className="text-white/90 text-sm max-w-md mt-4 font-medium leading-relaxed">
            Discover the Brightside difference. We combine innovative technology with exceptional service to deliver the best window privacy solutions.
          </p>
        </div>
      </div>
      
      <div className="px-6 pb-20 space-y-6">
        <div className="bg-surface-low p-6 rounded-3xl border border-surface-highest/50 shadow-sm">
          <h3 className="font-headline text-xl font-bold text-text-main mb-3 flex items-center gap-2">
            <Lightbulb className="text-brand-lime" size={24} /> Static Tech™ Advantage
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Our proprietary Static Tech™ films use advanced non-adhesive, non-residue suction technology. They are easy to apply, remove, and reposition, making them the perfect choice for both renters and homeowners who want a hassle-free privacy solution without damaging their windows.
          </p>
        </div>
        <div className="bg-surface-low p-6 rounded-3xl border border-surface-highest/50 shadow-sm">
          <h3 className="font-headline text-xl font-bold text-text-main mb-3 flex items-center gap-2">
            <Sliders className="text-brand-lime" size={24} /> Ultimate Customizability
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Every window is unique, and so are your privacy needs. We offer precision custom cutting to your exact measurements and a wide variety of designs—from classic frosted and reeded to modern geometric patterns—ensuring a perfect match for your architectural style.
          </p>
        </div>
        <div className="bg-surface-low p-6 rounded-3xl border border-surface-highest/50 shadow-sm">
          <h3 className="font-headline text-xl font-bold text-text-main mb-3 flex items-center gap-2">
            <Briefcase className="text-brand-lime" size={24} /> Professional Service
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            From your initial instant quote to the final installation, our expert team provides a seamless, professional experience. We handle the final measurements and precision fitting, so you can sit back and enjoy your newly transformed space with complete peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
}

