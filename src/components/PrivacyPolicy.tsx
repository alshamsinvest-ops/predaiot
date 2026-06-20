import React from 'react';
import { ShieldCheck, Lock, Eye, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  locale: 'EN' | 'AR';
}

export default function PrivacyPolicy({ locale }: PrivacyPolicyProps) {
  const translations = {
    EN: {
      subBadge: "Oman PDPL Secure Directive",
      title: "Data Protection & Privacy Policy",
      meta: "Compliance alignment under Royal Decree No. 6/2022 (Sultanate of Oman)",
      intro: "At PREDAIOT, utility and IPP operational security is our absolute highest priority. We comply with Oman's Personal Data Protection Law (PDPL) to guarantee that your generation telemetry, SCADA logs, and financial parameters remain entirely secure and isolated.",
      card1Title: "1. Data Minimization & Isolation",
      card1Desc: "We only request telemetry parameters (active MW output, SoC indexes, pricing arrays) strictly necessary to run economic leakage math. No personal identity coordinates, passwords or internal keys are ever stored or processed in raw formats.",
      card2Title: "2. AES-256 Cryptography At-Rest",
      card2Desc: "All structural telemetry logs, CSV databases, and file uploads are encrypted using military-grade AES-256 algorithms. Data channels are isolated using VPC peering architectures within the Gulf regional servers.",
      card3Title: "3. Absolute Client Purge Rights",
      card3Desc: "In strict alignment with Royal Decree 6/2022, Muscat and regional operators hold full rights of extraction and deletion. If you request records removal via al.shams.invest@gmail.com, your server-side database partitions are completely purged within 12 system hours, verified in writing.",
      card4Title: "4. Expiry & Secure Session Tokens",
      card4Desc: "The Client Portal session engine enforces 30-minute expiry states. Token pathways use secure cross-origin sanitization (Secure; SameSite=None) to block clickjacking or CSRF breaches inside the iframe environment.",
      dpoTitle: "Data Privacy Officer (DPO)",
      dpoDesc: "Please coordinate your security clearance checks directly with our Founder & CEO, Chams Eddine Madi at al.shams.invest@gmail.com."
    },
    AR: {
      subBadge: "الامتثال لقانون حماية البيانات الشخصية العماني",
      title: "سياسة حماية البيانات والخصوصية المعتمدة",
      meta: "مواءمة تشريعية وحقوقية كاملة بموجب المرسوم السلطاني العماني رقم 6/2022",
      intro: "يمثل تأمين المحطات والبيانات الهندسية لشركائنا من المرافق العامة وشركات إنتاج الطاقة أعلى مستويات التزامنا. نلتزم بقانون حماية البيانات الشخصية العماني لضمان بقاء سجلات SCADA ومصفوفة الأصول معزولة ومحمية بالكامل.",
      card1Title: "1. تقليل معالجة البيانات والحد الأدنى",
      card1Desc: "نقوم بطلب وسحب البيانات التشغيلية الأساسية فقط (القدرة الفعالة بالميجاوات، ومؤشرات الشحن، ومعاملات التسعير) اللازمة لعمليات الفحص الاقتصادي الفني. لا يتم حفظ أي هويات شخصية للمستخدمين في سجلاتنا.",
      card2Title: "2. تشفير عسكري AES-256 للبيانات المخزنة",
      card2Desc: "كافة السجلات والملفات المرفوعة للتدقيق تخضع لتشفير مشدد باستخدام خوارزميات AES-256. قنوات البيانات معزولة سحابياً وشبكياً بشكل تام داخل نطاق خوادم الخليج العربي المعتمدة.",
      card3Title: "3. حق الحذف والنسيان المطلق للمشغلين",
      card3Desc: "تماشياً بشكل كامل مع المرسوم السلطاني 6/2022، يحق للمشغلين وهيئات النفع في مسقط وجميع المحافظات سحب وحذف كافة بياناتهم بطلب بريدي مباشر لـ al.shams.invest@gmail.com، وسيتم إتلاف سجلات المشغلات بالكامل خلال 12 ساعة مع إثبات كتابي.",
      card4Title: "4. انتهاء الجلسات الحساسة والتأمين اللحظي",
      card4Desc: "نطبق سياسة بقاء قصيرة للجلسات لا تتعدى 30 دقيقة. وتأمين المسارات باستخدام ملفات تعريف مشفرة بالكامل وعزل المتصفح لمنع الاختراقات وتعدي البرمجة عبر iFrame.",
      dpoTitle: "مسؤول حماية خصوصية البيانات (DPO)",
      dpoDesc: "لتنسيقات الأمن والشهادات، يرجى التنسيق المباشر والسرّي مع المؤسس والرئيس التنفيذي: شمس الدين مادي على البريد al.shams.invest@gmail.com."
    }
  };

  const t = translations[locale];

  return (
    <section className="py-20 bg-[#050505] px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="privacy-master-page">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-950/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 font-sans">
          <span className="font-mono text-xs uppercase text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 font-bold">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            {t.subBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.title}
          </h1>
          <p className="text-xs font-mono text-white/50">
            {t.meta}
          </p>
          <p className="text-xs text-white/70 max-w-2xl mx-auto leading-relaxed pt-3">
            {t.intro}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 font-sans">
          
          <div className="p-6 rounded-3xl border border-white/10 bg-white/2 space-y-3">
            <Lock className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">{t.card1Title}</h3>
            <p className="text-xs text-white/50 leading-relaxed">{t.card1Desc}</p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/2 space-y-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">{t.card2Title}</h3>
            <p className="text-xs text-white/50 leading-relaxed">{t.card2Desc}</p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/2 space-y-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-bold text-white">{t.card3Title}</h3>
            <p className="text-xs text-white/50 leading-relaxed">{t.card3Desc}</p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/2 space-y-3">
            <Eye className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">{t.card4Title}</h3>
            <p className="text-xs text-white/50 leading-relaxed">{t.card4Desc}</p>
          </div>

        </div>

        {/* Founder DPO Card */}
        <div className="p-6 rounded-3xl border border-emerald-500/10 bg-emerald-500/2 flex flex-col sm:flex-row items-center gap-6 font-sans">
          <img
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
            alt="Chams Eddine Madi Profile"
            className="h-16 w-16 rounded-full object-cover border border-emerald-400/30"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">{t.dpoTitle}</h4>
            <p className="text-xs text-white/60 leading-relaxed">{t.dpoDesc}</p>
            <p className="text-xs text-emerald-400 font-mono font-bold mt-1">Official Security Port: secure@predaiot.ai</p>
          </div>
        </div>

      </div>
    </section>
  );
}
