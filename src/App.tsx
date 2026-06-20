import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import Header from './components/Header';
import Home from './components/Home';
import AuditPage from './components/AuditPage';
import PlatformDashboard from './components/PlatformDashboard';
import AboutContact from './components/AboutContact';
import WhitePapers from './components/WhitePapers';
import AICopilot from './components/AICopilot';
import LeakTestPage from './components/LeakTestPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  Building2, Percent, TrendingUp, AlertTriangle, Cpu, Sparkles, 
  HelpCircle, ChevronRight, Check, CheckCircle2, DollarSign, ArrowRight,
  User, Lock, Compass, Eye, ShieldCheck, Mail, Info, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setView] = useState<ViewState>('HOME');
  const [locale, setLocale] = useState<'EN' | 'AR'>('EN');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Custom login state parameters
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Google User profile
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    picture?: string;
  } | null>(null);

  const handleGoogleSignInClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        setUserProfile({
          name: userInfo.name || 'Corporate User',
          email: userInfo.email,
          picture: userInfo.picture || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
        });
        setIsLoggedIn(true);
        setView('PLATFORM');
      } catch (error) {
        console.error('Failed to fetch user info', error);
        setLoginError('Failed to fetch Google user info');
      }
    },
    onError: () => {
      setLoginError('Google login failed or was cancelled.');
    }
  });

  // Interactive pricing calculator state (Omani Rial primary, USD secondary)
  const [generatedValueOMR, setGeneratedValueOMR] = useState<number>(200000);

  // Reflecting the specified 40% PREDAIOT / 60% client gain split
  const clientShareOMR = Math.round(generatedValueOMR * 0.60);
  const predaiotShareOMR = Math.round(generatedValueOMR * 0.40);

  const generatedValueUSD = Math.round(generatedValueOMR * 2.6);
  const clientShareUSD = Math.round(clientShareOMR * 2.6);
  const predaiotShareUSD = Math.round(predaiotShareOMR * 2.6);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Corporate email is required for secure ledger entry.');
      return;
    }
    setLoginError('');
    setIsLoggedIn(true);
    setUserProfile({
      name: 'Salim Al-Harthy',
      email: loginEmail,
      picture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
    });
    setView('PLATFORM');
  };

  return (
    <div className="bg-[#050505] text-slate-100 min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header Navigation */}
      <Header 
        currentView={currentView} 
        setView={setView} 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        userProfile={userProfile}
        locale={locale}
        setLocale={setLocale}
      />

      {/* 2. Primary Layout Render */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            
            {/* HOME VIEW */}
            {currentView === 'HOME' && (
              <Home 
                setView={setView} 
                locale={locale}
                onQuickDemo={() => {
                  setView('PLATFORM');
                }}
              />
            )}

            {/* LEAK_TEST EXPERIMENTAL VIEW */}
            {currentView === 'LEAK_TEST' && (
              <LeakTestPage locale={locale} />
            )}

            {/* PRIVACY POLICY VIEW (PDO / Nama Compliance) */}
            {currentView === 'PRIVACY' && (
              <PrivacyPolicy locale={locale} />
            )}

            {/* ABOUT VIEW (narrative + Chams Eddine Madi + papers) */}
            {currentView === 'ABOUT' && (
              <AboutContact locale={locale} activeSection="ABOUT" />
            )}

            {/* WHITE PAPERS VIEW */}
            {currentView === 'WHITE_PAPERS' && (
              <WhitePapers locale={locale} />
            )}

            {/* CONTACT VIEW */}
            {currentView === 'CONTACT' && (
              <AboutContact locale={locale} activeSection="CONTACT" />
            )}

            {/* ECONOMIC DECISION INTELLIGENCE VIEW */}
            {currentView === 'ECONOMIC_INTELLIGENCE' && (
              <section className="py-20 bg-[#050505] px-4 sm:px-6 lg:px-8" id="intel-architecture-view">
                <div className="mx-auto max-w-4xl space-y-12">
                  <div className="text-center space-y-4">
                    <span className="font-mono text-xs uppercase text-[#34d399] tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex items-center font-bold">
                      Technical Architecture Spec
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      The Economic Decision Engine Paradigm
                    </h1>
                    <p className="text-xs sm:text-sm text-white/50 max-w-2xl mx-auto leading-relaxed font-sans">
                      PREDAIOT created a new category: Economic Decision Intelligence. Unlike forecasting software or simple telemetry SCADA dashboards, we align operational actions directly with financial utility ledgers.
                    </p>
                  </div>

                  {/* Operational diagram representation */}
                  <div className="p-6 rounded-3xl border border-white/10 bg-white/2 space-y-6 relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-emerald-900/5 rounded-full blur-3xl pointer-events-none"></div>
                    <h3 className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold pb-3 border-b border-white/10 flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-emerald-400" />
                      <span>Continuous Dual Optimization Loops</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                      <div className="p-5 rounded-2xl bg-[#050505] border border-white/10 space-y-3">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#38bdf8] font-bold block">1. POOL TRACKING LOOP</span>
                        <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                          Scans real-time Oman OPWP spot pricing models, sub-station temperature profiles, and wind speed vectors continually.
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#050505] border border-white/10 space-y-3">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500 font-bold block">2. DEGRADATION INDEX</span>
                        <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                          Calculates high-accuracy battery chemistry circular wear bounds to block unprofitable cycles during minor spot spikes.
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[#050505] border border-white/10 space-y-3">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">3. DISPATCH CORRECTION</span>
                        <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                          Automatically overrides standard morning charging targets to commit dispatch commands during premium arbitrage sweeps.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      💡 PREDAIOT sits quietly inside your existing operational stack. It imports SCADA loops, runs predictive pricing optimizations using localized AI vectors, and pushes optimized bidding directives directly back to your team, requiring <strong className="text-white">zero physical component changes or capital expenditures (CAPEX)</strong>.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ECONOMIC AUDITS VIEW */}
            {currentView === 'ECONOMIC_AUDITS' && (
              <AuditPage locale={locale} />
            )}

            {/* CASE STUDIES VIEW */}
            {currentView === 'CASE_STUDIES' && (
              <section className="py-20 bg-[#050505] px-4 sm:px-6 z-10 relative overflow-hidden" id="cases-master-view">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-950/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="mx-auto max-w-4xl space-y-12">
                  <div className="text-center space-y-3">
                    <span className="font-mono text-xs uppercase text-[#34d399] tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-bold">
                      Empirical Performance
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      Found Money In Muscat
                    </h1>
                    <p className="text-xs text-white/50 max-w-sm mx-auto">
                      Explore our landmark 500 MW Hybrid Muscat installation audit summary.
                    </p>
                  </div>

                  <div className="bg-white/2 backdrop-blur-sm rounded-3xl p-6 border border-white/10 space-y-6 shadow-2xl">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-6 border-b border-white/10">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                          Muscat Basin Portfolio ID: 49-BESS
                        </span>
                        <h3 className="text-xl font-bold text-white mt-3 font-sans">
                          500 MW Hybrid Solar-Plus-Storage
                        </h3>
                        <p className="text-xs text-white/55 mt-2 leading-relaxed font-sans">
                          Traditional telemetry software reported 100% technical uptime. However, static daily dispatch targets charged cells too early, leading to clip loss. PREDAIOT shifted rules to a dynamic charging window.
                        </p>
                      </div>

                      <div className="bg-[#050505] p-5 rounded-2xl border border-white/10 space-y-3.5 font-mono text-xs">
                        <div className="flex justify-between text-white/40">
                          <span>Standard Yield:</span>
                          <span className="text-white font-bold font-mono">$24,547,874 USD</span>
                        </div>
                        <div className="flex justify-between text-[#34d399]">
                          <span>PREDAIOT Optimized:</span>
                          <span className="text-white font-bold font-mono">$26,791,422 USD</span>
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-3 text-emerald-400 font-bold">
                          <span>Recovered Profits:</span>
                          <span>+$2,243,548 USD (+9.1%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                        * Based on PREDAIOT simulation using official Oman energy market data.
                      </p>
                    </div>

                  </div>
                </div>
              </section>
            )}

            {/* PRICING VIEW */}
            {currentView === 'PRICING' && (
              <section className="py-20 bg-[#050505] px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="pricing-master-view">
                <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-900/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="mx-auto max-w-5xl space-y-16">
                  
                  {/* Headline */}
                  <div className="text-center space-y-4">
                    <span className="font-mono text-xs uppercase text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-bold">
                      Capital Structure
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      Designed For True Alignment
                    </h1>
                    <p className="text-xs sm:text-sm text-white/50 max-w-2xl mx-auto leading-relaxed font-sans">
                      We earn money only when you generate additional cash flow. Explore the three models built to match utility parameters and startup facilities.
                    </p>
                  </div>

                  {/* Standard options show cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Option 1: Economic Audit */}
                    <div className="p-6 rounded-3xl border border-white/10 bg-white/2 flex flex-col justify-between h-[390px] hover:border-white/20 transition-all">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#34d399] bg-[#050505] px-2.5 py-1 rounded-full border border-white/10">
                          Option 1
                        </span>
                        
                        <h3 className="text-lg font-bold text-white mt-5">Economic Audit</h3>
                        <p className="text-[10px] text-white/40 font-mono mt-1 tracking-wider uppercase">Fixed Utility Diagnostic Fee</p>
                        
                        <div className="mt-5 flex items-baseline space-x-1 font-mono">
                          <span className="text-2xl font-bold text-white">2,500 – 3,000</span>
                          <span className="text-xs text-emerald-450 font-bold">OMR</span>
                          <span className="text-[10px] text-white/30 ml-2">(~$6,500 - $7,800 USD)</span>
                        </div>

                        <p className="text-xs text-white/55 mt-4 leading-relaxed font-sans">
                          A complete one-time operations audit scanning continuous physical SCADA and grid billing logs to pinpoint exact decision leaks. Designed for Nama, PDO, and Omani IPP developers.
                        </p>
                      </div>

                      <button 
                        onClick={() => setView('ECONOMIC_AUDITS')}
                        className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-full text-xs text-white font-semibold cursor-pointer transition-all"
                      >
                        Launch Audit Session
                      </button>
                    </div>

                    {/* Option 2: Pilot Program */}
                    <div className="p-6 rounded-3xl border border-white/10 bg-white/2 flex flex-col justify-between h-[390px] hover:border-white/20 transition-all">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 bg-[#050505] px-2.5 py-1 rounded-full border border-white/10">
                          Option 2
                        </span>
                        
                        <h3 className="text-lg font-bold text-white mt-5">Pilot Program</h3>
                        <p className="text-[10px] text-[#34d399] font-mono mt-1 tracking-wider uppercase">90-Day Full Live Integration</p>
                        
                        <div className="mt-5 flex items-baseline space-x-1 font-mono">
                          <span className="text-2xl font-bold text-white">Starting 20,000</span>
                          <span className="text-xs text-emerald-450 font-bold">OMR</span>
                          <span className="text-[10px] text-white/30 ml-2">(~$52,000 USD)</span>
                        </div>

                        <p className="text-xs text-white/55 mt-4 leading-relaxed font-sans">
                          Includes continuous SCADA telemetry ingestion, active optimization override recommendation streams, and verified real-time arbitrage bidding parameters.
                        </p>
                      </div>

                      <button 
                        onClick={() => setView('CONTACT')}
                        className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-full text-xs text-white font-semibold cursor-pointer transition-all"
                      >
                        Request Pilot Briefing
                      </button>
                    </div>

                    {/* Option 3: Revenue Share */}
                    <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between h-[390px] relative shadow-[0_10px_35px_rgba(16,185,129,0.1)]">
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-[#050505] font-mono font-bold text-[8px] uppercase tracking-widest px-3 py-1 rounded-full">
                        Performance Aligned
                      </span>

                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 bg-[#050505] px-2.5 py-1 rounded-full border border-emerald-500/20">
                          Option 3
                        </span>
                        
                        <h3 className="text-lg font-bold text-emerald-400 mt-5 font-sans">Gain Share Model</h3>
                        <p className="text-[10px] text-emerald-300/80 font-mono mt-1 tracking-wider uppercase">Zero Upfront Cash Needed</p>
                        
                        <div className="mt-5 flex items-baseline space-x-1 font-mono">
                          <span className="text-2.5xl font-bold text-emerald-400">60% / 40%</span>
                          <span className="text-xs text-white/40">Profit Split</span>
                        </div>

                        <p className="text-xs text-slate-200 mt-4 leading-relaxed font-sans">
                          Aligned with global utility operators. We earn a 40% percentage *only* of the verified incremental margin generated by the Decision Engine.
                        </p>
                      </div>

                      <button 
                        onClick={() => setView('CONTACT')}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 py-3 rounded-full text-xs text-[#050505] font-bold shadow-[0_4px_15px_rgba(16,185,129,0.2)] cursor-pointer"
                      >
                        Partner Under Gainshare
                      </button>
                    </div>

                  </div>

                  {/* Pricing interactive gain-share simulator */}
                  <div className="p-6 rounded-3xl border border-white/10 bg-white/2 max-w-2xl mx-auto space-y-5 relative overflow-hidden backdrop-blur-sm shadow-2xl">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-950/20 rounded-full blur-2xl pointer-events-none"></div>
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold block mb-1">
                      Option 3: Interactive Gain Share Split Calculator (Oman Rial)
                    </span>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-white/50 block font-sans">Estimated Annual Incremental Value (OMR)</label>
                        <span className="text-md text-emerald-400 font-bold font-mono bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">{generatedValueOMR.toLocaleString()} OMR <span className="text-[10px] text-white/40 ml-1">(~${generatedValueUSD.toLocaleString()} USD)</span></span>
                      </div>
                      <input 
                        type="range" 
                        min="50000" 
                        max="1000000" 
                        step="50000"
                        value={generatedValueOMR}
                        onChange={(e) => setGeneratedValueOMR(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1 bg-white/10 rounded-full cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
                      <div className="bg-[#050505] p-3.5 rounded-2xl border border-white/10">
                        <span className="text-white/40 tracking-wider block uppercase text-[9px] font-mono">Client Keeps (60%)</span>
                        <span className="text-white font-bold text-lg block mt-1 font-mono">{clientShareOMR.toLocaleString()} <span className="text-xs text-white/40">OMR</span></span>
                        <span className="text-[10px] text-white/30 block mt-0.5">(~ ${clientShareUSD.toLocaleString()} USD)</span>
                      </div>
                      <div className="bg-[#050505] p-3.5 rounded-2xl border border-emerald-500/20 text-emerald-400 font-mono">
                        <span className="text-emerald-400/60 tracking-wider block uppercase text-[9px] font-mono">PREDAIOT Share (40%)</span>
                        <span className="text-emerald-400 font-bold text-lg block mt-1 font-mono">{predaiotShareOMR.toLocaleString()} <span className="text-xs text-emerald-400/40">OMR</span></span>
                        <span className="text-[10px] text-emerald-400/30 block mt-0.5">(~ ${predaiotShareUSD.toLocaleString()} USD)</span>
                      </div>
                    </div>
                  </div>

                </div>
              </section>
            )}

            {/* PLATFORM / PORTAL CLIENT LOGIN / DASHBOARD VIEW */}
            {currentView === 'PLATFORM' && (
              <div>
                {isLoggedIn ? (
                  <PlatformDashboard />
                ) : (
                  // Secure client login segment
                  <div className="py-24 bg-[#050505] px-4 relative overflow-hidden" id="login-portal-section">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="max-w-md mx-auto bg-white/2 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                      <div className="absolute right-0 top-0 px-3.5 py-1.5 bg-[#050505] border-l border-b border-white/10 text-[8px] font-mono text-[#34d399] uppercase tracking-wider">
                        NODE-SECURE
                      </div>

                      <div className="text-center space-y-2 mb-8 mt-6">
                        <h2 className="text-xl font-bold text-white tracking-tight">Client Portal Gate</h2>
                        <p className="text-xs text-white/40 leading-relaxed font-sans">Enter secure telemetry coordinates to view portfolio status.</p>
                      </div>

                      <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div>
                          <label className="text-[10px] font-mono text-white/40 block mb-1 uppercase tracking-wider">Business Identity Email</label>
                          <input 
                            type="text" 
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono text-white/40 block mb-1 uppercase tracking-wider">Access Token / Password</label>
                          <input 
                            type="password" 
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono"
                          />
                        </div>

                        {loginError && (
                          <p className="text-xs text-red-400 font-mono">{loginError}</p>
                        )}

                        <button
                          type="submit"
                          className="w-full rounded-full bg-emerald-500 hover:bg-emerald-400 py-3.5 text-[#050505] text-xs font-bold uppercase tracking-widest transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)] cursor-pointer"
                        >
                          Synthesize Ledger Connection
                        </button>

                        <div className="relative my-4 flex py-1 items-center">
                          <div className="flex-grow border-t border-white/10"></div>
                          <span className="flex-shrink mx-4 font-mono text-[9px] text-white/30 uppercase tracking-widest">OR</span>
                          <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <button
                          type="button"
                          onClick={handleGoogleSignInClick}
                          className="w-full rounded-full bg-white text-slate-900 hover:bg-slate-100 py-3 text-xs font-bold transition-all flex items-center justify-center space-x-2.5 shadow-md cursor-pointer border border-slate-200"
                        >
                          <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          <span>Sign in with Google</span>
                        </button>
                      </form>

                      <div className="mt-6 pt-4 border-t border-white/10 text-center">
                        <p className="text-[9px] text-white/30 font-mono tracking-wide uppercase">
                          IPPORT: Muscat Node 495_A. Credentials pre-loaded for demo review.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Floating AI Copilot Trigger */}
      {currentView !== 'PLATFORM' && (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
          {isCopilotOpen ? (
            <div className="mb-4 w-[380px] max-w-[calc(100vw-48px)] bg-[#050505] rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
              <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                 <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-white">AI Copilot</span>
                 </div>
                 <button onClick={() => setIsCopilotOpen(false)} className="text-white/50 hover:text-white transition-colors cursor-pointer p-1">
                   {/* Close icon X */}
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <AICopilot setView={setView} />
              </div>
            </div>
          ) : (
             <button
              onClick={() => setIsCopilotOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-4 shadow-2xl transition-transform hover:scale-110 flex items-center justify-center cursor-pointer border border-emerald-400/30"
              title="Open AI Copilot"
            >
              <Sparkles className="h-6 w-6" />
            </button>
          )}
        </div>
      )}

      {/* 4. Elegant footer */}
      <footer className="border-t border-white/10 bg-[#050505] py-12 px-4 text-[11px] text-white/40 font-sans relative overflow-hidden" id="predaiot-footer">
        <div className="mx-auto max-w-7xl flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2.5">
              <svg viewBox="0 0 100 100" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <linearGradient id="footer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <circle cx="50" cy="50" r="40" stroke="url(#footer-grad)" strokeWidth="15" />
              </svg>
              <span className="font-sans font-semibold tracking-wider text-white/50">
                PREDAIOT &copy; 2026. All Rights Reserved.
              </span>
            </div>
            
            {/* Trust Signals */}
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span className="font-mono text-[9px] uppercase font-bold text-white/60">Powered by Gemini</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span className="font-mono text-[9px] uppercase font-bold text-white/60">OPWP Compliant</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
                <span className="text-[10px]">🇴🇲</span>
                <span className="font-mono text-[9px] uppercase font-bold text-white/60">Muscat, Oman</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-start text-white/30 font-sans border-t border-white/5 pt-6">
            <span className="font-bold">Al Shams Investment and Trade Company SPC | شركة الشمس للاستثمار والتجارة ش ش و</span>
            <span className="mx-2 hidden sm:inline">|</span>
            <span>Founder & CEO: Chams Eddine Madi</span>
            <a href="mailto:al.shams.invest@gmail.com" className="hover:text-emerald-450 transition-all font-mono">al.shams.invest@gmail.com</a>
            <span className="mx-2 hidden sm:inline">|</span>
            <span>C.R: 1610145 | P.C: 111 | Bousher, Muscat, Sultanate of Oman</span>
            <span className="mx-2 hidden sm:inline">|</span>
            <button onClick={() => setView('PRIVACY')} className="hover:text-emerald-400 cursor-pointer transition-colors underline underline-offset-2">Privacy & Compliance</button>
          </div>
        </div>
      </footer>
      <WhatsAppWidget />
    </div>
  );
}

function WhatsAppWidget() {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=96874114028&text=Hello%20PREDAIOT%20team,%20I'm%20interested%20in%20a%20professional%20energy%20audit.";
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[100] bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute left-14 opacity-0 group-hover:opacity-100 bg-[#050505] border border-white/10 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap transition-opacity duration-300 pointer-events-none font-bold uppercase tracking-widest font-mono">
        Connect via WhatsApp
      </span>
    </a>
  );
}
