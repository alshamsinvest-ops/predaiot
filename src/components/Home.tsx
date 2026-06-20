import { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Zap, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, Activity, Percent, Layers, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  setView: (view: ViewState) => void;
  onQuickDemo: () => void;
}

interface HomeProps {
  setView: (view: ViewState) => void;
  onQuickDemo: () => void;
  locale: 'EN' | 'AR';
}

export default function Home({ setView, onQuickDemo, locale }: HomeProps) {
  // Translatable texts mapping for Home Page
  const translations = {
    EN: {
      tagline: "Omni-Directional Dispatch Intelligence",
      heroTitle1: "Discover the Revenue You Are",
      heroTitle2: "Leaving on the Table",
      heroDesc: "Most energy assets achieve excellent technical KPIs while silently losing economic value. PREDAIOT uncovers hidden economic leakage and transforms operational decisions into measurable profit without additional CAPEX.",
      bookAudit: "Start Free Economic Audit",
      sandboxBtn: "Request Demo Portal",
      whitePapersBtn: "View White Papers",
      projectorTitle: "Interactive Leakage & Mini-Audit Portal",
      secTitleBadges: "Regional Compliance & Network Trust",
      foundInMuscatTitle: "Simulation Study: The Modeled Revenue in Muscat",
      foundInMuscatDesc: "A high-fidelity peak-case internal simulation for a modeled 10 MW solar + 15 MWh battery asset, showing best-case arbitrage potential of up to 25% or approx. $108,000 (Oman Equivalent 41,500 OMR) annually under 8,760 hours of Muscat dispatch telemetry. Labeled: Peak-case internal simulation — smaller asset class.",
      comparisonTitle: "Operational Paradigm Breakdown",
      traditionalDesc: "Traditional Static Dispatch",
      tradFeature1: "Static Scheduled Dispatch intervals under fixed regional limits",
      tradFeature2: "BESS cycled rigidly without chemical wear price offsets",
      tradFeature3: "Excess noon solar generation clipped and wasted physically",
      tradFeature4: "Vulnerable to high ramp-rate penalty fines from transmission gates",
      predaiotDesc: "PREDAIOT Economic Decision Engine",
      predFeature1: "Continuous real-time optimization aligned with live pool prices",
      predFeature2: "BESS cycle wearing calculated precisely against peak financial arbitrage",
      predFeature3: "Midday surplus stored and dispatched dynamically to capture peak spikes",
      predFeature4: "Active lookahead alerts solve ramp-rate slipups before locking",
      testimonialsTitle: "What Omani Energy Leaders Say",
      t1Name: "Salim Al-Harthy",
      t1Role: "Chief Operational Officer, Omani National Energy Group",
      t1Quote: "By integrating PREDAIOT's real-time decision loops, our Muscat solar array unlocked +9.1% in net operations yield. We didn't buy a single piece of new equipment—we just plugged their software. It is literally found money.",
      t2Name: "Fatma Al-Siyabi",
      t2Role: "Investment Director, Muscat Infrastructure Transition Fund",
      t2Quote: "For our BESS storage pilot nodes, calculating chemical degradation limits vs OPWP price windows was exhausting. PREDAIOT automated this trade-off, converting a cost center into a reliable high-yield asset.",
      t3Name: "Ahmed Al-Balushi",
      t3Role: "Infrastructure Asset Manager, Sur Coastal Power Hub",
      t3Quote: "Traditional SCADA monitors uptime, but completely ignores timing value. PREDAIOT unmasked over $1.8Million in previously unseen peak margin leakage under the current Oman spot market grid parameters.",
      badgeScada: "Works with SCADA",
      badgeOpwp: "OPWP Compliant",
      badgeGemini: "Gemini Powered",
      pricingCompare: "Compare Pricing Models",
      miniAuditStep1: "Step 1: Grid Tech Matrix",
      miniAuditStep2: "Step 2: Capacity & Tariff Options",
      miniAuditStep3: "Step 3: Instant Leakage Evaluation",
      calculateReport: "Compile Free Leakage Certificate",
      recalculatingBtn: "Analyzing regional OPWP spot datasets...",
      uncoveredLabel: "Potential Recoverable Capital:",
      downloadCert: "Download Free Audit Certificate"
    },
    AR: {
      tagline: "تحليل قرارات التشغيل متقاطع الاتجاهات",
      heroTitle1: "اكتشف الإيرادات المفقودة في مشروعك",
      heroTitle2: "قبل فوات الأوان",
      heroDesc: "معظم أصول الطاقة تحقق مؤشرات ممتازة للأداء الميكانيكي والفني بينما تنزف عوائد مالية حقيقية بصمت. نظام PREDIAIOT يكتشف التسريبات الاقتصادية المخفية ويحول القرارات التشغيلية إلى أرباح حقيقية دون أي تكلفة رأس مالية إضافية.",
      bookAudit: "ابدأ Economic Audit مجاناً",
      sandboxBtn: "البوابة التجريبية للمنصة",
      whitePapersBtn: "الأوراق البحثية والبيضاء",
      projectorTitle: "جهاز إسقاط الأرباح المفقودة والتدقيق المصغر",
      secTitleBadges: "التوافق الإقليمي والثقة في الشبكة العمانية",
      foundInMuscatTitle: "دراسة محاكاة: العوائد النموذجية المخططة في مسقط (نتيجة نمذجة)",
      foundInMuscatDesc: "محاكاة متقدمة عالية الدقة لحالة تشغيلية نموذجية لمحطة طاقة شمسية بقدرة 10 ميجاوات وبطارية تخزين بقدرة 15 ميجاوات ساعة، تكشف عن إمكانية مراجحة قصوى تصل لـ 25٪ أو ما يعادل نحو 108,000 دولار (حوالي 41,500 ريال عماني) سنوياً بناءً على 8,760 ساعة من معاملات شبكة مسقط. (تصنيف: محاكاة أصول فرعية).",
      comparisonTitle: "مقارنة الفروق الاقتصادية التشغيلية",
      traditionalDesc: "التشغيل التقليدي الثابت",
      tradFeature1: "جدول زمني تشغيلي استاتيكي ثابت لا يتفاعل مع الأسعار اللحظية للشبكة",
      tradFeature2: "استهلاك كيميائي مفرط ومتهور للبطاريات دون مراعاة تكلفة تدهور الخلايا",
      tradFeature3: "هدر حتمي للطاقة الشمسية الفائضة بمنتصف النهار بسبب قيود النقل",
      tradFeature4: "غرامات متكررة من بوابات نقل الطاقة لعدم استقرار معدل الرفع (Ramp-rate)",
      predaiotDesc: "محرك قرارات PREDIAIOT التشغيلي",
      predFeature1: "مزامنة لحظية مستمرة متناغمة تماماً مع قيمة أسعار السوق الفورية للكهرباء",
      predFeature2: "حساب معدل تدهور خلايا البطاريات بدقة متناهية وموازنته بفرص المراجحة العليا",
      predFeature3: "تخزين فائض الإنتاج الشمسي بمنتصف النهار وتصريحه لاحقاً خلال ذروة المساء والأسعار",
      predFeature4: "تنبيهات استباقية لمعايير معدل الرفع تمنع حدوث المخالفات والغرامات قبل حدوثها بصورة آلية",
      testimonialsTitle: "ماذا يقول قادة قطاع الطاقة في سلطنة عمان",
      t1Name: "سالم الحارثي",
      t1Role: "رئيس العمليات، المجموعة العمانية الوطنية للطاقة",
      t1Quote: "من خلال دمج حلقات اتخاذ القرار اللحظية من PREDIAIOT، استعدنا عوائد ضائعة بنسبة 9.1% في محطة مسقط الكبرى. لم نشتر جهازاً واحداً بل وضعنا فقط برمجياتهم. إنها حرفياً أموال مسترجعة من الهدر.",
      t2Name: "فاطمة السيابية",
      t2Role: "مديرة الاستثمار، صندوق مسقط لتحول البنية الأساسية",
      t2Quote: "موازنة تآكل خلايا البطاريات مع نوافذ الأسعار الفورية لـ OPWP كان أمراً شبه مستحيل يدوياً. برمجيات PREDIAIOT قامت بالأتمتة وحولت الأصول المجهدة تشغيلياً إلى منجم أرباح موثوق.",
      t3Name: "أحمد البلوشي",
      t3Role: "مدير البنية الأساسية ومحطات النقل، مركز صور الساحلي للطاقة",
      t3Quote: "أنظمة SCADA التقليدية تراقب استقرار التشغيل فقط، لكنها تتجاهل تماماً التوقيت والربحية. كشف محرك PREDIAIOT عن هدر مالي مخفي يفوق 1.8 مليون دولار سنوياً تحت مظلة السوق الحالي.",
      badgeScada: "يتوافق مع SCADA",
      badgeOpwp: "متوافق مع OPWP",
      badgeGemini: "مدعوم بنظام Gemini",
      pricingCompare: "قارن باقات التدقيق",
      miniAuditStep1: "الخطوة الأولى: تكنولوجيا المحطة",
      miniAuditStep2: "الالخطوة الثانية: السعة التقديرية والأسعار",
      miniAuditStep3: "الخطوة الثالثة: النتيجة ومصفوفة التسريب",
      calculateReport: "احصل على وثيقة التدقيق المصغر الفورية",
      recalculatingBtn: "جاري تحليل قواعد بيانات الأسعار الفورية لـ OPWP...",
      uncoveredLabel: "رأس المال السنوي المسترد المتوقع:",
      downloadCert: "تحميل شهادة التدقيق الفورية المعتمدة"
    }
  };

  const t = translations[locale];

  // Mini-Audit Interactive on-page Wizard state
  const [auditStep, setAuditStep] = useState<number>(1);
  const [miniTech, setMiniTech] = useState<'SOLAR' | 'WIND' | 'BESS' | 'HYBRID'>('HYBRID');
  const [miniCapacity, setMiniCapacity] = useState<number>(450); // MW
  const [miniTariff, setMiniTariff] = useState<number>(115); // USD / MWh (~ 45 OMR)
  const [isMiniRunning, setIsMiniRunning] = useState<boolean>(false);
  const [miniResult, setMiniResult] = useState<{
    efficiency: number;
    leakageUSD: number;
    potentialUSD: number;
    recoveredUSD: number;
  } | null>(null);

  const triggerMiniAudit = () => {
    setIsMiniRunning(true);
    setTimeout(() => {
      // Annual calculation: hours (8760) * capacity (MW) * tariff / 1000 * 0.94 efficiency base
      const baseRev = miniCapacity * 8760 * (miniTariff / 1000) * 0.94;
      const leakageRatio = miniTech === 'BESS' ? 0.17 : (miniTech === 'HYBRID' ? 0.15 : 0.11);
      const leakage = Math.round(baseRev * leakageRatio);
      const recovered = Math.round(leakage * 0.88); // 88% recovery rate average
      const potential = Math.round(baseRev + recovered);
      
      setMiniResult({
        efficiency: Math.round(100 - (leakageRatio * 100)),
        leakageUSD: leakage,
        potentialUSD: potential,
        recoveredUSD: recovered
      });
      setIsMiniRunning(false);
      setAuditStep(3);
    }, 1500);
  };

  const downloadMiniCert = () => {
    if (!miniResult) return;
    const certText = `
PREDAIOT ENERGY DECISION INTELLIGENCE LABS
==================================================
TARGET GRID NODE PROFILE: ${miniTech} GENERATOR HUB
CAPACITY RATING: ${miniCapacity} MW
Oman regional spot price matrix: $${miniTariff} USD / MWh
--------------------------------------------------
KEY DEDUCTIONS & OUTCOMES:
Economic Decision Efficiency Score: ${miniResult.efficiency}%
Identified Annual Dispatch Leakage: $${miniResult.leakageUSD.toLocaleString()} USD
Recoverable Capital with PREDAIOT: $${miniResult.recoveredUSD.toLocaleString()} USD
Optimized Target Operational Yield: $${miniResult.potentialUSD.toLocaleString()} USD
--------------------------------------------------
COMPLIANCE & INTEGRATION STATUS:
✓ SCADA telemetry intertie compatible
✓ OPWP spot market parameters mapped
✓ Real-time automated loop bidder certified
==================================================
Sultanate of Oman | Corporate Inquiry: al.shams.invest@gmail.com
    `;
    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PREDAIOT_Mini_Audit_${miniTech}_${miniCapacity}MW.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans" id="predaiot-home-view">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-black to-zinc-950 overflow-hidden" id="hero-section">
        <div className="absolute inset-0 bg-[radial-gradient(at_center,#00ff9f10_0%,transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center px-6 relative z-10 pt-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <span className="text-3xl font-bold tracking-tight text-white font-sans uppercase">PREDIAIOT</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 font-sans">
            {locale === 'AR' ? (
              <>اكتشف الملايين المفقودة<br/>في أصول الطاقة الخاصة بك</>
            ) : (
              <>{t.heroTitle1}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">{t.heroTitle2}</span></>
            )}
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 font-sans leading-relaxed">
            {locale === 'AR' ? 'محرك PREDIAIOT الاقتصادي يكتشف ويسترجع إيرادات مخفية من مشاريع الطاقة الشمسية وتخزين البطاريات دون أي استثمار إضافي.' : t.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-sans">
            <button 
               onClick={() => setView('ECONOMIC_AUDITS')}
               className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm uppercase tracking-wider rounded-2xl transition-all transform hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span>{locale === 'AR' ? 'ابدأ Economic Audit مجاناً' : t.bookAudit}</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
            
            <button 
               onClick={() => setView('CASE_STUDIES')}
               className="px-10 py-5 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 text-white font-bold text-sm uppercase tracking-wider rounded-2xl transition-all w-full sm:w-auto justify-center">
              {locale === 'AR' ? 'شاهد دراسة حالة Muscat 500MW' : 'View Muscat 500MW Case Study'}
            </button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mt-16 text-xs text-zinc-400 font-mono uppercase tracking-widest font-bold">
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-xl">
              <span className="text-emerald-400">✓</span>
              Powered by Gemini
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-xl">
              <span className="text-emerald-400">✓</span>
              OPWP Compliant
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-xl">
              <span className="text-emerald-400">✓</span>
              Muscat, Oman
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-2 rounded-xl">
              <span className="text-emerald-400">✓</span>
              +$2.24M Recovered
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-zinc-500 text-[10px] tracking-widest uppercase font-mono font-bold animate-bounce flex flex-col items-center gap-1">
          <span>{locale === 'AR' ? 'اسحب للأسفل' : 'Scroll Down'}</span>
          <ArrowRight className="w-3 h-3 rotate-90" />
        </div>
      </section>

      {/* Regional Corporate Partner Logo strip */}
      <section className="bg-slate-950/80 border-b border-slate-900 py-10 relative overflow-hidden" id="regional-partners-strip">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 z-10 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#10b981] font-bold mb-6">
            {t.secTitleBadges}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-center opacity-65">
            <div className="bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 px-5 py-4 rounded-xl flex flex-col items-center justify-center transition-colors">
              <span className="font-sans font-black text-xs text-white tracking-widest">NAMA</span>
              <span className="font-mono text-[7px] text-white/40 tracking-wider">AFFILIATE NETWORK</span>
            </div>
            <div className="bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 px-5 py-4 rounded-xl flex flex-col items-center justify-center transition-colors">
              <span className="font-sans font-black text-xs text-white tracking-widest">SUR LPG</span>
              <span className="font-mono text-[7px] text-white/40 tracking-wider">COASTAL TERMINALS</span>
            </div>
            <div className="bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 px-5 py-4 rounded-xl flex flex-col items-center justify-center transition-colors">
              <span className="font-sans font-black text-xs text-white tracking-widest">DHOFAR SYSTEM</span>
              <span className="font-mono text-[7px] text-white/40 tracking-wider">SOUTHERN GENERATORS</span>
            </div>
            <div className="bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 px-5 py-4 rounded-xl flex flex-col items-center justify-center transition-colors">
              <span className="font-sans font-black text-xs text-white tracking-widest">SOHAR LINK</span>
              <span className="font-mono text-[7px] text-white/40 tracking-wider">HEAVY INDUSTRIAL POWER</span>
            </div>
            <div className="bg-slate-900/40 border border-white/5 hover:border-emerald-500/20 px-5 py-4 rounded-xl flex flex-col items-center justify-center col-span-2 md:col-span-1 transition-colors">
              <span className="font-sans font-black text-xs text-white tracking-widest">AL-BATINAH</span>
              <span className="font-mono text-[7px] text-white/40 tracking-wider">GRID COOPERATIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Infrastructure Showcase with Professional High-Res Photos */}
      <section className="py-20 border-b border-slate-900 bg-slate-950/45 relative" id="infrastructure-showcase">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none select-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-[#10b981] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Supported Infrastructure Profiles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Optimizing Mission-Critical Energy Infrastructure
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              We connect directly with physical operational sites in Oman to translate high-frequency engineering states into optimized, top-tier financial system returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Asset 1: Battery storage BESS */}
            <div className="group relative rounded-3xl overflow-hidden border border-slate-850 bg-slate-900/10 hover:bg-slate-900/30 p-2 hover:border-emerald-500/20 transition-all flex flex-col justify-between" id="asset-card-bess">
              <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-5 bg-slate-950">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80" 
                  alt="Utility-scale BESS lithium containment array" 
                  className="h-full w-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-[#34d399] font-bold bg-slate-950/90 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  BESS Storage Optimization
                </span>
              </div>
              <div className="px-3 pb-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white mb-2 font-sans">Battery Storage Arbitrage Blocks</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Balancing the chemical degradation costs of heavy cycling with real-time OPWP spot market spikes to execute maximum-margin charging loops.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Target Node Efficiency:</span>
                  <span className="text-emerald-400 font-bold bg-[#050505] border border-emerald-500/20 px-2 py-0.5 rounded-full">+14.2% Yield Gain</span>
                </div>
              </div>
            </div>

            {/* Asset 2: Solar arrays */}
            <div className="group relative rounded-3xl overflow-hidden border border-slate-850 bg-slate-900/10 hover:bg-slate-900/30 p-2 hover:border-emerald-500/20 transition-all flex flex-col justify-between" id="asset-card-solar">
              <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-5 bg-slate-950">
                <img 
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80" 
                  alt="Giga-scale photovoltaic solar panels in Oman dessert region" 
                  className="h-full w-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-sky-450 font-bold bg-slate-950/90 border border-sky-500/30 px-2.5 py-1 rounded-full">
                  Renewable Yield Integration
                </span>
              </div>
              <div className="px-3 pb-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white mb-2 font-sans">Solar PV & Wind Hybrid Generators</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Bypassing peak day solar-clipping constraints by dynamically routing surplus noon-generation to regional battery blocks, discharging during extreme system peak tariff hours.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Capacity Optimized:</span>
                  <span className="text-sky-400 font-bold bg-[#050505] border border-sky-500/20 px-2 py-0.5 rounded-full">Up to 1500 MW single nodes</span>
                </div>
              </div>
            </div>

            {/* Asset 3: Grid dispatch */}
            <div className="group relative rounded-3xl overflow-hidden border border-slate-850 bg-slate-900/10 hover:bg-slate-900/30 p-2 hover:border-emerald-500/20 transition-all flex flex-col justify-between" id="asset-card-grid">
              <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-5 bg-slate-950">
                <img 
                  src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80" 
                  alt="Electrical distribution line poles on power grid" 
                  className="h-full w-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest text-amber-550 font-bold bg-slate-950/90 border border-amber-500/30 px-2.5 py-1 rounded-full">
                  Grid Transmission Intertie
                </span>
              </div>
              <div className="px-3 pb-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-white mb-2 font-sans">National Utility Dispatch & Substations</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Solving continuous dispatch execution mismatches under OPWP rules before energy commitments lock, transforming passive grid compliance into direct profit centers.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Economic Slip Audited:</span>
                  <span className="text-emerald-450 font-bold bg-[#050505] border border-emerald-500/20 px-2 py-0.5 rounded-full">Recovered 8% - 15% Leakage</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="py-20 border-b border-slate-900 bg-slate-950 relative" id="problem-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold font-mono text-emerald-400">
              Operational Realities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Hidden Problem Nobody Measures
            </h3>
            <p className="text-slate-400">
              Classic telemetry tools measure equipment wellness perfectly, but ignore the continuous economic leaks resulting from bad dispatch math.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Technical KPIs (What is tracked) */}
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 relative">
              <div className="absolute top-4 right-4 text-emerald-500 opacity-20">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="font-sans text-lg font-bold text-slate-200 mb-4 flex items-center space-x-2">
                <span className="inline-block p-1.5 rounded bg-emerald-950/50 border border-emerald-800/30 text-emerald-400 text-xs">A</span>
                <span>Standard Technical Metrics Tracked</span>
              </h4>
              <p className="text-xs text-slate-400 mb-6">
                Most energy asset operators focus heavily on engineering parameters. These are successfully optimized:
              </p>
              
              <ul className="space-y-4 font-mono text-xs">
                <li className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>Availability Ratio (Avg 98.4%)</span>
                </li>
                <li className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>Physical Asset Uptime (99.1%)</span>
                </li>
                <li className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>Performance Ratio (Ambient Decoupled)</span>
                </li>
                <li className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>State of Charge (SoC Limits Preserved)</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-850 text-[11px] text-slate-500 italic">
                ✓ Equipment is physically safe and running.
              </div>
            </div>

            {/* Economic Underperformance (What is lost) */}
            <div className="p-6 rounded-xl border border-red-950/80 bg-red-950/10 relative">
              <div className="absolute top-4 right-4 text-red-500 opacity-20">
                <XCircle className="h-10 w-10" />
              </div>
              <h4 className="font-sans text-lg font-bold text-red-400 mb-4 flex items-center space-x-2">
                <span className="inline-block p-1.5 rounded bg-red-950/50 border border-red-800/40 text-red-400 text-xs">B</span>
                <span>Silent Economic Losses Leaked</span>
              </h4>
              <p className="text-xs text-red-300/80 mb-6">
                Almost no asset team measures, benchmarks, or optimizes real-time transaction margins vs dispatch alternatives:
              </p>
              
              <ul className="space-y-4 font-mono text-xs">
                <li className="flex items-center space-x-3 text-red-300">
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span>Economic Leakage (Friction in timing spot prices)</span>
                </li>
                <li className="flex items-center space-x-3 text-red-300">
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span>Lost Arbitrage Value during peak local demand grid sweeps</span>
                </li>
                <li className="flex items-center space-x-3 text-red-300">
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span>Missed Dispatch Opportunities (Static trading models)</span>
                </li>
                <li className="flex items-center space-x-3 text-red-300">
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span>Decision Quality Decay (No automated audit loop)</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-red-900/30 text-[11px] text-red-400/70 italic-sans">
                ✗ Asset is technically sound, but financially bleeding.
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <div className="inline-block p-4 rounded-lg bg-orange-950/20 border border-orange-800/30 max-w-2xl">
              <p className="text-sm text-slate-350">
                <strong className="text-white">The Verdict:</strong> Assets that are technically sound and optimized are silently underperforming by <span className="text-amber-400 font-bold">8% to 15%</span> on revenue yields simply due to static operational dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section className="py-20 border-b border-slate-900 bg-slate-900/20" id="solution-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-16">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-bold font-mono text-emerald-400">
                The Solution
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Meet the Economic Decision Engine
              </h3>
              <p className="text-slate-400">
                PREDAIOT continuously evaluates operational decisions and identifies economically superior alternatives before revenue window closes.
              </p>
            </div>
            <button
              onClick={() => setView('ECONOMIC_INTELLIGENCE')}
              className="text-emerald-450 hover:text-emerald-300 font-semibold text-xs flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800"
            >
              <span>Explore Engine Architecture</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Solution Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/30 transition-all group">
              <span className="p-2 inline-block rounded bg-indigo-950/40 text-indigo-400 text-xs font-mono mb-4">
                01 / DETECTION
              </span>
              <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Economic Leakage Detection
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scans asset operational dispatch histories to spot hidden discrepancies between captured prices and true optimal markets.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/30 transition-all group">
              <span className="p-2 inline-block rounded bg-emerald-950/40 text-emerald-400 text-xs font-mono mb-4">
                02 / BIDDING
              </span>
              <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Dispatch Optimization
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates premium grid-injection steps in real time based on day-ahead forecasting streams and network topology limits.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/30 transition-all group">
              <span className="p-2 inline-block rounded bg-amber-950/40 text-amber-400 text-xs font-mono mb-4">
                03 / STORAGE
              </span>
              <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Battery Revenue Maximization
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Balances battery chemistry degradation costs with peak power spot rewards to identify net-profitable discharge periods.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/30 transition-all group">
              <span className="p-2 inline-block rounded bg-sky-950/40 text-sky-400 text-xs font-mono mb-4">
                04 / GENERATORS
              </span>
              <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Renewable Energy Optimization
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Saves clipped high-solar-noon yield inside storage blocks, dispatching it only when system prices spike during evening peak blocks.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/30 transition-all group">
              <span className="p-2 inline-block rounded bg-fuchsia-950/40 text-fuchsia-400 text-xs font-mono mb-4">
                05 / ANALYTICS
              </span>
              <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Decision Intelligence
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bridges physical machinery engineering parameters with strategic finance goals, empowering operators to understand true margin.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/30 transition-all group">
              <span className="p-2 inline-block rounded bg-rose-950/40 text-rose-400 text-xs font-mono mb-4">
                06 / WORKFLOWS
              </span>
              <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Economic Simulation
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulates extreme weather, pricing anomalies, and local grid outages to stress-test financial security profiles.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/30 transition-all group">
              <span className="p-2 inline-block rounded bg-teal-950/40 text-teal-400 text-xs font-mono mb-4">
                07 / MACHINE LEARNING
              </span>
              <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                AI Recommendations
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inbuilt Gemini-powered Copilot digests multi-asset operational data and answers real-time optimization directions instantly.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-800 bg-slate-950 hover:border-emerald-500/30 transition-all group">
              <span className="p-2 inline-block rounded bg-orange-950/40 text-orange-400 text-xs font-mono mb-4">
                08 / RADAR
              </span>
              <h4 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Revenue Opportunity Discovery
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Constantly maps and flags regional price spikes and system tariff adjustments to capture fast dispatch yields.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Case Study: Found Money in Muscat & Comparing Traditional vs PREDAIOT */}
      <section className="py-20 border-b border-slate-900 bg-slate-950" id="case-study-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-[#10b981] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-block">
                {locale === 'EN' ? "Oman Operational Verification" : "التحقق والنتاج التشغيلي في عمان"}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full inline-block">
                {locale === 'EN' ? "MODELED RESULT" : "نتيجة نمذجة ومحاكاة مسبقة"}
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {t.foundInMuscatTitle}
            </h3>
            <p className="text-slate-400 text-xs sm:text-xs max-w-2xl mx-auto leading-relaxed">
              {t.foundInMuscatDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-16">
            
            {/* Muscat Narrative block */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/60 to-slate-900/10 p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest font-bold block mb-2">
                  {locale === 'EN' ? "Node Muscat-South PV+BESS" : "عقدة محطة مسقط الجنوبية"}
                </span>
                <h4 className="text-xl font-bold text-white mb-4">
                  {locale === 'EN' ? "Unlocking Revenue in Al-Batinah & Muscat" : "تحرير رأس المال الراكد في الباطنة ومسقط"}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
                  {locale === 'EN' 
                    ? "Historically, our team discovered that physical utility grids in Al-Batinah and Muscat operated solar power coupled batteries in static 12-hour loops. By swapping traditional rules for our Economic Decision Engine, the system began charging the lithium cells solely on midday surplus solar, executing massive evening grid injections during peak OPWP spot pool windows. Labeled: Peak-case internal simulation for a smaller 10 MW / 15 MWh asset class."
                    : "تاريخياً، وجد فريقنا أن محطات الطاقة والبطاريات في الباطنة ومسقط تدار وفقاً لجدولة تقليدية ثابتة مدتها 12 ساعة. بمجرد إحلال نظام التشغيل والBidder الخاص بنا، بدأ كشغل البطاريات ذروات الموازنة. (تصنيف: دراسة محاكاة نموذجية لأصل فرعي 10 ميجاوات / 15 ميجاوات ساعة)."
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold block font-mono">
                      {locale === 'EN' ? "Simulated Yield (Smaller Asset Profile)" : "العائد الاسترآبي المقدر (فئة أصل مصغر)"}
                    </span>
                    <span className="text-xl font-mono font-black text-amber-500">$108,000 USD <span className="text-xs text-white/50">(41,500 OMR)</span></span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/25 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-[#34d399] font-bold block font-mono">
                      {locale === 'EN' ? "PRIMARY Citable Public Metric (500 MW scale asset)" : "المؤشر الوطني المرجعي الموثق (قدرة 500 ميجاوات)"}
                    </span>
                    <span className="text-1.5xl font-mono font-bold text-emerald-400">862,903 OMR <span className="text-xs text-white/65">/ yr</span></span>
                    <span className="text-[9px] text-[#34d399] block font-mono mt-0.5">9.1% – 15% Profitability Increase (Zero CAPEX)</span>
                  </div>
                  
                  <div className="pt-2 border-t border-emerald-500/10">
                    <p className="text-[9px] text-white/45 font-mono italic leading-normal">
                      &quot;{locale === 'EN' ? 'Published methodology — PREDAIOT, Oman National Open Data Portal Use Case, June 2026' : 'المنهجية المنشورة — PREDAIOT، دراسة حالة بوابة البيانات الوطنية المفتوحة بسلطنة عمان، يونيو 2026'}&quot;
                    </p>
                    <a 
                      href="http://opendata.gov.om/ar/use-cases/1d4a8d55-1b2a-4b72-baba-e1a3763e842f" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[9px] text-[#34d399] underline hover:text-emerald-300 font-mono block mt-1"
                    >
                      opendata.gov.om/ar/use-cases/1d4a8d55-1b2a-4b72-baba-e1a3763e842f
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Comprehensive Comparison table */}
            <div className="lg:col-span-7 bg-[#0d0d0d] rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col justify-between">
              <h4 className="text-md font-bold text-slate-200 mb-6 font-sans">
                {t.comparisonTitle}
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-450 border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-300 font-mono text-[10px] uppercase">
                      <th className="pb-3 pr-2">{locale === 'EN' ? "Parameter" : "المعيار"}</th>
                      <th className="pb-3 px-2 text-red-400">{t.traditionalDesc}</th>
                      <th className="pb-3 pl-2 text-emerald-400">{t.predaiotDesc}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    <tr>
                      <td className="py-3 px-1 font-semibold text-slate-200">{locale === 'EN' ? "OPWP Spot Pricing Sensitivity" : "التفاعل مع الأسعار اللحظية لـ OPWP"}</td>
                      <td className="py-3 px-2 text-red-300/80 font-mono">{locale === 'EN' ? "None (Static schedule)" : "معدوم (جدولة ثابتة)"}</td>
                      <td className="py-3 pl-2 text-emerald-300 font-mono font-bold">{locale === 'EN' ? "Real-time Live (continuous tracking)" : "لحظي مستمر (تحديث نشط)"}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-1 font-semibold text-slate-200">{locale === 'EN' ? "BESS Chemical Degradation Math" : "حساب تدهور خلايا البطاريات"}</td>
                      <td className="py-3 px-2 text-red-300/80 font-mono">{locale === 'EN' ? "Ignored (Rigid heavy cycles)" : "متجاهل (دورات تشغيل مجهدة)"}</td>
                      <td className="py-3 pl-2 text-emerald-300 font-mono font-bold">{locale === 'EN' ? "Calculated against market margin" : "محسوب بدقة مقابل العائد المتوقع"}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-1 font-semibold text-slate-200">{locale === 'EN' ? "Surplus Midday Photovoltaic" : "فائض الطاقة الشمسية بمنتصف النهار"}</td>
                      <td className="py-3 px-2 text-red-300/80 font-mono">{locale === 'EN' ? "Clipped & physically wasted" : "مهدر ومحجوب تشغيلياً"}</td>
                      <td className="py-3 pl-2 text-emerald-300 font-mono font-bold">{locale === 'EN' ? "Captured into battery blocks" : "مخزن وموجه ذكياً نحو المساء"}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-1 font-semibold text-slate-200">{locale === 'EN' ? "Decision Quality Assurance" : "معايير جودة القرار المالي"}</td>
                      <td className="py-3 px-2 text-red-300/80 font-mono">{locale === 'EN' ? "No feedback loops" : "بدون حلقات فحص متبادلة"}</td>
                      <td className="py-3 pl-2 text-emerald-300 font-mono font-bold">{locale === 'EN' ? "Automated digital micro-audits" : "تدقيق رقمي ميكرو-تفاعلي مدمج"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-[10px] text-slate-500 font-mono mt-6 border-t border-white/5 pt-4 text-center">
                * {locale === 'EN' ? "Verified simulation model modeled on OPWP 2026 Spot Hub and Oman Transmission grid topology rules." : "نموذج محاكاة مرصد ومحسوب استناداً لقواعد سوق الطاقة الفوري العماني لعام 2026."}
              </p>
            </div>

          </div>

          {/* Testimonials block */}
          <div className="space-y-6 mt-20" id="testimonials">
            <h4 className="text-xl font-bold text-center text-white mb-8">
              {t.testimonialsTitle}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                    "{t.t1Quote}"
                  </p>
                </div>
                <div className="flex items-center space-x-3 border-t border-white/5 pt-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 font-sans font-bold flex items-center justify-center text-xs">
                    SA
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-none">{t.t1Name}</h5>
                    <span className="text-[9px] text-slate-400 mt-1 block">{t.t1Role}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                    "{t.t2Quote}"
                  </p>
                </div>
                <div className="flex items-center space-x-3 border-t border-white/5 pt-4">
                  <div className="h-10 w-10 rounded-full bg-sky-500/20 text-sky-400 font-sans font-bold flex items-center justify-center text-xs">
                    FA
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-none">{t.t2Name}</h5>
                    <span className="text-[9px] text-slate-400 mt-1 block">{t.t2Role}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                    "{t.t3Quote}"
                  </p>
                </div>
                <div className="flex items-center space-x-3 border-t border-white/5 pt-4">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 text-purple-400 font-sans font-bold flex items-center justify-center text-xs">
                    AB
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white leading-none">{t.t3Name}</h5>
                    <span className="text-[9px] text-slate-400 mt-1 block">{t.t3Role}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick CTA to prompt login */}
          <div className="text-center mt-16">
            <button 
              onClick={() => setView('ECONOMIC_AUDITS')}
              className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#10b981] to-[#34d399] hover:from-emerald-400 hover:to-emerald-300 px-8 py-3.5 text-xs text-slate-950 font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] select-none cursor-pointer"
            >
              <span>{locale === 'EN' ? "Get Your Portfolio Audited" : "ابدأ التدقيق الفوري الشامل لمحفظتك"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
