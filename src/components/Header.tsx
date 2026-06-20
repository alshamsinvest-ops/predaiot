import { ViewState } from '../types';
import { ShieldCheck, BarChart3, HelpCircle, FileText, DollarSign, Cpu, MessageSquareCode, Mail, Zap, Globe, ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userProfile?: { name: string; email: string; picture?: string } | null;
  locale: 'EN' | 'AR';
  setLocale: (l: 'EN' | 'AR') => void;
}

export default function Header({ currentView, setView, isLoggedIn, setIsLoggedIn, userProfile, locale, setLocale }: HeaderProps) {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const texts = {
    EN: {
      home: "Home",
      solutions: "Solutions",
      intelligence: "Decision Intelligence",
      audits: "Economic Audits",
      leakTest: "7-Day Leak Test",
      cases: "Case Studies",
      papers: "White Papers",
      pricing: "Pricing",
      about: "About Us",
      contact: "Contact",
      bookAudit: "Book Economic Audit",
      clientPortal: "Client Portal",
      signOut: "Sign Out",
      intelTitle: "Economic Intel"
    },
    AR: {
      home: "الرئيسية",
      solutions: "الحلول",
      intelligence: "ذكاء القرارات",
      audits: "التدقيق الاقتصادي",
      leakTest: "اختبار التسريب",
      cases: "الحالات الواقعية",
      papers: "الأوراق البيضاء",
      pricing: "الأسعار",
      about: "من نحن",
      contact: "تواصل معنا",
      bookAudit: "احجز تدقيقاً اقتصادياً",
      clientPortal: "بوابة العميل",
      signOut: "خروج",
      intelTitle: "ذكاء التشغيل"
    }
  };

  const t = texts[locale];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-md" id="predaiot-header">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          className="flex cursor-pointer items-center space-x-3 transition hover:opacity-90 animate-fade-in"
          onClick={() => setView('HOME')}
          id="logo-container"
        >
          {/* High-fidelity recreation from Immersive UI theme design */}
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-sm transform rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.35)]">
            <div className="w-4 h-4 bg-[#050505] rounded-sm transform"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xl font-bold tracking-tighter text-white">
              PREDAIOT
            </span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-[#34d399] font-bold">
              {t.intelTitle}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-2" id="nav-links">
          <button
            onClick={() => setView('HOME')}
            className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'HOME' ? 'text-emerald-400 bg-white/5 border border-white/10' : 'text-white/60 hover:text-emerald-400'
            }`}
            id="nav-home"
          >
            {t.home}
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-colors ${
                ['ECONOMIC_INTELLIGENCE', 'ECONOMIC_AUDITS', 'LEAK_TEST'].includes(currentView) 
                  ? 'text-emerald-400 bg-white/5 border border-white/10' : 'text-white/60 hover:text-emerald-400'
              }`}
            >
              <span>{t.solutions}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {solutionsOpen && (
              <div className="absolute top-full mt-2 w-56 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-2 overflow-hidden flex flex-col z-50 animate-fade-in">
                <button
                  onClick={() => { setView('ECONOMIC_INTELLIGENCE'); setSolutionsOpen(false); }}
                  className="px-4 py-2 text-left text-xs font-semibold hover:bg-white/5 text-white/80 hover:text-emerald-400 transition-colors"
                >
                  {t.intelligence}
                </button>
                <button
                  onClick={() => { setView('ECONOMIC_AUDITS'); setSolutionsOpen(false); }}
                  className="px-4 py-2 text-left text-xs font-semibold hover:bg-white/5 text-white/80 hover:text-emerald-400 transition-colors"
                >
                  {t.audits}
                </button>
                <button
                  onClick={() => { setView('LEAK_TEST'); setSolutionsOpen(false); }}
                  className="px-4 py-2 text-left text-xs font-bold hover:bg-emerald-500/10 text-emerald-400/90 hover:text-emerald-300 transition-colors"
                >
                  {t.leakTest}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setView('CASE_STUDIES')}
            className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'CASE_STUDIES' ? 'text-emerald-400 bg-white/5 border border-white/10' : 'text-white/60 hover:text-emerald-400'
            }`}
            id="nav-cases"
          >
            {t.cases}
          </button>
          <button
            onClick={() => setView('WHITE_PAPERS')}
            className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'WHITE_PAPERS' ? 'text-emerald-400 bg-white/5 border border-white/10' : 'text-white/60 hover:text-emerald-400'
            }`}
            id="nav-papers"
          >
            {t.papers}
          </button>
          <button
            onClick={() => setView('PRICING')}
            className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'PRICING' ? 'text-emerald-400 bg-white/5 border border-white/10' : 'text-white/60 hover:text-emerald-400'
            }`}
            id="nav-pricing"
          >
            {t.pricing}
          </button>
          <button
            onClick={() => setView('ABOUT')}
            className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'ABOUT' ? 'text-emerald-400 bg-white/5 border border-white/10' : 'text-white/60 hover:text-emerald-400'
            }`}
            id="nav-about"
          >
            {t.about}
          </button>
          <button
            onClick={() => setView('CONTACT')}
            className={`px-3 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-colors ${
              currentView === 'CONTACT' ? 'text-emerald-400 bg-white/5 border border-white/10' : 'text-white/60 hover:text-emerald-400'
            }`}
            id="nav-contact"
          >
            {t.contact}
          </button>
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center space-x-3" id="quick-ctas">
          {/* Language Switch Toggle */}
          <button
            onClick={() => setLocale(locale === 'EN' ? 'AR' : 'EN')}
            className="flex items-center space-x-1 border border-white/10 px-2.5 py-1.5 rounded-full text-[10px] font-mono hover:bg-white/5 text-emerald-400 transition cursor-pointer select-none"
            title="Switch Language / تغيير اللغة"
            id="lang-toggle-button"
          >
            <Globe className="h-3.5 w-3.5 text-white/50" />
            <span className="font-bold">{locale === 'EN' ? 'العربية' : 'English'}</span>
          </button>

          {/* Book Audit Glow Button */}
          <button
            onClick={() => setView('ECONOMIC_AUDITS')}
            className="hidden md:inline-flex items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 px-4 py-1.5 text-xs font-bold text-white transition-all font-sans cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            id="header-btn-audit"
          >
            {t.bookAudit}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center space-x-2.5" id="user-profile-menu">
              <button
                onClick={() => setView('PLATFORM')}
                className="inline-flex items-center space-x-2 rounded-full bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-white/10 transition-all cursor-pointer"
                id="header-btn-platform"
              >
                {userProfile?.picture ? (
                  <img 
                    src={userProfile.picture} 
                    alt={userProfile.name} 
                    className="h-5 w-5 rounded-full object-cover border border-emerald-400/50"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Cpu className="h-4 w-4 text-emerald-400" />
                )}
                <span className="hidden sm:inline-block max-w-[100px] truncate text-slate-100">{userProfile?.name || 'Muscat Node'}</span>
              </button>
              
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setView('HOME');
                }}
                className="text-[10px] font-mono text-white/40 hover:text-red-400 transition-colors uppercase border border-white/10 px-2.5 py-1.5 rounded-full hover:bg-red-500/10 hover:border-red-500/20 cursor-pointer"
                id="header-btn-signout"
              >
                {t.signOut}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setView('PLATFORM');
              }}
              className="inline-flex items-center space-x-1 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-medium text-slate-100 hover:bg-white/20 transition-all cursor-pointer"
              id="header-btn-login"
            >
              <span>{t.clientPortal}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Subheader Navigation (highly mobile accessible) */}
      <div className="lg:hidden block border-t border-slate-900 bg-slate-950 px-2 py-1.5 max-h-12 overflow-x-auto scrollbar-none" id="mobile-quick-nav">
        <div className="flex space-x-2 whitespace-nowrap min-w-max">
          <button 
            onClick={() => setView('HOME')} 
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${currentView === 'HOME' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'}`}
          >
            {t.home}
          </button>
          
          <div className="relative inline-block" ref={dropdownRef}>
            <button 
              onClick={() => setSolutionsOpen(!solutionsOpen)} 
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-medium ${
                ['ECONOMIC_INTELLIGENCE', 'ECONOMIC_AUDITS', 'LEAK_TEST'].includes(currentView) 
                  ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'
              }`}
            >
              <span>{t.solutions}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
            </button>
            {solutionsOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 rounded-lg bg-[#0a0a0a] border border-white/10 shadow-2xl py-1 z-50 flex flex-col">
                <button
                  onClick={() => { setView('ECONOMIC_INTELLIGENCE'); setSolutionsOpen(false); }}
                  className="px-3 py-1.5 text-left text-[10px] text-white/80 hover:text-emerald-400"
                >
                  {t.intelligence}
                </button>
                <button
                  onClick={() => { setView('ECONOMIC_AUDITS'); setSolutionsOpen(false); }}
                  className="px-3 py-1.5 text-left text-[10px] text-white/80 hover:text-emerald-400"
                >
                  {t.audits}
                </button>
                <button
                  onClick={() => { setView('LEAK_TEST'); setSolutionsOpen(false); }}
                  className="px-3 py-1.5 text-left text-[10px] font-bold text-emerald-400/90 hover:text-emerald-300"
                >
                  {t.leakTest}
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setView('CASE_STUDIES')} 
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${currentView === 'CASE_STUDIES' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'}`}
          >
            {t.cases.split(' ')[0]}
          </button>
          <button 
            onClick={() => setView('WHITE_PAPERS')} 
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${currentView === 'WHITE_PAPERS' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'}`}
          >
            {t.papers.split(' ')[0]}
          </button>
          <button 
            onClick={() => setView('PRICING')} 
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${currentView === 'PRICING' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'}`}
          >
            {t.pricing}
          </button>
          <button 
            onClick={() => setView('ABOUT')} 
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${currentView === 'ABOUT' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'}`}
          >
            {t.about.split(' ')[0]}
          </button>
          <button 
            onClick={() => setView('CONTACT')} 
            className={`px-2.5 py-0.5 rounded text-[11px] font-medium ${currentView === 'CONTACT' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'}`}
          >
            {t.contact}
          </button>
        </div>
      </div>
    </header>
  );
}
