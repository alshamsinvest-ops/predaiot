import type { SectorContent } from "./types";

export const GROUP_B: Record<string, SectorContent> = {
  tnd: {
    headline: {
      en: "Losses and congestion are decisions, not just physics.",
      ar: "الفواقد والازدحام قراراتٌ لا فيزياء فحسب.",
    },
    lead: {
      en: "Transmission and distribution carry a cost in losses, congestion redispatch, and asset loading. How and when those are managed against the market price is an economic layer most networks never measure.",
      ar: "النقل والتوزيع يحملان تكلفةً في الفواقد، وإعادة التوزيع بسبب الازدحام، وتحميل الأصول. كيف ومتى تُدار هذه مقابل سعر السوق طبقةٌ اقتصادية لا تقيسها معظم الشبكات.",
    },
    leaks: [
      {
        title: { en: "Loss management with no price signal", ar: "إدارة الفواقد بلا إشارة سعر" },
        body: { en: "Technical losses are minimized on engineering rules. But a loss during a high-price hour costs far more than the same loss at 3 a.m. — and that difference is never priced.", ar: "الفواقد التقنية تُقلّل بقواعد هندسية. لكن فاقدًا في ساعة سعرٍ مرتفع يكلّف أكثر بكثير من الفاقد نفسه الثالثة فجرًا — وذلك الفرق لا يُسعَر أبدًا." },
      },
      {
        title: { en: "Congestion redispatch cost unaccounted", ar: "تكلفة إعادة التوزيع للازدحام غير محتسَبة" },
        body: { en: "Relieving congestion by redispatching has a cost that varies by hour. Managing it against the price curve keeps relief cheap.", ar: "تخفيف الازدحام بإعادة التوزيع له تكلفة تتفاوت بالساعة. إدارته مقابل منحنى السعر تُبقي التخفيف رخيصًا." },
      },
      {
        title: { en: "Transformer loading versus market value", ar: "تحميل المحوّلات مقابل قيمة السوق" },
        body: { en: "Loading and switching decisions optimize for asset life alone. Balancing life against the value of the energy flowing through recovers margin.", ar: "قرارات التحميل والتبديل تُحسّن لعمر الأصل وحده. موازنة العمر مقابل قيمة الطاقة المارّة تستردّ هامشًا." },
      },
    ],
    levers: [
      { name: { en: "Loss-aware coordination", ar: "تنسيق واعٍ بالفواقد" }, body: { en: "Weight loss reduction by the price of the hour it occurs in.", ar: "ترجيح خفض الفواقد بسعر الساعة التي يحدث فيها." } },
      { name: { en: "Congestion-cost timing", ar: "توقيت تكلفة الازدحام" }, body: { en: "Schedule redispatch and relief for the cheapest available hours.", ar: "جدولة إعادة التوزيع والتخفيف لأرخص الساعات المتاحة." } },
      { name: { en: "Asset loading vs value", ar: "تحميل الأصل مقابل القيمة" }, body: { en: "Balance transformer life against the value of throughput.", ar: "موازنة عمر المحوّل مقابل قيمة الإنتاجية المارّة." } },
      { name: { en: "Maintenance timing", ar: "توقيت الصيانة" }, body: { en: "Take outages when the value of what's carried is lowest.", ar: "أخذ الانقطاعات حين تكون قيمة المنقول أدنى." } },
    ],
    faqs: [
      { q: { en: "We're a regulated network — how does economics apply?", ar: "نحن شبكة منظَمة — كيف ينطبق الاقتصاد؟" }, a: { en: "Even under regulation, losses, redispatch, and outage timing carry costs that vary with price. We quantify those in OMR; you decide what to act on.", ar: "حتى تحت التنظيم، الفواقد وإعادة التوزيع وتوقيت الانقطاع تحمل تكاليف تتفاوت مع السعر. نقيسها بالريال؛ وأنت تقرّر ما تتحرّك بشأنه." } },
      { q: { en: "Do you interface with our SCADA/EMS?", ar: "هل تتكاملون مع سكادا/نظام إدارة الطاقة لدينا؟" }, a: { en: "We read from it; we don't control through it. Analysis is shadow-mode by default.", ar: "نقرأ منه؛ لا نتحكّم عبره. التحليل بوضع الظل افتراضيًا." } },
    ],
  },

  smartgrid: {
    headline: {
      en: "Sensors everywhere. Economic decisions nowhere.",
      ar: "مستشعراتٌ في كل مكان. وقراراتٌ اقتصادية في لا مكان.",
    },
    lead: {
      en: "A smart grid gathers the data to act on price in real time. But most orchestration still runs on rules and setpoints — the economic signal is measured and then ignored.",
      ar: "الشبكة الذكية تجمع البيانات للتحرّك على السعر لحظيًا. لكن معظم التنسيق ما زال يعمل بقواعد ونقاط ضبط — الإشارة الاقتصادية تُقاس ثم تُتجاهل.",
    },
    leaks: [
      {
        title: { en: "DER orchestration on rules, not prices", ar: "تنسيق الموارد الموزّعة بقواعد لا أسعار" },
        body: { en: "Distributed resources are dispatched on fixed schedules and thresholds. The one signal that would make them profitable — the hourly price — isn't in the loop.", ar: "الموارد الموزّعة تُوزّع بجداول وعتبات ثابتة. الإشارة الوحيدة التي تجعلها مربحة — السعر الساعي — ليست في الحلقة." },
      },
      {
        title: { en: "Flexibility signals unpriced", ar: "إشارات المرونة غير مُسعّرة" },
        body: { en: "The grid can see where flexibility exists but doesn't value it in OMR, so it's rarely called when it would earn the most.", ar: "الشبكة ترى أين توجد المرونة لكنها لا تُقدّرها بالريال، فنادرًا ما تُستدعى حين تكسب الأكثر." },
      },
      {
        title: { en: "Data collected, value never actioned", ar: "بياناتٌ تُجمع وقيمةٌ لا يُتحرّك بها" },
        body: { en: "Telemetry pours in and dashboards fill up, but no layer converts the stream into an economic decision at the moment it matters.", ar: "القياسات تتدفّق واللوحات تمتلئ، لكن لا طبقة تُحوّل التدفّق إلى قرار اقتصادي في اللحظة المهمّة." },
      },
    ],
    levers: [
      { name: { en: "Price-aware DER orchestration", ar: "تنسيق موارد موزّعة واعٍ بالسعر" }, body: { en: "Dispatch distributed assets on the hourly economic signal.", ar: "توزيع الأصول الموزّعة على الإشارة الاقتصادية الساعية." } },
      { name: { en: "Flexibility monetization", ar: "استثمار المرونة" }, body: { en: "Value and call flexibility when the price makes it pay.", ar: "تقدير المرونة واستدعاؤها حين يجعلها السعر مُجدية." } },
      { name: { en: "Real-time economic signals", ar: "إشارات اقتصادية لحظية" }, body: { en: "Turn the existing data stream into an OMR decision per interval.", ar: "تحويل تدفّق البيانات القائم إلى قرار بالريال لكل فترة." } },
      { name: { en: "Forecast-driven control", ar: "تحكّم مدفوع بالتنبّؤ" }, body: { en: "Pre-position assets ahead of forecast price windows.", ar: "تهيئة الأصول مسبقًا قبل نوافذ الأسعار المتوقّعة." } },
    ],
    faqs: [
      { q: { en: "We already invested in grid analytics. Why add this?", ar: "استثمرنا في تحليلات الشبكة. لماذا نضيف هذا؟" }, a: { en: "Analytics tell you what happened. We convert the same data into the economically optimal action per interval and quantify what the rules-based approach leaves behind.", ar: "التحليلات تخبرك بما حدث. نحن نحوّل البيانات نفسها إلى الإجراء الأمثل اقتصاديًا لكل فترة ونقيس ما يتركه النهج القائم على القواعد." } },
      { q: { en: "Does it require ripping out our controllers?", ar: "أيتطلّب استبدال متحكّماتنا؟" }, a: { en: "No. We read your streams and quantify the gap first; any control integration is opt-in and later.", ar: "لا. نقرأ تدفّقاتك ونقيس الفجوة أولًا؛ وأي تكامل تحكّم اختياري ولاحق." } },
    ],
  },

  industrial: {
    headline: {
      en: "Your load is flexible. Your energy bill acts like it isn't.",
      ar: "حملك مرن. لكن فاتورة طاقتك تتصرّف وكأنه ليس كذلك.",
    },
    lead: {
      en: "Industrial sites carry large, shiftable loads and often their own generation. Scheduling production and self-supply against the hourly price — instead of the production calendar alone — is a recoverable line on the P&L.",
      ar: "المواقع الصناعية تحمل أحمالًا كبيرة قابلة للإزاحة وغالبًا توليدها الخاص. جدولة الإنتاج والإمداد الذاتي مقابل السعر الساعي — بدل تقويم الإنتاج وحده — بندٌ قابل للاسترجاع في الأرباح والخسائر.",
    },
    leaks: [
      {
        title: { en: "Production scheduled with no tariff awareness", ar: "الإنتاج مجدوَل بلا وعٍ بالتعرفة" },
        body: { en: "Energy-intensive steps run when the line is free, not when power is cheap. Shifting the shiftable steps cuts cost with zero output loss.", ar: "الخطوات كثيفة الطاقة تُشغّل حين يكون الخط متاحًا لا حين تكون الطاقة رخيصة. إزاحة الخطوات القابلة للإزاحة تخفض التكلفة دون خسارة إنتاج." },
      },
      {
        title: { en: "Peak-demand charges from a single spike", ar: "رسوم ذروة الطلب من قفزة واحدة" },
        body: { en: "One coincident peak sets the demand charge for the month. Coordinating startups avoids paying for an avoidable spike.", ar: "ذروة متزامنة واحدة تحدّد رسم الطلب للشهر. تنسيق بدء التشغيل يتجنّب دفع ثمن قفزة يمكن تفاديها." },
      },
      {
        title: { en: "Self-generation versus import mistimed", ar: "التوليد الذاتي مقابل الاستيراد بتوقيت خاطئ" },
        body: { en: "Running on-site generation through cheap-grid hours — or importing through expensive ones — is a daily choice usually left on autopilot.", ar: "تشغيل التوليد الموقعي خلال ساعات الشبكة الرخيصة — أو الاستيراد خلال الغالية — خيارٌ يومي يُترك غالبًا على الطيّار الآلي." },
      },
    ],
    levers: [
      { name: { en: "Load-shifting", ar: "إزاحة الحمل" }, body: { en: "Move shiftable production steps into the cheapest hours.", ar: "نقل خطوات الإنتاج القابلة للإزاحة إلى أرخص الساعات." } },
      { name: { en: "Peak-demand management", ar: "إدارة ذروة الطلب" }, body: { en: "Coordinate startups to avoid setting a costly demand charge.", ar: "تنسيق بدء التشغيل لتفادي تحديد رسم طلبٍ مكلف." } },
      { name: { en: "Self-gen vs import optimization", ar: "تحسين التوليد الذاتي مقابل الاستيراد" }, body: { en: "Run on-site generation only when it beats the grid price.", ar: "تشغيل التوليد الموقعي فقط حين يتفوّق على سعر الشبكة." } },
      { name: { en: "Interruptible-load monetization", ar: "استثمار الحمل القابل للقطع" }, body: { en: "Earn from curtailable load in the windows it pays.", ar: "الكسب من الحمل القابل للكبح في النوافذ التي يُجدي فيها." } },
    ],
    faqs: [
      { q: { en: "Won't shifting production disrupt operations?", ar: "ألن تُعطّل إزاحة الإنتاج العمليات؟" }, a: { en: "We only target the steps you flag as shiftable, and we quantify the OMR before you change anything. Nothing moves without your sign-off.", ar: "نستهدف فقط الخطوات التي تُعلّمها كقابلة للإزاحة، ونقيس الريال قبل أن تُغيّر شيئًا. لا شيء يتحرّك دون موافقتك." } },
      { q: { en: "What data do you need to start?", ar: "ما البيانات اللازمة للبدء؟" }, a: { en: "A month of interval metering and, if available, your production schedule and any on-site generation logs.", ar: "شهرٌ من القياس بالفترات، وإن توفّر، جدول إنتاجك وأي سجلات توليد موقعي." } },
    ],
  },

  water: {
    headline: {
      en: "Pumping and desalination are your biggest energy decision.",
      ar: "الضخّ والتحلية هما قرار الطاقة الأكبر لديك.",
    },
    lead: {
      en: "Water systems are, economically, giant flexible loads with built-in storage — reservoirs and tanks. Running pumps and desal on demand schedules instead of the price curve leaves that flexibility unused.",
      ar: "أنظمة المياه، اقتصاديًا، أحمالٌ مرنة عملاقة بتخزينٍ مدمَج — خزّانات وصهاريج. تشغيل المضخّات والتحلية على جداول الطلب بدل منحنى السعر يترك تلك المرونة دون استخدام.",
    },
    leaks: [
      {
        title: { en: "Pumps run on demand, not on price", ar: "المضخّات تعمل على الطلب لا على السعر" },
        body: { en: "Filling reservoirs during expensive hours when the same volume could be pumped off-peak is a pure timing loss — the water is identical, the cost isn't.", ar: "ملء الخزّانات خلال الساعات الغالية بينما يمكن ضخّ الحجم نفسه خارج الذروة خسارة توقيتٍ صرفة — المياه متطابقة، والتكلفة ليست كذلك." },
      },
      {
        title: { en: "Desalination as an unmanaged flat load", ar: "التحلية كحملٍ ثابت غير مُدار" },
        body: { en: "Desal plants draw enormous steady power. Modulating output against price — within contractual water obligations — recovers cost without shorting supply.", ar: "محطّات التحلية تسحب طاقة هائلة ثابتة. تعديل الإنتاج مقابل السعر — ضمن التزامات المياه التعاقدية — يستردّ التكلفة دون تقصير الإمداد." },
      },
      {
        title: { en: "Storage never used as an energy buffer", ar: "التخزين لا يُستخدَم كمخزنٍ للطاقة أبدًا" },
        body: { en: "Reservoirs and tanks are energy storage in disguise. Pump-fill them cheap, draw them through peaks — most systems never dispatch them this way.", ar: "الخزّانات والصهاريج تخزينُ طاقةٍ متنكّر. املأها بالضخّ رخيصًا، واسحب منها خلال الذروات — معظم الأنظمة لا تُوزّعها هكذا أبدًا." },
      },
    ],
    levers: [
      { name: { en: "Pump scheduling to cheap hours", ar: "جدولة الضخّ لساعات رخيصة" }, body: { en: "Fill storage off-peak and draw it down through the peaks.", ar: "ملء التخزين خارج الذروة وسحبه خلال الذروات." } },
      { name: { en: "Desalination load-shifting", ar: "إزاحة حمل التحلية" }, body: { en: "Modulate desal output against price within water obligations.", ar: "تعديل إنتاج التحلية مقابل السعر ضمن التزامات المياه." } },
      { name: { en: "Reservoirs as storage", ar: "الخزّانات كتخزين" }, body: { en: "Treat tank and reservoir headroom as dispatchable energy storage.", ar: "معاملة سعة الصهاريج والخزّانات كتخزين طاقة قابل للتوزيع." } },
      { name: { en: "Peak avoidance", ar: "تفادي الذروة" }, body: { en: "Keep the largest loads out of the demand-charge interval.", ar: "إبقاء أكبر الأحمال خارج فترة رسم الطلب." } },
    ],
    faqs: [
      { q: { en: "Water supply can't be compromised — is that a constraint?", ar: "لا يمكن المساس بإمداد المياه — أهذا قيد؟" }, a: { en: "It's a hard constraint we honor. Optimization happens only within your service and storage limits; supply reliability comes first, savings second.", ar: "إنه قيدٌ صارم نحترمه. يحدث التحسين فقط ضمن حدود خدمتك وتخزينك؛ موثوقية الإمداد أولًا، والتوفير ثانيًا." } },
      { q: { en: "Do we need new hardware?", ar: "هل نحتاج أجهزة جديدة؟" }, a: { en: "No. The flexibility is already in your pumps and storage. We read your telemetry and quantify the timing gap.", ar: "لا. المرونة موجودة أصلًا في مضخّاتك وتخزينك. نقرأ قياساتك ونقيس فجوة التوقيت." } },
    ],
  },

  hydrogen: {
    headline: {
      en: "Electrolysis only pays when power is cheap. Do you run on price?",
      ar: "التحليل الكهربائي لا يُجدي إلا حين تكون الطاقة رخيصة. هل تعمل على السعر؟",
    },
    lead: {
      en: "Green hydrogen economics live and die on the power price feeding the electrolyzer. Running flat, or missing curtailed renewable energy, turns a viable project into a marginal one.",
      ar: "اقتصاد الهيدروجين الأخضر يحيا ويموت على سعر الطاقة المُغذّية للمحلّل. التشغيل الثابت أو تفويت الطاقة المتجدّدة المكبوحة يُحوّل مشروعًا قابلًا للحياة إلى هامشي.",
    },
    leaks: [
      {
        title: { en: "Electrolyzers running flat against price", ar: "المحلّلات تعمل بثبات ضدّ السعر" },
        body: { en: "A flat production target ignores the hours when power is expensive. Modulating load to cheap and curtailed energy is the difference between profit and loss per kg.", ar: "هدف إنتاجٍ ثابت يتجاهل الساعات التي تكون فيها الطاقة غالية. تعديل الحمل نحو الطاقة الرخيصة والمكبوحة هو الفرق بين الربح والخسارة لكل كيلوغرام." },
      },
      {
        title: { en: "Curtailed renewables not captured", ar: "المتجدّدة المكبوحة لا تُلتقَط" },
        body: { en: "Curtailed wind and solar are the cheapest electrons on the grid. An electrolyzer that isn't positioned to absorb them leaves free feedstock on the table.", ar: "الرياح والطاقة الشمسية المكبوحة أرخص الإلكترونات في الشبكة. محلّلٌ غير مهيّأ لامتصاصها يترك لقيمًا مجّانية على الطاولة." },
      },
      {
        title: { en: "Storage-versus-sell timing ignored", ar: "توقيت التخزين مقابل البيع مُهمَل" },
        body: { en: "When and how much hydrogen to store versus offtake is an economic decision tied to both power and product prices — rarely optimized together.", ar: "متى وكم من الهيدروجين يُخزّن مقابل التوريد قرارٌ اقتصادي مرتبط بسعري الطاقة والمنتج — نادرًا ما يُحسّنان معًا." },
      },
    ],
    levers: [
      { name: { en: "Price-aware electrolysis", ar: "تحليل كهربائي واعٍ بالسعر" }, body: { en: "Ramp electrolyzer load to the cheapest available hours.", ar: "رفع حمل المحلّل نحو أرخص الساعات المتاحة." } },
      { name: { en: "Curtailment-to-hydrogen", ar: "من الكبح إلى الهيدروجين" }, body: { en: "Position load to absorb curtailed renewable energy first.", ar: "تهيئة الحمل لامتصاص الطاقة المتجدّدة المكبوحة أولًا." } },
      { name: { en: "Sourcing optimization", ar: "تحسين مصدر التغذية" }, body: { en: "Choose grid versus dedicated renewable on hourly economics.", ar: "اختيار الشبكة مقابل المتجدّدة المخصّصة حسب اقتصاد الساعة." } },
      { name: { en: "Storage / offtake timing", ar: "توقيت التخزين / التوريد" }, body: { en: "Balance hydrogen storage against product and power prices.", ar: "موازنة تخزين الهيدروجين مقابل سعري المنتج والطاقة." } },
    ],
    faqs: [
      { q: { en: "Our offtake contract fixes volume. Can we still flex?", ar: "عقد التوريد لدينا يثبّت الحجم. أيمكننا المرونة؟" }, a: { en: "Yes — within your delivery commitment there's room to shift when the electrons are bought and hydrogen is stored. That timing is where the margin sits.", ar: "نعم — ضمن التزام التسليم توجد مساحة لإزاحة متى تُشترى الإلكترونات ويُخزّن الهيدروجين. ذلك التوقيت هو حيث يقع الهامش." } },
      { q: { en: "Why validate in Oman?", ar: "لماذا التحقّق في عُمان؟" }, a: { en: "Because Oman's power prices and renewable curtailment are published — every claim is checkable against an independent source.", ar: "لأن أسعار الطاقة والكبح المتجدّد في عُمان منشورة — كل ادّعاء قابل للتحقق مقابل مصدر مستقل." } },
    ],
  },
};
