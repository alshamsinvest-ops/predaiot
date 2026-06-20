import React, { useEffect, useRef, useState } from 'react';
import { Download, ExternalLink, Leaf, Zap, Activity } from 'lucide-react';
import * as d3 from 'd3';

interface WhitePapersProps {
  locale: 'EN' | 'AR';
}

function AnimatedCounter({ value, duration = 2000, prefix = '', suffix = '', decimals = 0 }: { value: number, duration?: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = time - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // easeOutQuart
      const easePattern = 1 - Math.pow(1 - percentage, 4);
      setCount(easePattern * value);
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}

const profitData = [
  { month: 'Jan', value: 52000 },
  { month: 'Feb', value: 56000 },
  { month: 'Mar', value: 64000 },
  { month: 'Apr', value: 71000 },
  { month: 'May', value: 83000 },
  { month: 'Jun', value: 91000 },
  { month: 'Jul', value: 98000 },
  { month: 'Aug', value: 92000 },
  { month: 'Sep', value: 81000 },
  { month: 'Oct', value: 72000 },
  { month: 'Nov', value: 58000 },
  { month: 'Dec', value: 44903 }
];

export default function WhitePapers({ locale }: WhitePapersProps) {
  const isAR = locale === 'AR';
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!d3Container.current) return;
    
    // Clear previous
    d3.select(d3Container.current).selectAll('*').remove();
    d3.select('body').selectAll('.d3-chart-tooltip').remove();

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'd3-chart-tooltip')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('background', '#18181b') // bg-zinc-900
      .style('border', '1px solid #3f3f46') // border-zinc-700
      .style('color', '#fff')
      .style('padding', '8px 12px')
      .style('border-radius', '8px')
      .style('font-family', 'ui-mono, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)')
      .style('z-index', 50);

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(d3Container.current)
      .attr('viewBox', `0 0 800 300`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#34d399") // emerald-400
      .attr("stop-opacity", 0.5);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#34d399")
      .attr("stop-opacity", 0);

    const x = d3.scalePoint()
      .domain(profitData.map(d => d.month))
      .range([0, width])
      .padding(0.5);

    const y = d3.scaleLinear()
      .domain([0, d3.max(profitData, d => d.value) as number * 1.1])
      .range([height, 0]);

    // X Grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat(() => "")
      )
      .attr('color', '#27272a') // zinc-800
      .attr('stroke-opacity', 0.5);

    // Y Grid lines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(() => "")
      )
      .attr('color', '#27272a') // zinc-800
      .attr('stroke-opacity', 0.5);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr('color', '#52525b') // zinc-600
      .selectAll("text")
      .attr('color', '#a1a1aa') // zinc-400
      .style('font-family', 'sans-serif')
      .style('font-size', '12px');

    // Y Axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${(d as number)/1000}k`))
      .attr('color', '#52525b')
      .selectAll("text")
      .attr('color', '#a1a1aa')
      .style('font-family', 'sans-serif')
      .style('font-size', '12px');

    // Add Y axis label:
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 15)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#a1a1aa')
      .style('font-family', 'sans-serif')
      .style('font-size', '12px')
      .text('OMR');

    // Area under line
    const area = d3.area<{month: string, value: number}>()
      .x(d => x(d.month) as number)
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(profitData)
      .attr('fill', 'url(#area-gradient)')
      .attr('opacity', 0.5)
      .attr('d', area);

    // Line
    const line = d3.line<{month: string, value: number}>()
      .x(d => x(d.month) as number)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(profitData)
      .attr('fill', 'none')
      .attr('stroke', '#34d399') // emerald-400
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add points
    svg.selectAll(".dot")
      .data(profitData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.month) as number)
      .attr("cy", d => y(d.value))
      .attr("r", 5)
      .attr("fill", "#050505")
      .attr("stroke", "#34d399")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 8).attr("fill", "#34d399");
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div style="font-weight: bold; color: #a1a1aa; margin-bottom: 4px; font-size: 10px; text-transform: uppercase;">${d.month} 2026</div>
          <div style="color: #34d399; font-size: 14px; font-weight: bold;">${d.value.toLocaleString()} OMR</div>
        `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 5).attr("fill", "#050505");
        tooltip.transition().duration(200).style('opacity', 0);
      });

    return () => {
      d3.select('body').selectAll('.d3-chart-tooltip').remove();
    };
  }, []);

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

        {/* D3 Chart Section */}
        <div className="mt-16 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-all">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
              {isAR ? 'توقع الأرباح المستردة على مدار 12 شهراً (مشروع مسقط 500MW)' : 'Projected Recovered Profits (12 Months, Muscat 500MW Installation)'}
            </h3>
            <p className="text-sm text-zinc-400 max-w-3xl">
              {isAR 
                ? 'يوضح هذا الرسم البياني التراكم الشهري للقيمة الاقتصادية أو "الأموال المستردة" التي يتم استعادتها بواسطة خوارزميات PREDAIOT، بمتوسط تسارع سنوي يصل إلى أكثر من 862 ألف ريال عماني من الأرباح المكتشفة.'
                : 'This chart illustrates the monthly compounding of economic value or "Found Money" recovered by PREDAIOT algorithms, projecting an accelerated total exceeding 862K OMR in unlocked annual returns.'}
            </p>
          </div>
          
          <div className="w-full overflow-hidden bg-black/40 rounded-2xl border border-zinc-800/50 p-4 relative">
            {/* Simple tooltip target area */}
            <svg ref={d3Container} className="w-full h-auto drop-shadow-xl" style={{ maxHeight: '400px' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-black/40 border border-zinc-800/50 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Leaf className="w-16 h-16 text-emerald-400" />
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono font-bold mb-1">
                {isAR ? 'معيار تعويض الكربون' : 'Carbon Offset Metric'}
              </p>
               <div className="text-3xl font-bold text-white font-mono flex items-baseline focus-within:ring-0">
                 <AnimatedCounter value={125430} />
                 <span className="text-sm text-zinc-500 ml-1">kg</span>
               </div>
               <p className="text-xs text-emerald-400 mt-2 font-medium">
                 {isAR ? 'تخفيض ثاني أكسيد الكربون عبر كبح تشغيل الديزل' : 'CO2 reduced via diesel startup suppression'}
               </p>
            </div>

            <div className="bg-black/40 border border-zinc-800/50 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Activity className="w-16 h-16 text-emerald-400" />
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono font-bold mb-1">
                {isAR ? 'كفاءة استقرار الشبكة' : 'Grid Stabilization Efficiency'}
              </p>
               <div className="text-3xl font-bold text-white font-mono flex items-baseline">
                 <AnimatedCounter value={99.8} decimals={1} />
                 <span className="text-sm text-zinc-500 ml-1">%</span>
               </div>
               <p className="text-xs text-emerald-400 mt-2 font-medium">
                 {isAR ? 'رقم قياسي للتردد المتماسك خلال الذروة' : 'Consistent frequency record during peak window'}
               </p>
            </div>
            
            <div className="bg-black/40 border border-zinc-800/50 rounded-2xl p-6 relative overflow-hidden group md:col-span-2 lg:col-span-1">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Zap className="w-16 h-16 text-emerald-400" />
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono font-bold mb-1">
                {isAR ? 'حماية تدهور البطارية' : 'Circular Battery Protection'}
              </p>
               <div className="text-3xl font-bold text-emerald-400 font-mono flex items-baseline">
                 <span className="text-xl mr-0.5">+</span>
                 <AnimatedCounter value={14.2} decimals={1} />
                 <span className="text-sm text-emerald-500/50 ml-1">%</span>
               </div>
               <p className="text-xs text-emerald-400 mt-2 font-medium">
                 {isAR ? 'تحسين دورة التدهور مقارنة بالجدول اليدوي' : 'Degradation cycle improvement vs. static schedule'}
               </p>
            </div>
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
