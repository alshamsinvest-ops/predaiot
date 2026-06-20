import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

interface WhitePapersProps {
  locale: 'EN' | 'AR';
}

export default function WhitePapers({ locale }: WhitePapersProps) {
  const isAR = locale === 'AR';

  return (
    <div className="min-h-screen bg-zinc-950 py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto pt-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">White Papers & Research</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            {isAR ? 'أحدث أبحاثنا ودراساتنا حول الفرص الاقتصادية في قطاع الطاقة العماني' : 'Our latest research and case studies on economic opportunities in the Omani energy sector.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* White Paper Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-bold tracking-wider uppercase rounded-full">White Paper 2026</span>
                </div>
                <span className="text-zinc-500 font-mono text-xs">{isAR ? '12 صفحة' : '12 Pages'}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-tight">
                The Hidden Economic Opportunity in Oman’s Energy Transition
              </h3>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                {isAR 
                  ? 'اكتشاف "الأموال المكتشفة" من خلال Economic Decision Intelligence — 862,903 ريال عماني سنوياً لكل مشروع 500MW.'
                  : 'Discovering "Found Money" through Economic Decision Intelligence — unlocking up to 862,903 OMR annually per 500MW project without CAPEX.'}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-zinc-500 mb-8 uppercase font-bold">
                <div>June 1, 2026</div>
                <div>PREDAIOT Research Team</div>
              </div>
            </div>

            <a href="/attachments/PREDAIOT_White_Paper_Oman_2026_V2.pdf" 
               target="_blank"
               className="block w-full bg-white text-black font-bold uppercase tracking-wider py-4 rounded-2xl text-center hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-2">
              <Download className="w-5 h-5 flex-shrink-0" />
              <span>{isAR ? 'تحميل الـ White Paper كاملاً (PDF)' : 'Download Full White Paper (PDF)'}</span>
            </a>
          </div>

          {/* Use Case Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-sm font-bold tracking-wider uppercase rounded-full">Official Use Case</span>
                </div>
                <span className="text-zinc-500 font-mono text-xs">opendata.gov.om</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-tight">
                PredAIoT — تحويل البيانات المفتوحة إلى قيمة اقتصادية
              </h3>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                {isAR 
                  ? 'Use Case رسمي منشور على بوابة البيانات المفتوحة العمانية يوضح كيفية تحقيق PREDIAIOT للقيمة الاقتصادية من البيانات الحكومية.'
                  : 'Official Use Case published on the Oman Open Data Portal demonstrating how PREDIAIOT delivers economic value from public government data.'}
              </p>
              
              <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-zinc-500 mb-8 uppercase font-bold">
                <div>June 3, 2026</div>
                <div>Chams Eddine Madi</div>
              </div>
            </div>

            <a href="https://opendata.gov.om/ar/use-cases/1d4a8d55-1b2a-4b72-baba-e1a3763e842f" 
               target="_blank"
               className="block w-full bg-white text-black font-bold uppercase tracking-wider py-4 rounded-2xl text-center hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-2">
              <span>{isAR ? 'اقرأ الـ Use Case الرسمي' : 'Read Official Use Case'}</span>
              <ExternalLink className="w-5 h-5 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Trust Note */}
        <div className="mt-16 text-center text-zinc-500 text-xs font-mono uppercase tracking-widest font-bold">
          {isAR ? 'جميع الدراسات مبنية على بيانات رسمية من APSR، Nama PWP، ووزارة الطاقة والمعادن' : 'All studies are based on official data from APSR, Nama PWP, and the Ministry of Energy & Minerals'}
        </div>
      </div>
    </div>
  );
}
