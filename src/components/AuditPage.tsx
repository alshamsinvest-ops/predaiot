import React, { useState, useRef } from 'react';
import { ShieldCheck, BarChart3, HelpCircle, FileText, DollarSign, Cpu, MessageSquareCode, Mail, Zap, FileUp, Play, Sparkles, ArrowRight, Check, AlertTriangle, Download } from 'lucide-react';
import { AuditInput, AuditResult } from '../types';

interface AuditPageProps {
  locale: 'EN' | 'AR';
}

export default function AuditPage({ locale }: AuditPageProps) {
  const [formData, setFormData] = useState<AuditInput>({
    assetName: locale === 'EN' ? 'Muscat BESS Project Alpha' : 'مشروع مسقط لتخزين الخلايا ألفا',
    assetType: 'HYBRID',
    capacityMW: 250,
    annualOpHours: 8760,
    country: 'Oman',
    gridTariffUSD: 12 // 12 OMR / MWh (~$31.20 USD)
  });

  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<string>('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic booking states for audit prices packages
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingEmail, setBookingEmail] = useState<string>('');
  const [bookingAsset, setBookingAsset] = useState<string>('');
  const [bookingCapacity, setBookingCapacity] = useState<number>(100);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const translations = {
    EN: {
      subBadge: "Autonomous Operational Diagnostics",
      mainTitle: "Discover the Revenue You Are Leaving on the Table",
      mainDesc: "Provide your basic operational capacity parameters or upload real generation telemetry logs. Our Economic Decision Engine will evaluate decision-quality degradation and project recovered profits.",
      assetTitle: "Asset Parameter Portal",
      assetNameLabel: "Asset Identifier Name",
      assetTypeLabel: "Asset Design Matrix",
      capacityLabel: "Uptime Capacity (MW)",
      tariffLabel: "Oman Spot Tariff Basis (OMR/MWh)",
      hoursLabel: "Annual Dispatch Target (Hours/yr)",
      uploadLabel: "Upload SCADA / Generation Telemetry (Optional)",
      uploadPlh: "Drag & drop telemetry files, or browse",
      uploadSub: "Accepts generation CSV, Excel formats",
      executeBtn: "Execute Economic Audit",
      executing: "Processing operational vectors...",
      resultsBadge: "Diagnostic Sandbox Output",
      awaitingTitle: "Awaiting Diagnostics Inputs",
      awaitingDesc: "Adjust custom capacities or upload sample CSV logs and click 'Execute Economic Audit' to see financial leaks.",
      runningTitle: "Running Simulation Analysis",
      reportTitle: "ECONOMIC INTELLIGENCE REPORT FOR:",
      ratingLabel: "Efficiency Rating",
      leakageLabel: "Projected Annual Leakage",
      recoverableLabel: "Recoverable Margin",
      directivesTitle: "Correction Roadmap Directives:",
      downloadReport: "Download Audit Summary",
      discussBtn: "Discuss Implementation Block",
      chooseTitle: "Choose Your Audit Tier",
      chooseDesc: "Choose the optimal depth of economic diagnostics for your energy installations.",
      tier1Name: "Economic Audit",
      tier1Subtitle: "For Independent Asset Operators",
      tier1Price: "2,500 – 3,000 OMR",
      tier1SubUSD: "(~$6,500 - $7,800 USD)",
      tier2Name: "Continuous Pilot Program",
      tier2Subtitle: "90-Day Full Live Ingestion",
      tier2Price: "Starting 20,000 OMR",
      tier2SubUSD: "(~$52,000 USD)",
      tier3Name: "Performance Gain Share",
      tier3Subtitle: "Fully Aligned With Utilities",
      tier3Price: "60% / 40% Split",
      tier3SubUSD: "Zero upfront Cash Needed",
      btnBook: "Book Audit Tier",
      btnPilot: "Inquire Pilot Setup",
      btnShare: "Inquire Gain Share",
      reserveTitle: "Audit Reservation Link",
      reservePrefix: "Register",
      officerName: "Officer Name",
      corpEmail: "Corporate Email Address",
      targetAssetName: "Target Asset Name",
      selectedCapacity: "Estimated Capacity (MW)",
      modalBtn: "Verify & Run Live Simulation font-sans",
      modalDisclaimer: "💡 Submitting this online reservation bypasses general email constraints and compiles high-frequency grid analytics instantly.",
      compiling: "Compiling grid analytics..."
    },
    AR: {
      subBadge: "تشخيص تشغيلي واقتصادي مستقل",
      mainTitle: "كشّف عن العائدات الضخمة المفقودة داخل محطتك",
      mainDesc: "أدخل معايير القدرة التشغيلية الأساسية لمحطتك أو ارفع سجلات تليمتري SCADA والتحميل الفعلية. سيقوم محرك القرارات بتقدير حجم الهدر المالي وفرص الاسترداد.",
      assetTitle: "بوابة معاملات ومصفوفة الأصول",
      assetNameLabel: "معرّف أو اسم الأصل والتحميل",
      assetTypeLabel: "نوع تكنولوجيا الأصل الاستراتيجي",
      capacityLabel: "القدرة الاستيعابية المركبة (ميجاوات)",
      tariffLabel: "التعريفة الفورية العمانية للشبكة (ريال/ميجاوات ساعة)",
      hoursLabel: "ساعات التشغيل السنوية المستهدفة (ساعة/سنة)",
      uploadLabel: "تحميل تليمتري SCADA أو سجلات التوليد (اختياري)",
      uploadPlh: "اسحب وأفلت ملفات التليمتري هنا، أو تصفح ملفاتك",
      uploadSub: "يقبل جداول CSV وصيغ Excel المتعددة",
      executeBtn: "تشغيل فحص الهدر والتدقيق الفوري",
      executing: "جاري تحليل ومعالجة المعاملات الفنية...",
      resultsBadge: "مخرجات محاكاة الفحص التشخيصي",
      awaitingTitle: "بانتظار إدخال معاملات التشغيل",
      awaitingDesc: "قم بتعديل القدرات في القائمة الجانبية أو ارفع عينة من سجلات SCADA ثم انقر لترجمة الهدر المالي.",
      runningTitle: "جاري تشغيل تحليل المحاكاة الرياضي",
      reportTitle: "تقرير ذكاء تشغيل الأصول الاقتصادي لـ:",
      ratingLabel: "مؤشر كفاءة القرار التشغيلي",
      leakageLabel: "الهدر المالي السنوي المتوقع",
      recoverableLabel: "هامش الربح القابل للاسترداد",
      directivesTitle: "توجيهات خارطة طريق التصحيح المستقلة:",
      downloadReport: "تحميل خلاصة التدقيق الرقمي",
      discussBtn: "مناقشة خطة التنفيذ مع الرئيس التنفيذي",
      chooseTitle: "اختر فئة التدقيق والمواءمة",
      chooseDesc: "حدد العمق المطلوب لعمليات التدقيق والفرص التشغيلية لشبكات الأصول الخاصة بك.",
      tier1Name: "التدقيق الاقتصادي القياسي",
      tier1Subtitle: "لمشغلي المحافظ الفردية والمطورين",
      tier1Price: "2,500 – 3,000 ر.ع.",
      tier1SubUSD: "(~$6,500 - $7,800 دولار أمريكي)",
      tier2Name: "برنامج التجريب التجاري المتصل",
      tier2Subtitle: "دمج مباشر وبيانات SCADA حية لـ 90 يوماً",
      tier2Price: "يبدأ من 20,000 ر.ع.",
      tier2SubUSD: "(~$52,000 دولار أمريكي)",
      tier3Name: "تقسيم الأرباح والمراجحة المستند للأداء",
      tier3Subtitle: "مواءمة تشغيلية واستثمارية كاملة",
      tier3Price: "60% للمشغل / 40% لـ PREDAIOT",
      tier3SubUSD: "بلا تكاليف أو مدفوعات نقدية مسبقة تشمل الأجهزة",
      btnBook: "احجز فئة التدقيق",
      btnPilot: "استعلم عن برنامج التجريب",
      btnShare: "استعلم عن مواءمة الأرباح",
      reserveTitle: "رابط حجز التدقيق التشغيلي",
      reservePrefix: "حجز وتسجيل",
      officerName: "اسم المسؤول التشغيلي بالشركة",
      corpEmail: "البريد الإلكتروني للعمل للمؤسسات",
      targetAssetName: "اسم المحطة أو الأصول التشغيلية",
      selectedCapacity: "القدرة الاستيعابية المخططة (ميجاوات)",
      modalBtn: "تأكيد وتشغيل محاكاة الشبكة الفورية",
      modalDisclaimer: "💡 إرسال هذا الحجز يتجاوز قيود الاتصال البطيء ويقوم بإنشاء تقرير تحليل ذروة الشبكة العمانية فورياً.",
      compiling: "جاري تصنيف تحليلات الشبكة الاستباقية..."
    }
  };

  const t = translations[locale];

  // Drag and drop events
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

  // Run mock physical math model for audit computation (OMR target rates)
  const handleCalculateAudit = (customData?: AuditInput) => {
    setIsAuditing(true);
    setAuditProgress(locale === 'EN' ? 'Ingesting dispatch telemetry profiles...' : 'جاري سحب عينات تليمتري التشغيل...');
    
    const targetData = customData || formData;
    
    setTimeout(() => {
      setAuditProgress(locale === 'EN' ? 'Reconstructing OPWP spot price matrices for Oman Grid...' : 'جاري بناء مصفوفات الأسعار الفورية لـ OPWP...');
      
      setTimeout(() => {
        setAuditProgress(locale === 'EN' ? 'Simulating battery charge-discharge degradation wear curve differentials...' : 'جاري محاكاة تآكل وتدهور أقطاب خلايا البطارية الحركية...');
        
        setTimeout(() => {
          setAuditProgress(locale === 'EN' ? 'Compiling executive optimization roadmap...' : 'جاري تجميع مخرجات خارطة الطريق وتأثير موازنة الأرباح...');
          
          setTimeout(() => {
            const cap = targetData.capacityMW;
            const hours = targetData.annualOpHours;
            const tariff = targetData.gridTariffUSD; // grid tariff in OMR/MWh

            // Calculations computed natively in Omani Rials (OMR)
            const totalEstRevenueOMR = cap * hours * (tariff / 1000) * 0.95; 
            const leakagePercentage = targetData.assetType === 'BESS' ? 0.16 : (targetData.assetType === 'HYBRID' ? 0.13 : 0.11);
            
            const computedLeakageOMR = Math.round(totalEstRevenueOMR * leakagePercentage);
            const computedPotentialOMR = Math.round(totalEstRevenueOMR * (1 + (leakagePercentage * 0.45)));
            // Can recover 85% with PREDAIOT
            const computedSavingsOMR = Math.round(computedLeakageOMR * 0.85);

            const delayedValueOMR = Math.round(computedLeakageOMR * 0.45);
            const rampValueOMR = Math.round(computedLeakageOMR * 0.20);
            const socDriftValueOMR = Math.round(computedLeakageOMR * 0.20);
            const untrackedOutagesValueOMR = Math.round(computedLeakageOMR * 0.15);

            setAuditResult({
              efficiencyScore: Math.round(100 - (leakagePercentage * 100)),
              // Hack to conform to native type structure, storing OMR value directly 
              leakageUSD: computedLeakageOMR,
              potentialRevenueUSD: computedPotentialOMR,
              recoveredValueUSD: computedSavingsOMR,
              breakdown: {
                delayedDispatch: delayedValueOMR,
                rampRateFine: rampValueOMR,
                socDrift: socDriftValueOMR,
                untrackedOutages: untrackedOutagesValueOMR
              },
              recommendations: locale === 'EN' ? [
                `Rescale battery bidding window to 04:00-07:00 to reduce ancillary circle wear degradation.`,
                `Leverage PREDAIOT dual solar-clipper storage limits to capture midday dispatch bypass.`,
                `Deploy continuous automatic loop feedback under OPWP Spot pool to avoid high ramp state rate penalties.`,
                `Synchronize dispatch algorithms with thermal limits of transmission gates leading to Muscat East substation.`
              ] : [
                `إعادة جدولة نافذة شحن البطاريات للفترة 04:00-07:00 لتقليل التآكل الكيميائي للأقطاب خلال ذروة الصباح.`,
                `الاستفادة من خوارزميات PREDAIOT في موازاة الطاقة الشمسية الفائضة مع ساعات التصريف اللحظية المناسبة.`,
                `تشغيل حلقة تصحيح التنبؤ الفوري لتجنب غرامات الاستجابة الطارئة بموجب هيكلة OPWP للتشغيل الصباحي.`,
                `مزامنة خوارزميات التصريف مع السعة الحرارية القصوى للمحولات الرئيسية المتصلة بمحطة مسقط الكبرى.`
              ]
            });
            setIsAuditing(false);
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  const downloadMockAudit = () => {
    // Printable executive audit report text and download 
    const reportText = `
PREDAIOT ECONOMIC INTELLIGENCE LABS (OMAN OFFICE)
===================================================
EXECUTIVE AUDIT SUMMARY FOR: ${formData.assetName.toUpperCase()}
Location: ${formData.country}
Capacity: ${formData.capacityMW} MW
Computed Tariff Basis: ${formData.gridTariffUSD} OMR / MWh (~$${Math.round(formData.gridTariffUSD * 2.6)} USD / MWh)
Published methodology — PREDAIOT, Oman National Open Data Portal Use Case, June 2026
---------------------------------------------------
CORE OUTCOMES:
Economic Decision Efficiency Score: ${auditResult?.efficiencyScore}% (Target Optimization Bound: 91%)
Estimated Annual Economic Leakage: ${auditResult?.leakageUSD.toLocaleString()} OMR
Potential Recoverable Margin: ${auditResult?.recoveredValueUSD.toLocaleString()} OMR (+12.5% Profit Surge with zero CAPEX)
---------------------------------------------------
LEAKAGE LOSS BREAKDOWN SPECS:
- Delay dispatch loss under Spot Market: ${auditResult?.breakdown.delayedDispatch.toLocaleString()} OMR
- Ramp-rate ancillary penalties & spikes: ${auditResult?.breakdown.rampRateFine.toLocaleString()} OMR
- SoC drift chemistry wear rate indices: ${auditResult?.breakdown.socDrift.toLocaleString()} OMR
- Untracked minor SCADA out-of-bounds: ${auditResult?.breakdown.untrackedOutages.toLocaleString()} OMR

RECOMMENDED MINIMAL ROADMAP DIRECTIVES:
${auditResult?.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
===================================================
Contact: secure@predaiot.ai | Muscat, Oman
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PREDAIOT_${formData.assetName.replace(/\s+/g, '_')}_Oman_Audit.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#050505] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans" id="predaiot-audit-view">
      <div className="mx-auto max-w-7xl">
        
        {/* Head Area */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 animate-fade-in font-sans">
          <span className="font-mono text-xs uppercase text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.05)] font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {t.subBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.mainTitle}
          </h1>
          <p className="text-xs sm:text-xs text-white/50 leading-relaxed max-w-2xl mx-auto">
            {t.mainDesc}
          </p>
        </div>

        {/* Input Sandbox form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20 pb-12 font-sans">
          
          <div className="lg:col-span-5 bg-[#050505] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-emerald-950/20 rounded-full blur-[80px] pointer-events-none"></div>
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4 flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              <span>{t.assetTitle}</span>
            </h3>

            <div>
              <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider">{t.assetNameLabel}</label>
              <input 
                type="text" 
                value={formData.assetName}
                onChange={(e) => setFormData({...formData, assetName: e.target.value})}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white uppercase font-mono tracking-wide focus:border-emerald-500/50 focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider">{t.assetTypeLabel}</label>
                <select
                  value={formData.assetType}
                  onChange={(e) => setFormData({...formData, assetType: e.target.value as any})}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                >
                  <option value="SOLAR" className="bg-[#050505] text-white">{locale === 'EN' ? 'Solar PV Station' : 'محطة طاقة شمسية'}</option>
                  <option value="WIND" className="bg-[#050505] text-white">{locale === 'EN' ? 'Wind Infrastructure' : 'محطة طاقة رياح'}</option>
                  <option value="BESS" className="bg-[#050505] text-white">{locale === 'EN' ? 'BESS Storage Block' : 'بطاريات تخزين BESS'}</option>
                  <option value="HYBRID" className="bg-[#050505] text-white">{locale === 'EN' ? 'PV + Hybrid Storage' : 'شمسية + تخزين هجين'}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider">{t.capacityLabel}</label>
                <input 
                  type="number" 
                  value={formData.capacityMW}
                  onChange={(e) => setFormData({...formData, capacityMW: Number(e.target.value)})}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider">{t.tariffLabel}</label>
                <input 
                  type="number" 
                  value={formData.gridTariffUSD}
                  onChange={(e) => setFormData({...formData, gridTariffUSD: Number(e.target.value)})}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider">{t.hoursLabel}</label>
                <input 
                  type="number" 
                  value={formData.annualOpHours}
                  onChange={(e) => setFormData({...formData, annualOpHours: Number(e.target.value)})}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                />
              </div>
            </div>

            {/* Usability Drag & Drop area */}
            <div>
              <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider">{t.uploadLabel}</label>
              
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onUploadClick}
                className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  dragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-white/2 hover:bg-white/5'
                }`}
                id="telemetry-upload-container"
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept=".csv,.xlsx,.txt" 
                  onChange={handleFileChange}
                />
                <FileUp className="h-6 w-6 text-white/40 mb-2 group-hover:text-emerald-400" />
                
                {uploadedFile ? (
                  <div className="text-center font-sans">
                    <p className="text-xs text-emerald-400 font-mono font-bold">{uploadedFile}</p>
                    <p className="text-[10px] text-white/40 mt-1">{locale === 'EN' ? 'Ready for mathematical calculation' : 'الملف جاهز الآن للتحليل والمعايرة الرياضية'}</p>
                  </div>
                ) : (
                  <div className="font-sans">
                    <p className="text-xs text-slate-300 font-medium">{t.uploadPlh}</p>
                    <p className="text-[9px] text-white/30 mt-1">{t.uploadSub}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={() => handleCalculateAudit()}
              disabled={isAuditing}
              className="w-full rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050505] py-3.5 text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
              id="run-audit-btn"
            >
              {isAuditing ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border border-slate-950 border-t-transparent animate-spin" />
                  <span>{t.executing}</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{t.executeBtn}</span>
                </>
              )}
            </button>
          </div>

          {/* Audit Results section */}
          <div className="lg:col-span-7 bg-white/2 border border-white/10 rounded-3xl p-6 min-h-[460px] flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-sm">
            <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-emerald-950/10 rounded-full blur-[80px] pointer-events-none"></div>
            <span className="absolute top-5 right-6 text-[9px] font-mono uppercase tracking-widest text-[#34d399] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
              {t.resultsBadge}
            </span>

            {!isAuditing && !auditResult ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-16 my-auto text-center font-sans">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">{t.awaitingTitle}</h4>
                <p className="text-xs text-white/40 max-w-sm leading-relaxed">
                  {t.awaitingDesc}
                </p>
              </div>
            ) : isAuditing ? (
              <div className="flex flex-col items-center justify-center h-full space-y-5 py-16 my-auto font-sans">
                <div className="relative h-14 w-14 text-emerald-400">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/20 opacity-75 animate-ping" />
                  <div className="h-14 w-14 rounded-full border border-emerald-500 border-t-transparent animate-spin" />
                </div>
                <div className="text-center font-mono space-y-2">
                  <p className="text-xs text-white uppercase font-bold tracking-widest animate-pulse">{t.runningTitle}</p>
                  <p className="text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 max-w-xs mx-auto text-center">{auditProgress}</p>
                </div>
              </div>
            ) : (
              // Successful Result
              <div className="space-y-6 font-sans select-none" id="audit-results-panel">
                <div className="border-b border-white/10 pb-4">
                  <h4 className="text-[10px] text-white/40 font-mono uppercase tracking-wider">{t.reportTitle}</h4>
                  <h3 className="text-xl font-bold text-white uppercase font-mono tracking-tight mt-1">{formData.assetName}</h3>
                </div>

                {/* Score dials */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#050505] p-4 rounded-2xl border border-white/10">
                    <span className="text-[9px] text-white/40 block uppercase font-mono tracking-wider">{t.ratingLabel}</span>
                    <div className="text-3xl font-mono font-bold text-amber-500 mt-1">{auditResult?.efficiencyScore}%</div>
                    <span className="text-[9px] text-white/30 block mt-1 font-sans">
                      {locale === 'EN' ? `Leakage gap: ${100 - (auditResult?.efficiencyScore || 0)}%` : `فجوة التسريب: ${100 - (auditResult?.efficiencyScore || 0)}%`}
                    </span>
                  </div>
                  <div className="bg-[#050505] p-4 rounded-2xl border border-white/10 animate-pulse">
                    <span className="text-[9px] text-red-400 block uppercase font-mono tracking-wider font-bold">{t.leakageLabel}</span>
                    <div className="text-2.5xl font-mono font-bold text-white mt-1">
                      {auditResult?.leakageUSD.toLocaleString()} <span className="text-xs text-white/40">OMR</span>
                    </div>
                    <span className="text-[9px] text-white/30 block mt-1 font-sans">
                      {locale === 'EN' ? `equivalent to ~$${Math.round((auditResult?.leakageUSD || 0) * 2.6).toLocaleString()} USD` : `ما يعادل مالي حوالي ~$${Math.round((auditResult?.leakageUSD || 0) * 2.6).toLocaleString()} دولار`}
                    </span>
                  </div>
                  <div className="bg-[#050505] p-4 rounded-2xl border border-white/10">
                    <span className="text-[9px] text-emerald-400 block uppercase font-mono tracking-wider font-bold">{t.recoverableLabel}</span>
                    <div className="text-2.5xl font-mono font-bold text-emerald-400 mt-1">
                      +{auditResult?.recoveredValueUSD.toLocaleString()} <span className="text-xs">OMR</span>
                    </div>
                    <span className="text-[9px] text-white/30 block mt-1 font-sans">
                      {locale === 'EN' ? `equivalent to ~$${Math.round((auditResult?.recoveredValueUSD || 0) * 2.6).toLocaleString()} USD` : `ما يعادل مالي حوالي ~$${Math.round((auditResult?.recoveredValueUSD || 0) * 2.6).toLocaleString()} دولار`}
                    </span>
                  </div>
                </div>

                {/* Breakdown structure */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                    {locale === 'EN' ? 'Leakage Breakdown Variables (OMR):' : 'تفاصيل متغيرات الهدر المالي (ريال عماني):'}
                  </h5>
                  <div className="space-y-2 text-[11px] font-mono">
                    <div className="flex justify-between p-3 bg-white/2 rounded-xl border border-white/10">
                      <span className="text-white/60">✗ {locale === 'EN' ? 'Delayed dispatch during grid peaks:' : 'تأخير التصريف التشغيلي عن نافذة الذروة SMP:'}</span>
                      <span className="text-white font-bold">{auditResult?.breakdown.delayedDispatch.toLocaleString()} OMR</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/2 rounded-xl border border-white/10">
                      <span className="text-white/60">✗ {locale === 'EN' ? 'Ramp-rate power penalties:' : 'مخالفات وغرامات التغير السريع للجهد Ramp-Rate:'}</span>
                      <span className="text-white font-bold">{auditResult?.breakdown.rampRateFine.toLocaleString()} OMR</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/2 rounded-xl border border-white/10">
                      <span className="text-white/60">✗ {locale === 'EN' ? 'Charging window chemistry deterioration:' : 'تآكل وتدهور الخلايا أثناء ساعات الشحن الخاطئ:'}</span>
                      <span className="text-white font-bold">{auditResult?.breakdown.socDrift.toLocaleString()} OMR</span>
                    </div>
                  </div>
                </div>

                {/* Audit recommendations */}
                <div className="space-y-2.5 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
                  <span className="text-[10px] text-[#34d399] uppercase font-bold tracking-widest flex items-center space-x-1.5 font-mono">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                    <span>{t.directivesTitle}</span>
                  </span>
                  <ul className="space-y-1.5 my-2">
                    {auditResult?.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-xs text-white/70 flex items-start space-x-2 leading-relaxed">
                        <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions banner */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                  <button
                    onClick={downloadMockAudit}
                    className="w-full sm:flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-full text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer transition-all"
                  >
                    <Download className="h-4 w-4 text-emerald-400" />
                    <span>{t.downloadReport}</span>
                  </button>
                  <a
                    href="mailto:secure@predaiot.ai?subject=PREDAIOT%20Economic%20Audit%20Inquiry"
                    className="w-full sm:flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#050505] py-3 rounded-full text-xs font-bold text-center block transition-all shadow-[0_4px_15px_rgba(16,185,129,0.25)]"
                  >
                    {t.discussBtn}
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Dynamic packages */}
        <div className="border-t border-white/10 pt-16 font-sans" id="packages-section">
          <div className="text-center space-y-2 mb-12">
            <h3 className="text-3xl font-bold tracking-tight text-white">{t.chooseTitle}</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">{t.chooseDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Starter Package / Economic Audit */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/2 relative flex flex-col justify-between h-[410px] hover:border-white/20 transition-all">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#34d399] bg-[#050505] px-2.5 py-1 rounded-full border border-white/10 font-bold">
                  {t.tier1Name}
                </span>
                <div className="mt-5 flex items-baseline space-x-1">
                  <span className="text-2.5xl font-mono font-bold text-white">{t.tier1Price}</span>
                </div>
                <p className="text-[10px] text-white/40 font-mono text-xs uppercase tracking-wider font-semibold mt-1">{t.tier1SubUSD}</p>
                <p className="text-[10px] text-[#34d399] mt-2 font-mono uppercase tracking-wider font-bold">{t.tier1Subtitle}</p>
                
                <ul className="mt-5 space-y-2.5 text-xs text-white/50">
                  <li className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{locale === 'EN' ? 'Complete 1-year historical SCADA scan' : 'فحص تليمتري SCADA التاريخي الكامل لعام'}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{locale === 'EN' ? 'Reconstruct OPWP price matrices leaks' : 'إعادة بناء فجوات مصفوفة أسعار شبكة عمان'}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{locale === 'EN' ? 'Actionable dispatch correction roadmap' : 'خارطة طريق إصلاح تصريف أصول للتوليد'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedTier(t.tier1Name);
                  setBookingAsset(locale === 'EN' ? 'Manah-1 Solar PV' : 'محطة منح-1 للطاقة الشمسية');
                  setBookingCapacity(500);
                  setBookingName('');
                  setBookingEmail('');
                  setIsBookingOpen(true);
                }}
                className="w-full text-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 py-2.5 rounded-full text-xs font-semibold text-white block transition-all cursor-pointer"
              >
                {t.btnBook}
              </button>
            </div>

            {/* Professional Package / Continuous Pilot */}
            <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 relative flex flex-col justify-between h-[410px] shadow-[0_10px_35px_rgba(16,185,129,0.1)]">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-[#050505] text-[8px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                {locale === 'EN' ? 'Live Pilot' : 'التجريب التفاعلي المباشر'}
              </span>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#34d399] bg-[#050505] px-2.5 py-1 rounded-full border border-emerald-500/25 font-bold">
                  {t.tier2Name}
                </span>
                <div className="mt-5 flex items-baseline space-x-1">
                  <span className="text-2xl font-mono font-bold text-white">{t.tier2Price}</span>
                </div>
                <p className="text-[10px] text-white/40 font-mono text-xs uppercase tracking-wider font-semibold mt-1">{t.tier2SubUSD}</p>
                <p className="text-[10px] text-emerald-400 mt-2 font-mono uppercase tracking-wider font-bold">{t.tier2Subtitle}</p>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                    <span>{locale === 'EN' ? 'Up to 3 assets full live dispatch ingestion' : 'دمج تليمتري حي مباشر لما يصل لـ 3 محطات'}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{locale === 'EN' ? 'Continuous direct pricing over-rides' : 'إقران مستمر لتعديل عطلات ومزايدات الأسعار الرسمية'}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{locale === 'EN' ? '1-Day executive delivery boardroom summary' : 'عرض تقديمي شامل بالمجلس والاستشارة الفنية'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedTier(t.tier2Name);
                  setBookingAsset(locale === 'EN' ? 'Ibri-II Solar Field' : 'محطة عبري-2 الكبرى للطاقة الشمسية');
                  setBookingCapacity(500);
                  setBookingName('');
                  setBookingEmail('');
                  setIsBookingOpen(true);
                }}
                className="w-full text-center bg-emerald-500 hover:bg-emerald-400 py-3 rounded-full text-xs font-bold text-[#050505] block transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)] cursor-pointer"
              >
                {t.btnPilot}
              </button>
            </div>

            {/* Enterprise Package / Performance Gain Share */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/2 relative flex flex-col justify-between h-[410px] hover:border-white/20 transition-all">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#34d399] bg-[#050505] px-2.5 py-1 rounded-full border border-white/10 font-bold">
                  {t.tier3Name}
                </span>
                <div className="mt-5 flex items-baseline space-x-1">
                  <span className="text-2.5xl font-mono font-bold text-white">{t.tier3Price}</span>
                </div>
                <p className="text-[10px] text-white/40 font-mono text-xs uppercase tracking-wider font-semibold mt-1">{t.tier3SubUSD}</p>
                <p className="text-[10px] text-sky-450 mt-2 font-mono uppercase tracking-wider font-bold">{t.tier3Subtitle}</p>

                <ul className="mt-5 space-y-2.5 text-xs text-white/50">
                  <li className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{locale === 'EN' ? 'Zero upfront software or license Capex' : 'صفر ريال عماني رسوم اشتراكات أو برمجيات مسبقة'}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{locale === 'EN' ? 'We only margin-earn on verified incremental value' : 'نربح نسبة فقط من الهدر المسترد والمثبت تقنياً'}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{locale === 'EN' ? 'Oman PDPL compliance guaranteed' : 'الامتثال لقوانين حماية خصوصية الأصول العمانية'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSelectedTier(t.tier3Name);
                  setBookingAsset(locale === 'EN' ? 'Muscat Utility Asset C' : 'الشركة الوطنية العمانية لنقل الكهرباء - محطة ج');
                  setBookingCapacity(1200);
                  setBookingName('');
                  setBookingEmail('');
                  setIsBookingOpen(true);
                }}
                className="w-full text-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 py-2.5 rounded-full text-xs font-semibold text-white block transition-all cursor-pointer"
              >
                {t.btnShare}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 1. Success Banner */}
      {successBanner && (
        <div className="fixed bottom-8 right-8 z-55 w-full max-w-xl px-4 animate-fade-in font-sans">
          <div className="bg-emerald-500 text-slate-950 px-6 py-4 rounded-2xl shadow-2xl flex items-start space-x-3 border border-emerald-400">
            <Sparkles className="h-5 w-5 text-slate-950 flex-shrink-0 mt-0.5 animate-bounce" />
            <div className="text-xs flex-grow">
              <p className="font-bold uppercase tracking-wider text-[10px]">{locale === 'EN' ? 'SCADA Telemetry Sweep Active' : 'تنشيط دمج وبحث تليمتري SCADA المباشر'}</p>
              <p className="mt-1 font-medium text-slate-900 leading-relaxed">{successBanner}</p>
            </div>
            <button onClick={() => setSuccessBanner(null)} className="font-bold text-slate-900 hover:opacity-80 pl-2 text-md leading-none">&times;</button>
          </div>
        </div>
      )}

      {/* 2. Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden font-sans">
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-emerald-950/15 rounded-full blur-[90px] pointer-events-none"></div>

            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#34d399] font-bold bg-[#050505] border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  {t.reserveTitle}
                </span>
                <h3 className="text-sm font-bold text-white mt-2 font-sans">
                  {t.reservePrefix} - {selectedTier}
                </h3>
              </div>
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="text-white/40 hover:text-white font-bold text-lg p-2 hover:bg-white/5 rounded-full h-8 w-8 flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setIsSubmittingBooking(true);
              setTimeout(() => {
                setIsSubmittingBooking(false);
                setIsBookingOpen(false);
                
                const resolvedInput = {
                  assetName: bookingAsset,
                  assetType: 'BESS' as any,
                  capacityMW: bookingCapacity,
                  annualOpHours: 8760,
                  country: 'Oman',
                  gridTariffUSD: formData.gridTariffUSD
                };
                setFormData(resolvedInput);
                handleCalculateAudit(resolvedInput);

                setSuccessBanner(
                  locale === 'EN' 
                    ? `Live diagnostic sweep compiled instantly! Custom audit parameters for "${bookingAsset.toUpperCase()}" (${bookingCapacity} MW) have been processed under regional OPWP spot rules. You can now download the generated economic roadmap logs below.`
                    : `اكتمل المسح والربط التشخيصي المباشر! جاري تحليل مدخلات الأصول لـ "${bookingAsset.toUpperCase()}" بقدرة (${bookingCapacity} ميجاوات) بموجب الأسعار الفورية للشبكة العمانية. بإمكانك تحميل خلاصة خارطة الطريق وتقرير القرارات فورياً الآن في الأسفل.`
                );
                setTimeout(() => setSuccessBanner(null), 10000);
              }, 1200);
            }} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider font-bold">{t.officerName}</label>
                  <input 
                    type="text" 
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-sans"
                    placeholder="e.g. Salim Al Harthy"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider font-bold">{t.corpEmail}</label>
                  <input 
                    type="email" 
                    required
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono"
                    placeholder="salim@oman-energy.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider font-bold">{t.targetAssetName}</label>
                <input 
                  type="text" 
                  required
                  value={bookingAsset}
                  onChange={(e) => setBookingAsset(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono"
                  placeholder="e.g. Ibri PV Solar Facility"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/40 block mb-1 uppercase font-mono tracking-wider font-bold">{t.selectedCapacity}: {bookingCapacity} MW</label>
                <input 
                  type="range" 
                  min="10" 
                  max="1500" 
                  step="10"
                  value={bookingCapacity}
                  onChange={(e) => setBookingCapacity(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-white/10 rounded-full cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-[10px] text-emerald-300 leading-relaxed font-sans">
                {t.modalDisclaimer}
              </div>

              <button
                type="submit"
                disabled={isSubmittingBooking}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#050505] font-bold py-3 rounded-full text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer font-sans shadow-[0_4px_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
              >
                {isSubmittingBooking ? (
                  <>
                    <div className="h-3 w-3 rounded-full border border-slate-950 border-t-transparent animate-spin" />
                    <span>{t.compiling}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>{locale === 'EN' ? 'Verify & Run Live Simulation' : 'تأكيد وحساب محاكاة الأرباح'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
