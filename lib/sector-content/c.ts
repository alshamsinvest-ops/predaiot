import type { SectorContent } from "./types";

export const GROUP_C: Record<string, SectorContent> = {
  datacenters: {
    headline: {
      en: "Compute is flexible. Your energy strategy should be too.",
      ar: "الحوسبة مرنة. واستراتيجية طاقتك يجب أن تكون كذلك.",
    },
    lead: {
      en: "Data centers optimize for PUE and uptime, but rarely for the price of the hour. Shiftable workloads, on-site batteries, and cooling pre-conditioning are economic levers sitting unused.",
      ar: "مراكز البيانات تُحسّن لكفاءة استخدام الطاقة والجاهزية، لكن نادرًا لسعر الساعة. الأحمال القابلة للإزاحة، والبطاريات الموقعية، وتهيئة التبريد المسبقة روافعٌ اقتصادية غير مُستخدَمة.",
    },
    leaks: [
      {
        title: { en: "Backup batteries idle instead of arbitraging", ar: "بطاريات الاحتياط عاطلة بدل المراجحة" },
        body: { en: "UPS and BESS capacity sits reserved for an outage that rarely comes, while never earning from the price spread it could safely capture.", ar: "سعة مزوّدات الطاقة غير المنقطعة والبطاريات محجوزة لانقطاعٍ نادرًا ما يأتي، دون أن تكسب من فارق السعر الذي يمكنها التقاطه بأمان." },
      },
      {
        title: { en: "Cooling flat against a moving price", ar: "التبريد ثابت ضدّ سعرٍ متحرّك" },
        body: { en: "Thermal mass lets a facility pre-cool in cheap hours and coast through expensive ones. Constant-setpoint cooling throws that option away.", ar: "الكتلة الحرارية تتيح للمنشأة التبريد المسبق في الساعات الرخيصة والانسياب خلال الغالية. التبريد بنقطة ضبطٍ ثابتة يرمي هذا الخيار." },
      },
      {
        title: { en: "Shiftable workloads never shifted", ar: "أحمالٌ قابلة للإزاحة لا تُزاح أبدًا" },
        body: { en: "Batch and non-latency-critical jobs can move to cheaper hours or sites. Without an economic signal, they run whenever they're queued.", ar: "المهام الدفعية وغير الحسّاسة للكمون يمكن نقلها لساعات أو مواقع أرخص. بلا إشارة اقتصادية، تُشغّل متى وُضعت في الطابور." },
      },
    ],
    levers: [
      { name: { en: "Workload shifting", ar: "إزاحة أحمال العمل" }, body: { en: "Move batch compute to cheaper hours (and sites) on price.", ar: "نقل الحوسبة الدفعية لساعات (ومواقع) أرخص حسب السعر." } },
      { name: { en: "On-site BESS arbitrage", ar: "مراجحة بطاريات موقعية" }, body: { en: "Earn from spare backup capacity without risking resilience.", ar: "الكسب من سعة الاحتياط الفائضة دون المساس بالمرونة." } },
      { name: { en: "Cooling pre-conditioning", ar: "تهيئة التبريد المسبقة" }, body: { en: "Pre-cool in cheap hours; coast through the expensive ones.", ar: "التبريد المسبق في الساعات الرخيصة؛ والانسياب خلال الغالية." } },
      { name: { en: "Demand-response participation", ar: "المشاركة في الاستجابة للطلب" }, body: { en: "Monetize curtailable load in the windows it pays.", ar: "استثمار الحمل القابل للكبح في النوافذ التي يُجدي فيها." } },
    ],
    faqs: [
      { q: { en: "Uptime is non-negotiable. Does this touch resilience?", ar: "الجاهزية غير قابلة للتفاوض. أيمسّ هذا المرونة؟" }, a: { en: "No. Every lever operates strictly within your reserve and SLA margins. We optimize the headroom you already have, never the safety floor.", ar: "لا. كل رافعة تعمل بدقّة ضمن هوامش احتياطك واتفاقية الخدمة. نُحسّن السعة الفائضة التي لديك أصلًا، لا أرضية الأمان أبدًا." } },
      { q: { en: "What do you need to start?", ar: "ما اللازم للبدء؟" }, a: { en: "Interval power draw, your BESS/UPS specs, and which workloads you consider shiftable. We quantify the gap from there.", ar: "سحب الطاقة بالفترات، ومواصفات بطارياتك/مزوّداتك، وأي أحمال تعتبرها قابلة للإزاحة. نقيس الفجوة من هناك." } },
    ],
  },

  microgrids: {
    headline: {
      en: "Island or import? That's an economic decision, every hour.",
      ar: "الانعزال أم الاستيراد؟ ذاك قرارٌ اقتصادي، كل ساعة.",
    },
    lead: {
      en: "A microgrid constantly chooses between its own generation, storage, and the grid. Made on rules, that choice is safe but rarely cheapest. Made on price, it's both.",
      ar: "الشبكة الصغيرة تختار باستمرار بين توليدها الخاص، وتخزينها، والشبكة. حين يُتّخذ القرار بقواعد، يكون آمنًا لكنه نادرًا الأرخص. وحين يُتّخذ على السعر، يكون الأمرين معًا.",
    },
    leaks: [
      {
        title: { en: "Import/export on rules, not price", ar: "استيراد/تصدير بقواعد لا بسعر" },
        body: { en: "Buying from or selling to the grid on fixed thresholds misses the hours where the opposite decision would have paid.", ar: "الشراء من الشبكة أو البيع لها بعتبات ثابتة يفوّت الساعات التي كان القرار المعاكس فيها مُجديًا." },
      },
      {
        title: { en: "Genset running when storage was cheaper", ar: "المولّد يعمل بينما التخزين أرخص" },
        body: { en: "Diesel or gas gensets fired on a schedule burn fuel in hours when stored solar would have covered the load for free.", ar: "مولّدات الديزل أو الغاز المُشغّلة بجدول تحرق وقودًا في ساعات كانت الطاقة الشمسية المخزّنة ستغطّي الحمل فيها مجّانًا." },
      },
      {
        title: { en: "Islanding economics ignored", ar: "اقتصاد الانعزال مُهمَل" },
        body: { en: "Choosing to island or stay connected has an hourly cost. Deciding it on reliability alone leaves the economic half of the choice unmanaged.", ar: "قرار الانعزال أو البقاء موصولًا له تكلفة ساعية. حسمه على الموثوقية وحدها يترك النصف الاقتصادي من الخيار دون إدارة." },
      },
    ],
    levers: [
      { name: { en: "Price-aware import/export", ar: "استيراد/تصدير واعٍ بالسعر" }, body: { en: "Trade with the grid on the hourly spread, not a threshold.", ar: "التداول مع الشبكة حسب الفارق الساعي لا العتبة." } },
      { name: { en: "Genset-vs-storage dispatch", ar: "توزيع المولّد مقابل التخزين" }, body: { en: "Fire the genset only when it beats stored and grid energy.", ar: "تشغيل المولّد فقط حين يتفوّق على الطاقة المخزّنة والشبكة." } },
      { name: { en: "Islanding economics", ar: "اقتصاد الانعزال" }, body: { en: "Price the island-or-connect choice, not just its reliability.", ar: "تسعير خيار الانعزال أو الوصل، لا موثوقيته فقط." } },
      { name: { en: "DER coordination", ar: "تنسيق الموارد الموزّعة" }, body: { en: "Sequence solar, storage, and load on the price curve.", ar: "ترتيب الطاقة الشمسية والتخزين والحمل على منحنى السعر." } },
    ],
    faqs: [
      { q: { en: "Reliability is why we built the microgrid. Does this risk it?", ar: "الموثوقية هي سبب بنائنا للشبكة الصغيرة. أيُخاطر هذا بها؟" }, a: { en: "No. Reliability constraints are hard limits the engine respects. It optimizes cost only within the operating envelope you define.", ar: "لا. قيود الموثوقية حدودٌ صارمة يحترمها المحرّك. يُحسّن التكلفة فقط ضمن نطاق التشغيل الذي تحدّده." } },
      { q: { en: "Does it work without a grid connection?", ar: "أيعمل بلا وصلة شبكة؟" }, a: { en: "Yes — even fully islanded, the genset-versus-storage-versus-solar choice is an hourly economic decision we optimize.", ar: "نعم — حتى في الانعزال الكامل، خيار المولّد مقابل التخزين مقابل الشمسية قرارٌ اقتصادي ساعي نُحسّنه." } },
    ],
  },

  vpp: {
    headline: {
      en: "You aggregate flexibility. Are you dispatching it at the best price?",
      ar: "أنت تُجمّع المرونة. هل تُوزّعها بأفضل سعر؟",
    },
    lead: {
      en: "A virtual power plant is only as good as the decision of which asset to dispatch, into which market, at which hour. Run on program rules, a VPP captures a fraction of the value stacked across its fleet.",
      ar: "محطّة الطاقة الافتراضية بجودة قرار أيّ أصلٍ يُوزّع، في أي سوق، في أي ساعة. حين تعمل بقواعد البرنامج، تلتقط المحطّة جزءًا من القيمة المكدّسة عبر أسطولها.",
    },
    leaks: [
      {
        title: { en: "Aggregate dispatch on program rules", ar: "توزيع مُجمّع بقواعد البرنامج" },
        body: { en: "Calling the whole fleet on a single program signal ignores which specific assets are cheapest to move that hour.", ar: "استدعاء الأسطول كاملًا بإشارة برنامج واحدة يتجاهل أي أصولٍ محدّدة هي الأرخص للتحريك تلك الساعة." },
      },
      {
        title: { en: "Asset-level opportunity cost ignored", ar: "تكلفة الفرصة على مستوى الأصل مُهمَلة" },
        body: { en: "Each asset in the fleet has its own opportunity cost. Dispatching without pricing it per asset over-uses some and under-uses others.", ar: "كل أصل في الأسطول له تكلفة فرصته الخاصة. التوزيع دون تسعيرها لكل أصل يُفرط في استخدام بعضها ويُقصّر في أخرى." },
      },
      {
        title: { en: "Market-versus-ancillary allocation misjudged", ar: "خطأ في توزيع السوق مقابل الخدمات المساعِدة" },
        body: { en: "The same flexibility can serve energy or ancillary markets. Choosing wrong for the hour caps the value the fleet could have stacked.", ar: "المرونة نفسها يمكن أن تخدم أسواق الطاقة أو الخدمات المساعِدة. الاختيار الخاطئ للساعة يحُدّ من القيمة التي كان الأسطول ليكدّسها." },
      },
    ],
    levers: [
      { name: { en: "Value-stacked dispatch", ar: "توزيع مُكدّس القيمة" }, body: { en: "Sequence each asset into the market that pays most that hour.", ar: "توجيه كل أصل إلى السوق الأعلى دفعًا تلك الساعة." } },
      { name: { en: "Asset-level opportunity cost", ar: "تكلفة الفرصة على مستوى الأصل" }, body: { en: "Price each unit's cost of moving before it's called.", ar: "تسعير تكلفة تحريك كل وحدة قبل استدعائها." } },
      { name: { en: "Market-vs-ancillary allocation", ar: "توزيع السوق مقابل المساعِدة" }, body: { en: "Route flexibility to energy or ancillary on hourly value.", ar: "توجيه المرونة للطاقة أو المساعِدة حسب القيمة الساعية." } },
      { name: { en: "Forecast-driven bidding", ar: "مزايدة مدفوعة بالتنبّؤ" }, body: { en: "Pre-position fleet capacity ahead of forecast price windows.", ar: "تهيئة سعة الأسطول مسبقًا قبل نوافذ الأسعار المتوقّعة." } },
    ],
    faqs: [
      { q: { en: "We run a DR/aggregation program already. What's new?", ar: "نُشغّل برنامج استجابة/تجميع بالفعل. ما الجديد؟" }, a: { en: "Programs decide when to call the fleet. We decide which assets, into which market, at what opportunity cost — the layer that turns aggregation into stacked value.", ar: "البرامج تقرّر متى يُستدعى الأسطول. نحن نقرّر أي أصول، في أي سوق، بأي تكلفة فرصة — الطبقة التي تُحوّل التجميع إلى قيمة مكدّسة." } },
      { q: { en: "Do you need per-asset data?", ar: "أتحتاجون بيانات لكل أصل؟" }, a: { en: "Per-asset dispatch history sharpens it, but we can start from fleet-level logs and refine as more granularity arrives.", ar: "سجل التوزيع لكل أصل يُحدّه، لكن يمكننا البدء من سجلات مستوى الأسطول والتحسين مع وصول تفصيلٍ أكثر." } },
    ],
  },
};
