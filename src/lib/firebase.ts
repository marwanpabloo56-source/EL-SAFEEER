// Models and Data types for El Safeer platform
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: 'local-supervisor-uid',
      email: 'marwanpabloo56@gmail.com',
      emailVerified: true,
      isAnonymous: false,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.warn('Data Operation Notice:', JSON.stringify(errInfo));
}

// Data models
export type GradeId = 'grade1' | 'grade2' | 'grade3';

export interface GradeInfo {
  id: GradeId;
  name: string;
  shortName: string;
  badge: string;
  description: string;
}

export const GRADES_LIST: GradeInfo[] = [
  {
    id: 'grade1',
    name: 'الصف الأول الإعدادي',
    shortName: 'أولى إعدادي',
    badge: '1ع',
    description: 'تأسيس قوي وبناء الثقة في المنهج الجديد',
  },
  {
    id: 'grade2',
    name: 'الصف الثاني الإعدادي',
    shortName: 'تانية إعدادي',
    badge: '2ع',
    description: 'مرحلة التركيز وفهم التراكمي وتطوير المهارات',
  },
  {
    id: 'grade3',
    name: 'الصف الثالث الإعدادي (الشهادة)',
    shortName: 'تالتة إعدادي',
    badge: '3ع',
    description: 'سنة الحصاد والتفوق لتحقيق أعلى مجموع',
  },
];

export interface ScheduleItem {
  id: string;
  grade: GradeId;
  dayOfWeek: string; // 'السبت', 'الأحد', etc.
  dayIndex: number; // 0 for Saturday or matching Day of week
  time: string; // e.g. "04:00 مساءً"
  time24?: string; // e.g. "16:00" for countdown calculation
  centerName: string;
  centerAddress: string;
  notes?: string;
  isCancelled?: boolean;
}

export interface CenterItem {
  id: string;
  name: string;
  address: string;
  phone?: string;
  mapLink?: string;
  notes?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  grade: 'all' | GradeId;
  isUrgent?: boolean;
  dateStr: string;
  badgeLabel?: string; // 'جديد', 'مهم', 'تنبيه'
}

export interface VideoItem {
  id: string;
  title: string;
  grade: GradeId;
  youtubeUrl: string;
  isComingSoon: boolean;
  unitTitle: string;
  duration?: string;
  dateAdded?: string;
}

export interface PlatformSettings {
  teacherName: string;
  nickname: string;
  slogan: string;
  whatsappNumber: string; // e.g. "201012345678"
  displayPhone: string; // e.g. "01012345678"
  assistantPhone?: string;
  tickerText: string;
  announcementActive: boolean;
  heroNotice?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  addedAt: string;
}

// Initial default data if Firestore is fresh
export const DEFAULT_SETTINGS: PlatformSettings = {
  teacherName: 'أ/ محمود عصام',
  nickname: 'السفير',
  slogan: 'سفيرك للتفوق والدرجة النهائية في المرحلة الإعدادية',
  whatsappNumber: '201023456789',
  displayPhone: '01023456789',
  assistantPhone: '01123456789',
  tickerText: '🔥 أهلاً بأبطال السفير! بدأ حجز وتأكيد مواعيد الفصل الدراسي الجديد للمرحلة الإعدادية (1ع - 2ع - 3ع) بالسناتر والمجموعات الخاصة.',
  announcementActive: true,
  heroNotice: 'حضور الحصص بالملزمة الجديدة وكشكول المتابعة، والامتحان الدوري كل حصتين 🌟',
};

export const DEFAULT_CENTERS: CenterItem[] = [
  {
    id: 'center-1',
    name: 'سنتر النخبة التعليمي',
    address: 'شارع التحرير الرئيسي - أمام مدرسة الأورمان - الدور الثاني',
    phone: '01023456789',
    mapLink: 'https://maps.google.com',
    notes: 'مكيف بالكامل وقاعة مجهزة بشاشات عرض ذكية',
  },
  {
    id: 'center-2',
    name: 'سنتر الفرسان التخصصي',
    address: 'ميدان المحطة - بجوار صيدلية العزبي - برج الأطباء',
    phone: '01123456789',
    mapLink: 'https://maps.google.com',
    notes: 'قريب من محطة المترو والمواصلات العامة',
  },
  {
    id: 'center-3',
    name: 'سنتر المستقبل الذهبي',
    address: 'شارع الجلاء - متفرع من شارع الجمهورية - عمارة الأمل',
    phone: '01223456789',
    mapLink: 'https://maps.google.com',
    notes: 'مكتبة السنتر توفر جميع الملازم والامتحانات الدورية',
  },
];

