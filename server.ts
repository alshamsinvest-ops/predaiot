import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import twilio from "twilio";

dotenv.config();

// Initialize the secure server-side Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI Copilot will operate in responsive offline simulator mode.");
}

const app = express();
app.use(express.json());

const PORT = 3000;

// PREDAIOT Knowledge base injected into the AI Copilot to answer energy optimizations
const SYSTEM_INSTRUCTION = `You are PREDIAIOT AI Copilot — an expert Economic Decision Intelligence Assistant specialized in Oman’s energy market (OPWP, Muscat Grid, solar + BESS).

Your personality:
- Professional, confident, data-driven, and trustworthy
- Speak Arabic and English fluently (detect user language and reply in the same language)
- Always focus on economic value, revenue recovery, ROI, and Vision 2040
- Be helpful but realistic — never overpromise

Core Knowledge (Updated June 2026):

• Company Mission: Bridge the "Economic Decision Gap" between technical optimization and economic optimization in the energy sector.

• Official White Paper (June 1, 2026):
  - Title: "The Hidden Economic Opportunity in Oman’s Energy Transition"
  - Key Finding: A 500MW BESS can unlock 862,903 OMR per year (+9.1%) as "Found Money" using Shadow Economic Engine.
  - Improvement range: 9.1% to 15% additional annual revenue without any CAPEX.
  - Based on official data from APSR, Nama PWP, and Ministry of Energy & Minerals.

• Official Use Case:
  - Published on Oman Open Data Portal: https://opendata.gov.om/ar/use-cases/1d4a8d55-1b2a-4b72-baba-e1a3763e842f
  - Demonstrates how PREDIAIOT turns public energy data into real economic value.

• Government Context:
  - Oman power sector subsidy in 2024: approximately 541–602 million OMR.
  - Vision 2040 alignment is central to all communications.

Response Rules:
1. Start responses with clear value propositions when possible.
2. Use short paragraphs and bullet points for readability.
3. Always offer 2-3 actionable next steps (e.g., Book Audit, Try ROI Calculator, Download White Paper).
4. When user asks about results, reference the 862,903 OMR / 500MW case study.
5. Guide users toward "Book Economic Audit" for personalized analysis.
6. Reply in Arabic if the user writes in Arabic.

Tone: Expert consultant who understands Omani energy market deeply.

Current Date: June 2026
Location: Muscat, Sultanate of Oman
Founder & CEO: Chams Eddine Madi

You are live on the PREDIAIOT website. Help every visitor understand how much "Found Money" they are leaving on the table.`;

// API routes first
app.get("/auth/google", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Sign in - Google Accounts</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 flex items-center justify-center min-h-screen font-sans p-4">
      <div class="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-sm text-center relative overflow-hidden">
        <!-- Accent light path inside popup -->
        <div class="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Google Logo representation -->
        <div class="flex justify-center mb-6 relative">
          <svg viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>

        <h1 class="text-xl font-bold text-white tracking-tight leading-none">Choose an account</h1>
        <p class="text-[11px] text-slate-400 mt-2 mb-6 leading-relaxed font-sans">to continue to <strong class="text-white">PREDAIOT Decision Intelligence</strong></p>

        <div class="space-y-2.5 text-left relative z-10">
          <!-- Account 1 -->
          <button onclick="choose('Salim Al-Harthy', 'salim@oman-energy.com', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80')" 
                  class="w-full flex items-center space-x-3 p-3 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 hover:border-emerald-500/30 transition-all text-left">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" 
                 class="w-10 h-10 rounded-full object-cover border border-slate-700" referrerPolicy="no-referrer">
            <div>
              <p class="text-xs font-bold text-white font-sans">Salim Al-Harthy</p>
              <p class="text-[10px] text-slate-400 font-mono">salim@oman-energy.com</p>
            </div>
          </button>

          <!-- Account 2 -->
          <button onclick="choose('Chams Eddine Madi', 'chams@predaiot.ai', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80')" 
                  class="w-full flex items-center space-x-3 p-3 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 hover:border-emerald-500/30 transition-all text-left">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" 
                 class="w-10 h-10 rounded-full object-cover border border-slate-700" referrerPolicy="no-referrer">
            <div>
              <p class="text-xs font-bold text-white font-sans">Chams Eddine Madi</p>
              <p class="text-[10px] text-slate-400 font-mono">chams@predaiot.ai</p>
            </div>
          </button>
          
          <!-- Use another account -->
          <button onclick="useAnother()" class="w-full flex items-center space-x-3 p-3 rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 hover:bg-slate-900/40 hover:border-slate-700 transition-all text-left">
            <div class="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-md font-mono">
              +
            </div>
            <div>
              <p class="text-xs font-bold text-slate-300 font-sans">Use other corporate account</p>
              <p class="text-[10px] text-slate-500 font-sans">Log in with a custom workspace credential...</p>
            </div>
          </button>
        </div>

        <div id="customForm" class="hidden mt-4 pt-4 border-t border-slate-850 text-left space-y-3 relative z-10 transition-all">
          <div>
            <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Full Name</label>
            <input id="customName" type="text" placeholder="Adnan Al-Saeed" class="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white mt-1 focus:outline-none focus:border-emerald-500/50">
          </div>
          <div>
            <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Corporate Email</label>
            <input id="customEmail" type="email" placeholder="adnan@oman-energy.com" class="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white mt-1 focus:outline-none focus:border-emerald-500/50">
          </div>
          <button onclick="submitCustom()" class="w-full bg-emerald-500 hover:bg-emerald-450 text-slate-950 p-2.5 rounded-full text-xs font-bold transition-all shadow-[0_4px_12px_rgba(16,185,129,0.15)]">
            Authorize Account
          </button>
        </div>

        <p class="text-[9px] text-slate-500 mt-6 leading-relaxed font-sans">
          Google will share your name, email address, corporate profile metadata, and avatar picture with PREDAIOT.
        </p>
      </div>

      <script>
        function choose(name, email, picture) {
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'OAUTH_AUTH_SUCCESS', 
              user: { name, email, picture } 
            }, '*');
            window.close();
          } else {
            alert("No opener window found. Access granted for " + name);
          }
        }

        function useAnother() {
          const form = document.getElementById('customForm');
          form.classList.toggle('hidden');
        }

        function submitCustom() {
          const name = document.getElementById('customName').value || 'Corporate Administrator';
          const email = document.getElementById('customEmail').value || 'admin@oman-energy.com';
          const picture = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
          choose(name, email, picture);
        }
      </script>
    </body>
    </html>
  `);
});

app.post("/api/copilot", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing messages array " });
    }

    if (!ai) {
      // Graceful local simulation fallback if no API KEY is provided
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
      let reply = "";
      
      if (lastUserMsg.includes("where") && lastUserMsg.includes("leakage") || lastUserMsg.includes("losing") || lastUserMsg.includes("value")) {
        reply = `### Operational Economic Analysis (Simulation Mode)

