import type { SectorContent } from "./types";

export const GROUP_A: Record<string, SectorContent> = {
  oilgas: {
    headline: {
      en: "Every molecule is a price decision. Are yours timed to the market?",
      ar: "كل جزيء قرارُ سعرٍ. هل قراراتك موقوتة على السوق؟",
    },
    lead: {
      en: "Gas-to-power allocation, compression, and processing all run against a moving price. Whether to burn, sell, or store is an economic decision made hundreds of times a day — usually on a schedule, not on the spread.",
      ar: "تخصيص الغاز للتوليد، والضغط، والمعالجة — كلها تُدار مقابل سعر متحرّك. قرار الحرق أو البيع أو التخزين قرارٌ اقتصادي يُتّخذ مئات المرّات يوميًا — غالبًا على جدول، لا على الفارق السعري.",
    },
    leaks: [
      {
        title: { en: "Gas allocated on a schedule, not the spark spread", ar: "الغاز يُخصَّص على جدول لا على فارق الشرارة" },
        body: {
          en: "The choice to burn gas for power or sell it to the grid moves with the spark spread every hour. Fixed allocation ignores the hours when selling beats burning.",
          ar: "قرار حرق الغاز للتوليد أو بيعه للشبكة يتحرّك مع فارق الشرارة كل ساعة. التخصيص الثابت يتجاهل الساعات التي يتفوّق فيها البيع على الحرق.",
        },
      },
      {
        title: { en: "Compression running flat while tariffs swing", ar: "الضغط يعمل بثبات بينما تتأرجح التعرفة" },
        body: {
          en: "Compressors and processing trains draw large, shiftable loads. Running them through peak-price hours instead of cheap ones is a recoverable cost with no production impact.",
          ar: "الضواغط وقطارات المعالجة تسحب أحمالًا كبيرة قابلة للإزاحة. تشغيلها في ساعات الذروة السعرية بدل الساعات الرخيصة تكلفةٌ قابلة للاسترجاع دون أثر على الإنتاج.",
        },
      },
      {
        title: { en: "Flaring and venting as unpriced loss", ar: "الحرق والتنفيس كخسارة غير مُسعّرة" },
        body: {
          en: "Associated gas that is flared has an opportunity cost the control room never sees in OMR — because no system prices the decision to flare versus capture and monetize.",
          ar: "الغاز المصاحب الذي يُحرق له تكلفة فرصة لا تراها غرفة التحكم بالريال — لأن لا نظام يُسعّر قرار الحرق مقابل الالتقاط والاستثمار.",
        },
      },
    ],
    levers: [
      { name: { en: "Spark-spread-aware allocation", ar: "تخصيص واعٍ بفارق الشرارة" }, body: { en: "Route gas to power or market on the hourly spread, not a fixed split.", ar: "توجيه الغاز للتوليد أو السوق حسب الفارق الساعي، لا تقسيم ثابت." } },
      { name: { en: "Load-shift compression", ar: "إزاحة حمل الضغط" }, body: { en: "Move shiftable compression and processing into the cheapest hours.", ar: "نقل الضغط والمعالجة القابلين للإزاحة إلى أرخص الساعات." } },
      { name: { en: "Associated-gas monetization timing", ar: "توقيت استثمار الغاز المصاحب" }, body: { en: "Price the flare-versus-capture decision and act when capture pays.", ar: "تسعير قرار الحرق مقابل الالتقاط والتحرّك حين يُجدي الالتقاط." } },
      { name: { en: "Maintenance in low-price windows", ar: "الصيانة في نوافذ الأسعار المنخفضة" }, body: { en: "Schedule downtime into hours where lost output is cheapest.", ar: "جدولة التوقّف في الساعات التي يكون فيها الإنتاج المفقود أرخص." } },
    ],
    faqs: [
      { q: { en: "We already have an energy management system. Why this?", ar: "لدينا نظام إدارة طاقة بالفعل. لماذا هذا؟" }, a: { en: "EMS measures technical performance. We measure the economic quality of each dispatch and allocation decision in OMR — a different signal your EMS doesn't compute.", ar: "نظام إدارة الطاقة يقيس الأداء التقني. نحن نقيس الجودة الاقتصادية لكل قرار توزيع وتخصيص بالريال — إشارة مختلفة لا يحسبها نظامك." } },
      { q: { en: "Does this touch our control systems?", ar: "هل يمسّ هذا أنظمة التحكم لدينا؟" }, a: { en: "No. Read-only by default. We replay your decisions against published prices and quantify the gap. Live control is opt-in and comes later.", ar: "لا. القراءة فقط افتراضيًا. نُعيد تشغيل قراراتك مقابل الأسعار المنشورة ونقيس الفجوة. التحكم الحي اختياري ولاحق." } },
    ],
  },

  power: {
    headline: {
      en: "Your plant runs on a dispatch order. Is the order economically optimal?",
      ar: "محطتك تعمل بأمر توزيع. هل الأمر هو الأمثل اقتصاديًا؟",
    },
    lead: {
      en: "Unit commitment, ramping, and reserve-versus-energy are decided hour by hour against a market price. Small lags between the merit order and the real economics compound into a large annual gap.",
      ar: "الالتزام بالوحدات، والرفع التدريجي، والاحتياطي مقابل الطاقة — تُقرّر ساعةً بساعة مقابل سعر السوق. فجواتٌ صغيرة بين ترتيب الجدارة والاقتصاد الحقيقي تتراكم إلى فجوة سنوية كبيرة.",
    },
    leaks: [
      {
        title: { en: "Unit commitment lagging the merit order", ar: "الالتزام بالوحدات متأخّر عن ترتيب الجدارة" },
        body: { en: "Committing or holding a unit an hour late — or early — sells energy at the wrong margin. The plant meets its MW target and still leaves money on the table.", ar: "الالتزام بوحدة أو تعليقها بساعة تأخّرًا أو تبكيرًا يبيع الطاقة عند هامش خاطئ. المحطة تبلغ هدف الميجاوات وتترك المال على الطاولة." },
      },
      {
        title: { en: "Ramp cost ignored in the decision", ar: "تكلفة الرفع مُهمَلة في القرار" },
        body: { en: "Ramping fast to chase a peak has a fuel and wear cost. When that cost isn't priced against the captured margin, aggressive ramps quietly lose money.", ar: "الرفع السريع لملاحقة الذروة له تكلفة وقود وتآكل. حين لا تُسعَر تلك التكلفة مقابل الهامش الملتقَط، تخسر عمليات الرفع العنيفة المال بهدوء." },
      },
      {
        title: { en: "Must-run hours at low or negative margin", ar: "ساعات التشغيل الإلزامي بهامش منخفض أو سالب" },
        body: { en: "Running through low-price hours to avoid a shutdown can cost more than the shutdown-restart cycle would. Nobody prices the two paths side by side.", ar: "التشغيل خلال ساعات الأسعار المنخفضة لتجنّب الإيقاف قد يكلّف أكثر من دورة الإيقاف والتشغيل. لا أحد يُسعّر المسارين جنبًا إلى جنب." },
      },
    ],
    levers: [
      { name: { en: "Price-aware unit commitment", ar: "التزام بالوحدات واعٍ بالسعر" }, body: { en: "Commit and de-commit on the hourly margin, not a day-ahead assumption.", ar: "الالتزام والتحرّر حسب الهامش الساعي، لا افتراض اليوم السابق." } },
      { name: { en: "Ramp-cost-aware dispatch", ar: "توزيع واعٍ بتكلفة الرفع" }, body: { en: "Weigh ramp fuel and wear against the margin the ramp captures.", ar: "موازنة وقود الرفع والتآكل مقابل الهامش الذي يلتقطه." } },
      { name: { en: "Start/stop timing", ar: "توقيت التشغيل والإيقاف" }, body: { en: "Price the shutdown-restart cycle against holding through low hours.", ar: "تسعير دورة الإيقاف والتشغيل مقابل الصمود خلال الساعات المنخفضة." } },
      { name: { en: "Reserve-vs-energy allocation", ar: "تخصيص الاحتياطي مقابل الطاقة" }, body: { en: "Hold capacity for reserve only when energy value is lower.", ar: "حجز القدرة للاحتياطي فقط حين تكون قيمة الطاقة أقل." } },
    ],
    faqs: [
      { q: { en: "Isn't this what our dispatch optimizer does?", ar: "أليس هذا ما يفعله مُحسّن التوزيع لدينا؟" }, a: { en: "Dispatch optimizers schedule to meet load and constraints. We measure, after the fact and in OMR, how far each decision was from the economic optimum — then close that gap.", ar: "مُحسّنات التوزيع تجدول لتلبية الحمل والقيود. نحن نقيس، بأثر رجعي وبالريال، بُعد كل قرار عن الأمثل الاقتصادي — ثم نُغلق تلك الفجوة." } },
      { q: { en: "What data do you need?", ar: "ما البيانات التي تحتاجونها؟" }, a: { en: "One month of hourly unit dispatch and output. We align it to published market prices and return the decision gap by hour.", ar: "شهر من توزيع الوحدات وإنتاجها بالساعة. نُوائمه مع أسعار السوق المنشورة ونُعيد فجوة القرار بالساعة." } },
    ],
  },

  utilities: {
    headline: {
      en: "You buy and sell power all day. Every transaction has an optimal hour.",
      ar: "تشتري وتبيع الطاقة طوال اليوم. لكل صفقة ساعتها المثلى.",
    },
    lead: {
      en: "A utility's margin lives in the timing of procurement, peak-demand exposure, and the flexibility it already controls. Most of that timing is set by contract and habit, not by the hour's price.",
      ar: "هامش المرفق يعيش في توقيت الشراء، والتعرّض لذروة الطلب، والمرونة التي يملكها أصلًا. معظم هذا التوقيت يُحدّد بالعقد والعادة، لا بسعر الساعة.",
    },
    leaks: [
      {
        title: { en: "Procurement on fixed blocks, not the spot", ar: "الشراء بكتل ثابتة لا بالسوق الفوري" },
        body: { en: "Buying energy in standing blocks misses the cheap hours the spot market offers and overpays through the expensive ones.", ar: "شراء الطاقة بكتل ثابتة يفوّت الساعات الرخيصة التي يقدّمها السوق الفوري ويدفع زيادةً خلال الغالية." },
      },
      {
        title: { en: "Peak-demand charges from uncoordinated load", ar: "رسوم ذروة الطلب من حملٍ غير منسّق" },
        body: { en: "A single uncoordinated peak sets the demand charge for the whole period. Shaving it with owned flexibility is pure recovered margin.", ar: "ذروة واحدة غير منسّقة تحدّد رسم الطلب للفترة كلها. تقليمها بمرونةٍ مملوكة هامشٌ مُستردٌّ صافٍ." },
      },
      {
        title: { en: "Demand response under-monetized", ar: "الاستجابة للطلب غير مُستثمَرة بالكامل" },
        body: { en: "Flexibility that could earn in a demand-response window sits idle because no system flags the window in economic terms.", ar: "المرونة التي يمكن أن تكسب في نافذة استجابة للطلب تقف عاطلة لأن لا نظام يُشير إلى النافذة اقتصاديًا." },
      },
    ],
    levers: [
      { name: { en: "Procurement timing", ar: "توقيت الشراء" }, body: { en: "Shift purchasable volume toward the cheapest published hours.", ar: "إزاحة الحجم القابل للشراء نحو أرخص الساعات المنشورة." } },
      { name: { en: "Peak shaving", ar: "تقليم الذروة" }, body: { en: "Use owned flexibility to cut the interval that sets demand charges.", ar: "استخدام المرونة المملوكة لخفض الفترة التي تحدّد رسوم الطلب." } },
      { name: { en: "Demand-response monetization", ar: "استثمار الاستجابة للطلب" }, body: { en: "Flag and act on DR windows the moment they pay.", ar: "الإشارة إلى نوافذ الاستجابة والتحرّك حين تُجدي." } },
      { name: { en: "Portfolio balancing", ar: "موازنة المحفظة" }, body: { en: "Net generation, storage, and load against the hourly price.", ar: "مقاصّة التوليد والتخزين والحمل مقابل السعر الساعي." } },
    ],
    faqs: [
      { q: { en: "We have long-term supply contracts. Does this still apply?", ar: "لدينا عقود توريد طويلة الأجل. هل ينطبق هذا؟" }, a: { en: "Yes. The engine works on whatever flexibility you do control — load timing, storage, and short-term procurement — and quantifies the gap there without touching your contracts.", ar: "نعم. يعمل المحرّك على أي مرونة تتحكّم بها فعلًا — توقيت الحمل والتخزين والشراء قصير الأجل — ويقيس الفجوة هناك دون المساس بعقودك." } },
      { q: { en: "Is our consumption data safe?", ar: "هل بيانات استهلاكنا آمنة؟" }, a: { en: "Read-only and scoped by contract. We don't sell your data or the insights derived from it.", ar: "قراءة فقط ومحصورة بالعقد. لا نبيع بياناتك ولا الرؤى المشتقّة منها." } },
    ],
  },

  renewables: {
    headline: {
      en: "Clean generation, dirty timing? Curtailment and export timing decide the revenue.",
      ar: "توليدٌ نظيف وتوقيتٌ رديء؟ الكبح وتوقيت التصدير يحدّدان الإيراد.",
    },
    lead: {
      en: "A renewable portfolio produces when the resource is available — but earns based on when it exports and how it handles curtailment. Those are economic decisions, and they usually run on defaults.",
      ar: "محفظة المتجدّدة تُنتج حين يتوفّر المورد — لكنها تكسب حسب متى تُصدّر وكيف تتعامل مع الكبح. تلك قرارات اقتصادية، وتعمل غالبًا على الإعدادات الافتراضية.",
    },
    leaks: [
      {
        title: { en: "Curtailment absorbed by no one", ar: "كبحٌ لا يمتصّه أحد" },
        body: { en: "When output is curtailed, the energy is simply lost. With co-located flexibility it could be stored at near-zero cost and sold into the peak.", ar: "حين يُكبح الإنتاج، تُفقد الطاقة ببساطة. مع مرونةٍ مُشترَكة الموقع يمكن تخزينها بتكلفة تقارب الصفر وبيعها في الذروة." },
      },
      {
        title: { en: "Midday export at the day's lowest price", ar: "تصدير الظهيرة عند أدنى سعر في اليوم" },
        body: { en: "Solar-heavy portfolios export hardest exactly when prices are softest. Shaping export against the price curve recovers margin the panels already generated.", ar: "المحافظ الغنية بالطاقة الشمسية تُصدّر بأقصى قوّة تحديدًا حين تكون الأسعار أضعف. تشكيل التصدير مقابل منحنى السعر يستردّ هامشًا ولّدته الألواح أصلًا." },
      },
      {
        title: { en: "PPA-versus-merchant split misjudged", ar: "خطأ في توزيع اتفاقية الشراء مقابل السوق" },
        body: { en: "The volume committed to a fixed PPA versus sold merchant is an economic bet on the hour. Getting the split wrong caps upside on the best days.", ar: "الحجم الملتزَم لاتفاقية شراء ثابتة مقابل المُباع في السوق رهانٌ اقتصادي على الساعة. الخطأ في التوزيع يحُدّ من المكسب في أفضل الأيام." },
      },
    ],
    levers: [
      { name: { en: "Curtailment capture", ar: "التقاط الكبح" }, body: { en: "Absorb curtailed energy into co-located storage and resell at peak.", ar: "امتصاص الطاقة المكبوحة في تخزين مشترك الموقع وإعادة بيعها في الذروة." } },
      { name: { en: "Export shaping", ar: "تشكيل التصدير" }, body: { en: "Shift exportable energy away from the low-price midday trough.", ar: "إزاحة الطاقة القابلة للتصدير بعيدًا عن قاع الظهيرة منخفض السعر." } },
      { name: { en: "PPA / merchant allocation", ar: "توزيع الاتفاقية / السوق" }, body: { en: "Split committed and merchant volume on expected hourly value.", ar: "توزيع الحجم الملتزَم والسوقي حسب القيمة الساعية المتوقّعة." } },
      { name: { en: "Forecast-driven hold", ar: "احتباس مدفوع بالتنبّؤ" }, body: { en: "Hold storage when a higher-value window is forecast ahead.", ar: "احتباس التخزين حين تُتوقّع نافذة أعلى قيمة قادمة." } },
    ],
    faqs: [
      { q: { en: "We don't have storage yet. Is there still a gap?", ar: "ليس لدينا تخزين بعد. هل ما زالت هناك فجوة؟" }, a: { en: "Yes — export timing and PPA/merchant allocation are decisions you make with or without storage. The engine quantifies both, and shows what storage would add.", ar: "نعم — توقيت التصدير وتوزيع الاتفاقية/السوق قراراتٌ تتّخذها بتخزين أو بدونه. يقيس المحرّك كليهما، ويُظهر ما سيضيفه التخزين." } },
      { q: { en: "Where do the prices come from?", ar: "من أين تأتي الأسعار؟" }, a: { en: "Officially published market signals — every figure is independently verifiable.", ar: "إشارات السوق المنشورة رسميًا — كل رقم قابل للتحقق باستقلالية." } },
    ],
  },

  wind: {
    headline: {
      en: "The wind is free. The decision to sell now or store isn't.",
      ar: "الريح مجّانية. قرار البيع الآن أو التخزين ليس كذلك.",
    },
    lead: {
      en: "Wind generates hardest at night and in shoulder hours — often when prices are lowest. Whether to sell at generation, store, or shape around imbalance penalties is where the revenue is really decided.",
      ar: "الرياح تُولّد بأقصى قوّة ليلًا وفي الساعات الهامشية — غالبًا حين تكون الأسعار أدنى. قرار البيع عند التوليد أو التخزين أو التشكيل حول غرامات الاختلال هو حيث يُحسم الإيراد فعلًا.",
    },
    leaks: [
      {
        title: { en: "Night generation dumped at low prices", ar: "توليد الليل يُطرَح بأسعار منخفضة" },
        body: { en: "Selling every MWh the instant it's generated means selling the night's output into the day's cheapest hours. Shaping recovers that spread.", ar: "بيع كل ميجاواط-ساعة لحظة توليده يعني بيع إنتاج الليل في أرخص ساعات اليوم. التشكيل يستردّ ذلك الفارق." },
      },
      {
        title: { en: "Imbalance penalties from forecast error", ar: "غرامات اختلال من خطأ التنبّؤ" },
        body: { en: "Committing volume the wind doesn't deliver triggers imbalance costs. Bidding that prices forecast uncertainty avoids paying for optimism.", ar: "الالتزام بحجم لا تُسلّمه الرياح يُطلق تكاليف اختلال. المزايدة التي تُسعّر عدم يقين التنبّؤ تتجنّب دفع ثمن التفاؤل." },
      },
      {
        title: { en: "Hybrid storage sitting idle", ar: "التخزين الهجين واقفٌ عاطلًا" },
        body: { en: "Where wind is paired with storage, a fixed charge/discharge rule leaves the highest-value evening hours uncaptured.", ar: "حيث تقترن الرياح بالتخزين، قاعدة شحن/تفريغ ثابتة تترك أعلى ساعات المساء قيمةً دون التقاط." },
      },
    ],
    levers: [
      { name: { en: "Price-aware store-or-sell", ar: "تخزين أو بيع واعٍ بالسعر" }, body: { en: "Store night generation for the evening peak instead of dumping it.", ar: "تخزين توليد الليل لذروة المساء بدل طرحه." } },
      { name: { en: "Imbalance-aware bidding", ar: "مزايدة واعية بالاختلال" }, body: { en: "Price forecast uncertainty into committed volume to avoid penalties.", ar: "تسعير عدم يقين التنبّؤ في الحجم الملتزَم لتجنّب الغرامات." } },
      { name: { en: "Hybrid dispatch timing", ar: "توقيت التوزيع الهجين" }, body: { en: "Cycle paired storage on price, not on a fixed clock.", ar: "تدوير التخزين المقترن حسب السعر لا على ساعةٍ ثابتة." } },
      { name: { en: "Low-wind maintenance windows", ar: "نوافذ صيانة انخفاض الرياح" }, body: { en: "Schedule downtime into low-wind, low-price hours.", ar: "جدولة التوقّف في ساعات انخفاض الرياح والأسعار." } },
    ],
    faqs: [
      { q: { en: "Wind is intermittent — can economics really be optimized?", ar: "الرياح متقطّعة — أيمكن تحسين الاقتصاد فعلًا؟" }, a: { en: "Intermittency is exactly why timing matters. The engine works with your forecast and the price curve to shape store, sell, and bid decisions around the uncertainty.", ar: "التقطّع هو تحديدًا سبب أهمّية التوقيت. يعمل المحرّك مع تنبّؤك ومنحنى السعر لتشكيل قرارات التخزين والبيع والمزايدة حول عدم اليقين." } },
      { q: { en: "Do you need our turbine SCADA?", ar: "هل تحتاجون سكادا التوربينات لدينا؟" }, a: { en: "Hourly generation and dispatch logs are enough to start. Richer telemetry tightens the result.", ar: "سجلات التوليد والتوزيع بالساعة تكفي للبدء. القياسات الأغنى تُحكم النتيجة." } },
    ],
  },
};
