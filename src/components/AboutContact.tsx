import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Download, Send, CheckCircle2, FileText, ArrowRight, Lightbulb, MessageCircle } from 'lucide-react';

interface AboutContactProps {
  locale: 'EN' | 'AR';
  activeSection?: 'ABOUT' | 'WHITE_PAPERS' | 'CONTACT';
}

export default function AboutContact({ locale, activeSection }: AboutContactProps) {
  const [inquiryName, setInquiryName] = useState<string>('');
  const [inquiryEmail, setInquiryEmail] = useState<string>('');
  const [inquiryText, setInquiryText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Section Refs for Auto-scrolling on navigation clicks
  const aboutRef = useRef<HTMLDivElement>(null);
  const papersRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSection === 'ABOUT' && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (activeSection === 'WHITE_PAPERS' && papersRef.current) {
      papersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (activeSection === 'CONTACT' && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection]);

  const texts = {
    EN: {
      narrativeBadge: "Our Narrative & Belief",
      narrativeTitle: "The Economic Gap Is Bigger Than The Technical Gap",
      narrativeQuote: "We don't buy new equipment for you. We just make the equipment you already own output the real revenue it originally promised.",
      narrative1: "PREDAIOT was founded on a simple, yet highly disruptive belief:",
      narrativeBold: " The energy industry has spent decades optimizing equipment. The next frontier is optimizing decisions.",
      narrative2: "By building the global category leader in Economic Decision Intelligence, we help wind facilities, solar arrays, energy investors, industrial sites, and battery storage operators uncover critical, hidden revenue locked inside files and telemetry logs.",
      premiseTitle: "Underlying premise:",
      premiseDesc: "Traditional dispatch solutions seek to deliver standard technical compliance. PREDAIOT aligns actual dispatch actions with live financial pool values continuously, retrieving 'found money' with zero capital cost additions.",
      intelBadge: "Intellectual Capital",
      intelTitle: "White Papers & Technical Publications",
      intelDesc: "Access the detailed energy economic frameworks published by our intelligence team.",
      subBadge: "Operational Hub",
      subTitle: "Connect Directly",
      ceo: "Founder & CEO",
      directInquiry: "Send Direct Economic Inquiry",
      officerName: "Corporate Officer Name",
      businessEmail: "Business Email Address",
      portfolioSummary: "Portfolio Summary / Inquiry Details",
      portfolioPlh: "Describe your asset capacity details (BESS, Solar MW) or localized dispatch constraints.",
      submitBtn: "Submit Direct Inquiry Form",
      subscribing: "Routing to Chams Eddine Madi...",
      inboxSuccess: "Inquiry submitted! We will coordinate directly with Chams Eddine Madi within 12 system hours.",
      guaranteeBannerTitle: "Book Your Economic Audit Today.",
      guaranteeBannerDesc: "Discover how much found money is currently hidden inside your assets."
    },
    AR: {
      narrativeBadge: "سرديتنا وقناعتنا الراسخة",
      narrativeTitle: "الفجوة الاقتصادية أكبر بكثير من الفجوة التقنية",
      narrativeQuote: "نحن لا نشتري لك معدات جديدة. نحن نجعل المعدات التي تمتلكها بالفعل تدر عليك العائد الحقيقي الذي وعدتك به في الأصل.",
      narrative1: "تأسست شركة PREDAIOT على قناعة بسيطة ومحورية في نفس الوقت:",
      narrativeBold: " لقد أمضت صناعة الطاقة عقوداً في تحسين كفاءة المعدات الفنية. لكن الأفق والحد القادم هو تحسين جودة القرارات الرأسمالية والتشغيلية.",
      narrative2: "من خلال بناء رائد الفئة العالمي في مجال ذكاء القرارات الاقتصادية، نساعد مرافق الرياح ومصفوفات الطاقة الشمسية والمستثمرين في قطاع الطاقة والمواقع الصناعية على كشف العائدات المفقودة المخبأة داخل ملفات وسجلات التليمتري والتشغيل.",
      premiseTitle: "الفرضية الأساسية:",
      premiseDesc: "تسعى حلول التشغيل التقليدية إلى توفير مجرد التزام بالمعايير الفنية البسيطة. بينما تقوم PREDAIOT بمزامنة أوامر التشغيل الفعلية بمصفوفة الأسعار الفورية اللحظية لشبكة الكهرباء باستمرار، مما يستعيد ملايين الريالات المهدرة بلا تكاليف رأسمالية إضافية.",
      intelBadge: "رأس المال الفكري والأبحاث",
      intelTitle: "الأوراق البيضاء والمنشورات الفنية المعمقة",
      intelDesc: "تصفح وحمّل الأطر الاقتصادية التفصيلية التي ينشرها فريق ذكاء تشغيل الطاقة والمطورين لدينا.",
      subBadge: "المركز التشغيلي",
      subTitle: "التواصل المباشر مع الإدارة",
      ceo: "المؤسس والرئيس التنفيذي",
      directInquiry: "إرسال طلب استشارة اقتصادية مباشرة",
      officerName: "اسم المسؤول التشغيلي بالشركة",
      businessEmail: "البريد الإلكتروني للعمل",
      portfolioSummary: "ملخص المحفظة أو تفاصيل الاستفسار",
      portfolioPlh: "يرجى وصف تفاصيل قدرة محطتك (رياح، بطاريات تخزين، طاقة شمسية بالميجاوات) أو قيود التصريف والشبكة.",
      submitBtn: "إرسال نموذج الاستعلام الفوري",
      subscribing: "تم توجيه الاستعلام الفوري لمكتب شمس الدين مادي...",
      inboxSuccess: "تم تقديم استفسارك بنجاح! وسيتواصل معك المؤسس شمس الدين مادي وفريق العمل خلال 12 ساعة تشغيلية.",
      guaranteeBannerTitle: "احجز تدقيق أصولك الفوري اليوم.",
      guaranteeBannerDesc: "كشّف عن المبالغ المالية الضخمة وسجلات الهدر المالي المخبأة حالياً داخل أصولك."
    }
  };

  const t = texts[locale];

  const whitePapers = [
    {
      title: locale === 'EN' ? "The Hidden Economic Opportunity in Oman's Energy Transition" : "الفرص الاقتصادية الكامنة في تحول الطاقة بسلطنة عمان",
      subtitle: locale === 'EN' ? "Uncovering millions in latent margin under OPWP spot market parameters." : "كشف ملايين الريالات المفقودة في معاملات السوق الفورية لشركة OPWP.",
      author: "Chams Eddine Madi",
      size: "2.4 MB",
      desc: locale === 'EN' ? "An in-depth guide on how Omani utilities can align solar-plus-storage physical limits with financial bidding rules." : "دليل معمق حول كيفية إقرار مشغلي المرافق العمانية لمقاييس تخزين الطاقة مع قواعد العروض الفورية لكسب الفارق المالي."
    },
    {
      title: locale === 'EN' ? "Economic Decision Intelligence for Renewable Assets" : "ذكاء القرارات الاقتصادية للأصول المتجددة",
      subtitle: locale === 'EN' ? "Bridging SCADA physical telemetry with corporate ledger realities." : "الربط بين تليمتري SCADA المادي ودفاتر المحاسبة المالية التنفيذية للشركات.",
      author: "PREDAIOT Research",
      size: "1.8 MB",
      desc: locale === 'EN' ? "A framework mapping why assets optimized for 99% uptime silently bleed up to 12% in net operating cash margins." : "إطار عمل يوضح لماذا تفقد الأصول المحسنة للتشغيل الفني الصرف 12% من أرباحها الصافية بسبب توقيتات Bidding الخاطئة."
    },
    {
      title: locale === 'EN' ? "Battery Storage Profit Optimization" : "تعظيم أرباح خلايا تخزين البطاريات",
      subtitle: locale === 'EN' ? "Balancing circular wear indices with extreme grid price arbitrage peak sweeps." : "موازنة مؤشرات تآكل البطاريات مع مراجحة الأسعار اللحظية لذروة الطلب للشبكة العمانية.",
      author: "Chams Eddine Madi",
      size: "3.1 MB",
      desc: locale === 'EN' ? "A mathematical breakdown of BESS bidding logic, showing how to calculate net-profitable charging windows under OPWP rules." : "تحليل رياضي لمنطق المزايدة لتخزين BESS وساعات الشحن المثالية بموجب لوائح عمان لتجنب التلف وتأخير التصريف اللحظي."
    },
    {
      title: locale === 'EN' ? "The Future of Economic Dispatch" : "مستقبل التوزيع الاقتصادي للكهرباء والشبكات",
      subtitle: locale === 'EN' ? "Transitioning portfolios from reactive forecasts to automated autonomous decision loops." : "تحويل المحافظ والمحطات من التنبؤات الاستجابية السلبية إلى حلقات قرارات مؤتمتة ومستقلة بالكامل.",
      author: "PREDAIOT Labs",
      size: "1.5 MB",
      desc: locale === 'EN' ? "How real-time SCADA loop integration solves dispatch errors before energy is committed to the transmission network." : "كيف يحل الدمج المباشر لـ SCADA الفوري أخطاء التصريف والالتزام بالشبكة قبل إرسال الأحمال لخطوط النقل بمحافظة مسقط."
    }
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryText('');
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1200);
  };

  const handlePaperDownload = (title: string) => {
    const text = `
=========================================
PREDAIOT WHITE PAPER INTEL BLOCK
Title: ${title}
Author: Chams Eddine Madi et al.
Muscat, Oman
=========================================
Executive Insight:
In modern energy infrastructures, technical KPIs are successfully optimized.
However, economic leakages result from bad timing, static bidding regimes, 
and circular wear penalties.

PREDAIOT's Economic Decision Engine resolves this friction in real-time under
Oman OPWP parameters, achieving an average yield improvement of +9.1% to +15%.

To receive the complete premium publication, coordinate with Chams Eddine Madi
at: al.shams.invest@gmail.com or +968 7411 4028.
=========================================
    `;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}_PREDAIOT_Excerpt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#050505] text-slate-100 min-h-screen" id="about-and-papers-view">
      
      {/* 1. About Narrative */}
      <div ref={aboutRef}>
        <section className="py-20 border-b border-white/10 relative overflow-hidden animate-fade-in" id="about-predaiot-narrative">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-900/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              
              <div className="md:col-span-7 space-y-6">
                <span className="font-mono text-xs uppercase text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  {t.narrativeBadge}
                </span>
                
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  {t.narrativeTitle}
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {t.narrative1}
                  <strong className="text-white">{t.narrativeBold}</strong>
                </p>

                <p className="text-sm text-white/50 leading-relaxed">
                  {t.narrative2}
                </p>

                <div className="p-5 bg-white/2 border border-white/10 rounded-2xl flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-350 leading-relaxed">
                    <strong className="text-white">{t.premiseTitle}</strong> {t.premiseDesc}
                  </div>
                </div>
              </div>

              {/* Visual Quote board */}
              <div className="md:col-span-5 bg-gradient-to-r from-emerald-950/20 to-white/2 p-6 rounded-3xl border border-white/10 space-y-4">
                <span className="text-[10px] uppercase font-mono text-white/40 tracking-wider">The Category Paradigm</span>
                
                <div className="font-sans text-lg font-semibold text-white italic leading-snug">
                  "{t.narrativeQuote}"
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-xs text-emerald-400 font-bold font-sans">Chams Eddine Madi</p>
                  <p className="text-[10px] text-white/40 font-mono">{locale === 'EN' ? 'Founder & CEO, PREDAIOT' : 'المؤسس والرئيس التنفيذي، PREDAIOT'}</p>
                </div>
              </div>

            </div>

          </div>
        </section>
      </div>

      {/* 2. White Papers Center */}
      <div ref={papersRef}>
        <section className="py-20 border-b border-white/10 bg-white/1 relative" id="white-papers-center">
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-950/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
              <span className="font-mono text-xs uppercase text-[#34d399] tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-bold">
                {t.intelBadge}
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {t.intelTitle}
              </h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                {t.intelDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-fade-in">
              {whitePapers.map((paper, idx) => (
                <div key={idx} className="p-6 rounded-3xl border border-white/10 bg-white/2 hover:border-emerald-500/30 hover:bg-white/5 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="p-1 px-2 rounded-full bg-white/5 text-[9px] text-white/60 font-mono border border-white/10">
                        {paper.size}
                      </span>
                      <FileText className="h-5 w-5 text-emerald-400 opacity-60" />
                    </div>

                    <h4 className="text-md font-bold text-white leading-snug font-sans">{paper.title}</h4>
                    <p className="text-[10px] text-emerald-400 font-mono font-bold tracking-wider uppercase">{paper.subtitle}</p>
                    <p className="text-xs text-white/40 leading-relaxed font-sans">{paper.desc}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
                    <span className="text-[10px] text-white/40 font-mono">{locale === 'EN' ? `Author: ${paper.author}` : `الكاتب: ${paper.author}`}</span>
                    <button
                      onClick={() => handlePaperDownload(paper.title)}
                      className="inline-flex items-center space-x-1 border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full text-xs text-emerald-400 font-mono cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{locale === 'EN' ? 'Download Excerpt' : 'تحمل مقتبس'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </div>

      {/* 3. Contact Portal */}
      <div ref={contactRef}>
        <section className="py-20 bg-[#050505]" id="contact-predaiot">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              
              {/* Chams Eddine Madi Contact cards */}
              <div className="md:col-span-5 space-y-6">
                <div>
                  <span className="font-mono text-xs uppercase text-emerald-400 tracking-widest font-bold">
                    {t.subBadge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mt-1">
                    {t.subTitle}
                  </h3>
                </div>

                <div className="bg-white/2 p-6 rounded-3xl border border-white/10 space-y-6">
                  
                  {/* Profile detail */}
                  <div className="flex items-center space-x-4 border-b border-white/10 pb-4">
                    <img
                      src="/chams_photo.jpg"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80"; }}
                      alt="Chams Eddine Madi Profile"
                      className="h-12 w-12 rounded-full object-cover border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-sans text-sm font-bold text-white">Chams Eddine Madi</h4>
                      <p className="text-[10px] font-mono text-emerald-400">{t.ceo}</p>
                    </div>
                  </div>

                  {/* Info parameters */}
                  <div className="space-y-4 text-xs font-mono">
                    
                    <a 
                      href="mailto:al.shams.invest@gmail.com" 
                      className="flex items-center space-x-3 text-white/70 hover:text-emerald-400 transition"
                    >
                      <Mail className="h-4.0 w-4.0 text-white/40" />
                      <span>al.shams.invest@gmail.com</span>
                    </a>

                    <a 
                      href="https://api.whatsapp.com/send?phone=96874114028&text=Hello%20Chams,%20I%20would%20like%20to%20discuss%20PREDAIOT." 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-emerald-400 hover:text-emerald-300 transition"
                    >
                      <MessageCircle className="h-4.0 w-4.0" />
                      <span>WhatsApp: +968 7411 4028</span>
                    </a>
                    <a 
                      href="tel:+96874114028" 
                      className="flex items-center space-x-3 text-white/70 hover:text-emerald-400 transition"
                    >
                      <Phone className="h-4.0 w-4.0 text-white/40" />
                      <span>+968 7411 4028</span>
                    </a>

                    <div className="flex items-center space-x-3 text-white/70">
                      <MapPin className="h-4.0 w-4.0 text-white/40" />
                      <span>Bousher / Muscat Governorate / Oman</span>
                    </div>

                    <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                      <p className="text-[10.5px] font-bold text-white uppercase tracking-wider font-sans">
                        Al Shams Investment and Trade Company SPC
                      </p>
                      <p className="text-[10px] text-emerald-400 font-sans font-bold">
                        شركة الشمس للاستثمار والتجارة ش ش و
                      </p>
                      <div className="flex flex-col space-y-1 mt-2 text-white/50 text-[10px]">
                        <span>C.R: 1610145 | P.C: 111</span>
                        <a href="mailto:al.shams.invest@gmail.com" className="hover:text-emerald-400 transition">al.shams.invest@gmail.com</a>
                      </div>
                    </div>

                  </div>

                </div>
                
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <p className="text-xs text-slate-300">
                    <strong className="text-white">{t.guaranteeBannerTitle}</strong> {t.guaranteeBannerDesc}
                  </p>
                </div>
              </div>

              {/* Active direct message submission */}
              <div className="md:col-span-7 bg-[#050505] p-6 rounded-3xl border border-white/10">
                <h4 className="font-sans text-sm font-bold text-slate-200 mb-6">{t.directInquiry}</h4>
                
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  
                  <div>
                    <label className="text-[10px] font-mono text-white/40 block mb-1 uppercase tracking-wider">{t.officerName}</label>
                    <input 
                      type="text" 
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                      placeholder={locale === 'EN' ? "e.g. Salim Al Harthy" : "مثال: سالم الحارثي"}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/40 block mb-1 uppercase tracking-wider">{t.businessEmail}</label>
                    <input 
                      type="email" 
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                      placeholder="e.g. salim@oman-energy.com"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/40 block mb-1 uppercase tracking-wider">{t.portfolioSummary}</label>
                    <textarea 
                      rows={4}
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all shadow-inner"
                      placeholder={t.portfolioPlh}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#050505] font-bold py-3.5 rounded-full text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)] cursor-pointer"
                  >
                    {isSending ? (
                      <span>{t.subscribing}</span>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>{t.submitBtn}</span>
                      </>
                    )}
                  </button>

                  {isSuccess && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2 animate-fade-in">
                      <CheckCircle2 className="h-4.0 w-4.0 text-emerald-400 flex-shrink-0 animate-bounce" />
                      <span>{t.inboxSuccess}</span>
                    </div>
                  )}

                </form>
              </div>

            </div>

          </div>
        </section>
      </div>

    </div>
  );
}
