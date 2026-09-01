import { doc, getDoc, setDoc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";
import { computed } from "vue";

export interface CmsPriceItem {
  id: string;
  hotelId?: string;
  hotelNameAr?: string;
  hotelNameEn?: string;
  roomType?: string; // e.g. 'standard' | 'deluxe' | 'suite' | 'executive' | 'service'
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priceSar: number;
  unitAr: string;
  unitEn: string;
  includesVat: boolean;
  vatPercentage: number;
  permitNumber?: string;
}

export interface CmsHotelItem {
  id?: string;
  name: string;
  nameEn?: string;
  city: string;
  cityEn?: string;
  image: string;
  description: string;
  descriptionEn?: string;
  permitNumber: string;
  googleMapsUrl?: string;
}

export interface CmsSiteContent {
  features: {
    enableDirectPayment: boolean;
  };
  legal: {
    tradeName: string;
    tradeNameEn: string;
    crNumber: string;
    licenseNumber: string;
    licenseCategory: string;
    licenseCategoryEn: string;
  };
  support: {
    phone: string;
    whatsapp: string;
    complaintsEmail: string;
    support24_7Note: string;
    support24_7NoteEn: string;
    complaintsSlaHours: number;
  };
  hero: {
    welcomePrefix: string;
    welcomePrefixEn?: string;
    brandName: string;
    brandNameEn?: string;
    subtitle: string;
    subtitleEn?: string;
    badgeText: string;
    badgeTextEn?: string;
    showOffer: boolean;
    offerText: string;
    offerTextEn?: string;
    images?: string[];
  };
  about: {
    title: string;
    titleEn?: string;
    badge: string;
    badgeEn?: string;
    contentHtml: string;
    contentHtmlEn?: string;
    stats?: { label: string; labelEn?: string; value: string }[];
  };
  hotelsServices: {
    title: string;
    titleEn?: string;
    badge: string;
    badgeEn?: string;
    subtitle: string;
    subtitleEn?: string;
    contentHtml: string;
    contentHtmlEn?: string;
    features: string[];
    featuresEn?: string[];
    items: CmsHotelItem[];
  };
  prices: {
    titleAr: string;
    titleEn: string;
    badgeAr: string;
    badgeEn: string;
    subtitleAr: string;
    subtitleEn: string;
    items: CmsPriceItem[];
  };
  policies: {
    bookingPolicyAr: string;
    bookingPolicyEn: string;
    cancellationPolicyAr: string;
    cancellationPolicyEn: string;
    cancelResponseHours: number;
    insurancePolicyAr: string;
    insurancePolicyEn: string;
    hasInsurance: boolean;
    refundPolicyAr: string;
    refundPolicyEn: string;
    refundExecutionDays: number;
  };
  contact: {
    title: string;
    titleEn?: string;
    badge: string;
    badgeEn?: string;
    descriptionHtml: string;
    descriptionHtmlEn?: string;
    phone: string;
    email: string;
    whatsapp: string;
    location: string;
    locationEn?: string;
    workingDays: string;
    workingDaysEn?: string;
    workingHours: string;
    workingHoursEn?: string;
    showPayment: boolean;
    bankName: string;
    accountName: string;
    accountNumber: string;
    iban: string;
  };
  socials: {
    whatsapp: string;
    facebook: string;
    snapchat: string;
    instagram: string;
    twitter: string;
  };
  footer: {
    aboutText: string;
    aboutTextEn?: string;
    copyrightText: string;
    copyrightTextEn?: string;
  };
}

export const defaultCmsContent: CmsSiteContent = {
  features: {
    enableDirectPayment: false, // Default hidden until client confirms
  },
  legal: {
    tradeName: "مؤسسة بروج المميزة للسياحة",
    tradeNameEn: "Burouj Al Mumayaza Tourism Est.",
    crNumber: "7027874945",
    licenseNumber: "73103970",
    licenseCategory: "تنظيم وتسهيل خدمات السفر والسياحة",
    licenseCategoryEn: "Travel & Tourism Services Facilitation",
  },
  support: {
    phone: "0507583933",
    whatsapp: "966507583933",
    complaintsEmail: "Buroujtourism@gmail.com",
    support24_7Note: "خدمة الرد على الاستفسارات والشكاوى متوفرة على مدار الساعة (24/7)",
    support24_7NoteEn: "24/7 inquiries & complaints handling service",
    complaintsSlaHours: 24,
  },
  hero: {
    welcomePrefix: "أهلاً بكم في",
    welcomePrefixEn: "Welcome to",
    brandName: "بروج المميزة",
    brandNameEn: "Burouj Al Mumayaza",
    subtitle: "طريقك الأمثل لحجوزات فنادق مكة والمدينة بأرقى المستويات وأفضل الأسعار الشاملة للضريبة",
    subtitleEn: "Your premier destination for Makkah and Madinah hotel reservations at competitive VAT-inclusive rates",
    badgeText: "مرخص من وزارة السياحة برقم 73103970",
    badgeTextEn: "Licensed by the Ministry of Tourism #73103970",
    showOffer: true,
    offerText: "✨ عروض خاصة وحصرية لموسم العمرة بفنادق الصف الأول المطلة على الحرم!",
    offerTextEn: "✨ Exclusive Umrah season offers at premier frontline hotels overlooking the Holy Haram!",
    images: [
      "/9.jpeg",
      "/10.jpeg",
      "/11.jpeg",
      "/13.jpeg",
      "/14.jpeg",
      "/15.jpeg",
      "/16.jpeg",
      "/17.jpeg",
      "/18.jpeg",
      "/19.jpeg",
      "/test/1.jpeg",
      "/test/2.jpeg",
      "/test/3.jpeg",
      "/test/4.jpeg",
      "/test/5.jpeg",
      "/test/6.jpeg",
      "/test/7.jpeg",
      "/test/8.jpeg",
      "/test/20.jpeg",
    ],
  },
  about: {
    title: "من نحن",
    titleEn: "About Us",
    badge: "عن شركة بروج",
    badgeEn: "About Burouj",
    contentHtml: `
      <h2>ريادة وتميز في الضيافة الفندقية</h2>
      <p>تأسست <strong>مؤسسة بروج المميزة للسياحة</strong> (سجل تجاري: 7027874945 | ترخيص وزارة السياحة: 73103970) في مكة المكرمة، ونفخر بكوننا من المنشآت الرائدة في توفير وتنظيم الإقامات الفندقية بالمملكة العربية السعودية وفق أعلى المعايير واللوائح النظامية.</p>
      <p>نعمل بشغف وتفانٍ لتقديم تجربة إقامة متكاملة تجمع بين القرب من الحرمين الشريفين، والراحة الفائقة، والأسعار الشفافة والشاملة للضرائب النظامية التي تلبي تطلعات ضيوف الرحمن والزوار.</p>
      <p>فريقنا المتخصص متواجد على مدار الساعة (24/7) لضمان سرعة الرد على الاستفسارات وتسهيل كافة إجراءات حجزكم وتوفير أعلى معايير الجودة والضيافة الأصيلة.</p>
    `,
    contentHtmlEn: `
      <h2>Leadership & Excellence in Hospitality</h2>
      <p>Established in Makkah, <strong>Burouj Al Mumayaza Tourism Est.</strong> (CR: 7027874945 | Ministry of Tourism License: 73103970) is proud to be a premier agency facilitating hotel accommodations across the Kingdom of Saudi Arabia under strict statutory compliance.</p>
      <p>We are dedicated to delivering seamless hospitality near the Two Holy Mosques with transparent, VAT-inclusive pricing tailored to pilgrims and international visitors.</p>
      <p>Our multilingual support team is active 24/7 to resolve inquiries, process direct bookings, and ensure maximum guest satisfaction.</p>
    `,
    stats: [
      { label: "سنوات من الخبرة", labelEn: "Years of Experience", value: "+10" },
      { label: "فندق شريك مرخص", labelEn: "Licensed Partner Hotels", value: "+150" },
      { label: "عميل سعيد ومقيم", labelEn: "Happy Guests Served", value: "+25,000" },
      { label: "خدمة واستفسارات وشكاوى", labelEn: "24/7 Support & Care", value: "24/7" },
    ],
  },
  hotelsServices: {
    title: "فنادق وخدمات الإقامة المرخصة",
    titleEn: "Licensed Hotels & Accommodation Services",
    badge: "مرافق مرخصة ومصنفة",
    badgeEn: "Licensed & Classified Accommodations",
    subtitle: "نوفر باقات إقامة متكاملة في نخبة من أرقى فنادق مكة والمدينة المصرحة من وزارة السياحة",
    subtitleEn: "Comprehensive accommodation packages at premier hotels in Makkah and Madinah authorized by the Ministry of Tourism",
    contentHtml: `
      <h2>إقامات فندقية فاخرة وميسرة بالقرب من الحرمين الشريفين</h2>
      <p>نوفر خيارات واسعة ومتنوعة من أرقى الفنادق القريبة من المسجد الحرام والمسجد النبوي الشريف، مع إطلالات مباشرة ومرافق عالمية تلبي كافة التطلعات وبأسعار شاملة للضريبة بنسبة 100%.</p>
    `,
    contentHtmlEn: `
      <h2>Luxury & Accessible Hotel Stays Near the Two Holy Mosques</h2>
      <p>We offer diverse selections of prestigious hotels near the Holy Haram in Makkah and the Prophet's Mosque in Madinah, with direct vistas and transparent, all-inclusive VAT pricing.</p>
    `,
    features: [
      "فنادق الصف الأول المرخصة والمطلة مباشرة على الحرم المكي والنبوي",
      "أسعار إجمالية معلنة تشمل ضريبة القيمة المضافة 15% وكافة الرسوم",
      "تأكيد فوري للحجوزات وسرعة الرد على الاستفسارات والتعديلات",
      "خدمة عملاء والرد على الشكاوى على مدار 24 ساعة يومياً (24/7)",
      "سياسات إلغاء واسترجاع شفافة تضمن حقوق النزلاء",
      "خيارات متنوعة تناسب الإقامات الاقتصادية والـ 5 نجوم الفاخرة",
    ],
    featuresEn: [
      "Prime frontline licensed hotels overlooking Holy Haram & Prophet's Mosque",
      "Total advertised rates inclusive of 15% VAT and statutory municipal fees",
      "Instant confirmation and prompt handling of bookings & adjustments",
      "24/7 dedicated customer care and prompt complaints resolution center",
      "Transparent cancellation and refund policies protecting guest rights",
      "Diverse tiers from budget accommodations to ultra-luxury 5-star suites",
    ],
    items: [
      {
        id: "hotel-abraj-safwah",
        name: "فنادق أبراج الصفوة - الحرم المكي",
        nameEn: "Abraj Al Safwah Hotels - Makkah Haram",
        city: "مكة المكرمة",
        cityEn: "Makkah Al Mukarramah",
        image: "/9.jpeg",
        description: "إقامات فندقية فاخرة 5 نجوم بإطلالة مباشرة وساحرة على الكعبة المشرفة وساحات الحرم المكي.",
        descriptionEn: "5-star luxury stay with direct, panoramic views of the Holy Kaaba and Haram plazas.",
        permitNumber: "73103970-MK-01",
        googleMapsUrl: "https://maps.google.com/?q=Abraj+Al+Safwah+Makkah",
      },
      {
        id: "hotel-madinah-central",
        name: "فندق المنطقة المركزية الشمالية - المسجد النبوي",
        nameEn: "Northern Central Area Hotel - Prophet's Mosque",
        city: "المدينة المنورة",
        cityEn: "Madinah Al Munawwarah",
        image: "/10.jpeg",
        description: "إقامة مميزة ومصنفة على بعد خطوات يسيرة من ساحات المسجد النبوي الشريف وباب السلام.",
        descriptionEn: "Classified prime hotel just steps away from the Prophet's Mosque plazas and Bab Al Salam.",
        permitNumber: "73103970-MD-02",
        googleMapsUrl: "https://maps.google.com/?q=Northern+Central+Area+Madinah",
      },
      {
        id: "hotel-swiss-makkah",
        name: "فندق سويس أوتيل المقام - مكة المكرمة",
        nameEn: "Swissotel Al Maqam - Makkah",
        city: "مكة المكرمة",
        cityEn: "Makkah Al Mukarramah",
        image: "/13.jpeg",
        description: "برج فندقي عالمي في مجمع أبراج البيت يجمع بين الفخامة العصرية والوصول المباشر للحرم.",
        descriptionEn: "World-class hospitality tower in Abraj Al Bait with modern luxury and direct Haram access.",
        permitNumber: "73103970-MK-03",
        googleMapsUrl: "https://maps.google.com/?q=Swissotel+Al+Maqam+Makkah",
      },
      {
        id: "hotel-dar-taqwa-madinah",
        name: "فندق دار التقوى - المدينة المنورة",
        nameEn: "Dar Al Taqwa Hotel - Madinah",
        city: "المدينة المنورة",
        cityEn: "Madinah Al Munawwarah",
        image: "/14.jpeg",
        description: "إطلالة مباشرة على الروضة الشريفة وساحات الحرم النبوي مع خدمات ضيافة 5 نجوم راقية.",
        descriptionEn: "Frontline vistas of the Prophet's Mosque and Rawdah with distinguished 5-star services.",
        permitNumber: "73103970-MD-04",
        googleMapsUrl: "https://maps.google.com/?q=Dar+Al+Taqwa+Hotel+Madinah",
      },
      {
        id: "hotel-aziziyah-suites",
        name: "أجنحة الضيافة المميزة - العزيزية",
        nameEn: "Hospitality Family Suites - Al Aziziyah",
        city: "مكة المكرمة",
        cityEn: "Makkah Al Mukarramah",
        image: "/11.jpeg",
        description: "باقات إقامة عائلية رحبة ومجهزة بالكامل مع خدمة نقل ترددية على مدار 24 ساعة للحرم.",
        descriptionEn: "Spacious family accommodation suites with full amenities and 24/7 Haram transport.",
        permitNumber: "73103970-MK-05",
        googleMapsUrl: "https://maps.google.com/?q=Al+Aziziyah+Makkah",
      },
      {
        id: "hotel-oberoi-madinah",
        name: "فندق أوبروي المدينة المنورة",
        nameEn: "The Oberoi Hotel - Madinah",
        city: "المدينة المنورة",
        cityEn: "Madinah Al Munawwarah",
        image: "/15.jpeg",
        description: "أرقى معايير الضيافة العالمية وقربه الاستثنائي من مصلى النساء والمواجهة الشريفة.",
        descriptionEn: "Renowned international luxury offering exceptional proximity to the Prophet's Mosque.",
        permitNumber: "73103970-MD-06",
        googleMapsUrl: "https://maps.google.com/?q=The+Oberoi+Madina",
      },
      {
        id: "hotel-fairmont-clock",
        name: "فندق فيرمونت برج ساعة مكة الملكي",
        nameEn: "Makkah Clock Royal Tower - A Fairmont Hotel",
        city: "مكة المكرمة",
        cityEn: "Makkah Al Mukarramah",
        image: "/16.jpeg",
        description: "أحد أبرز معالم الضيافة العالمية بمكة المكرمة مع أجنحة ملكية وإطلالات بانورامية على الكعبة.",
        descriptionEn: "Iconic landmark in Makkah offering royal suites and full panoramic views of the Holy Kaaba.",
        permitNumber: "73103970-MK-07",
        googleMapsUrl: "https://maps.google.com/?q=Makkah+Clock+Royal+Tower+Fairmont",
      },
    ],
  },
  prices: {
    titleAr: "قائمة أسعار الخدمات الفندقية والسياحية",
    titleEn: "Services & Accommodation Price List",
    badgeAr: "أسعار شاملة الضريبة والرسوم",
    badgeEn: "All-Inclusive Statutory Pricing",
    subtitleAr: "جميع الأسعار المعروضة نهائية ومشتملة على ضريبة القيمة المضافة (15%) وكافة الرسوم النظامية",
    subtitleEn: "All prices shown are total and include 15% VAT and all statutory fees",
    items: [
      {
        id: "room-abraj-deluxe-kaaba",
        hotelId: "hotel-abraj-safwah",
        hotelNameAr: "فنادق أبراج الصفوة - الحرم المكي",
        hotelNameEn: "Abraj Al Safwah Hotels - Makkah Haram",
        roomType: "deluxe",
        nameAr: "غرفة ديلوكس مطلة على الكعبة المشرفة",
        nameEn: "Deluxe Kaaba View Room",
        descriptionAr: "إطلالة مباشرة على الكعبة، شامل الإفطار لشخصين، إنترنت فائق السرعة، وخدمة 24 ساعة.",
        descriptionEn: "Direct Kaaba view, breakfast for 2 included, high-speed Wi-Fi & 24/7 service.",
        priceSar: 1150,
        unitAr: "لليلة الواحدة",
        unitEn: "Per night",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MK-01",
      },
      {
        id: "room-abraj-standard-plaza",
        hotelId: "hotel-abraj-safwah",
        hotelNameAr: "فنادق أبراج الصفوة - الحرم المكي",
        hotelNameEn: "Abraj Al Safwah Hotels - Makkah Haram",
        roomType: "standard",
        nameAr: "غرفة قياسية مطلة على ساحات الحرم المكي",
        nameEn: "Standard Haram Plaza View Room",
        descriptionAr: "غرفة لشخصين مجهزة بالكامل بإطلالة على الساحات مع خدمة الرد والدعم 24/7.",
        descriptionEn: "Fully equipped twin/double room overlooking Haram plazas with 24/7 support.",
        priceSar: 850,
        unitAr: "لليلة الواحدة",
        unitEn: "Per night",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MK-01",
      },
      {
        id: "room-madinah-central-exec",
        hotelId: "hotel-madinah-central",
        hotelNameAr: "فندق المنطقة المركزية الشمالية - المسجد النبوي",
        hotelNameEn: "Northern Central Area Hotel - Prophet's Mosque",
        roomType: "executive",
        nameAr: "غرفة تنفيذية بالمنطقة المركزية الشمالية",
        nameEn: "Executive North Central Room - Madinah",
        descriptionAr: "دقيقتان سيراً من الحرم النبوي، شامل الرسوم والضريبة وخدمات رجال الأعمال.",
        descriptionEn: "2 minutes walk to Prophet's Mosque, all taxes included with executive amenities.",
        priceSar: 690,
        unitAr: "لليلة الواحدة",
        unitEn: "Per night",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MD-02",
      },
      {
        id: "room-madinah-classic-twin",
        hotelId: "hotel-madinah-central",
        hotelNameAr: "فندق المنطقة المركزية الشمالية - المسجد النبوي",
        hotelNameEn: "Northern Central Area Hotel - Prophet's Mosque",
        roomType: "standard",
        nameAr: "غرفة كلاسيكية مزدوجة قريبة من الحرم النبوي",
        nameEn: "Classic Twin Room Near Prophet's Mosque",
        descriptionAr: "إقامة مريحة لشخصين مع إفطار بوفيه متكامل وقرب استثنائي من المسجد النبوي.",
        descriptionEn: "Comfortable stay for 2 with buffet breakfast and close proximity to the Mosque.",
        priceSar: 520,
        unitAr: "لليلة الواحدة",
        unitEn: "Per night",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MD-02",
      },
      {
        id: "room-swiss-premium-haram",
        hotelId: "hotel-swiss-makkah",
        hotelNameAr: "فندق سويس أوتيل المقام - مكة المكرمة",
        hotelNameEn: "Swissotel Al Maqam - Makkah",
        roomType: "deluxe",
        nameAr: "غرفة بريميوم سويس بإطلالة الحرم",
        nameEn: "Swiss Premium Haram View Room",
        descriptionAr: "فخامة سويسرية داخل وقف الملك عبدالعزيز مع وصول مباشر ومصاعد لساحة الحرم.",
        descriptionEn: "Swiss hospitality in King Abdulaziz Endowment with direct Haram elevators.",
        priceSar: 980,
        unitAr: "لليلة الواحدة",
        unitEn: "Per night",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MK-03",
      },
      {
        id: "room-dar-taqwa-deluxe",
        hotelId: "hotel-dar-taqwa-madinah",
        hotelNameAr: "فندق دار التقوى - المدينة المنورة",
        hotelNameEn: "Dar Al Taqwa Hotel - Madinah",
        roomType: "deluxe",
        nameAr: "غرفة ديلوكس مواجهة للمواجهة والروضة الشريفة",
        nameEn: "Deluxe Rawdah View Room - Madinah",
        descriptionAr: "موقع فريد مواجه لباب النساء والمواجهة الشريفة مع ضيافة فاخرة شاملة الضريبة.",
        descriptionEn: "Direct Rawdah view with luxury hospitality, all statutory taxes included.",
        priceSar: 890,
        unitAr: "لليلة الواحدة",
        unitEn: "Per night",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MD-04",
      },
      {
        id: "suite-aziziyah-family",
        hotelId: "hotel-aziziyah-suites",
        hotelNameAr: "أجنحة الضيافة المميزة - العزيزية",
        hotelNameEn: "Hospitality Family Suites - Al Aziziyah",
        roomType: "suite",
        nameAr: "جناح عائلي فاخر (غرفتان وصالة)",
        nameEn: "Luxury Family Suite (2 Bedrooms & Living Room)",
        descriptionAr: "تسع 4-5 أفراد مع مطبخ تحضيري ومواصلات مستمرة على مدار الساعة للحرم المكي.",
        descriptionEn: "Accommodates 4-5 guests with kitchenette and 24/7 continuous Haram shuttle.",
        priceSar: 450,
        unitAr: "لليلة الواحدة",
        unitEn: "Per night",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MK-05",
      },
      {
        id: "room-oberoi-grand-deluxe",
        hotelId: "hotel-oberoi-madinah",
        hotelNameAr: "فندق أوبروي المدينة المنورة",
        hotelNameEn: "The Oberoi Hotel - Madinah",
        roomType: "deluxe",
        nameAr: "غرفة جراند ديلوكس أوبروي بإطلالة الحرم النبوي",
        nameEn: "Oberoi Grand Deluxe Haram View Room",
        descriptionAr: "أعلى درجات الفخامة والخصوصية وخدمة الخادم الشخصي ووجبة إفطار فاخرة لشخصين.",
        descriptionEn: "Supreme luxury, personalized service, and gourmet breakfast for 2.",
        priceSar: 1280,
        unitAr: "لليلة الواحدة",
        unitEn: "Per night",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MD-06",
      },
      {
        id: "suite-fairmont-clock-kaaba",
        hotelId: "hotel-fairmont-clock",
        hotelNameAr: "فندق فيرمونت برج ساعة مكة الملكي",
        hotelNameEn: "Makkah Clock Royal Tower - A Fairmont Hotel",
        roomType: "suite",
        nameAr: "جناح فيرمونت سيجنتشر بإطلالة بانورامية على الكعبة",
        nameEn: "Fairmont Signature Panoramic Kaaba Suite",
        descriptionAr: "جناح ملكي فاخر في الطوابق العليا مع إطلالة كاملة ومباشرة على صحن الطواف والكعبة.",
        descriptionEn: "Royal suite on higher floors with full panoramic vistas of the Kaaba.",
        priceSar: 2100,
        unitAr: "لليلة الواحدة",
        unitEn: "Per night",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MK-07",
      },
      {
        id: "package-umrah-deluxe-service",
        hotelId: "hotel-abraj-safwah",
        hotelNameAr: "فنادق أبراج الصفوة - الحرم المكي",
        hotelNameEn: "Abraj Al Safwah Hotels - Makkah Haram",
        roomType: "service",
        nameAr: "باقة إقامة عمرة متكاملة (مكة + المدينة)",
        nameEn: "Integrated Umrah Hospitality Package (Makkah & Madinah)",
        descriptionAr: "إقامة 4 ليالٍ بأبراج الصفوة مكة + 3 ليالٍ بالمدينة بفندق مصنف 5 نجوم مع النقل.",
        descriptionEn: "4 nights at Abraj Al Safwah Makkah + 3 nights in Madinah 5-star hotel with transport.",
        priceSar: 4950,
        unitAr: "للباقة الكاملة",
        unitEn: "Per package",
        includesVat: true,
        vatPercentage: 15,
        permitNumber: "73103970-MK-01",
      },
    ],
  },
  policies: {
    bookingPolicyAr: `
      <h3>1. سياسة وشروط الحجز وإصدار المستند:</h3>
      <p>يتم تأكيد الحجز فورياً عبر منصة مؤسسة بروج المميزة للسياحة، ويصدر للعميل مستند حجز رسمي إلكتروني فور استلام الطلب متضمناً رقم الحجز المرجعي، بيانات الفندق أو الوحدة، رقم التصريح، تفاصيل التواريخ، وإجمالي السعر مشتملاً على ضريبة القيمة المضافة (15%) والرسوم النظامية.</p>
    `,
    bookingPolicyEn: `
      <h3>1. Booking Terms & Confirmation Document:</h3>
      <p>Bookings are promptly processed through Burouj Al Mumayaza Tourism platform. An official digital booking confirmation is generated, including booking reference ID, hotel/unit details, permit number, check-in/out dates, and total amount inclusive of 15% VAT and statutory fees.</p>
    `,
    cancellationPolicyAr: `
      <h3>2. سياسة وإجراءات إلغاء وتعديل الحجز:</h3>
      <p><strong>آلية تقديم الطلب:</strong> يمكن للعميل تقديم طلب إلغاء أو تعديل الحجز عبر نموذج التواصل بالموقع باختيار نوع الطلب (طلب إلغاء / تعديل حجز)، أو عبر التواصل المباشر مع خدمة العملاء على مدار الساعة عبر الواتساب أو الهاتف.</p>
      <p><strong>المدة المحددة للرد والبت في الطلب:</strong> تلتزم المؤسسة بالرد على طلب الإلغاء أو التعديل والبت فيه خلال مدة لا تتجاوز <strong>24 ساعة</strong> من وقت استلام الطلب.</p>
      <p><strong>شروط الإلغاء المجاني:</strong> يحق للعميل الإلغاء مجاناً واسترداد كامل المبلغ قبل موعد تسجيل الدخول بـ 48 ساعة على الأقل. وفي حال الإلغاء في موعد أقل تطبق شروط سياسة الفندق المعتمدة دون أي رسوم غير معلنة.</p>
    `,
    cancellationPolicyEn: `
      <h3>2. Cancellation & Modification Policy & Procedures:</h3>
      <p><strong>Request Method:</strong> Guests can submit cancellation or modification requests via the website contact form (selecting Cancellation/Modification), or directly through 24/7 customer support via WhatsApp or phone.</p>
      <p><strong>Response & Resolution SLA:</strong> The establishment commits to reviewing, responding to, and deciding upon cancellation or modification requests within a maximum of <strong>24 hours</strong> from receipt.</p>
      <p><strong>Free Cancellation:</strong> Full refund is applicable when cancellation is requested at least 48 hours prior to check-in date.</p>
    `,
    cancelResponseHours: 24,
    insurancePolicyAr: `
      <h3>3. سياسة مبالغ التأمين:</h3>
      <p><strong>توضيح رسمي:</strong> لا تطلب مؤسسة بروج المميزة للسياحة أي مبالغ تأمين إضافية لحجوزات الخدمات والوحدات الفندقية المعروضة عبر الموقع الإلكتروني.</p>
      <p>وفي حال فرض أي فندق تأميناً مؤقتاً للخدمات الإضافية أثناء تسجيل الدخول، فإنه يُدفع مباشرة للفندق ويسترد فوراً عند تسجيل الخروج والفحص دون أي تأخير.</p>
    `,
    insurancePolicyEn: `
      <h3>3. Security Deposit & Insurance Policy:</h3>
      <p><strong>Official Notice:</strong> Burouj Al Mumayaza Tourism does not charge any security deposit for hotel room bookings facilitated through the website.</p>
      <p>Should any specific hotel require an incidental deposit at physical check-in, it is paid directly to the hotel reception and refunded immediately upon check-out inspection.</p>
    `,
    hasInsurance: false,
    refundPolicyAr: `
      <h3>4. سياسة استرجاع المبالغ (وفق المادة الثالثة والعشرون):</h3>
      <p><strong>عند تعذر تقديم الخدمة المتفق عليها:</strong> في حال تعذر تقديم الخدمة المحجوزة لأي سبب خارج عن إرادة العميل، تلتزم المؤسسة فوراً بتخيير السائح بين:</p>
      <ul>
        <li>توفير خدمة بديلة مساوية أو أفضل بنفس القيمة ودون تحميل العميل أي مبالغ إضافية.</li>
        <li>أو استرجاع المبالغ المدفوعة فوراً وكاملة <strong>دون خصم أي رسوم أو استقطاعات</strong>.</li>
      </ul>
      <p><strong>المدة الزمنية لإعادة المبلغ:</strong> يتم تنفيذ أمر الاسترداد فوراً وتصل المبالغ لحساب العميل خلال مدة من <strong>1 إلى 3 أيام عمل</strong> حسب نظام البنك المصدر.</p>
    `,
    refundPolicyEn: `
      <h3>4. Refund Policy (Under Article 23):</h3>
      <p><strong>In Case of Inability to Provide the Agreed Service:</strong> Should the establishment be unable to provide the booked service, the guest is immediately offered the choice of:</p>
      <ul>
        <li>Providing an equivalent or superior alternative service at no extra cost.</li>
        <li>Or a full immediate refund of all paid amounts <strong>without any deduction or fees</strong>.</li>
      </ul>
      <p><strong>Refund Processing SLA:</strong> Refunds are initiated immediately and credited back to the customer within <strong>1 to 3 business days</strong> depending on the issuing bank.</p>
    `,
    refundExecutionDays: 3,
  },
  contact: {
    title: "تواصل معنا",
    titleEn: "Contact Us",
    badge: "خدمة واستفسارات 24/7",
    badgeEn: "24/7 Inquiries & Support",
    descriptionHtml: "<p>يسعدنا استقبال استفساراتكم وشكواكم وطلبات الحجز على مدار الساعة طوال أيام الأسبوع (24/7). يرجى ملء النموذج أو التواصل عبر القنوات المباشرة وسنرد عليكم فوراً.</p>",
    descriptionHtmlEn: "<p>We welcome your inquiries, booking requests, and official complaints round the clock (24/7). Please submit the form or contact us through direct channels for instant response.</p>",
    phone: "0507583933",
    email: "Buroujtourism@gmail.com",
    whatsapp: "966507583933",
    location: "مكة المكرمة - المملكة العربية السعودية",
    locationEn: "Makkah Al Mukarramah - Kingdom of Saudi Arabia",
    workingDays: "طوال أيام الأسبوع (7 أيام)",
    workingDaysEn: "All Week (7 Days)",
    workingHours: "24 ساعة على مدار اليوم للرد على الاستفسارات والشكاوى والحجوزات",
    workingHoursEn: "24 Hours daily response for inquiries, complaints and bookings",
    showPayment: true,
    bankName: "البنك الأهلي السعودي",
    accountName: "مؤسسة بروج المميزة للسياحة",
    accountNumber: "",
    iban: "",
  },
  socials: {
    whatsapp: "https://wa.me/966507583933",
    facebook: "https://facebook.com",
    snapchat: "https://snapchat.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  },
  footer: {
    aboutText: "مؤسسة بروج المميزة للسياحة (سجل تجاري: 7027874945 | ترخيص وزارة السياحة: 73103970) - خياركم الموثوق لحجوزات الفنادق والخدمات السياحية في مكة المكرمة والمدينة المنورة.",
    aboutTextEn: "Burouj Al Mumayaza Tourism Est. (CR: 7027874945 | Tourism License: 73103970) - Your trusted partner for hotel bookings and pilgrimage services in Makkah and Madinah.",
    copyrightText: "جميع الحقوق محفوظة لمؤسسة بروج المميزة للسياحة",
    copyrightTextEn: "All rights reserved to Burouj Al Mumayaza Tourism Est.",
  },
};

export const useCmsContent = () => {
  const db = useFirestore();
  const docRef = doc(db, "site_content", "main");
  const { data: rawData, pending, error } = useDocument(docRef);

  const content = computed<CmsSiteContent>(() => {
    if (!rawData.value) {
      return defaultCmsContent;
    }
    const val = rawData.value as any;

    // Backward compatibility merge with hotels / services if stored separately
    const hotelsServicesMerged: CmsSiteContent["hotelsServices"] = {
      ...defaultCmsContent.hotelsServices,
      ...(val.hotelsServices || {}),
      items: val.hotelsServices?.items?.length
        ? val.hotelsServices.items
        : val.hotels?.items?.length
        ? val.hotels.items
        : defaultCmsContent.hotelsServices.items,
      features: val.hotelsServices?.features?.length
        ? val.hotelsServices.features
        : val.services?.features?.length
        ? val.services.features
        : defaultCmsContent.hotelsServices.features,
    };

    return {
      features: { ...defaultCmsContent.features, ...(val.features || {}) },
      legal: { ...defaultCmsContent.legal, ...(val.legal || {}) },
      support: { ...defaultCmsContent.support, ...(val.support || {}) },
      hero: { ...defaultCmsContent.hero, ...(val.hero || {}) },
      about: { ...defaultCmsContent.about, ...(val.about || {}) },
      hotelsServices: hotelsServicesMerged,
      prices: {
        ...defaultCmsContent.prices,
        ...(val.prices || {}),
        items: val.prices?.items?.length ? val.prices.items : defaultCmsContent.prices.items,
      },
      policies: { ...defaultCmsContent.policies, ...(val.policies || {}) },
      contact: {
        ...defaultCmsContent.contact,
        ...(val.contact || {}),
        descriptionHtml:
          val.contact?.descriptionHtml ||
          val.contact?.description ||
          defaultCmsContent.contact.descriptionHtml,
      },
      socials: { ...defaultCmsContent.socials, ...(val.socials || {}) },
      footer: { ...defaultCmsContent.footer, ...(val.footer || {}) },
    };
  });

  const saveContent = async (updatedContent: Partial<CmsSiteContent>) => {
    try {
      await setDoc(docRef, updatedContent, { merge: true });
      return { success: true };
    } catch (err: any) {
      console.error("Failed to save CMS content:", err);
      return { success: false, error: err?.message || "حدث خطأ أثناء الحفظ" };
    }
  };

  return {
    content,
    pending,
    error,
    saveContent,
  };
};
