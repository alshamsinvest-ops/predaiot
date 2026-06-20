import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, BarChart3, FileUp, Play, Sparkles, 
  ArrowRight, Check, AlertTriangle, Download, Share2, 
  Clock, Lock, FileText, CheckCircle2 
} from 'lucide-react';

interface LeakTestPageProps {
  locale: 'EN' | 'AR';
}

export default function LeakTestPage({ locale }: LeakTestPageProps) {
  // Enforced Rate Limit State
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string>('');

  // Form State
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [assetType, setAssetType] = useState<'SOLAR' | 'WIND' | 'BESS' | 'HYBRID'>('HYBRID');
  const [capacity, setCapacity] = useState<number>(250); // in MW
  const [dataType, setDataType] = useState<'UPLOAD' | 'NO_DATA'>('NO_DATA');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulation execution steps
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Timer for time-bounded offer (14 days from today)
  const [countdownText, setCountdownText] = useState<string>('');

  useEffect(() => {
    // 14 days countdown
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference <= 0) {
        setCountdownText("Promo Expired");
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      if (locale === 'EN') {
        setCountdownText(`${days}d ${hours}h ${minutes}m left`);
      } else {
        setCountdownText(`متبقي ${days} يوم و ${hours} ساعة و ${minutes} دقيقة`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [locale]);

  // Check rate limit on mount
  useEffect(() => {
    checkRateLimit();
  }, []);

  const checkRateLimit = () => {
    const lastSubText = localStorage.getItem('predaiot_leak_test_last_submission');
    if (lastSubText) {
      const lastSub = JSON.parse(lastSubText);
      const now = new Date().getTime();
      // 30 days is 30 * 24 * 60 * 60 * 1000
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (now - lastSub.timestamp < thirtyDaysMs) {
        setIsRateLimited(true);
        const nextEligibleDate = new Date(lastSub.timestamp + thirtyDaysMs);
        if (locale === 'EN') {
          setRateLimitMessage(`Rate Limit Active: One free 7-day leak test allowed per email/company every 30 days. You last submitted for "${lastSub.email}" on ${new Date(lastSub.timestamp).toLocaleDateString()}. Next test eligible on ${nextEligibleDate.toLocaleDateString()}.`);
        } else {
          setRateLimitMessage(`تنبيه الاستخدام: يُسمح باختبار مجاني واحد كل 30 يوماً لكل بريد/شركة. كان آخر اختبار لـ "${lastSub.email}" في ${new Date(lastSub.timestamp).toLocaleDateString()}. تاريخ الاختبار التالي المتاح ${nextEligibleDate.toLocaleDateString()}.`);
        }
      }
    }
  };

  // Drag-and-drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const [simulationResult, setSimulationResult] = useState<{
    leakageOMR: number;
    leakageUSD: number;
    annualLeakageOMR: number;
    annualLeakageUSD: number;
    concreteLeakageOMR: number;
    concreteExample: string;
    concreteExampleAR: string;
  } | null>(null);

  // Handle Form submit & Progression Simulation
  const handleRunTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !company) return;

    // Rate limit check
    const lastSubText = localStorage.getItem('predaiot_leak_test_last_submission');
    if (lastSubText) {
      const lastSub = JSON.parse(lastSubText);
      const now = new Date().getTime();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (now - lastSub.timestamp < thirtyDaysMs) {
        checkRateLimit();
        return;
      }
    }

    setIsProcessing(true);
    setProgressStep(1);

    // Interactive progress timeouts
    setTimeout(() => {
      setProgressStep(2);
      setTimeout(() => {
        setProgressStep(3);
        setTimeout(() => {
          setProgressStep(4);
          setTimeout(() => {
            // Generate deterministic leak math depending on capacity and asset type
            const base7DayRev = capacity * 168 * 115 * 0.94 / 1000; // Cap * Hours(168) * SMP * base efficiency
            const leakageRatio = assetType === 'BESS' ? 0.16 : (assetType === 'HYBRID' ? 0.14 : 0.11);
            const leakageUSD = Math.round(base7DayRev * leakageRatio);
            const leakageOMR = Math.round(leakageUSD * 0.385);

            // Annualized
            const annualLeakageUSD = Math.round(leakageUSD * 52);
            const annualLeakageOMR = Math.round(leakageOMR * 52);

            // Concrete leakage example
            const singleShiftLossUSD = Math.round(capacity * 2.5 * 40 / 2); // capacity * hours discharged * difference tariff
            const concreteValueOMR = Math.round(singleShiftLossUSD * 0.385);

            setSimulationResult({
              leakageOMR: leakageOMR,
              leakageUSD: leakageUSD,
              annualLeakageOMR: annualLeakageOMR,
              annualLeakageUSD: annualLeakageUSD,
              concreteLeakageOMR: concreteValueOMR,
              concreteExample: `BESS Block ${company.substring(0,4).toUpperCase()}-4 discharged output at 12:45 during a minor non-peak ancillary window of $35/MWh instead of waiting for the OPWP grid peak at 15:30 ($115/MWh), leaking ${concreteValueOMR.toLocaleString()} OMR in a single cycle.`,
              concreteExampleAR: `قام مجمع تخزين البطاريات ${company.substring(0,4).toUpperCase()}-4 بتصريف الشحنات والقدرة التشغيلية الساعة 12:45 في وقت أسعار متدنية تبلغ 14 ريالاً للميجاوات، بدلاً من الانتظار لذروة طلب شبكة مسقط الساعة 15:30 (45 ريالاً للميجاوات)، مسبباً هدر مالي وتسريباً بقيمة ${concreteValueOMR.toLocaleString()} ريال عماني في دورة واحدة.`
            });

            // Persit rate limit
            const subRecord = {
              email: email,
              company: company,
              timestamp: new Date().getTime()
            };
            localStorage.setItem('predaiot_leak_test_last_submission', JSON.stringify(subRecord));

            setIsProcessing(false);
            setProgressStep(5);
            setIsCompleted(true);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleShareWhatsApp = () => {
    if (!simulationResult) return;
    const shareMsg = locale === 'EN'
      ? `I just ran PREDAIOT's 7-Day Leak Test for our ${capacity} MW energy facility and identified ${simulationResult.leakageOMR.toLocaleString()} OMR in weekly operational leakage! Find your leakage at: predaiot.ai`
      : `لقد أجريت للتو اختبار تسريب الطاقة لمفتوح 7 أيام من PREDAIOT لمحطتنا بسعة ${capacity} ميجاوات، وكشفنا عن هدر بقيمة ${simulationResult.leakageOMR.toLocaleString()} ريال عماني أسبوعياً! تحقق من تسريبات محطتك عبر: predaiot.ai`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`, '_blank');
  };

  const downloadTestReport = () => {
    if (!simulationResult) return;
    const reportText = `
PREDAIOT ENERGY DECISION INTELLIGENCE LABS
==================================================
7-DAY LEAK TEST CERTIFICATE OF FINDINGS
==================================================
FACILITY PROFILE: ${company.toUpperCase()}
CAPACITY: ${capacity} MW [TYPE: ${assetType}]
SECURITY & COMPLIANCE FRAMEWORK: Oman PDPL Royal Decree 6/2022
--------------------------------------------------
FOUND LEAK DESIGNATION:
- 7-Day Identified Operational Leakage: ${simulationResult.leakageOMR.toLocaleString()} OMR [Equivalent to $${simulationResult.leakageUSD.toLocaleString()} USD]
- Pro-rata Annualized Leakage: ${simulationResult.annualLeakageOMR.toLocaleString()} OMR [Equivalent to $${simulationResult.annualLeakageUSD.toLocaleString()} USD]
- Verified Leakage Ratio: ${assetType === 'BESS' ? '16%' : (assetType === 'HYBRID' ? '14%' : '11%')} in Decision Mismatches

CONCRETE DECISION INSTABILITY EXAMPLE:
${locale === 'EN' ? simulationResult.concreteExample : simulationResult.concreteExampleAR}

--------------------------------------------------
5% FINANCIAL GUARANTEE VERDICT:
"If we don't find at least 5% in recoverable value in your free week, 
we'll tell you so in writing — no audit needed, no cost, ever."

LIMITED TIME UP-SELL UPGRADE:
Lock in the full 8,760-hour audit at 50% discount: 1,250 OMR 
(standard price: 2,500 – 3,000 OMR) if booked within 14 days.
==================================================
Sultanate of Oman | Official Inquiry: al.shams.invest@gmail.com
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PREDAIOT_7Day_LeakTest_${company.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const translations = {
    EN: {
      subBadge: "High-Leverage Growth Diagnostic",
      mainTitle: "7-Day Energy Leak Test",
      tagline: "We'll Find Your Operational Leak in 7 Days — Free. No Catch.",
      secLabel: "Frame compliance verified under Oman's Personal Data Protection Law (PDPL, Royal Decree 6/2022). All uploaded SCADA parameters remain encrypted at rest and logically isolated.",
      formHeader: "Leak Diagnostic Scope Parameters",
      nameLabel: "Corporate Officer Name",
      emailLabel: "Corporate Business Email",
      phoneLabel: "Contact Phone Number (WhatsApp Enabled)",
      companyLabel: "Utility / Company Name",
      techTypeLabel: "Asset Model Matrix",
      capacityLabel: "Asset Output Rating (MW)",
      dataTypeLabel: "Operational Core Telemetry Vector",
      uploadPrompt: "Upload 7 Days Telemetry Data (CSV / XLSX)",
      samplePrompt: "I don't have generation telemetry yet — run sample evaluation modeled on average Muscat spot price patterns",
      runBtn: "Execute 7-Day Diagnostic Test",
      progress1: "Filtering weather anomalies...",
      progress2: "Checking ramp-rate conformity...",
      progress3: "Calculating OPWP Spot market arbitrage deviation...",
      progress4: "Measuring local State of Charge drift...",
      completedTitle: "Leakage Intelligence Findings",
      weeklyLeak: "Weekly Detected Leakage",
      annualizedLeak: "Annualized Leakage Projection",
      decisionTitle: "Decision Leakage Breakdown Example",
      guaranteeText: "GUARANTEE: If we don't find at least 5% in recoverable value in your free week, we'll state so in writing — no audit needed, no cost, ever.",
      upsellTitle: "Limited Opportunity Full Upgrade",
      upsellDesc: "Lock in the full 8,760-hour audit at 50% OFF — 1,250 OMR (normally 2,500 – 3,000 OMR). Available for the first 10 clients only, within the next 14 days.",
      shareBtn: "Share on WhatsApp",
      downloadBtn: "Download Signed Certificate"
    },
    AR: {
      subBadge: "أداة تشخيص تسريب الطاقة والشبكات",
      mainTitle: "اختبار تسريب الـ 7 أيام المجاني",
      tagline: "سنجد التسريب المالي لخلية الطاقة الخاصة بك خلال 7 أيام - مجاناً بالكامل دون شروط.",
      secLabel: "جميع البيانات والتشخيصات تتوافق تماماً مع قانون حماية البيانات الشخصية العماني (PDPL)، الصادر بمرسوم سلطاني رقم 6/2022. كافة البيانات مشفرة بالكامل ولا يتم مشاركتها.",
      formHeader: "مدخلات ومحددات مصفوفة الفحص التشغيلي",
      nameLabel: "اسم المسؤول التشغيلي",
      emailLabel: "البريد الإلكتروني للشركة",
      phoneLabel: "رقم الهاتف للاتصال والواتساب",
      companyLabel: "اسم الشركة / المحطة",
      techTypeLabel: "تكنولوجيا الأصول والمصفوفة",
      capacityLabel: "السعة الاسمية الاسمية (ميجاوات)",
      dataTypeLabel: "توجيه مدخلات البيانات التشغيلية",
      uploadPrompt: "رفع ملفات التليمتري وسجلات البيانات أسبوع كامل (CSV / XLSX)",
      samplePrompt: "لا أمتلك سجلات جاهزة حالياً — تشغيل محاكاة استكشافية مستندة إلى متوسط الأسعار الفورية بسلطنة عمان",
      runBtn: "بدء فحص وتحليل التسريب المباشر",
      progress1: "تصفية الاختلالات الجوية والانحرافات...",
      progress2: "فحص الالتزام بمعدلات الرفع الهندسية للشبكة والمقاييس...",
      progress3: "حساب انحراف مراجحة سوق أسعار OPWP الفورية المباشرة...",
      progress4: "قياس تآكل خلايا البطارية والفاقد الكيميائي بسبب دورات الشحن الاستاتيكية...",
      completedTitle: "نتائج التدقيق والتشخيص الفوري",
      weeklyLeak: "التسريبات المباشرة المكتشفة بالـ 7 أيام",
      annualizedLeak: "التسريبات الاقتصادية السنوية المهدرة",
      decisionTitle: "مثال عملي على تسريب قرارات التشغيل",
      guaranteeText: "الضمان المالي الحصري: إذا لم نكتشف تسريباً وهدراً مالياً لا يقل عن 5% في أسبوعك التجريبي، فسنخطرك كذباً وبشفافية تامة، ولن تلتزم بدفع أي تكاليف لأي تدقيق مستقبلي.",
      upsellTitle: "فرصة الترقية والحجز لفحص العام الكامل",
      upsellDesc: "احجز تدقيقاً كاملاً وشاملاً لمدة 8,760 ساعة بخصم 50% — فقط بقيمة 1,250 ريال عماني (بدلاً من الأسعار الدورية البالغة 2,500 - 3,000 ريال) للعشرة عملاء الأوائل وخلال 14 يوماً فقط.",
      shareBtn: "مشاركة النتائج عبر الواتساب",
      downloadBtn: "تحميل شهادة فحص معتمدة وموقعة"
    }
  };

  const t = translations[locale];

  return (
    <div className="py-20 bg-[#050505] px-4 sm:px-6 lg:px-8 z-10 relative overflow-hidden" id="leak-test-master-view">
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-emerald-900/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-blue-900/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mx-auto max-w-4xl space-y-12">
        
        {/* Head Area */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="font-mono text-xs uppercase text-[#10b981] tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-emerald-400 rotate-12" />
            {t.subBadge}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            {t.mainTitle}
          </h1>
          <p className="text-base sm:text-lg text-[#10b981] font-bold">
            {t.tagline}
          </p>
          <p className="text-xs text-white/50 leading-relaxed font-sans max-w-2xl mx-auto border border-emerald-500/10 bg-emerald-500/2 rounded-2xl p-4">
            🛡️ {t.secLabel}
          </p>
        </div>

        {/* Rate limit lock screening */}
        {isRateLimited ? (
          <div className="p-8 rounded-3xl bg-red-950/10 border border-red-900/30 text-center max-w-2xl mx-auto space-y-4">
            <AlertTriangle className="h-10 w-10 text-red-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">Rate Limit Exception Block</h3>
            <p className="text-sm text-slate-300">
              {rateLimitMessage}
            </p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-white/40 mb-3">To analyze multiple projects or coordinates, connect directly with Chams Eddine Madi.</p>
              <a 
                href="mailto:al.shams.invest@gmail.com?subject=PREDAIOT%20Multiple%20Asset%20Verification%20Request"
                className="inline-block bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-full text-xs font-semibold text-white border border-white/10 transition"
              >
                Connect with CEO
              </a>
            </div>
          </div>
        ) : !isCompleted ? (
          // Parameter Input form
          <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              <span>{t.formHeader}</span>
            </h3>

            <form onSubmit={handleRunTest} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] text-white/40 block mb-1.5 uppercase font-mono tracking-wider">{t.nameLabel}</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isProcessing}
                    placeholder="Chams Eddine Madi"
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 block mb-1.5 uppercase font-mono tracking-wider">{t.emailLabel}</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isProcessing}
                    placeholder="al.shams.invest@gmail.com"
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] text-white/40 block mb-1.5 uppercase font-mono tracking-wider">{t.phoneLabel}</label>
                  <input 
                    type="text" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isProcessing}
                    placeholder="+968 7411 4028"
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 block mb-1.5 uppercase font-mono tracking-wider">{t.companyLabel}</label>
                  <input 
                    type="text" 
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={isProcessing}
                    placeholder="Nama Group"
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] text-white/40 block mb-1.5 uppercase font-mono tracking-wider">{t.techTypeLabel}</label>
                  <select 
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as any)}
                    disabled={isProcessing}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer font-sans"
                  >
                    <option value="HYBRID" className="bg-[#0c0c0c] text-white">Hybrid Solar-Plus-Storage</option>
                    <option value="BESS" className="bg-[#0c0c0c] text-white">Standalone BESS blocks</option>
                    <option value="SOLAR" className="bg-[#0c0c0c] text-white">Solar PV Utility</option>
                    <option value="WIND" className="bg-[#0c0c0c] text-white">Wind Power Farm</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/40 block mb-1.5 uppercase font-mono tracking-wider">{t.capacityLabel}</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="10000"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Data Choice */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <label className="text-[10px] text-white/40 block uppercase font-mono tracking-wider">{t.dataTypeLabel}</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                  <button 
                    type="button"
                    onClick={() => setDataType('NO_DATA')}
                    disabled={isProcessing}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${dataType === 'NO_DATA' ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-white/5 bg-white/2 hover:border-white/15'}`}
                  >
                    <input 
                      type="radio" 
                      checked={dataType === 'NO_DATA'} 
                      readOnly 
                      className="mt-1 accent-emerald-500 pointer-events-none" 
                    />
                    <div>
                      <p className="text-xs font-bold text-white leading-none">Representative Spot-Evaluation</p>
                      <p className="text-[9px] text-white/40 mt-1">No telemetry file required; models using historical regional SMP pricing tables.</p>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setDataType('UPLOAD')}
                    disabled={isProcessing}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${dataType === 'UPLOAD' ? 'border-emerald-500/60 bg-emerald-500/5' : 'border-white/5 bg-white/2 hover:border-white/15'}`}
                  >
                    <input 
                      type="radio" 
                      checked={dataType === 'UPLOAD'} 
                      readOnly 
                      className="mt-1 accent-emerald-500 pointer-events-none" 
                    />
                    <div>
                      <p className="text-xs font-bold text-white leading-none">Actual Telemetry Leak Test</p>
                      <p className="text-[9px] text-white/40 mt-1">Upload 7 days of raw SCADA, active output, temperature or charging logs.</p>
                    </div>
                  </button>
                </div>
              </div>

              {dataType === 'UPLOAD' && (
                <div className="space-y-2 animate-fade-in font-sans">
                  <label className="text-[10px] text-white/40 block uppercase font-mono tracking-wider">{t.uploadPrompt}</label>
                  
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={onUploadClick}
                    className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                      dragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-white/2 hover:bg-white/5'
                    }`}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept=".csv,.xlsx,.txt" 
                      onChange={handleFileChange}
                    />
                    <FileUp className="h-6 w-6 text-emerald-400 mb-2" />
                    
                    {uploadedFile ? (
                      <div>
                        <p className="text-xs text-emerald-400 font-mono font-bold">{uploadedFile}</p>
                        <p className="text-[9px] text-white/30 mt-1">7-day telemetry payload fully mapped. Ready for analysis.</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-slate-300 font-medium">Drag 7-day CSV telemetry file, or <span className="text-emerald-400 font-semibold underline">browse</span></p>
                        <p className="text-[9px] text-white/30 mt-1">Accepts SCADA export, active charging CSV, or generation logs.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Run diagnostic CTA */}
              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#10b981] hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-full text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-45"
              >
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{t.runBtn}</span>
                </>
              </button>

              {/* OVERLAY SKELETON */}
              {isProcessing && (
                <div className="absolute inset-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center shadow-2xl rounded-3xl animate-fade-in-up">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[40px] opacity-20 animate-pulse"></div>
                    <div className="h-20 w-20 bg-[#050505] rounded-full border border-emerald-500/50 flex items-center justify-center animate-spin-slow">
                      <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#34d399] font-bold mb-4 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">
                    {progressStep === 1 ? t.progress1 : progressStep === 2 ? t.progress2 : progressStep === 3 ? t.progress3 : t.progress4}
                  </h3>
                  
                  <div className="space-y-4 w-full max-w-sm mx-auto">
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-emerald-500 w-full animate-progress origin-left"></div>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden w-5/6 mx-auto border border-white/5">
                      <div className="h-full bg-amber-500 w-full animate-progress origin-left delay-75"></div>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden w-4/6 mx-auto border border-white/5">
                      <div className="h-full bg-sky-500 w-full animate-progress origin-left delay-150"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 font-mono mt-8">Analyzing OPWP pricing gaps internally...</p>
                </div>
              )}
            </form>
          </div>
        ) : (
          // Completion view
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#0c0c0c] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <span className="absolute top-5 right-6 text-[9px] font-mono uppercase tracking-widest text-[#10b981] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                Test Verdict: COMPLETED
              </span>

              <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4 mb-6 font-mono flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>{company.toUpperCase()} // DIAGNOSTIC LEDGER</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Score */}
                <div className="space-y-5">
                  <div className="bg-[#050505] p-5 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono block">{t.weeklyLeak}</span>
                    <p className="text-4xl font-mono font-bold text-red-400 mt-2">
                      {simulationResult?.leakageOMR.toLocaleString()} <span className="text-base text-white/40">OMR</span>
                    </p>
                    <p className="text-xs text-white/40 font-sans mt-1">Equivalent to ~ ${simulationResult?.leakageUSD.toLocaleString()} USD lost in past 7 days.</p>
                  </div>

                  <div className="bg-[#050505] p-5 rounded-2xl border border-emerald-500/20 text-emerald-300">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono block">{t.annualizedLeak}</span>
                    <p className="text-4xl font-mono font-bold text-emerald-400 mt-2 font-black">
                      {simulationResult?.annualLeakageOMR.toLocaleString()} <span className="text-base text-white/40">OMR / yr</span>
                    </p>
                    <p className="text-xs text-white/40 font-sans mt-1">Equivalent to ~ ${simulationResult?.annualLeakageUSD.toLocaleString()} USD per annum.</p>
                  </div>
                </div>

                {/* Narrative Example & Guarantee */}
                <div className="space-y-6">
                  <div className="bg-[#050505] p-5 rounded-2xl border border-white/10">
                    <h4 className="text-[10px] text-amber-500 font-mono tracking-widest uppercase block mb-2">{t.decisionTitle}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {locale === 'EN' ? simulationResult?.concreteExample : simulationResult?.concreteExampleAR}
                    </p>
                  </div>

                  {/* Certified Guarantee visual block */}
                  <div className="p-5 border border-amber-500/30 bg-amber-500/5 rounded-2xl text-[11px] font-sans text-amber-400/90 leading-relaxed relative">
                    <div className="absolute top-2 right-3">
                      <ShieldCheck className="h-5 w-5 text-amber-400 opacity-60" />
                    </div>
                    <strong>{locale === 'EN' ? "5% CORE RECOVERY GUARANTEE:" : "ضمان استرداد الـ 5% الأساسي:"}</strong>
                    <p className="mt-1">
                      {locale === 'EN' 
                        ? "If we do not identify at least 5% in fully recoverable operational margin value in your free weeks, we will state so to you in writing — no further audit or fees needed, ever."
                        : "إذا لم نتمكن من كشف فرصة استرداد مالي تشغيلي واضحة لا تقل عن 5% خلال فترة الفحص التجريبية، فسنخطرك كذباً وبوضوح تام، وتظل محصناً من دفع أي رسوم أخرى تشغيلية."
                      }
                    </p>
                  </div>

                </div>

              </div>

              {/* Promo Banner */}
              <div className="mt-8 p-5 bg-gradient-to-r from-emerald-950/20 via-slate-900 to-emerald-950/10 border border-emerald-500/30 rounded-2xl font-sans" id="upsell-promo">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-amber-500 bg-[#050505] px-2.5 py-0.5 rounded border border-amber-500/20 font-bold">
                      {locale === 'EN' ? "TIME-BOUNDED ADVANTAGE" : "ميزة محدودة المدة"}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{t.upsellTitle}</h4>
                    <p className="text-xs text-slate-350">{t.upsellDesc}</p>
                  </div>
                  <div className="bg-[#050505] border border-amber-500/25 px-4 py-2 rounded-xl text-center space-y-0.5 shrink-0">
                    <span className="text-[8px] font-mono text-white/40 block font-bold">TIMER</span>
                    <span className="text-xs font-mono font-bold text-amber-400">{countdownText}</span>
                  </div>
                </div>
              </div>

              {/* Sharing & Download CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-white/5 mt-8">
                <button
                  onClick={downloadTestReport}
                  className="w-full sm:flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="h-4 w-4 text-emerald-400" />
                  <span>{t.downloadBtn}</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="w-full sm:flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-full text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.25)]"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{t.shareBtn}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
