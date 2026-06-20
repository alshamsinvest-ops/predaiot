import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Cpu, RefreshCw, AlertTriangle, TrendingUp, CheckCircle, 
  Search, ShieldCheck, FileText, ArrowUpRight, Zap, Play, Sparkles, 
  Clock, Leaf, HelpCircle, HardDriveDownload, Settings, Bell, Mail, 
  DownloadCloud, Radio, ChevronRight, Check
} from 'lucide-react';

export default function PlatformDashboard() {
  const [activeTab, setActiveTab2] = useState<'OVERVIEW' | 'ASSETS' | 'SIMULATION' | 'RECOMMENDATIONS' | 'SETTINGS' | 'METHODOLOGY'>('OVERVIEW');
  const [selectedAssetType, setSelectedAssetType] = useState<'Utility Scale Solar' | 'BESS' | 'Wind Farms'>('BESS');
  const [chargingWindow, setChargingWindow] = useState<'STANDARD' | 'OPTIMIZED'>('STANDARD');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimulatingCycle, setIsSimulatingCycle] = useState<boolean>(false);
  const [scadaStreamProgress, setScadaStreamProgress] = useState<number>(0);

  // Dynamic real-time maintenance alerts configuration state
  const [liveGridAlerts, setLiveGridAlerts] = useState([
    { 
      id: 1, 
      name: 'Block 4 Lithium Cell Balancing Splay', 
      location: 'Muscat Regional Node 49', 
      status: 'CRITICAL', 
      leakProjected: '$48,620 USD', 
      tag: 'BESS-THERMAL', 
      time: 'Just now',
      description: 'Localized temperature threshold deviation within lithium containment array. PREDAIOT recommends immediate charging window sweep.'
    },
    { 
      id: 2, 
      name: 'Ibri II PV Solar Inverter Extreme Clipping', 
      location: 'Ad Dhahirah Basin Intertie', 
      status: 'ALERT', 
      leakProjected: '$32,240 USD', 
      tag: 'RENEWABLE-CLIP', 
      time: '12 min ago',
      description: 'Midday photovoltaic solar generation surpassing peak grid-carrying capacity.'
    },
    { 
      id: 3, 
      name: 'Muscat East Substation Frequency Anomalous Drifts', 
      location: 'Eastern Muscat Grid Subnet', 
      status: 'MONITOR', 
      leakProjected: '$11,960 USD', 
      tag: 'GRID-CYBER', 
      time: '1 hr ago',
      description: 'Sub-second oscillation patterns detected on the transmission substation busbar.'
    },
    { 
      id: 4, 
      name: 'Manah Solar I Intermittent Dispatch Deficit', 
      location: 'A’Dakhiliyah Region Connector', 
      status: 'RESOLVED', 
      leakProjected: '$0 USD', 
      tag: 'SYSTEM-LOSS', 
      time: '3 hr ago',
      description: 'Sub-nominal solar injection bypassed by pre-charging alternative battery blocks.'
    }
  ]);

  // Email notifications & threshold inputs
  const [testEmailAddress, setTestEmailAddress] = useState<string>('salim@oman-energy.com');
  const [triggerValueThreshold, setTriggerValueThreshold] = useState<number>(35);
  const [isSendingEmailTest, setIsSendingEmailTest] = useState<boolean>(false);
  const [emailStatusLog, setEmailStatusLog] = useState<string | null>(null);

  // Custom sliding alerts / state notifications
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Reports config
  const [selectedReportType, setSelectedReportType] = useState<'DAILY_ARBITRAGE' | 'WEEKLY_OUTAGES' | 'MONTHLY_LEDGER'>('DAILY_ARBITRAGE');
  const [selectedReportFormat, setSelectedReportFormat] = useState<'CSV' | 'TXT' | 'JSON'>('CSV');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  // Direct structured report formatter & downloader
  const downloadReportDirect = (type: 'DAILY_ARBITRAGE' | 'WEEKLY_OUTAGES' | 'MONTHLY_LEDGER', format: 'CSV' | 'TXT' | 'JSON') => {
    const timestamp = new Date().toISOString();
    let textContent = "";
    let filename = `PREDAIOT_${type}_REPORT_${new Date().toLocaleDateString().replace(/\//g, '-')}.${format.toLowerCase()}`;
    
    if (format === 'CSV') {
      textContent = `Timestamp,Muscat_Node_Ref,Operating_Efficiency,Tariff_USD_MWh,Active_Economic_Loss_USD,BESS_Discharge_Yield_USD\n${timestamp},OPWP_Asset_Block4,89%,109.46,0,486200\n${timestamp},Ibri_Solar_Intertie,94%,100.10,32240,0\n${timestamp},Muscat_East_Sub,99%,135.20,0,894400`;
    } else if (format === 'JSON') {
      textContent = JSON.stringify({
        organization: "PREDAIOT Decision Intelligence",
        reportType: type,
        jurisdiction: "Oman National Transmission Grid",
        generatedAt: timestamp,
        complianceMetrics: {
          gridPeakEfficiency: "89.2%",
          leakageMitigationRate: "93.4%",
          cumulativeArbitrageYieldUSD: 486200
        },
        records: [
          { time: "02:00", tariffUSD: 31, scadaLoadMW: 90, lossTraditional: 40040, lossPREDAIOT: 0 },
          { time: "06:00", tariffUSD: 55, scadaLoadMW: 110, lossTraditional: 31200, lossPREDAIOT: 0 },
          { time: "14:00", tariffUSD: 151, scadaLoadMW: 280, lossTraditional: 486200, lossPREDAIOT: 0 }
        ]
      }, null, 2);
    } else {
      textContent = `========================================================\nPREDAIOT DECISION INTELLIGENCE OPERATIONAL REPORT\n========================================================\nReport Type: ${type} (Structured ASCII Report)\nOrigin Node: OPWP_Asset_Block4_Muscat\nGenerated: ${timestamp}\n\nKEY INSIGHTS & STATISTICS:\n--------------------------------------------------------\n* Operational Efficiency Rating: ${isOptimized ? '89%' : '72%'}\n* Resolved Annual Net Leakage: ${isOptimized ? '$486,200 USD' : '$0 USD'}\n* Battery Health Preservation Coefficient: 98.8%\n\nDISPATCH STRATEGY AUDIT RECORDS:\n* Active charging rule: ${isOptimized ? 'PREDAIOT Dynamic 04h-07h' : 'Traditional baseline 02h-05h'}\n* Status: Grid operations fully aligned.\n========================================================\nMuscat, Sultanate of Oman | tech@predaiot.ai`;
    }
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    setToastNotification(`Generated & downloaded professional report ${filename} successfully!`);
    setTimeout(() => setToastNotification(null), 6000);
  };

  // Dynamic values that update depending on whether user selects standard or PREDAIOT optimized charging window
  const isOptimized = chargingWindow === 'OPTIMIZED';
  
  const efficiencyScore = isOptimized ? 98.8 : 76.3;
  const currentLeakage = isOptimized ? 0 : 31420;
  const annualSaved = isOptimized ? 31420 : 0;
  const batteryHealthRating = isOptimized ? '98.8% (Optimal Rate)' : '92.1% (Accelerated Degradation)';
  const dispatchYieldMultiplier = isOptimized ? '+14.2% yield' : '+2.1% yield';

  const handleDownloadCustomReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      
      const timestamp = new Date().toISOString();
      let textContent = "";
      let filename = `PREDAIOT_${selectedReportType}_RECORDS.${selectedReportFormat.toLowerCase()}`;
      
      if (selectedReportFormat === 'CSV') {
        textContent = `Timestamp,Muscat_Node_ID,Price_Tariff_USD_MWh,BESS_Charging_Load_MW,Estimated_Leakage_USD,Net_Optimized_Profit_USD\n${timestamp},OPWP_Asset_Block4,109.20,250,48620,333840\n${timestamp},OPWP_Asset_Block4,150.80,250,0,486200`;
      } else if (selectedReportFormat === 'JSON') {
        textContent = JSON.stringify({
          agency: "PREDAIOT Economic Decision Intelligence Labs",
          reportType: selectedReportType,
          nodeId: "OPWP_Asset_Block4",
          timestamp,
          records: [
            { hour: "02:00", tariff: 31, standardCharge: 50, optimizedCharge: 0, deltaLeakageUSD: 40040 },
            { hour: "04:00", tariff: 23, standardCharge: 50, optimizedCharge: 50, deltaLeakageUSD: 0 },
            { hour: "14:00", tariff: 151, standardCharge: -40, optimizedCharge: -60, deltaLeakageUSD: 486200 }
          ]
        }, null, 2);
      } else {
        textContent = `PREDAIOT TRANSACTION REPORT\n============================\nType: ${selectedReportType}\nFormat: TXT ASCII\nTimestamp: ${timestamp}\nNode Ref: Muscat OPWP Area 49\n----------------------------\nOperational Efficiency Index: ${efficiencyScore}%\nEstimated Leakage ongoing: $${currentLeakage.toLocaleString()} USD\nIdentified Arbitrage opportunities: +$486,200 USD\n\nDirect Dispatch recommendation executed: Shift BESS baseline charging window to 04:00-07:00.\n============================`;
      }
      
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      
      setToastNotification(`Generated & downloaded spreadsheet "${filename}" successfully!`);
      setTimeout(() => setToastNotification(null), 6000);
    }, 1200);
  };

  const handleSendTestEmailAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmailTest(true);
    setEmailStatusLog("Establishing secure TLS handshake with smtp.predaiot.ai on port 587...");
    
    setTimeout(() => {
      setEmailStatusLog("SMTP Client Authenticated [SUCCESS]");
      
      setTimeout(() => {
        setEmailStatusLog(`Delivering MIME decision log pack to target destination: ${testEmailAddress}...`);
        
        setTimeout(() => {
          setIsSendingEmailTest(false);
          setEmailStatusLog(`Verified: Dispatched leakage response email notification alert to ${testEmailAddress}.`);
          
          setToastNotification(`Leakage response email dispatched to ${testEmailAddress}!`);
          setTimeout(() => setToastNotification(null), 6000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // SCADA network telemetry simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setScadaStreamProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Dispatch profile points according to simulated hours
  const dispatchData = [
    { hour: '00:00', price: 18, solar: 0, load: 120, standardCharge: 0, optCharge: 0 },
    { hour: '02:00', price: 12, solar: 0, load: 90, standardCharge: 50, optCharge: 0 }, // Inefficient charge window
    { hour: '04:00', price: 9, solar: 0, load: 80, standardCharge: 50, optCharge: 50 },  // Optimal deep tariff charge
    { hour: '06:00', price: 21, solar: 15, load: 110, standardCharge: 0, optCharge: 50 }, // Optimal charge matches sunrise
    { hour: '08:00', price: 34, solar: 80, load: 160, standardCharge: 0, optCharge: -20 }, // Solar helps
    { hour: '10:00', price: 42, solar: 180, load: 210, standardCharge: -10, optCharge: -10 },
    { hour: '12:00', price: 31, solar: 220, load: 240, standardCharge: 0, optCharge: 10 },  // midday solar saves
    { hour: '14:00', price: 58, solar: 160, load: 280, standardCharge: -40, optCharge: -60 }, // optimized discharge peak
    { hour: '16:00', price: 65, solar: 90, load: 310, standardCharge: -40, optCharge: -80 },  // peak discharge
    { hour: '18:00', price: 48, solar: 10, load: 260, standardCharge: 0, optCharge: -10 },
    { hour: '20:00', price: 36, solar: 0, load: 190, standardCharge: 0, optCharge: 0 },
    { hour: '22:00', price: 24, solar: 0, load: 140, standardCharge: 0, optCharge: 0 },
  ];

  const filteredEvents = liveGridAlerts.filter(ev => 
    ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ev.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerGridSimulationCycle = () => {
    setIsSimulatingCycle(true);
    setTimeout(() => {
      setIsSimulatingCycle(false);
    }, 1500);
  };

  const getLogReportUrl = () => {
    const header = `PREDAIOT ENGINE DECISION EXPORT LOGS\n===========================\nTimestamp: ${new Date().toISOString()}\n`;
    const body = `Asset Profile: Port-Folio Block 4 BESS\nCharging Window State: ${chargingWindow}\nComputed Portfolio Score: ${efficiencyScore}%\nAnnual Economic Leakage Rate: ${currentLeakage} OMR\nAnalyzed Dispatch Index Code: OPWP_AL_SWEEP_V9\n`;
    const blob = new Blob([header + body], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PREDAIOT-OP-EXPORT-${chargingWindow}.log`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResolveAlert = (id: number) => {
    setLiveGridAlerts(prev => prev.map(al => {
      if (al.id === id) {
        return { ...al, status: 'RESOLVED', leakProjected: '0 OMR' };
      }
      return al;
    }));
    setToastNotification(`Resolved alert #${id} autonomously! Standard telemetry alignment verified.`);
    setTimeout(() => setToastNotification(null), 6000);
  };

  const handleInjectAlert = () => {
    const alertId = liveGridAlerts.length + 1;
    const items = [
      { name: 'Sohar Heavy Industry Subnet Voltage Drop', location: 'Sohar Area 5', tag: 'VOLTAGE-DROP', risk: '9,200 OMR' },
      { name: 'Dhofar Wind Field Sudden Curtailment', location: 'Salalah Intertie', tag: 'WIND-DEV', risk: '15,600 OMR' },
      { name: 'Sur LNG Plant Auxiliary Grid Splay', location: 'Sur Coastal Node', tag: 'TRANS-LIMIT', risk: '6,400 OMR' }
    ];
    const picked = items[Math.floor(Math.random() * items.length)];
    const newAlert = {
      id: alertId,
      name: picked.name,
      location: picked.location,
      status: 'CRITICAL',
      leakProjected: picked.risk,
      tag: picked.tag,
      time: 'Just now',
      description: 'Localized anomalous grid disturbance with power factor degradation risk.'
    };
    setLiveGridAlerts(prev => [newAlert, ...prev]);
    setToastNotification(`[CRITICAL EVENT INJECTED] Real-time SCADA sensor triggered: ${picked.name}!`);
    setTimeout(() => setToastNotification(null), 7000);
  };

  return (
    <div className="bg-[#050505] text-[#e2e8f0] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans" id="predaiot-platform-dashboard">
      <div className="mx-auto max-w-7xl">
        
        {/* Upper Client Profile ribbon */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-[9px] text-[#34d399] bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full tracking-wider uppercase font-bold">
                Enterprise SaaS Access Node Active
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Economic Intelligence Portal
            </h1>
            <div className="mt-4 mb-3 flex flex-wrap items-center gap-3">
              <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">Asset Type:</span>
              <div className="flex flex-wrap bg-[#050505] border border-white/10 rounded-full p-1 shadow-inner">
                {(['Utility Scale Solar', 'BESS', 'Wind Farms'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedAssetType(type)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                      selectedAssetType === type 
                        ? 'bg-white/10 text-emerald-400 border border-white/5 shadow-sm' 
                        : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-white/50 font-sans mt-1">
              Muscat Grid Regional Node portfolio control: <strong className="text-white/80 font-mono">OPWP_Asset_Block4_{selectedAssetType.replace(/\s+/g, '_').toUpperCase()}</strong>
            </p>
          </div>

          {/* Quick telemetry feed state */}
          <div className="flex items-center space-x-4 bg-white/2 border border-white/10 rounded-2xl px-4 py-2 font-mono text-xs backdrop-blur-sm">
            <span className="text-white/40 font-mono text-[9px] uppercase tracking-wider">SCADA DATA STREAM:</span>
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-16 bg-white/5 rounded-full relative overflow-hidden inline-block border border-white/10">
                <span className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-300" style={{ width: `${scadaStreamProgress}%` }} />
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold font-mono">{scadaStreamProgress}%</span>
            </div>
          </div>
        </div>

        {/* Dashboard Layout Drawer/Sidebar options */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs option */}
          <div className="lg:col-span-3 space-y-2">
            <span className="text-[9px] font-mono uppercase text-white/40 tracking-wider font-bold block px-2 mb-2">
              Autonomous Controls
            </span>
            <button
              onClick={() => setActiveTab2('OVERVIEW')}
              className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'OVERVIEW' ? 'bg-emerald-500 text-[#050505] font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <BarChart3 className="h-4 w-4" />
                <span>Executive Overview</span>
              </div>
              <span className={`font-mono text-[9px] px-1.5 rounded uppercase ${activeTab === 'OVERVIEW' ? 'bg-[#050505] text-emerald-400 font-bold' : 'bg-white/5'}`}>L1</span>
            </button>
            <button
              onClick={() => setActiveTab2('SIMULATION')}
              className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'SIMULATION' ? 'bg-emerald-500 text-[#050505] font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Cpu className="h-4 w-4" />
                <span>BESS Dispatch Simulator</span>
              </div>
              <span className={`font-mono text-[9px] px-2 rounded uppercase ${activeTab === 'SIMULATION' ? 'bg-[#050505] text-red-400 font-bold' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>Active</span>
            </button>
            <button
              onClick={() => setActiveTab2('ASSETS')}
              className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'ASSETS' ? 'bg-emerald-500 text-[#050505] font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Zap className="h-4 w-4" />
                <span>Oman Regional Subnets</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab2('RECOMMENDATIONS')}
              className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'RECOMMENDATIONS' ? 'bg-emerald-500 text-[#050505] font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Sparkles className="h-4 w-4" />
                <span>Engine Corrections</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab2('METHODOLOGY')}
              className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'METHODOLOGY' ? 'bg-emerald-500 text-[#050505] font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="h-4 w-4" />
                <span>Economic Methodology</span>
              </div>
              <span className={`font-mono text-[8px] px-1.5 rounded uppercase ${activeTab === 'METHODOLOGY' ? 'bg-[#050505] text-emerald-400 font-bold' : 'bg-white/5'}`}>Math</span>
            </button>
            <button
              onClick={() => setActiveTab2('SETTINGS')}
              className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'SETTINGS' ? 'bg-emerald-500 text-[#050505] font-bold shadow-[0_4px_12px_rgba(16,185,129,0.2)]' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Settings className="h-4 w-4" />
                <span>Real-time API & Alerts</span>
              </div>
              <span className={`font-mono text-[8px] px-1.5 rounded uppercase ${activeTab === 'SETTINGS' ? 'bg-[#050505] text-emerald-400 font-bold' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>Live</span>
            </button>

            {/* Quick stats panel left */}
            <div className="pt-6 border-t border-white/10 mt-6 space-y-4">
              <div className="bg-white/2 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                <span className="font-mono text-[9px] uppercase block text-white/40 tracking-wider">Asset 4 Wear Factor</span>
                <p className="text-xs font-semibold text-white mt-1">{batteryHealthRating}</p>
                <div className="p-2 rounded-xl bg-[#050505] text-[10px] text-white/50 mt-2.5 font-mono border border-white/10">
                  Total Cycles: 481 / 5,000
                </div>
              </div>
            </div>
          </div>

          {/* Core Panel Content */}
          <div className="lg:col-span-9 space-y-6" id="dashboard-core">
            
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-8 animate-fade-in" id="overview-tab">
                
                {/* 1. Dynamic Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Economic Efficiency */}
                  <div className="p-5 rounded-3xl border border-white/10 bg-white/2 relative overflow-hidden shadow-xl">
                    <span className="absolute top-4 right-4 text-[9px] font-mono text-white/30 tracking-wider uppercase">EDE_KPI</span>
                    <span className="text-[10px] uppercase text-white/40 font-mono tracking-widest block font-bold">Economic Decision Efficiency (EDE)</span>
                    <div className="text-3xl font-mono mt-1 font-bold text-white flex items-baseline space-x-1">
                      <span className={isOptimized ? 'text-emerald-400' : 'text-amber-500'}>{efficiencyScore}%</span>
                      <span className="text-xs font-normal text-white/30">/ 100% optimum</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#050505] rounded-full mt-4 overflow-hidden border border-white/10">
                      <div className={`h-full rounded-full transition-all duration-500 ${isOptimized ? 'bg-emerald-400' : 'bg-amber-500'}`} style={{ width: `${efficiencyScore}%` }} />
                    </div>
                    <p className="text-[10px] text-white/40 mt-3.5 leading-relaxed font-sans">
                      Ratio of Actual Dispatch value to the mathematically optimal index (EV_actual / EV_optimal).
                    </p>
                  </div>

                  {/* Identified Leakage */}
                  <div className="p-5 rounded-3xl border border-white/10 bg-white/2 relative overflow-hidden shadow-xl">
                    <span className="absolute top-4 right-4 text-[9px] font-mono text-white/30 tracking-wider uppercase">OMR_VAL</span>
                    <span className="text-[10px] uppercase text-white/40 font-mono tracking-widest block font-bold">Economic Leakage (EPG)</span>
                    <div className="text-3xl font-mono mt-1 font-bold text-white flex items-baseline space-x-1">
                      <span className={isOptimized ? 'text-white/40' : 'text-red-400'}>{currentLeakage.toLocaleString()} OMR</span>
                      <span className="text-xs font-normal text-white/30">/ yr</span>
                    </div>
                    <p className="text-[10px] text-white/45 mt-4 flex items-center space-x-1.5 font-sans">
                      {isOptimized ? (
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                      )}
                      <span>{isOptimized ? 'Leakage gap completely sealed' : '23.7% lost due to dispatch errors'}</span>
                    </p>
                    <p className="text-[10px] text-white/40 mt-1 leading-relaxed font-sans">
                      Difference between optimal capacity returns and current dispatch.
                    </p>
                  </div>

                  {/* Recovered Value */}
                  <div className="p-5 rounded-3xl border border-white/10 bg-white/2 relative overflow-hidden shadow-xl">
                    <span className="absolute top-4 right-4 text-[9px] font-mono text-white/30 tracking-wider uppercase">FOUND_MONEY</span>
                    <span className="text-[10px] uppercase text-emerald-400 font-mono tracking-widest block font-bold">Recoverable Value</span>
                    <div className="text-23l font-mono mt-1 font-bold text-emerald-400 flex items-baseline space-x-1">
                      <span className="text-3xl font-bold font-mono">+{annualSaved.toLocaleString()} OMR</span>
                      <span className="text-xs font-normal text-emerald-500">/ yr</span>
                    </div>
                    <p className="text-[10px] text-white/40 mt-4 leading-relaxed font-sans">
                      {isOptimized ? '🎉 OMR 31,420 of Found Money successfully secured in real time!' : '⚡ OMR 31,420 of Found Money available to rescue via optimization.'}
                    </p>
                    <p className="text-[10px] text-white/40 mt-1 leading-relaxed font-sans">
                      Unlocks secondary profits using existing generation assets with zero CAPEX.
                    </p>
                  </div>

                </div>

                {/* 2. Interactive Dispatch Window Toggle Widget */}
                <div className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden shadow-xl">
                  <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-emerald-400 font-mono tracking-widest block">LIVE ASSET DECISION CONTROL</span>
                      <h3 className="text-lg font-bold text-white mt-1 font-sans">
                        Active Battery Dispatch Rule Setup
                      </h3>
                      <p className="text-xs text-white/60 font-sans mt-0.5">
                        Select a bidding window to test dispatch impact against real Muscat pool market price spikes.
                      </p>
                    </div>

                    {/* Interactive Switcher buttons matching client portal instructions */}
                    <div className="flex bg-[#050505] p-1 rounded-full border border-white/10" id="dispatch-rule-toggle">
                      <button
                        onClick={() => setChargingWindow('STANDARD')}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          !isOptimized ? 'bg-amber-600 text-white shadow-lg' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Traditional Limit (02:00-05:00)
                      </button>
                      <button
                        onClick={() => setChargingWindow('OPTIMIZED')}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                          isOptimized ? 'bg-emerald-500 text-[#050505] shadow-lg' : 'text-white/50 hover:text-white'
                        }`}
                        id="apply-optimized-btn"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>PREDAIOT Rule (04:00-07:00)</span>
                      </button>
                    </div>

                  </div>

                  {/* Impact Alert block */}
                  <div className={`p-4 rounded-2xl text-xs flex items-start space-x-3 transition-colors ${
                    isOptimized ? 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-300' : 'bg-amber-950/25 border border-amber-500/20 text-amber-300'
                  }`}>
                    {isOptimized ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-3 w-full">
                          <div>
                            <p className="font-bold">Corrective rule engaged successfully!</p>
                            <p className="text-[11px] text-white/50 mt-1 font-sans leading-relaxed">
                              BESS charging shifted to lower tariff morning valley. Real-time circular cell degradation reduced by 14%. Uncovering <span className="text-emerald-400 font-bold">31,420 OMR of Found Money</span>.
                            </p>
                          </div>
                          
                          <div className="bg-[#050505]/40 p-4 rounded-xl border border-emerald-500/15 space-y-2.5">
                            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">Corrected Values / No Active Value-Loss Decisions:</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-emerald-300/85">
                              <div className="bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10 space-y-0.5">
                                <span className="text-[10px] font-bold block flex items-center gap-1">✔ Early Discharge <Check className="h-3 w-3 inline text-emerald-400" /></span>
                                <p className="text-[10px] text-white/40 leading-snug">Aligned with peak price volatility windows. <span className="text-emerald-400 font-mono block mt-0.5 font-bold">0 OMR Loss</span></p>
                              </div>
                              <div className="bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10 space-y-0.5">
                                <span className="text-[10px] font-bold block flex items-center gap-1">✔ Inefficient Diesel <Check className="h-3 w-3 inline text-emerald-400" /></span>
                                <p className="text-[10px] text-white/40 leading-snug">Suppressed startup block during solar generation. <span className="text-emerald-400 font-mono block mt-0.5 font-bold">0 OMR Loss</span></p>
                              </div>
                              <div className="bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10 space-y-0.5">
                                <span className="text-[10px] font-bold block flex items-center gap-1">✔ Solar Curtailment <Check className="h-3 w-3 inline text-emerald-400" /></span>
                                <p className="text-[10px] text-white/40 leading-snug">Charging rescheduled to clip midday solar peak loads. <span className="text-emerald-400 font-mono block mt-0.5 font-bold">0 OMR Loss</span></p>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-emerald-400 block text-right">Sum EPG Active Leakage: 0 OMR / year</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="space-y-3 w-full">
                          <div>
                            <p className="font-bold">High Economic Leakage ongoing inside Asset 4 (Muscat Area)</p>
                            <p className="text-[11px] text-zinc-450 mt-1 font-sans leading-relaxed">
                              Asset 4 is committing battery charging capacity too early during system peak start routines. This error incurs <span className="text-amber-500 font-bold">31,420 OMR of needless annual leakage losses</span> compared to optimal operation. Click "PREDAIOT Rule" to correct this immediately.
                            </p>
                          </div>
                          
                          <div className="bg-[#050505]/60 hover:bg-[#050505]/80 p-4 rounded-xl border border-white/5 space-y-2.5 transition-all">
                            <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold block">Top 3 Value-Loss Decisions Identified:</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="bg-white/2 p-2.5 rounded-lg border border-amber-500/10 space-y-1">
                                <span className="text-[10px] font-bold text-slate-200 block">1. Early Discharge Fault</span>
                                <p className="text-[10px] text-white/50 leading-snug">Battery discharged too early; missing peak arbitrage pool value. <span className="text-red-400 font-mono block mt-1 font-bold">Est: 14,139 OMR Loss</span></p>
                              </div>
                              <div className="bg-white/2 p-2.5 rounded-lg border border-amber-500/10 space-y-1">
                                <span className="text-[10px] font-bold text-slate-200 block">2. Inefficient Diesel Gen-Start</span>
                                <p className="text-[10px] text-white/50 leading-snug">Diesel started unnecessarily during high-yield solar surplus. <span className="text-red-400 font-mono block mt-1 font-bold">Est: 9,426 OMR Loss</span></p>
                              </div>
                              <div className="bg-white/2 p-2.5 rounded-lg border border-amber-500/10 space-y-1">
                                <span className="text-[10px] font-bold text-slate-200 block">3. Solar Curtailment Clipper</span>
                                <p className="text-[10px] text-white/50 leading-snug">Midday solar output curtailed due to uncoordinated charging curves. <span className="text-red-400 font-mono block mt-1 font-bold">Est: 7,855 OMR Loss</span></p>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 block text-right">Sum EPG Total Leakage: 31,420 OMR / year</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. PROMINENT BEFORE & AFTER COMPARISON PANEL */}
                <div className="bg-white/2 p-6 rounded-3xl border border-white/10 shadow-2xl relative" id="before-after-prominent-panel">
                  <div className="absolute top-4 right-4 flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                    <span className="font-mono text-[9px] uppercase text-emerald-400 font-bold tracking-wider">Dynamic Ledger Matrix</span>
                  </div>
                  
                  <div className="mb-5">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">A/B Strategic Performance Alignment</h4>
                    <h3 className="text-base font-bold text-white font-sans mt-0.5">Before vs. After Optimization Audit</h3>
                    <p className="text-xs text-white/55 font-sans mt-1">
                      Direct side-by-side audit mapping traditional static grid limits to PREDAIOT autonomous decision intelligence corrections.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans-serif border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-white/40 uppercase font-mono text-[9px] tracking-wider">
                          <th className="py-3 px-3">Operational Indicator</th>
                          <th className="py-3 px-3">Before (Traditional Grid Baseline)</th>
                          <th className="py-3 px-3 text-emerald-400">After (PREDAIOT Autonomous Rule)</th>
                          <th className="py-3 px-3 text-right">Net Financial Differential</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                        <tr className="hover:bg-white/2 transition-colors">
                          <td className="py-3 px-3 font-medium text-white/80 font-sans">Dispatch Bidding Strategy</td>
                          <td className="py-3 px-3 text-white/50">Early Morning Charge (02:00-05:00)</td>
                          <td className="py-3 px-3 font-semibold text-emerald-400 bg-emerald-500/5">Optimized Solar-Valley (04:00-07:00)</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-bold">Timing Aligned</td>
                        </tr>
                        <tr className="hover:bg-white/2 transition-colors">
                          <td className="py-3 px-3 font-medium text-white/80 font-sans">Economic Peak Loss Decay</td>
                          <td className="py-3 px-3 text-red-400 font-bold">31,420 OMR / year</td>
                          <td className="py-3 px-3 font-semibold text-emerald-400 bg-emerald-500/5">0 OMR (Fully Rescued)</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-bold">-100% Extinguished</td>
                        </tr>
                        <tr className="hover:bg-white/2 transition-colors">
                          <td className="py-3 px-3 font-medium text-white/80 font-sans">Midday Photo-Voltaic Solar Clipping</td>
                          <td className="py-3 px-3 text-amber-500 font-semibold">8.4% Average Capacity Clip</td>
                          <td className="py-3 px-3 font-semibold text-emerald-300 bg-emerald-500/5">0.0% Clipped (Optimally Routed)</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-bold">+8.4% Solar Injected</td>
                        </tr>
                        <tr className="hover:bg-white/2 transition-colors">
                          <td className="py-3 px-3 font-medium text-white/80 font-sans">Lithium Battery Life Devaluation</td>
                          <td className="py-3 px-3 text-white/50">Accelerated Wear (Est. 5-Yr Devaluation)</td>
                          <td className="py-3 px-3 font-semibold text-emerald-300 bg-emerald-500/5">Thermal Symmetrical Cycle (12-Yr Retained)</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-bold">+14.2% Cell Protection</td>
                        </tr>
                        <tr className="hover:bg-white/2 transition-colors">
                          <td className="py-3 px-3 font-medium text-white/80 font-sans">Net Economic Decision Efficiency (EDE)</td>
                          <td className="py-3 px-3 text-amber-500 font-bold">76.3% Efficiency Index</td>
                          <td className="py-3 px-3 font-semibold text-emerald-400 bg-emerald-500/5">98.8% Optimum Index</td>
                          <td className="py-3 px-3 text-right text-emerald-400 font-bold">+22.5% EDE Gain</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. Dual Columns detailing Spot Pricing & Real-Time Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Spot Pricing Chart (7 Columns) */}
                  <div className="lg:col-span-7 p-6 rounded-3xl border border-white/10 bg-white/2 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
                        <div>
                          <h4 className="text-xs font-mono uppercase tracking-widest text-[#34d399] font-[#050505] font-bold">24-Hour Dispatch Profile Matrix</h4>
                          <p className="text-[10px] text-white/40 mt-0.5">System load (MW) and grid spot tariffs (USD / MWh).</p>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">{dispatchYieldMultiplier}</span>
                      </div>

                      {/* Pure CSS Dispatch profile lines representing high fidelity telemetry mapping */}
                      <div className="h-44 flex items-end justify-between gap-1.5 pt-4 border-b border-white/10" id="matrix-chart-container">
                        {dispatchData.map((pt, idx) => {
                          const maxPrice = 65;
                          const barHeight = (pt.price / maxPrice) * 100;

                          // Charging state indicator representation
                          let activityColor = "bg-white/5";
                          if (!isOptimized && pt.hour === '02:00') activityColor = "bg-amber-600 animate-pulse shadow-[0_0_15px_rgba(217,119,6,0.5)]";
                          if (isOptimized && pt.hour === '06:00') activityColor = "bg-[#10b981] animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]";
                          if (pt.hour === '14:00' || pt.hour === '16:00') activityColor = "bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]";

                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                              
                              {/* Tooltip on hover */}
                              <div className="absolute bottom-full mb-1.5 bg-[#050505] border border-white/10 rounded-xl p-2.5 hidden group-hover:block text-[9px] font-mono shadow-2xl z-20 w-32 backdrop-blur-sm">
                                <span className="text-[#34d399] font-bold block">${Math.round(pt.price * 2.6)} USD</span>
                                <span className="text-white/50 block">Solar: {pt.solar} MW</span>
                                <span className="text-white/50 block">Load: {pt.load} MW</span>
                              </div>

                              {/* Price representation bar */}
                              <div 
                                className={`w-full rounded-t-full transition-all duration-300 ${activityColor}`}
                                style={{ height: `${Math.max(barHeight, 5)}%` }} 
                              />
                              <span className="text-[8px] font-mono text-white/30 mt-1.5 block tracking-wider font-bold">
                                {pt.hour}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-4 text-[9px] font-mono uppercase tracking-wider font-bold">
                      <span className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 bg-white/10 rounded-full border border-white/10" />
                        <span className="text-white/40">Base Price</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 bg-sky-500 rounded-full" />
                        <span className="text-sky-400">Peak Discharge</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <span className={`h-2 w-2 rounded-full ${isOptimized ? 'bg-emerald-400' : 'bg-amber-600'}`} />
                        <span className={isOptimized ? 'text-emerald-400' : 'text-amber-500'}>{isOptimized ? 'PREDAIOT Ideal' : 'Early Splay'}</span>
                      </span>
                    </div>
                  </div>

                  {/* HIGHLY VISIBLE REAL-TIME MAINTENANCE ALERTS LIST (5 Columns) */}
                  <div className="lg:col-span-5 p-6 rounded-3xl border border-white/10 bg-white/2 shadow-xl flex flex-col justify-between" id="real-time-alerts-panel">
                    <div>
                      <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                          <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">Real-time Maintenance & Grid Alerts</h4>
                        </div>
                        <button 
                          onClick={handleInjectAlert}
                          className="text-[9px] font-mono uppercase bg-[#050505] hover:bg-white/5 border border-white/10 text-amber-400 px-2 py-1 rounded-full cursor-pointer cursor-pointers block transition-colors"
                        >
                          + Simulate Event
                        </button>
                      </div>

                      <p className="text-[10px] text-white/50 leading-relaxed font-sans mb-4">
                        Autonomous diagnostic loops listening to real Muscat SCADA telemetry feeds. Click checkmark to apply override bypasses.
                      </p>

                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                        {liveGridAlerts.map((alert) => {
                          const isCritical = alert.status === 'CRITICAL';
                          const isWarning = alert.status === 'ALERT';
                          const isMonitor = alert.status === 'MONITOR';
                          const isSolved = alert.status === 'RESOLVED';

                          let badgeColor = "bg-white/5 text-white/40 border-white/15";
                          if (isCritical) badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                          if (isWarning) badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                          if (isMonitor) badgeColor = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                          if (isSolved) badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

                          return (
                            <div key={alert.id} className="p-3 bg-[#050505] rounded-2xl border border-white/5 space-y-2 text-[11px] relative select-none">
                              <div className="flex justify-between items-start">
                                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border uppercase ${badgeColor}`}>
                                  {alert.status}
                                </span>
                                <span className="text-[9px] text-white/30 font-mono font-sans">{alert.time}</span>
                              </div>
                              
                              <div>
                                <h5 className="font-bold text-white uppercase text-[10px] tracking-wide font-mono leading-tight">{alert.name}</h5>
                                <p className="text-[9.5px] text-white/40 font-sans mt-0.5">{alert.location}</p>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
                                <div className="text-[10px] font-mono">
                                  <span className="text-white/30 block text-[8px] uppercase">Est Risk Loss</span>
                                  <span className={`font-bold ${isCritical ? 'text-red-400' : (isWarning ? 'text-amber-400' : 'text-emerald-400')}`}>{alert.leakProjected}</span>
                                </div>

                                {!isSolved && (
                                  <button
                                    onClick={() => handleResolveAlert(alert.id)}
                                    className="p-1 rounded-full bg-emerald-500 hover:bg-emerald-450 text-[#050505] cursor-pointer transition-colors"
                                    title="Authorize economic override loop"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* 5. INTERACTIVE EMAIL NOTIFICATIONS & DIRECT REPORTS LEDGER GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Email Subscriber Form (5 Columns) */}
                  <div className="lg:col-span-5 p-6 rounded-3xl border border-white/10 bg-white/2 shadow-xl flex flex-col justify-between" id="quick-email-opt-in">
                    <div>
                      <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-white/10">
                        <Mail className="h-4 w-4 text-[#38bdf8]" />
                        <h4 className="text-xs uppercase text-white font-mono tracking-wider font-bold">
                          SMTP Email Alerts subscription
                        </h4>
                      </div>

                      <p className="text-[11px] text-white/50 leading-relaxed font-sans mb-4">
                        Expose backend SMS & SMTP email channels directly. Subscribe now to deliver dynamic thermal balancing alerts and monthly arbitrage summaries to your corporate team:
                      </p>

                      <form onSubmit={handleSendTestEmailAlert} className="space-y-4">
                        <div>
                          <label className="text-[9px] text-white/40 block uppercase font-mono tracking-wider font-bold mb-1">Corporate Destination Email</label>
                          <input 
                            type="email"
                            required
                            value={testEmailAddress}
                            onChange={(e) => setTestEmailAddress(e.target.value)}
                            className="w-full rounded-xl bg-[#050505] border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#38bdf8]/50 focus:bg-white/5 transition-all font-mono"
                            placeholder="salim@oman-energy.com"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] text-white/40 block uppercase font-mono tracking-wider font-bold mb-1">Ancillary Alarm Threshold</label>
                          <div className="flex items-center space-x-3">
                            <input 
                              type="range" 
                              min="10" 
                              max="100" 
                              value={triggerValueThreshold}
                              onChange={(e) => setTriggerValueThreshold(Number(e.target.value))}
                              className="flex-grow accent-[#38bdf8] h-1 bg-white/10 rounded-full cursor-pointer focus:outline-none"
                            />
                            <span className="font-mono text-[#38bdf8] font-bold bg-[#050505] border border-white/10 px-2 py-0.5 rounded-xl text-[10px]">
                              ${Math.round(triggerValueThreshold * 2.6)} USD
                            </span>
                          </div>
                        </div>

                        {emailStatusLog && (
                          <div className="p-3 bg-[#050505] border border-white/5 rounded-2xl font-mono text-[9px] text-[#38bdf8] leading-relaxed max-h-24 overflow-y-auto">
                            {emailStatusLog}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSendingEmailTest}
                          className="w-full text-center bg-[#38bdf8] hover:bg-sky-400 py-2.5 rounded-full text-xs text-[#050505] font-extrabold uppercase tracking-widest transition-all cursor-pointer shadow-[0_4px_15px_rgba(56,189,248,0.2)] disabled:opacity-50"
                        >
                          {isSendingEmailTest ? "SMTP Delivering..." : "Confirm & Push Test Alert"}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Daily/Weekly/Monthly structured visual reports ledger (7 Columns) */}
                  <div className="lg:col-span-7 p-6 rounded-3xl border border-white/10 bg-white/2 shadow-xl flex flex-col justify-between" id="report-vault-prominent">
                    <div>
                      <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                        <div className="flex items-center space-x-2">
                          <DownloadCloud className="h-4 w-4 text-emerald-400" />
                          <h4 className="text-xs uppercase text-white font-mono tracking-wider font-bold">
                            Corporate Ledger & Operational Reports Center
                          </h4>
                        </div>
                      </div>

                      <p className="text-[10px] text-white/50 leading-relaxed font-sans mb-4">
                        Review and download historical, compiled decision logs. Click the respective format button to compile the ASCII spreadsheet report directly to your device.
                      </p>

                      <div className="space-y-3">
                        
                        {/* Daily Arbitrage Report Row */}
                        <div className="p-3.5 bg-[#050505] rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">#REP-DAILY</span>
                              <span className="text-slate-200 font-bold font-sans">Daily Arbitrage Statement</span>
                            </div>
                            <p className="text-[10px] text-white/40 font-sans">Contains hourly pricing vectors, cell charging SoC telemetry points, of yesterday.</p>
                          </div>
                          
                          <div className="flex items-center space-x-1.5 self-end sm:self-center">
                            <button onClick={() => downloadReportDirect('DAILY_ARBITRAGE', 'CSV')} className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1.5 text-slate-300 rounded border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-center font-bold">CSV</button>
                            <button onClick={() => downloadReportDirect('DAILY_ARBITRAGE', 'JSON')} className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1.5 text-slate-300 rounded border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-center font-bold">JSON</button>
                            <button onClick={() => downloadReportDirect('DAILY_ARBITRAGE', 'TXT')} className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1.5 text-slate-300 rounded border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-center font-bold">TXT</button>
                          </div>
                        </div>

                        {/* Weekly Outages Row */}
                        <div className="p-3.5 bg-[#050505] rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[8px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded">#REP-WEEKLY</span>
                              <span className="text-slate-200 font-bold font-sans">Weekly Grid Anomalies Stress Audit</span>
                            </div>
                            <p className="text-[10px] text-white/40 font-sans">Contains historical splay, frequency fluctuations, and solar curtailments.</p>
                          </div>
                          
                          <div className="flex items-center space-x-1.5 self-end sm:self-center">
                            <button onClick={() => downloadReportDirect('WEEKLY_OUTAGES', 'CSV')} className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1.5 text-slate-300 rounded border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-center font-bold">CSV</button>
                            <button onClick={() => downloadReportDirect('WEEKLY_OUTAGES', 'JSON')} className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1.5 text-slate-300 rounded border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-center font-bold">JSON</button>
                            <button onClick={() => downloadReportDirect('WEEKLY_OUTAGES', 'TXT')} className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1.5 text-slate-300 rounded border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-center font-bold">TXT</button>
                          </div>
                        </div>

                        {/* Monthly Ledger Row */}
                        <div className="p-3.5 bg-[#050505] rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">#REP-MONTHLY</span>
                              <span className="text-slate-200 font-bold font-sans">Monthly Profit Reconciliation Index</span>
                            </div>
                            <p className="text-[10px] text-white/40 font-sans">Contains executive yield settlements, capacity factors, and BESS wear-health.</p>
                          </div>
                          
                          <div className="flex items-center space-x-1.5 self-end sm:self-center">
                            <button onClick={() => downloadReportDirect('MONTHLY_LEDGER', 'CSV')} className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1.5 text-slate-300 rounded border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-center font-bold">CSV</button>
                            <button onClick={() => downloadReportDirect('MONTHLY_LEDGER', 'JSON')} className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1.5 text-slate-300 rounded border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-center font-bold">JSON</button>
                            <button onClick={() => downloadReportDirect('MONTHLY_LEDGER', 'TXT')} className="text-[9px] font-mono uppercase bg-white/5 px-2.5 py-1.5 text-slate-300 rounded border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-center font-bold">TXT</button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>

                {/* 6. Downward Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button 
                    onClick={getLogReportUrl}
                    className="w-full sm:flex-1 rounded-full border border-white/10 bg-white/5 p-3.5 text-xs text-slate-300 flex items-center justify-center space-x-2 transition hover:bg-white/10 cursor-pointer font-bold uppercase tracking-wider"
                  >
                    <HardDriveDownload className="h-4 w-4 text-emerald-400" />
                    <span>Download Core Dispatch LOGS (.log)</span>
                  </button>
                  <button 
                    onClick={triggerGridSimulationCycle}
                    disabled={isSimulatingCycle}
                    className="w-full sm:flex-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 flex items-center justify-center space-x-2 transition hover:bg-[#10b981]/20 cursor-pointer font-bold uppercase tracking-wider shadow-[0_4px_15px_rgba(16,185,129,0.1)]"
                  >
                    <RefreshCw className={`h-4 w-4 text-emerald-400 ${isSimulatingCycle ? 'animate-spin' : ''}`} />
                    <span>{isSimulatingCycle ? 'Sweeping portfolio vectors...' : 'Force System Wide Dispatch Sweep'}</span>
                  </button>
                </div>

              </div>
            )}

            {/* 2. Simulation Sandbox tab */}
            {activeTab === 'SIMULATION' && (
              <div className="space-y-6 animate-fade-in" id="simulation-tab">
                <div className="bg-white/2 p-6 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
                  <div className="border-b border-white/10 pb-4 mb-5 flex justify-between items-center">
                    <span className="text-xs font-mono uppercase font-bold text-sky-400 tracking-wider">
                      Muscat Basin Dispatch Simulation Laboratory
                    </span>
                    <span className="text-[9px] text-white/50 bg-[#050505] border border-white/10 px-2.5 py-1 rounded-full font-mono uppercase font-bold tracking-wider">
                      V2.4_SIM
                    </span>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed mb-6 font-sans">
                    Analyze the financial outcome under varying operational scenarios. PREDAIOT simulates extreme weather patterns, transmission congestion limits, and spot market pricing matrices.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#050505] p-5 rounded-2xl border border-white/10 space-y-5">
                      <h4 className="text-xs uppercase text-white/40 font-mono font-bold tracking-widest">Simulated Variables</h4>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-white/40 block uppercase font-mono tracking-wider font-bold">BESS Grid Capacity (MW)</label>
                        <input type="range" min="10" max="500" defaultValue="250" className="w-full accent-emerald-500 h-1 bg-white/10 rounded-full cursor-pointer" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-white/40 block uppercase font-mono tracking-wider font-bold">Oman Grid Summer Demand Peak (MW)</label>
                        <input type="range" min="3000" max="8000" defaultValue="4500" className="w-full accent-emerald-500 h-1 bg-white/10 rounded-full cursor-pointer" />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-white/40 block uppercase font-mono tracking-wider font-bold">Target Battery Degradation Rate</label>
                        <select className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-xs text-white uppercase font-mono focus:outline-none">
                          <option>0.08% / month (Gentle Optimal charging limit)</option>
                          <option>0.15% / month (Accelerated - Static cycle)</option>
                          <option>0.24% / month (Critical Circle Wear loop)</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-[#050505] p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs uppercase text-white/40 font-mono font-bold tracking-widest mb-4">Simulation Projections</h4>
                        <div className="space-y-3.5 font-mono text-xs">
                          <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-white/40">Peak Arbitrage:</span>
                            <span className="text-white font-bold font-mono">$333,840 USD / day</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-white/40">System Peak Co-efficiency:</span>
                            <span className="text-emerald-400 font-bold font-mono">94.2% (Excellent)</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-white/40">Est Degradation Cost:</span>
                            <span className="text-amber-500 font-bold font-mono">$4,810 USD / cycle</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={triggerGridSimulationCycle}
                        className="w-full text-center bg-emerald-500 hover:bg-emerald-400 rounded-full p-3 text-xs text-[#050505] font-extrabold uppercase tracking-widest shadow-[0_4px_15px_rgba(16,185,129,0.2)] cursor-pointer mt-6"
                      >
                        {isSimulatingCycle ? 'Calculating vectors...' : 'Simulate Custom Scenario'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Assets Tab */}
            {activeTab === 'ASSETS' && (
              <div className="space-y-6 animate-fade-in" id="assets-tab">
                <div className="bg-white/2 p-6 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10 mb-6 font-sans">
                    <div>
                      <h4 className="text-xs uppercase text-white/40 font-mono tracking-widest font-bold">Oman Regional Subnets Scanner</h4>
                      <p className="text-[10px] text-white/50 mt-0.5">Identify real-time localized tariff anomalies across Oman.</p>
                    </div>
                    
                    {/* Search bar block */}
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        placeholder="Search subnets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full bg-[#050505] border border-white/10 px-4 py-2.5 text-xs text-white pl-10 outline-none focus:border-emerald-500/50 transition-all font-sans"
                      />
                      <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-white/30" />
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {filteredEvents.map(ev => {
                      let statusBadge = "bg-red-500/10 text-red-400 border-red-500/20";
                      if (ev.status === 'ALERT') statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                      if (ev.status === 'MONITOR') statusBadge = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                      if (ev.status === 'RESOLVED') statusBadge = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

                      return (
                        <div key={ev.id} className="p-4 bg-[#050505] rounded-2xl border border-white/10 flex justify-between items-center text-xs hover:border-white/25 transition-all">
                          <div className="space-y-1">
                            <span className={`px-2.5 py-1 rounded-full text-[8px] font-mono font-bold uppercase border ${statusBadge}`}>
                              {ev.status}
                            </span>
                            <p className="font-bold text-white uppercase font-mono mt-2 tracking-wide text-sm">{ev.name}</p>
                            <span className="text-[10px] text-white/40 font-mono">Region: {ev.location}</span>
                          </div>
                          
                          <div className="text-right font-mono">
                            <span className="text-[9px] text-white/30 block uppercase font-mono tracking-wider">Estimated Leakage</span>
                            <span className="text-amber-500 font-bold font-mono text-base">{ev.leakProjected}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Recommendations tab */}
            {activeTab === 'RECOMMENDATIONS' && (
              <div className="space-y-6 animate-fade-in" id="recommendations-tab">
                <div className="bg-white/2 p-6 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl space-y-4">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
                    AI recommendation engine logs
                  </span>
                  
                  <div className="bg-[#050505] p-5 rounded-2xl border border-white/10 text-xs text-white/75 leading-relaxed font-mono">
                    <span className="text-emerald-400 font-bold text-sm block mb-3 font-mono">[DECISION RECON_V21]</span>
                    <span className="text-white block font-bold mb-1">Observation of Asset 4 Dispatch behavior:</span>
                    Current charging loops timing parameter is 02:00-05:00. OPWP spot pricing vectors show high volatility rate threshold beginning 06:00. BESS SoC capacity drift allows minor circular degradation penalty of $48,620 per year.
                    
                    <span className="text-white block font-bold mt-4 mb-1">Recommended correction:</span>
                    Apply optimal dispatch rule to shift baseline charging window to 04:00-07:00. This avoids Circular peak degradation risk and captures optimal generation valley rates.
                  </div>
                  
                  <div className="text-right">
                    <button 
                      onClick={() => setChargingWindow('OPTIMIZED')}
                      className="bg-emerald-500 hover:bg-emerald-400 rounded-full px-5 py-3 text-xs font-bold text-[#050505] uppercase tracking-widest shadow-[0_4px_15px_rgba(16,185,129,0.2)] cursor-pointer"
                    >
                      Apply Recommended Window Change
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Economic Methodology Math tab */}
            {activeTab === 'METHODOLOGY' && (
              <div className="space-y-8 animate-fade-in text-[#f8fafc]" id="methodology-tab">
                
                {/* 1. Header Card */}
                <div className="p-6 bg-gradient-to-br from-emerald-950/20 to-black rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
                  <span className="font-mono text-[9px] uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 tracking-widest font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    PREDAIOT CORE ECONOMIC COMPILER
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-4 font-sans leading-tight">
                    Discovery Engineering: Reconstructing the Economic Potential Gap (EPG)
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed font-sans mt-2 max-w-2xl">
                    PREDAIOT compiles, registers, and corrects decision-quality degradation on grid-intertied energy installations. 
                    It is designed to systematically answer the question: <em className="text-emerald-400 not-italic">"How is lost economic value calculated?"</em>
                  </p>
                </div>

                {/* 2. Grid explaining the equations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  
                  {/* Card A: Actual Dispatch Formulation */}
                  <div className="bg-white/2 p-6 rounded-3xl border border-white/10 shadow-lg space-y-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-7 w-7 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                        <span className="text-[10px] font-mono font-bold text-red-400">EVa</span>
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#34d399] font-mono">1. Actual Dispatch Formulation</h4>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">
                      At every time slot <code className="text-emerald-400 font-mono">t</code> (compiled in high-frequency 15-minute intervals), actual energy yield and cash flows are logged directly from telemetry sensors:
                    </p>
                    <div className="p-4 bg-[#050505] rounded-xl border border-white/5 font-mono text-[11px] text-center text-slate-100 flex flex-col justify-center gap-1.5">
                      <div className="text-slate-400 text-[10px]">Actual Net Economic Profit Formula</div>
                      <div className="text-xs font-bold text-emerald-400">EV_actual(t) = Revenue(t) - Cost(t)</div>
                      <div className="text-[9px] text-white/30 pt-1.5 border-t border-white/5 text-left leading-normal">
                        Where:
                        <ul className="list-disc pl-3 mt-1 space-y-0.5 text-[9px] text-zinc-400">
                          <li><strong className="text-slate-200">Revenue(t):</strong> Power injected to grid &times; SMP spot tariff + ancillary returns.</li>
                          <li><strong className="text-slate-200">Cost(t):</strong> Grid_kWh &times; purchase price + Diesel_Liters &times; FuelPrice.</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed font-sans">
                      The total actual profit for a given period <code className="text-emerald-400 font-mono">EV_actual_total</code> is the mathematical sum of all intervals:
                    </p>
                    <div className="p-3.5 bg-[#050505] rounded-xl border border-white/5 font-mono text-center text-xs font-bold text-white">
                      ∑ [Revenue(t) - Cost(t)]
                    </div>
                  </div>

                  {/* Card B: Optimal Dispatch Simulation (The Ideal Machine) */}
                  <div className="bg-white/2 p-6 rounded-3xl border border-white/10 shadow-lg space-y-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-7 w-7 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                        <span className="text-[10px] font-mono font-bold text-emerald-400">EVo</span>
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#34d399] font-mono">2. Optimal Economic Dispatch</h4>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed font-sans">
                      PREDAIOT's Simulation Engine runs parallel, real-time optimal path tracing. It models how an economically omniscient dispatcher would configure the same system:
                    </p>
                    <div className="p-4 bg-[#050505] rounded-xl border border-white/5 font-mono text-[11px] text-center text-slate-100 flex flex-col justify-center gap-1.5">
                      <div className="text-slate-400 text-[10px]">Optimal Target Matrix Formula</div>
                      <div className="text-xs font-bold text-emerald-400">EV_optimal = Max_Dispatch [∑ (Energy_i &times; Value_i)]</div>
                      <div className="text-[9px] text-white/30 pt-1.5 border-t border-white/5 text-left leading-normal">
                        Subject to strict physical battery updates:
                        <div className="font-bold text-zinc-300 mt-1 font-mono text-center">SOC_(t+1) = SOC_t + (η_c &times; P_c) - (P_d / η_d)</div>
                        <ul className="list-disc pl-3 mt-1 space-y-0.5 text-[9px] text-zinc-400">
                          <li><strong className="text-slate-200">η_c / η_d:</strong> Electrochemical round-trip efficiency coefficients.</li>
                          <li><strong className="text-slate-200">SOC_min &lt; SOC &lt; SOC_max:</strong> Prevents battery chemical collapse.</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed font-sans">
                      This represents back-testing on real grid parameters to establish the absolute performance boundary of your asset.
                    </p>
                  </div>

                </div>

                {/* 3. The investor KPIs */}
                <div className="bg-white/2 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
                  <div>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">INVESTOR-RELEVANT KPIs</span>
                    <h4 className="text-lg font-bold text-white mt-1">Measuring the Loss: EPG & EDE Metrics</h4>
                    <p className="text-xs text-white/50 mt-1 font-sans">
                      Investors and utilities evaluate operating performance through two primary mathematical ratios:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* EPG Card */}
                    <div className="bg-[#050505] p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-red-400 font-mono block">Economic Potential Gap (EPG)</span>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          The absolute financial margin leaked. It represents "leaking wealth" on the asset's books.
                        </p>
                      </div>
                      <div className="bg-white/2 p-4 rounded-xl border border-white/5 font-mono text-center text-sm font-bold text-white mt-4">
                        EPG = EV_optimal - EV_actual
                        <span className="block text-[10px] font-normal text-white/40 font-mono mt-1">Example: 125,000 OMR - 100,000 OMR = 25,000 OMR Loss</span>
                      </div>
                    </div>

                    {/* EDE Card */}
                    <div className="bg-[#050505] p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono block">Economic Decision Efficiency (EDE)</span>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          The efficiency index. If EDE is 1, the asset is operating optimally. 0.763 represents a 23.7% leakage.
                        </p>
                      </div>
                      <div className="bg-white/2 p-4 rounded-xl border border-white/5 font-mono text-center text-sm font-bold text-emerald-400 mt-4">
                        EDE = EV_actual / EV_optimal
                        <span className="block text-[10px] font-normal text-white/40 font-mono mt-1">Target Boundary with PREDAIOT: &gt;98.5%</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 4. Real-time options evaluated */}
                <div className="bg-white/2 p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <Cpu className="h-5 w-5 text-emerald-400 animate-pulse" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#34d399] font-mono">Real-Time Pilot Mode Decision Engine (Real-Time)</h4>
                  </div>
                  
                  <p className="text-xs text-white/60 leading-relaxed font-sans">
                    At each 1-5 minute timestep interval (<code className="text-emerald-400 font-mono">t</code>), PREDAIOT ingests telemetry vectors (<code className="text-white/70">Load, PV, SOC, Grid, Diesel, and OPWP Spot Price</code>). The compiler continuously models future states and evaluates up to four actions to select the one that yields the absolute peak economic returns:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs select-none">
                    <div className="p-3 bg-[#050505] rounded-xl border border-white/5 text-center">
                      <span className="text-red-400 font-bold block mb-1">A</span>
                      <p className="text-[10px] text-white/50 font-sans">Discharge Battery (Peak Arbitrage Shaving)</p>
                    </div>
                    <div className="p-3 bg-[#050505] rounded-xl border border-white/5 text-center">
                      <span className="text-amber-400 font-bold block mb-1">B</span>
                      <p className="text-[10px] text-white/50 font-sans">Hold Capacity / Storage Mode</p>
                    </div>
                    <div className="p-3 bg-[#050505] rounded-xl border border-white/5 text-center">
                      <span className="text-sky-450 font-bold block mb-1">C</span>
                      <p className="text-[10px] text-white/50 font-sans">Charge battery using grid tariff valleys</p>
                    </div>
                    <div className="p-3 bg-[#050505] rounded-xl border border-white/2 text-center">
                      <span className="text-teal-400 font-bold block mb-1">D</span>
                      <p className="text-[10px] text-white/50 font-sans">Fire Diesel Generator (Only during deficit)</p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#050505] rounded-xl border border-emerald-500/20 text-center font-mono">
                    <span className="text-zinc-400 text-[10px] block mb-1 uppercase tracking-wider">PREDAIOT Decision Rule</span>
                    <span className="text-sm font-bold text-emerald-400">Decision = ArgMax [ EV_i(t) ]</span>
                    <p className="text-[9px] text-[#34d399] mt-1">Respecting battery thermodynamic wear boundaries & spot pool constraints.</p>
                  </div>
                </div>

                {/* 5. Return to Overview button */}
                <div className="text-center pt-2">
                  <button 
                    onClick={() => setActiveTab2('OVERVIEW')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#050505] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer inline-flex items-center space-x-1.5"
                  >
                    <span>Back to Operations Overview</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

              </div>
            )}

            {/* 5. Settings / Integration Panel / Alerts & Email tab */}
            {activeTab === 'SETTINGS' && (
              <div className="space-y-6 animate-fade-in" id="settings-tab">
                
                {/* Visual Header Banner with high fidelity photo */}
                <div className="rounded-3xl overflow-hidden h-44 w-full relative border border-white/10 select-none shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80" 
                    alt="Muscat Substation under predictive telemetry sweep" 
                    className="h-full w-full object-cover opacity-65"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                    <div>
                      <span className="font-mono text-[9px] uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full tracking-wider font-bold">
                        Central Command Console
                      </span>
                      <h3 className="font-sans text-white font-extrabold text-xl mt-1.5">
                        Integration & System Controls
                      </h3>
                    </div>
                    <Radio className="h-6 w-6 text-emerald-400 animate-pulse hidden sm:block" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* FastAPI Integration Center */}
                  <div className="bg-white/2 p-5 rounded-3xl border border-white/10 backdrop-blur-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
                        <Cpu className="h-4 w-4 text-emerald-400" />
                        <h4 className="text-xs uppercase text-white font-mono tracking-wider font-bold">
                          FastAPI Real-time API Pipeline
                        </h4>
                      </div>

                      <p className="text-[11px] text-white/50 leading-relaxed font-sans mb-3">
                        Connect high-frequency SCADA telemetry directly into the PREDAIOT economic optimizer. Paste this boilerplate code in your Python FastAPI backend to stream spot price deviations:
                      </p>

                      <div className="bg-[#050505] p-3 rounded-2xl border border-white/10 text-[10px] font-mono text-slate-300 overflow-x-auto whitespace-pre leading-normal max-h-56">
{`from fastapi import FastAPI, WebSocket
import json
import asyncio

app = FastAPI()

# Stream coordinates to PREDAIOT Muscat Node
@app.websocket("/ws/scada")
async def scada_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        # Load system pricing variables
        telemetry = {
            "node_id": "OPWP_BLOCK_4",
            "bess_soc": 98.4,
            "grid_demand_mw": 4500,
            "current_tariff_mwh": 42.1
        }
        await websocket.send_text(json.dumps(telemetry))
        await asyncio.sleep(1.0)`}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-white/40">Secure Endpoint URI:</span>
                      <span className="text-emerald-400 border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 rounded-full">wss://api.predaiot.ai/ws/scada</span>
                    </div>
                  </div>

                  {/* Real-time System notifications configuration */}
                  <div className="bg-white/2 p-5 rounded-3xl border border-white/10 backdrop-blur-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
                        <Bell className="h-4 w-4 text-amber-500" />
                        <h4 className="text-xs uppercase text-white font-mono tracking-wider font-bold">
                          System Notifications Center
                        </h4>
                      </div>

                      <p className="text-[11px] text-white/50 leading-relaxed font-sans mb-4">
                        Configure customized prompt thresholds to push real-time alerts onto your dispatch workspace console. Test your grid alarms here:
                      </p>

                      <div className="space-y-4 font-sans text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 block uppercase font-mono tracking-widest font-bold">Alert Trigger Threshold (USD / MWh Spread)</label>
                          <div className="flex items-center space-x-3">
                            <input 
                              type="range" 
                              min="10" 
                              max="100" 
                              value={triggerValueThreshold}
                              onChange={(e) => setTriggerValueThreshold(Number(e.target.value))}
                              className="flex-grow accent-emerald-500 h-1 bg-white/10 rounded-full cursor-pointer"
                            />
                            <span className="font-mono text-emerald-400 font-bold bg-[#050505] border border-white/10 px-2.5 py-1 rounded-xl text-[10px]">
                              ${Math.round(triggerValueThreshold * 2.6)} USD
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-[#050505] rounded-xl border border-white/10">
                          <span className="text-[9px] font-mono text-white/30 block uppercase font-bold tracking-wider mb-1">State: Active & Listening</span>
                          <p className="text-[10px] text-white/60 leading-relaxed font-sans">
                            When regional spot tariff spreads exceed <strong className="text-emerald-400 font-mono">${Math.round(triggerValueThreshold * 2.6)} USD</strong>, the decision engine automatically executes emergency battery absorption loops to lock in high-margin arbitrage.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setToastNotification(`[ALERT TRIGGER TEST] Muscat sub-station spread exceeded $${Math.round(triggerValueThreshold * 2.6)} USD! Dispatched urgent peak arbitrage recommendations.`);
                        setTimeout(() => setToastNotification(null), 8500);
                      }}
                      className="w-full text-center bg-white/5 border border-white/10 hover:bg-amber-500/10 hover:border-amber-500/20 py-2.5 rounded-full text-xs text-amber-400 font-semibold cursor-pointer transition-all mt-4"
                    >
                      Simulate Real-time Grid Alert
                    </button>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Email alerts notification hub */}
                  <div className="bg-white/2 p-5 rounded-3xl border border-white/10 backdrop-blur-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
                        <Mail className="h-4 w-4 text-[#38bdf8]" />
                        <h4 className="text-xs uppercase text-white font-mono tracking-wider font-bold">
                          Secure Email Alert Ledger Hub
                        </h4>
                      </div>

                      <p className="text-[11px] text-white/50 leading-relaxed font-sans mb-4">
                        Enable direct email reports containing active circular wear stats, degradation alerts, and daily economic loss matrices delivered to your executives:
                      </p>

                      <form onSubmit={handleSendTestEmailAlert} className="space-y-4">
                        <div>
                          <label className="text-[9px] text-white/40 block uppercase font-mono tracking-wider font-bold mb-1">Target Corporate Recipient</label>
                          <input 
                            type="email"
                            required
                            value={testEmailAddress}
                            onChange={(e) => setTestEmailAddress(e.target.value)}
                            className="w-full rounded-xl bg-[#050505] border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-[#38bdf8]/50 focus:bg-white/5 transition-all font-mono"
                            placeholder="salim@oman-energy.com"
                          />
                        </div>

                        {emailStatusLog && (
                          <div className="p-3 bg-[#050505] border border-white/10 rounded-2xl font-mono text-[9px] text-[#38bdf8] leading-relaxed max-h-24 overflow-y-auto">
                            {emailStatusLog}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSendingEmailTest}
                          className="w-full text-center bg-[#38bdf8] hover:bg-sky-400 py-2.5 rounded-full text-xs text-[#050505] font-extrabold uppercase tracking-widest transition-all cursor-pointer shadow-[0_4px_15px_rgba(56,189,248,0.2)] disabled:opacity-50"
                        >
                          {isSendingEmailTest ? "SMTP Delivering..." : "Dispatch Test Alert Email"}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Daily and weekly downloader reports vault */}
                  <div className="bg-white/2 p-5 rounded-3xl border border-white/10 backdrop-blur-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
                        <DownloadCloud className="h-4 w-4 text-emerald-400" />
                        <h4 className="text-xs uppercase text-white font-mono tracking-wider font-bold">
                          Daily / Weekly Reports Vault
                        </h4>
                      </div>

                      <p className="text-[11px] text-white/50 leading-relaxed font-sans mb-4">
                        Request and export historical operating yield, curtailment bypass spreadsheets, and circular arbitrage summaries directly to your device:
                      </p>

                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <div>
                          <label className="text-[9px] text-white/40 block uppercase font-mono tracking-wider font-bold mb-1">Selected Log Type</label>
                          <select 
                            value={selectedReportType} 
                            onChange={(e) => setSelectedReportType(e.target.value as any)}
                            className="w-full bg-[#050505] border border-white/10 p-2.5 rounded-xl text-xs uppercase font-mono focus:outline-none"
                          >
                            <option value="DAILY_ARBITRAGE">Daily Arbitrage</option>
                            <option value="WEEKLY_OUTAGES">Weekly Outages</option>
                            <option value="MONTHLY_LEDGER">Monthly Ledger</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] text-white/40 block uppercase font-mono tracking-wider font-bold mb-1">Spreadsheet Format</label>
                          <select 
                            value={selectedReportFormat} 
                            onChange={(e) => setSelectedReportFormat(e.target.value as any)}
                            className="w-full bg-[#050505] border border-white/10 p-2.5 rounded-xl text-xs uppercase font-mono focus:outline-none"
                          >
                            <option value="CSV">COMMA (.csv)</option>
                            <option value="TXT">ASCII TEXT (.txt)</option>
                            <option value="JSON">STRUCT (.json)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDownloadCustomReport}
                      disabled={isGeneratingReport}
                      className="w-full text-center bg-emerald-500 hover:bg-emerald-400 py-3 rounded-full text-xs text-[#050505] font-extrabold uppercase tracking-widest transition-all cursor-pointer shadow-[0_4px_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                    >
                      {isGeneratingReport ? "Synthesizing spreadsheet..." : "Generate & Download Operational Report"}
                    </button>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* 3. Toast Notifications sliding overlay */}
      {toastNotification && (
        <div className="fixed bottom-8 left-8 z-55 w-full max-w-sm px-4">
          <div className="bg-slate-900 border border-white/20 text-slate-100 p-4 rounded-2xl shadow-2xl flex items-start space-x-3">
            <Radio className="h-4.5 w-4.5 text-emerald-400 mt-0.5 animate-pulse" />
            <div className="text-xs flex-grow font-sans">
              <p className="font-bold text-emerald-400 font-mono text-[9px] tracking-wider uppercase">Enterprise Message Alert</p>
              <p className="mt-1 leading-relaxed text-slate-300">{toastNotification}</p>
            </div>
            <button onClick={() => setToastNotification(null)} className="text-slate-400 hover:text-white font-bold pl-2 text-md leading-none">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}
