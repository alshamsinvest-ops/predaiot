import type { Bilingual } from "./types";

/**
 * Bespoke hook strip (4 per sector) + one urgency line per sector for
 * /industries/[sector]. Replaces the old universal strip that repeated
 * "8,760 / 0 CAPEX / In OMR / Auditable" on every page.
 *
 * CONTENT GOVERNANCE: no fabricated statistics. Every "k" label is either a
 * structural truth (flared gas earns nothing), a definitional statement, or a
 * decision framing — never an invented percentage or OMR figure.
 */
export interface SectorHook {
  k: Bilingual;
  v: Bilingual;
}

export const SECTOR_HOOKS: Record<string, SectorHook[]> = {
  oilgas: [
    {
      k: { en: "Burn · Sell · Store", ar: "حرق · بيع · تخزين" },
      v: {
        en: "Three destinations for the same molecule. Only one is optimal at tonight's price.",
        ar: "ثلاث وجهات لنفس الجزيء — وواحدة فقط هي المثلى بسعر الليلة.",
      },
    },
    {
      k: { en: "Flare = 0", ar: "الشعلة = صفر" },
      v: {
        en: "A flared or unpriced molecule earns nothing — the only decision with a guaranteed loss.",
        ar: "الجزيء المحروق أو غير المُسعّر يكسب صفرًا — القرار الوحيد بخسارة مضمونة.",
      },
    },
    {
      k: { en: "Schedule ≠ Spread", ar: "الجدول ≠ الفارق" },
      v: {
        en: "Compression and gas-to-power run on schedules. The price spread doesn't.",
        ar: "الضغط وتحويل الغاز إلى كهرباء يعملان بجداول ثابتة — وفارق السعر لا يعرف الجداول.",
      },
    },
    {
      k: { en: "Re-decidable hourly", ar: "قرارٌ كل ساعة" },
      v: {
        en: "Allocation can be re-decided every hour. Most operations re-decide it once a quarter.",
        ar: "التخصيص يمكن إعادة تقريره كل ساعة — ومعظم العمليات تعيد النظر فيه مرة كل ربع سنة.",
      },
    },
  ],
  power: [
    {
      k: { en: "Peak ≠ Average", ar: "الذروة ≠ المتوسط" },
      v: {
        en: "A unit that runs flat through the peak sells its best hours at an average price.",
        ar: "الوحدة التي تعمل بوتيرة ثابتة خلال الذروة تبيع أفضل ساعاتها بسعرٍ متوسط.",
      },
    },
    {
      k: { en: "Every start has a price", ar: "لكل تشغيلٍ ثمن" },
      v: {
        en: "So does every hour offline while scarcity prices print. Both are calculable — before you commit.",
        ar: "وكذلك كل ساعة توقف بينما تُسجّل أسعار الندرة. كلاهما قابل للحساب — قبل اتخاذ القرار.",
      },
    },
    {
      k: { en: "Merit order moves", ar: "ترتيب الاستحقاق يتحرك" },
      v: {
        en: "The market re-ranks your unit every hour. A fixed schedule can't answer a moving rank.",
        ar: "السوق يعيد ترتيب وحدتك كل ساعة — وجدول ثابت لا يجيب على ترتيبٍ متحرك.",
      },
    },
    {
      k: { en: "SMP is published", ar: "السعر الحدّي منشور" },
      v: {
        en: "The marginal price tells you exactly when a MWh is worth double. Is anyone listening?",
        ar: "السعر الحدّي يخبرك متى يساوي الميغاواط-ساعة ضعف قيمته. فهل من يُنصت؟",
      },
    },
  ],
  utilities: [
    {
      k: { en: "Fleet-wide", ar: "على مستوى الأسطول" },
      v: {
        en: "One mispriced unit is noise. A fleet of them is a budget line.",
        ar: "وحدة واحدة خارج السعر ضوضاء — أسطول كامل منها بندٌ في الميزانية.",
      },
    },
    {
      k: { en: "An hourly race", ar: "سباقٌ كل ساعة" },
      v: {
        en: "Generation, storage and imports compete for every hour. Few portfolios price that race.",
        ar: "التوليد والتخزين والاستيراد تتنافس على كل ساعة — وقليلة هي المحافظ التي تُسعّر هذا السباق.",
      },
    },
    {
      k: { en: "Regulator-ready", ar: "جاهز للمنظّم" },
      v: {
        en: "Every dispatch carries a written economic rationale a regulator can replay.",
        ar: "كل قرار توزيع يحمل مبررًا اقتصاديًا مكتوبًا يمكن للجهة التنظيمية إعادة تشغيله.",
      },
    },
    {
      k: { en: "Least-cost, proven", ar: "أقل تكلفة، بدليل" },
      v: {
        en: "The next tariff review will ask if you dispatched at least-cost. Bring evidence, not assurances.",
        ar: "المراجعة التعرفية القادمة ستسأل: هل وزّعتم بأقل تكلفة؟ أحضروا الدليل لا التطمينات.",
      },
    },
  ],
  renewables: [
    {
      k: { en: "Generated ≠ Earned", ar: "المولّد ≠ المكسوب" },
      v: {
        en: "Your asset produces MWh. Your P&L records OMR. The gap between them is a decision.",
        ar: "أصلك ينتج ميغاواط-ساعة، وقائمة أرباحك تسجّل ريالات — والفجوة بينهما قرار.",
      },
    },
    {
      k: { en: "Curtailment", ar: "التقليص" },
      v: {
        en: "Curtailed energy is a receipt for value you never collected.",
        ar: "الطاقة المقلّصة إيصالٌ بقيمةٍ لم تُحصّلها قط.",
      },
    },
    {
      k: { en: "Free fuel ≠ free money", ar: "وقود مجاني ≠ مال مجاني" },
      v: {
        en: "When fuel costs nothing, timing is the only economic lever you have left.",
        ar: "حين لا يكلّف الوقود شيئًا، يصبح التوقيت الرافعة الاقتصادية الوحيدة المتبقية.",
      },
    },
    {
      k: { en: "PPA hides the spread", ar: "اتفاقية الشراء تُخفي الفارق" },
      v: {
        en: "Fixed offtake hides the market spread — it doesn't remove it.",
        ar: "الشراء الثابت يخفي فارق السوق — لكنه لا يلغيه.",
      },
    },
  ],
  wind: [
    {
      k: { en: "Night bias", ar: "انحياز الليل" },
      v: {
        en: "Wind often blows hardest when prices are lowest. Timing is the whole game.",
        ar: "غالبًا ما تشتد الرياح حين تنخفض الأسعار — فالتوقيت هو اللعبة كلها.",
      },
    },
    {
      k: { en: "Curtail or absorb", ar: "تقليص أم استيعاب" },
      v: {
        en: "Every curtailment order is an economic event, not just an operational one.",
        ar: "كل أمر تقليص حدثٌ اقتصادي، لا مجرد إجراء تشغيلي.",
      },
    },
    {
      k: { en: "Half a decision", ar: "نصف قرار" },
      v: {
        en: "A wind forecast without a price forecast is half a decision.",
        ar: "توقّع الرياح دون توقّع السعر نصفُ قرار.",
      },
    },
    {
      k: { en: "Variable ≠ passive", ar: "متغيّر ≠ سلبي" },
      v: {
        en: "Variability is only a cost when nobody is pricing it.",
        ar: "التغيّر لا يكون كلفةً إلا حين لا يُسعّره أحد.",
      },
    },
  ],
  tnd: [
    {
      k: { en: "Congestion re-prices", ar: "الازدحام يعيد التسعير" },
      v: {
        en: "Congestion re-prices the network every hour; the wires business absorbs it silently.",
        ar: "الازدحام يعيد تسعير الشبكة كل ساعة — وقطاع النقل يمتص الكلفة بصمت.",
      },
    },
    {
      k: { en: "Losses have a price", ar: "للفواقد سعر" },
      v: {
        en: "Technical losses settle at a market price. Few networks see it hour-by-hour.",
        ar: "الفواقد الفنية تُسوّى بسعر السوق — وقليلة هي الشبكات التي تراه ساعةً بساعة.",
      },
    },
    {
      k: { en: "Cheapest resolution", ar: "أرخص حلٍّ للقيد" },
      v: {
        en: "Every constraint has a cheapest resolution. Was yours it?",
        ar: "لكل قيدٍ تشغيلي حلٌّ أرخص من غيره — فهل كان حلُّكم هو؟",
      },
    },
    {
      k: { en: "Answerable at review", ar: "مُساءَل عند المراجعة" },
      v: {
        en: "A dispatch decision without a recorded rationale is unanswerable at review time.",
        ar: "قرار التوزيع دون مبرر مسجّل لا يمكن الدفاع عنه وقت المراجعة.",
      },
    },
  ],
  smartgrid: [
    {
      k: { en: "Data ≠ Decisions", ar: "البيانات ≠ القرارات" },
      v: {
        en: "Telemetry answers \"what is happening\". It never answers \"what is it worth\".",
        ar: "القياسات تجيب عن «ماذا يحدث» — ولا تجيب أبدًا عن «كم يساوي».",
      },
    },
    {
      k: { en: "Half smart", ar: "ذكاء منقوص" },
      v: {
        en: "A smart grid that can't justify a decision in OMR is only half smart.",
        ar: "الشبكة الذكية التي لا تبرر قراراتها بالريال ذكاؤها منقوص.",
      },
    },
    {
      k: { en: "Signals are free", ar: "الإشارات مجانية" },
      v: {
        en: "Marginal price, scarcity, demand — published, hourly, free. And mostly unused.",
        ar: "السعر الحدّي والندرة والطلب — منشورة، كل ساعة، مجانًا. وغالبًا بلا استخدام.",
      },
    },
    {
      k: { en: "Close the loop", ar: "أغلق الحلقة" },
      v: {
        en: "You already paid for the sensors. The economic layer is the part that pays you back.",
        ar: "لقد دفعتم ثمن أجهزة الاستشعار — والطبقة الاقتصادية هي الجزء الذي يردّ لكم المال.",
      },
    },
  ],
  industrial: [
    {
      k: { en: "Load = Lever", ar: "الحِمل = رافعة" },
      v: {
        en: "Every shiftable load is a tradable position against the tariff curve.",
        ar: "كل حِملٍ قابل للتحويل هو مركز تداول مقابل منحنى التعرفة.",
      },
    },
    {
      k: { en: "A few hours rule", ar: "ساعات قليلة تحكم" },
      v: {
        en: "A handful of peak hours can set your demand charges for the whole month.",
        ar: "حفنة من ساعات الذروة قد تحدد رسوم الطلب لشهرٍ كامل.",
      },
    },
    {
      k: { en: "Make or import", ar: "توليد أم استيراد" },
      v: {
        en: "Self-generation vs. grid import is a price decision made daily — usually by habit.",
        ar: "التوليد الذاتي مقابل الاستيراد من الشبكة قرار سعري يومي — يُتّخذ عادةً بالعادة.",
      },
    },
    {
      k: { en: "Same plan, cheaper", ar: "نفس الخطة، أرخص" },
      v: {
        en: "Scheduling by price turns the same production plan into a cheaper one.",
        ar: "الجدولة وفق السعر تحوّل خطة الإنتاج نفسها إلى خطةٍ أرخص.",
      },
    },
  ],
  water: [
    {
      k: { en: "Water can wait", ar: "الماء يستطيع الانتظار" },
      v: {
        en: "Water can wait hours; energy prices can't. Storage is your arbitrage.",
        ar: "الماء يحتمل الانتظار ساعات، وأسعار الطاقة لا تحتمل — والتخزين هو مراجحتكم.",
      },
    },
    {
      k: { en: "Desal is a trade", ar: "التحلية صفقة" },
      v: {
        en: "Desalination is energy priced in water — schedule it like a trade.",
        ar: "التحلية طاقةٌ مُسعّرة بالماء — فجدولوها كما تُجدوَل الصفقات.",
      },
    },
    {
      k: { en: "Tanks = Batteries", ar: "الخزانات = بطاريات" },
      v: {
        en: "Reservoir head is stored energy. Dispatch it like a battery.",
        ar: "منسوب الخزان طاقة مخزّنة — وزّعوها كما تُوزّع البطارية.",
      },
    },
    {
      k: { en: "One bill, two flows", ar: "فاتورة واحدة، تدفقان" },
      v: {
        en: "Water and energy costs move together. Optimize them together.",
        ar: "تكاليف الماء والطاقة تتحرك معًا — فحسّنوهما معًا.",
      },
    },
  ],
  hydrogen: [
    {
      k: { en: "Power is the cost", ar: "الكهرباء هي التكلفة" },
      v: {
        en: "Electricity dominates green-hydrogen cost. Electrolysis timing IS the business case.",
        ar: "الكهرباء تهيمن على تكلفة الهيدروجين الأخضر — وتوقيت التحليل الكهربائي هو جدوى المشروع نفسها.",
      },
    },
    {
      k: { en: "Cheapest hours win", ar: "أرخص الساعات تفوز" },
      v: {
        en: "Run at the grid's cheapest, cleanest hours and your cost per kilogram follows.",
        ar: "شغّلوا في أرخص ساعات الشبكة وأنظفها، وستنخفض تكلفة الكيلوغرام تبعًا لذلك.",
      },
    },
    {
      k: { en: "Paid to be flexible", ar: "مرونة مدفوعة الأجر" },
      v: {
        en: "An electrolyser is a controllable load the grid will pay to have.",
        ar: "المحلّل الكهربائي حِملٌ قابل للتحكم ستدفع الشبكة مقابل وجوده.",
      },
    },
    {
      k: { en: "Green ≠ always-on", ar: "أخضر ≠ دائم التشغيل" },
      v: {
        en: "Running through expensive hours burns the margin the project was financed on.",
        ar: "التشغيل عبر الساعات المكلفة يحرق الهامش الذي مُوّل المشروع على أساسه.",
      },
    },
  ],
  datacenters: [
    {
      k: { en: "AI-scale load", ar: "حِمل بحجم الذكاء الاصطناعي" },
      v: {
        en: "Compute demand grows faster than grid contracts adapt. That spread is yours to manage.",
        ar: "طلب الحوسبة ينمو أسرع من تكيّف عقود الشبكة — وهذا الفارق لكم أن تديروه.",
      },
    },
    {
      k: { en: "Flexible ≠ Down", ar: "مرن ≠ متوقف" },
      v: {
        en: "Batteries, gensets, workload shifting — flexibility that never touches uptime.",
        ar: "بطاريات ومولدات وترحيل أحمال — مرونة لا تمسّ زمن التشغيل إطلاقًا.",
      },
    },
    {
      k: { en: "24/7 ≠ Flat", ar: "24/7 ≠ سعر ثابت" },
      v: {
        en: "Constant uptime doesn't mean constant price. Your bill knows the difference.",
        ar: "استمرارية التشغيل لا تعني ثبات السعر — وفاتورتكم تعرف الفرق.",
      },
    },
    {
      k: { en: "A portfolio, hourly", ar: "محفظة، كل ساعة" },
      v: {
        en: "Contracted power plus market exposure is a portfolio. Someone should price it hourly.",
        ar: "الطاقة المتعاقد عليها زائد الانكشاف على السوق محفظةٌ — ينبغي أن يُسعّرها أحدهم كل ساعة.",
      },
    },
  ],
  microgrids: [
    {
      k: { en: "Four options, one answer", ar: "أربعة خيارات، جواب واحد" },
      v: {
        en: "Generate, store, import or shed — every hour has exactly one cheapest answer.",
        ar: "توليد أو تخزين أو استيراد أو فصل — لكل ساعة جوابٌ واحد هو الأرخص.",
      },
    },
    {
      k: { en: "Every source, priced", ar: "كل مصدر، مُسعّر" },
      v: {
        en: "Diesel, solar, battery, grid: each hour has a least-cost mix. Habit rarely finds it.",
        ar: "ديزل وشمس وبطارية وشبكة: لكل ساعة مزيجٌ أقل كلفة — ونادرًا ما تجده العادة.",
      },
    },
    {
      k: { en: "Resilience has rent", ar: "للموثوقية إيجار" },
      v: {
        en: "Backup capacity carries a cost every day. Recover it in the cheap hours.",
        ar: "قدرة الاحتياط تحمل كلفةً كل يوم — فاستردّوها في الساعات الرخيصة.",
      },
    },
    {
      k: { en: "Small ≠ Simple", ar: "صغير ≠ بسيط" },
      v: {
        en: "Small systems leak silently — no analyst, no review, just a bill that's always slightly too high.",
        ar: "الأنظمة الصغيرة تتسرّب بصمت — لا محلل ولا مراجعة، فقط فاتورة أعلى مما يجب دائمًا.",
      },
    },
  ],
  vpp: [
    {
      k: { en: "Fleet as one", ar: "أسطول كأصلٍ واحد" },
      v: {
        en: "A thousand small assets dispatched as one plant — if the timing engine exists.",
        ar: "ألف أصل صغير يُوزّع كمحطة واحدة — إن وُجد محرّك التوقيت.",
      },
    },
    {
      k: { en: "Co-timing is the value", ar: "التزامن هو القيمة" },
      v: {
        en: "Aggregation value comes from co-timing, not from just connecting.",
        ar: "قيمة التجميع تأتي من التزامن لا من مجرد الربط.",
      },
    },
    {
      k: { en: "Proof = decision log", ar: "الإثبات = سجل القرارات" },
      v: {
        en: "Markets pay fleets that can prove response. Proof is a decision log.",
        ar: "الأسواق تدفع للأساطيل القادرة على إثبات الاستجابة — والإثبات سجلُّ قرارات.",
      },
    },
    {
      k: { en: "Every node counts", ar: "كل عقدة تُحتسب" },
      v: {
        en: "Un-priced nodes drag the whole portfolio's revenue.",
        ar: "العقد غير المُسعّرة تجرّ إيراد المحفظة كلها إلى الأسفل.",
      },
    },
  ],
};