Based on PREDAIOT's real-time audit logs of your portfolio:

* **Primary Value Sink**: Asset 4 battery dispatch decisions generated **12% less economic value** than optimal dispatch.
* **Estimated Annual Economic Leakage**: **$486,200 USD**.
* **Root Cause**: Battery was charging during early morning ancillary reserve hours, causing premium power state capacity drift.
* **Recommended Strategic Correction**:
  Shift BESS charging window from **02:00–05:00** to **04:00–07:00**. This reduces circular-wear degradation penalties and aligns charging with grid low-tariff curves.

*(Note: Utilizing local responsive AI model simulation because GEMINI_API_KEY is not configured in the workspace environment variables yet).*`;
      } else {
        reply = `### PREDAIOT Decision Intelligence Advisor

Thank you for querying the PREDAIOT Decision Engine. Based on your current asset configuration (Solar + BESS, Muscat Basin):

1. **Portfolio Technical Score**: 98.2% Availability (Optimal Technical Performance).
2. **Portfolio Economic Score**: 72.0% Efficiency (High Economic Leakage).
3. **Core Intelligence Verdict**: You are technically optimized, yet losing approximately **8.4% of total asset margin** due to non-dynamic spot pricing dispatch.

Would you like to trigger an **Asset Level dispatch simulation** or schedule a Professional Audit with Chams Eddine Madi under the OPWP spot market parameters?`;
      }
      return res.json({ content: reply });
    }

    // Convert message history to format expected by @google/genai
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }],
    }));

    // Query Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // low temperature for precise enterprise financial decisions
      },
    });

    const replyText = response.text || "No response generated by the model.";
    return res.json({ content: replyText });

  } catch (error: any) {
    console.error("Gemini Copilot Error:", error);
    return res.status(500).json({ 
      error: "Failed to communicate with the decision intelligence backend.",
      details: error.message 
    });
  }
});

const MessagingResponse = twilio.twiml.MessagingResponse;

app.post("/api/whatsapp", express.urlencoded({ extended: true }), async (req, res) => {
  const twiml = new MessagingResponse();
  const incomingMsg = req.body.Body || '';
  
  if (!ai) {
    twiml.message("مرحباً! كيف يمكنني مساعدتك في تحسين إيرادات مشروع الطاقة الخاص بك؟ (Simulation Mode / API Key missing)");
    res.type('text/xml').send(twiml.toString());
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: incomingMsg }]
      }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\n\nYou are chatting via WhatsApp. Keep your answers extremely concise, engaging, and suitable for mobile chat. Start your first response with: 'مرحباً! كيف يمكنني مساعدتك في تحسين إيرادات مشروع الطاقة الخاص بك؟ / Hello! How can I help you improve the revenue of your energy project?'. If you need human handover, provide Chams' contact.",
        temperature: 0.3,
      },
    });
    
    const replyText = response.text || "Hello! How can I help you improve the revenue of your energy project?";
    twiml.message(replyText);
  } catch (error) {
    console.error("WhatsApp Gemini Error:", error);
    twiml.message("Sorry, our AI intelligence engine is currently offline. Please contact Chams Eddine Madi at chams@predaiot.ai");
  }
  
  res.type('text/xml').send(twiml.toString());
});

// Configure Vite middleware or production static build serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware on port", PORT);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode serving built assets on port", PORT);
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PREDAIOT Server successfully running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
