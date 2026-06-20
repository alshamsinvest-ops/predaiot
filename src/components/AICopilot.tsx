import { useState, useEffect, useRef } from 'react';
import { ViewState, ChatMessage } from '../types';
import { Send, Sparkles, User, Cpu, AlertTriangle, ShieldCheck, HelpCircle, MessageSquare } from 'lucide-react';

interface AICopilotProps {
  setView: (view: ViewState) => void;
  onChargeChange?: () => void;
}

export default function AICopilot({ setView, onChargeChange }: AICopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### PREDAIOT Decision Intelligence Advisor

Welcome to the **PREDAIOT AI Copilot**. I am configured under Muscat Grid spot parameters to identify economic leakage in energy storage and solar blocks.

**Suggestions to try:**
1. *Where am I losing the most economic value?*
2. *What is the difference between technical and economic optimization?*
3. *How do OPWP pool spot pricing limits impact battery degradation wear budgets?*

Select a prompt below, or ask your custom operational telemetry question.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    if (!customText) setInputText('');

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) {
        throw new Error('Network error from PREDAIOT decision gateway.');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If they ask a query about losing value / Asset 4 shift, we can trigger the state change in the parent
      if (textToSend.toLowerCase().includes('losing') || textToSend.toLowerCase().includes('leakage') || textToSend.toLowerCase().includes('asset 4')) {
        if (onChargeChange) {
          onChargeChange();
        }
      }

    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 2}`,
        role: 'assistant',
        content: `⚠️ Failed to acquire response. Please verify that server-side proxy routes and credentials are in place inside your Settings. In the meantime, port simulations are fully active.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQuestions = [
    { text: "Where am I losing the most economic value?", label: "Scan Leakage" },
    { text: "Tell me about the Muscat OPWP Case Study", label: "Oman Market" },
    { text: "أنت حاسبة ROI الاقتصادية الذكية لـ PREDIAIOT.\n\nاطلب من المستخدم المدخلات التالية خطوة بخطوة:\n1. سعة المشروع (MW) — مثال: 250 MW\n2. نوع الأصل (PV + BESS, Solar Only, BESS Only)\n3. متوسط ساعات التشغيل السنوية\n4. متوسط سعر البيع في السوق (USD/MWh) — افتراضي: 45-65\n\nبعد جمع البيانات، احسب وقدم النتائج بهذا الشكل:\n\n**نتائج التحليل الاقتصادي:**\n\n- الإيراد السنوي المتوقع حالياً: $X,XXX,XXX\n- التسرب الاقتصادي المقدر: $X,XXX,XXX\n- الإيراد الإضافي القابل للاسترجاع: **+$X,XXX,XXX سنوياً**\n- نسبة التحسن: +X.X%\n- فترة استرداد الاستثمار (إذا وجد): X أشهر\n\nأضف شرح مختصر + قدم دعوة للمستخدم لحجز Audit كامل في النهاية.\n\nابدأ الآن بسؤال المستخدم عن سعة المشروع.", label: "📊 Interactive ROI Calculator" }
  ];

  return (
    <div className="bg-[#050505] text-slate-100 min-h-[500px] flex flex-col justify-between font-sans shadow-2xl border border-white/10 rounded-3xl overflow-hidden max-w-4xl mx-auto" id="copilot-control-hub">
      
      {/* Upper header line */}
      <div className="flex items-center justify-between border-b border-white/10 p-5 bg-white/5 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse" />
            <div className="absolute top-0 left-0 w-5 h-5 bg-emerald-500/20 blur-md rounded-full pointer-events-none"></div>
          </div>
          <div>
            <span className="font-sans text-xs font-bold text-white tracking-wide block uppercase">
              PREDAIOT AI Copilot
            </span>
            <span className="font-mono text-[9px] text-[#34d399] uppercase block tracking-wider font-semibold">
              Live Decision intelligence node
            </span>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center space-x-2 text-[10px] text-white/50 font-mono bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span>Connected to gemini-3.5-flash</span>
        </div>
      </div>

      {/* Message Output Frame */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[400px] min-h-[300px] scrollbar-thin scrollbar-thumb-white/10" id="messages-frame">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div 
              key={msg.id} 
              className={`flex items-start space-x-3 max-w-3xl ${isAssistant ? '' : 'flex-row-reverse space-x-reverse ml-auto'}`}
            >
              <div className={`p-1.5 rounded-full flex-shrink-0 ${isAssistant ? 'bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-white/5 border border-white/10'}`}>
                {isAssistant ? (
                  <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <User className="h-3.5 w-3.5 text-blue-400" />
                )}
              </div>

              <div className="space-y-1">
                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${isAssistant ? 'bg-white/5 text-slate-350 border border-white/15' : 'bg-[#10b981] text-[#050505] font-semibold shadow-[0_4px_15px_rgba(16,185,129,0.2)]'}`}>
                  {/* Clean line render for basic Markdown sections */}
                  {msg.content.split('\n').map((line, lineIdx) => {
                    if (line.startsWith('###')) {
                      return <h4 key={lineIdx} className={`font-bold mt-3 mb-1.5 text-sm ${isAssistant ? 'text-white' : 'text-[#050505]'}`}>{line.replace('###', '')}</h4>;
                    }
                    if (line.startsWith('* **')) {
                      return <p key={lineIdx} className="pl-4 my-1 flex items-start text-xs"><span className={`mr-2 ${isAssistant ? 'text-emerald-400' : 'text-[#050505]/70'}`}>&bull;</span>{line.replace('*', '')}</p>;
                    }
                    if (line.startsWith('*')) {
                      return <p key={lineIdx} className="pl-4 my-1 flex items-start text-xs"><span className={`mr-2 ${isAssistant ? 'text-emerald-400' : 'text-[#050505]/70'}`}>&bull;</span>{line.replace('*', '')}</p>;
                    }
                    return <p key={lineIdx} className="mb-1">{line}</p>;
                  })}
                </div>
                
                <span className="text-[9px] font-mono text-white/30 block text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-white/40 font-mono text-xs">
            <Cpu className="h-4.0 w-4.0 animate-spin text-emerald-400" />
            <span className="text-[10px] animate-pulse">Scanning portfolio database files...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset suggestions and action keys */}
      <div className="border-t border-white/10 p-5 space-y-4 bg-white/2">
        
        {/* Preset sliders selection */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start" id="preset-prompts-row">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.text)}
              disabled={isLoading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/20 text-[10px] font-sans font-semibold text-emerald-100 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{q.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-2" id="copilot-input-area">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask anything about asset charging limits, degradation rules or Oman market results..."
            className="flex-1 rounded-full bg-white/5 border border-white/10 p-3 px-5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="p-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#050505] font-bold transition-all flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