/** One line of honest urgency per sector — rendered inside the final CTA. */
export const SECTOR_URGENCY: Record<string, Bilingual> = {
  oilgas: {
    en: "Tonight's peak will price your gas with or without you — and the hours you miss don't come back.",
    ar: "ذروة الليلة ستُسعّر غازكم بحضوركم أو بغيابكم — والساعات التي تفوت لا تعود.",
  },
  power: {
    en: "Scarcity hours pay for the whole quarter — and they never announce themselves in advance.",
    ar: "ساعات الندرة تدفع أرباح الربع كله — وهي لا تعلن عن نفسها مسبقًا أبدًا.",
  },
  utilities: {
    en: "Every tariff review asks the same question: did you dispatch at least-cost? Bring evidence.",
    ar: "كل مراجعة تعرفية تطرح السؤال نفسه: هل وزّعتم بأقل تكلفة؟ أحضروا الدليل.",
  },
  renewables: {
    en: "The sun and wind won't change their schedule. The market changes hourly. One of them has to be managed.",
    ar: "الشمس والرياح لن تغيّرا جدولهما، والسوق يتغير كل ساعة — لا بد من إدارة أحدهما.",
  },
  wind: {
    en: "The next curtailment order is coming. What it costs you was decided before it lands.",
    ar: "أمر التقليص القادم آتٍ لا محالة — وما سيكلفكم تقرر قبل وصوله.",
  },
  tnd: {
    en: "Every constrained hour settles somewhere. Without an economic layer, it settles against you.",
    ar: "كل ساعة مقيّدة تُسوّى في مكانٍ ما — وبدون طبقة اقتصادية، تُسوّى على حسابكم.",
  },
  smartgrid: {
    en: "The sensors are installed. The signals are published. The only missing layer is the one that earns.",
    ar: "أجهزة الاستشعار مركّبة والإشارات منشورة — والطبقة الوحيدة الغائبة هي التي تكسب المال.",
  },
  industrial: {
    en: "Your next electricity bill is being decided on the factory floor right now — hour by hour.",
    ar: "فاتورة الكهرباء القادمة تتقرر في أرضية المصنع الآن — ساعةً بساعة.",
  },
  water: {
    en: "A pumping schedule written by habit pays the tariff's worst hours. The price curve is published — use it.",
    ar: "جدول الضخ المكتوب بالعادة يدفع أسوأ ساعات التعرفة — ومنحنى الأسعار منشور، فاستخدموه.",
  },
  hydrogen: {
    en: "Every business plan promised cheap-hour operation. The cheap hours are on the market — is your electrolyser?",
    ar: "كل خطة عمل وعدت بالتشغيل في الساعات الرخيصة — الساعات الرخيصة موجودة في السوق، فهل محلّلكم الكهربائي هناك؟",
  },
  datacenters: {
    en: "Every rack you add raises the stakes on the same unpriced decisions.",
    ar: "كل خزانة خوادم تضيفونها ترفع رهان القرارات غير المُسعّرة نفسها.",
  },
  microgrids: {
    en: "Your microgrid made hundreds of decisions today. Nobody checked what they cost.",
    ar: "شبكتكم المصغّرة اتخذت مئات القرارات اليوم — ولم يتحقق أحد مما كلّفته.",
  },
  vpp: {
    en: "Aggregation without economic timing is just a bigger meter.",
    ar: "التجميع دون توقيت اقتصادي ليس سوى عدّادٍ أكبر.",
  },
};