export const DEFAULT_SCHEDULES: ScheduleItem[] = [
  // 1st Prep
  {
    id: 'sch-101',
    grade: 'grade1',
    dayOfWeek: 'السبت',
    dayIndex: 6,
    time: '03:00 مساءً',
    time24: '15:00',
    centerName: 'سنتر النخبة التعليمي',
    centerAddress: 'شارع التحرير الرئيسي - أمام مدرسة الأورمان',
    notes: 'حصة الشرح الأسبوعي + تسميع الكلمات والقواعد',
  },
  {
    id: 'sch-102',
    grade: 'grade1',
    dayOfWeek: 'الثلاثاء',
    dayIndex: 2,
    time: '05:00 مساءً',
    time24: '17:00',
    centerName: 'سنتر الفرسان التخصصي',
    centerAddress: 'ميدان المحطة - بجوار صيدلية العزبي',
    notes: 'تدريبات مكثفة وحل كتاب التدريبات والواجب',
  },
  // 2nd Prep
  {
    id: 'sch-201',
    grade: 'grade2',
    dayOfWeek: 'الأحد',
    dayIndex: 0,
    time: '04:00 مساءً',
    time24: '16:00',
    centerName: 'سنتر النخبة التعليمي',
    centerAddress: 'شارع التحرير الرئيسي - أمام مدرسة الأورمان',
    notes: 'شرح الوحدة الجديدة + كويز سريع أول ربع ساعة',
  },
  {
    id: 'sch-202',
    grade: 'grade2',
    dayOfWeek: 'الأربعاء',
    dayIndex: 3,
    time: '06:00 مساءً',
    time24: '18:00',
    centerName: 'سنتر المستقبل الذهبي',
    centerAddress: 'شارع الجلاء - متفرع من شارع الجمهورية',
    notes: 'مراجعة أسبوعية وحل بنك الأسئلة',
  },
  // 3rd Prep
  {
    id: 'sch-301',
    grade: 'grade3',
    dayOfWeek: 'السبت',
    dayIndex: 6,
    time: '06:00 مساءً',
    time24: '18:00',
    centerName: 'سنتر النخبة التعليمي',
    centerAddress: 'شارع التحرير الرئيسي - أمام مدرسة الأورمان',
    notes: 'حصة الشهادة الإعدادية - شرح عميق وتدريب على أسئلة المحافظات',
  },
  {
    id: 'sch-302',
    grade: 'grade3',
    dayOfWeek: 'الإثنين',
    dayIndex: 1,
    time: '04:30 مساءً',
    time24: '16:30',
    centerName: 'سنتر الفرسان التخصصي',
    centerAddress: 'ميدان المحطة - برج الأطباء',
    notes: 'ورشة حل امتحانات ومراجعة تراكمية مع السفير',
  },
  {
    id: 'sch-303',
    grade: 'grade3',
    dayOfWeek: 'الخميس',
    dayIndex: 4,
    time: '05:00 مساءً',
    time24: '17:00',
    centerName: 'سنتر المستقبل الذهبي',
    centerAddress: 'شارع الجلاء - عمارة الأمل',
    notes: 'مجموعة المتميزين - أسئلة المستويات العليا والتفوق',
  },
];

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'امتحان نصف الفصل الشامل لجميع طلاب تالتة إعدادي 🏆',
    content: 'يعلن مستر محمود عصام (السفير) عن موعد الامتحان الشامل لطلاب الشهادة الإعدادية في جميع السناتر الأسبوع القادم، وفيه جوائز مالية وميداليات تفوق للأوائل!',
    grade: 'grade3',
    isUrgent: true,
    dateStr: 'منذ يومين',
    badgeLabel: 'جديد ومهم',
  },
  {
    id: 'news-2',
    title: 'استلام ملزمة المراجعة والتطبيقات لطلاب أولى وتانية إعدادي',
    content: 'الملزمة الجديدة متوفرة الآن في سكرتارية السناتر، يرجى استلام نسختك قبل حصة السبت القادم لأن الشرح وتدريبات الحصة هتكون منها مباشرة.',
    grade: 'all',
    isUrgent: false,
    dateStr: 'منذ 3 أيام',
    badgeLabel: 'تنبيه ملزمة',
  },
  {
    id: 'news-3',
    title: 'بدء استقبال أسئلة الطلاب على جروب الواتساب التعليمي',
    content: 'مساعد السفير متاح يومياً من 6 لـ 10 مساءً للرد على استفسارات الواجب ونماذج الامتحانات وحل أي مسألة تقف قدامكم.',
    grade: 'all',
    isUrgent: false,
    dateStr: 'منذ أسبوع',
    badgeLabel: 'متابعة أونلاين',
  },
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'أقوى مراجعة على أهم نقاط التأسيس وفنيات الامتحان | تالتة إعدادي',
    grade: 'grade3',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isComingSoon: false,
    unitTitle: 'الوحدة الأولى - المهارات الأساسية',
    duration: '38 دقيقة',
    dateAdded: 'جديد هذا الأسبوع',
  },
  {
    id: 'vid-2',
    title: 'شرح فكرة ومسألة بتيجي في كل المحافظات | تالتة إعدادي',
    grade: 'grade3',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isComingSoon: false,
    unitTitle: 'مراجعات ليلة الامتحان وتريكات السفير',
    duration: '24 دقيقة',
    dateAdded: 'الأسبوع الماضي',
  },
  {
    id: 'vid-3',
    title: 'حل أصعب 50 سؤال اختيار من متعدد وتدريبات متوقعة | تانية إعدادي',
    grade: 'grade2',
    youtubeUrl: '',
    isComingSoon: true,
    unitTitle: 'الوحدة الثانية - بنك الأسئلة',
    duration: 'قريباً',
    dateAdded: 'ترقّبوا البث',
  },
  {
    id: 'vid-4',
    title: 'تبسيط شامل لأهم دروس المنهج في فيديو واحد ممتع | أولى إعدادي',
    grade: 'grade1',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isComingSoon: false,
    unitTitle: 'الوحدة الأولى - المفاهيم والتدريبات',
    duration: '31 دقيقة',
    dateAdded: 'متاح الآن',
  },
  {
    id: 'vid-5',
    title: 'مراجعة ليلة الامتحان الشامل وأقوى التوقعات | أولى إعدادي',
    grade: 'grade1',
    youtubeUrl: '',
    isComingSoon: true,
    unitTitle: 'المراجعة النهائية والتوقعات',
    duration: 'قريباً',
    dateAdded: 'ينزل قبل الامتحان',
  },
];
