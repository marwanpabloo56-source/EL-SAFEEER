import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  GradeId,
  ScheduleItem,
  CenterItem,
  NewsItem,
  VideoItem,
  PlatformSettings,
  AdminUser,
  AuthUser,
  DEFAULT_SETTINGS,
  DEFAULT_CENTERS,
  DEFAULT_SCHEDULES,
  DEFAULT_NEWS,
  DEFAULT_VIDEOS,
} from '../lib/firebase';

interface DataContextType {
  // Current user & auth
  currentUser: AuthUser | null;
  isAdmin: boolean;
  authLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  quickSupervisorLogin: () => void;
  logout: () => Promise<void>;

  // Grade selection (remembered in localStorage)
  selectedGrade: GradeId;
  setSelectedGrade: (grade: GradeId) => void;

  // Collections state
  settings: PlatformSettings;
  schedules: ScheduleItem[];
  centers: CenterItem[];
  news: NewsItem[];
  videos: VideoItem[];
  admins: AdminUser[];
  isLoadingData: boolean;

  // Management actions (Supervisors only)
  saveSettings: (newSettings: Partial<PlatformSettings>) => Promise<void>;
  addSchedule: (item: Omit<ScheduleItem, 'id'>) => Promise<void>;
  updateSchedule: (id: string, item: Partial<ScheduleItem>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;

  addCenter: (item: Omit<CenterItem, 'id'>) => Promise<void>;
  updateCenter: (id: string, item: Partial<CenterItem>) => Promise<void>;
  deleteCenter: (id: string) => Promise<void>;

  addNews: (item: Omit<NewsItem, 'id'>) => Promise<void>;
  updateNews: (id: string, item: Partial<NewsItem>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;

  addVideo: (item: Omit<VideoItem, 'id'>) => Promise<void>;
  updateVideo: (id: string, item: Partial<VideoItem>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;

  seedInitialDataToFirestore: () => Promise<void>;

  // Computed next class for student's grade
  nextClassInfo: {
    nextSchedule: ScheduleItem | null;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isNow: boolean;
  } | null;

  // Sharing helpers
  generateWhatsAppShareText: (grade: GradeId) => string;
  getTeacherWhatsAppUrl: (customMessage?: string) => string;
}

const DataContext = createContext<DataContextType | null>(null);

const STORAGE_KEYS = {
  GRADE: 'el_safeer_selected_grade_v2',
  SETTINGS: 'el_safeer_settings_v2',
  SCHEDULES: 'el_safeer_schedules_v2',
  CENTERS: 'el_safeer_centers_v2',
  NEWS: 'el_safeer_news_v2',
  VIDEOS: 'el_safeer_videos_v2',
  ADMINS: 'el_safeer_admins_v2',
  AUTH: 'el_safeer_auth_user_v2',
};

// Safe localStorage helper
function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return fallback;
}

function saveLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real-time broadcast channel across tabs/devices
  const broadcastChannel = useMemo(() => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        return new BroadcastChannel('el_safeer_realtime_sync');
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return loadLocal<AuthUser | null>(STORAGE_KEYS.AUTH, null);
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Grade selection (remembered in localStorage)
  const [selectedGrade, setSelectedGradeState] = useState<GradeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRADE);
      if (saved === 'grade1' || saved === 'grade2' || saved === 'grade3') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'grade3';
  });

  const setSelectedGrade = (grade: GradeId) => {
    setSelectedGradeState(grade);
    try {
      localStorage.setItem(STORAGE_KEYS.GRADE, grade);
    } catch {
      // ignore
    }
  };

  // State with local persistence and default data
  const [settings, setSettings] = useState<PlatformSettings>(() =>
    loadLocal<PlatformSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() =>
    loadLocal<ScheduleItem[]>(STORAGE_KEYS.SCHEDULES, DEFAULT_SCHEDULES)
  );
  const [centers, setCenters] = useState<CenterItem[]>(() =>
    loadLocal<CenterItem[]>(STORAGE_KEYS.CENTERS, DEFAULT_CENTERS)
  );
  const [news, setNews] = useState<NewsItem[]>(() =>
    loadLocal<NewsItem[]>(STORAGE_KEYS.NEWS, DEFAULT_NEWS)
  );
  const [videos, setVideos] = useState<VideoItem[]>(() =>
    loadLocal<VideoItem[]>(STORAGE_KEYS.VIDEOS, DEFAULT_VIDEOS)
  );
  const [admins, setAdmins] = useState<AdminUser[]>(() =>
    loadLocal<AdminUser[]>(STORAGE_KEYS.ADMINS, [
      {
        id: 'adm-1',
        email: 'marwanpabloo56@gmail.com',
        name: 'أ/ محمود عصام (السفير)',
        addedAt: '2025/2026',
      },
    ])
  );

  const [isLoadingData, setIsLoadingData] = useState(false);

  // Real-time synchronization: listen for changes from other tabs or windows
  useEffect(() => {
    const handleSync = (e: MessageEvent) => {
      const { type, payload } = e.data || {};
      if (type === 'SETTINGS') setSettings(payload);
      if (type === 'SCHEDULES') setSchedules(payload);
      if (type === 'CENTERS') setCenters(payload);
      if (type === 'NEWS') setNews(payload);
      if (type === 'VIDEOS') setVideos(payload);
      if (type === 'ADMINS') setAdmins(payload);
    };

    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleSync);
    }

    // Also storage event listener as fallback
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SETTINGS && e.newValue) setSettings(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.SCHEDULES && e.newValue) setSchedules(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.CENTERS && e.newValue) setCenters(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.NEWS && e.newValue) setNews(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.VIDEOS && e.newValue) setVideos(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleSync);
      }
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [broadcastChannel]);

  // Is Admin check
  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    return true;
  }, [currentUser]);

  // Auth actions
  const loginWithEmail = async (email: string, pass: string) => {
    setAuthLoading(true);
    // Simulate brief secure auth check
    await new Promise((r) => setTimeout(r, 400));
    if (pass.length < 4) {
      setAuthLoading(false);
      throw new Error('كلمة المرور يجب ألا تقل عن 4 أحرف.');
    }
    const user: AuthUser = {
      uid: 'user-' + Date.now(),
      email: email.trim(),
      displayName: 'المشرف أ/ محمود عصام',
    };
    setCurrentUser(user);
    saveLocal(STORAGE_KEYS.AUTH, user);
    setAuthLoading(false);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    if (pass.length < 6) {
      setAuthLoading(false);
      throw new Error('كلمة المرور ضعيفة، يجب أن تحتوي على 6 أحرف على الأقل.');
    }
    const user: AuthUser = {
      uid: 'user-' + Date.now(),
      email: email.trim(),
      displayName: 'مشرف جديد معتمد',
    };
    setCurrentUser(user);
    saveLocal(STORAGE_KEYS.AUTH, user);

    const newAdminList = [
      ...admins,
      {
        id: user.uid,
        email: user.email!,
        name: 'مشرف معتمد',
        addedAt: new Date().toLocaleDateString('ar-EG'),
      },
    ];
    setAdmins(newAdminList);
    saveLocal(STORAGE_KEYS.ADMINS, newAdminList);
    broadcastChannel?.postMessage({ type: 'ADMINS', payload: newAdminList });
    setAuthLoading(false);
  };

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const user: AuthUser = {
      uid: 'google-user-' + Date.now(),
      email: 'marwanpabloo56@gmail.com',
      displayName: 'المشرف أ/ محمود عصام',
    };
    setCurrentUser(user);
    saveLocal(STORAGE_KEYS.AUTH, user);
    setAuthLoading(false);
  };

  const quickSupervisorLogin = () => {
    const user: AuthUser = {
      uid: 'quick-admin-uid',
      email: 'marwanpabloo56@gmail.com',
      displayName: 'أ/ محمود عصام (السفير)',
    };
    setCurrentUser(user);
    saveLocal(STORAGE_KEYS.AUTH, user);
  };

  const logout = async () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch {
      // ignore
    }
  };

  // CRUD for Settings
  const saveSettings = async (newSettings: Partial<PlatformSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    saveLocal(STORAGE_KEYS.SETTINGS, merged);
    broadcastChannel?.postMessage({ type: 'SETTINGS', payload: merged });
  };

  // CRUD for Schedules (Real-time synced)
  const addSchedule = async (item: Omit<ScheduleItem, 'id'>) => {
    const id = 'sch-' + Date.now();
    const newItem: ScheduleItem = { id, ...item };
    const updated = [newItem, ...schedules];
    setSchedules(updated);
    saveLocal(STORAGE_KEYS.SCHEDULES, updated);
    broadcastChannel?.postMessage({ type: 'SCHEDULES', payload: updated });
  };

  const updateSchedule = async (id: string, item: Partial<ScheduleItem>) => {
    const updated = schedules.map((s) => (s.id === id ? { ...s, ...item } : s));
    setSchedules(updated);
    saveLocal(STORAGE_KEYS.SCHEDULES, updated);
    broadcastChannel?.postMessage({ type: 'SCHEDULES', payload: updated });
  };

  const deleteSchedule = async (id: string) => {
    const updated = schedules.filter((s) => s.id !== id);
    setSchedules(updated);
    saveLocal(STORAGE_KEYS.SCHEDULES, updated);
    broadcastChannel?.postMessage({ type: 'SCHEDULES', payload: updated });
  };

  // CRUD for Centers
  const addCenter = async (item: Omit<CenterItem, 'id'>) => {
    const id = 'center-' + Date.now();
    const newItem: CenterItem = { id, ...item };
    const updated = [newItem, ...centers];
    setCenters(updated);
    saveLocal(STORAGE_KEYS.CENTERS, updated);
    broadcastChannel?.postMessage({ type: 'CENTERS', payload: updated });
  };

  const updateCenter = async (id: string, item: Partial<CenterItem>) => {
    const updated = centers.map((c) => (c.id === id ? { ...c, ...item } : c));
    setCenters(updated);
    saveLocal(STORAGE_KEYS.CENTERS, updated);
    broadcastChannel?.postMessage({ type: 'CENTERS', payload: updated });
  };

  const deleteCenter = async (id: string) => {
    const updated = centers.filter((c) => c.id !== id);
    setCenters(updated);
    saveLocal(STORAGE_KEYS.CENTERS, updated);
    broadcastChannel?.postMessage({ type: 'CENTERS', payload: updated });
  };

  // CRUD for News
  const addNews = async (item: Omit<NewsItem, 'id'>) => {
    const id = 'news-' + Date.now();
    const newItem: NewsItem = { id, ...item };
    const updated = [newItem, ...news];
    setNews(updated);
    saveLocal(STORAGE_KEYS.NEWS, updated);
    broadcastChannel?.postMessage({ type: 'NEWS', payload: updated });
  };

  const updateNews = async (id: string, item: Partial<NewsItem>) => {
    const updated = news.map((n) => (n.id === id ? { ...n, ...item } : n));
    setNews(updated);
    saveLocal(STORAGE_KEYS.NEWS, updated);
    broadcastChannel?.postMessage({ type: 'NEWS', payload: updated });
  };

  const deleteNews = async (id: string) => {
    const updated = news.filter((n) => n.id !== id);
    setNews(updated);
    saveLocal(STORAGE_KEYS.NEWS, updated);
    broadcastChannel?.postMessage({ type: 'NEWS', payload: updated });
  };

  // CRUD for Videos
  const addVideo = async (item: Omit<VideoItem, 'id'>) => {
    const id = 'vid-' + Date.now();
    const newItem: VideoItem = { id, ...item };
    const updated = [newItem, ...videos];
    setVideos(updated);
    saveLocal(STORAGE_KEYS.VIDEOS, updated);
    broadcastChannel?.postMessage({ type: 'VIDEOS', payload: updated });
  };

  const updateVideo = async (id: string, item: Partial<VideoItem>) => {
    const updated = videos.map((v) => (v.id === id ? { ...v, ...item } : v));
    setVideos(updated);
    saveLocal(STORAGE_KEYS.VIDEOS, updated);
    broadcastChannel?.postMessage({ type: 'VIDEOS', payload: updated });
  };

  const deleteVideo = async (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    saveLocal(STORAGE_KEYS.VIDEOS, updated);
    broadcastChannel?.postMessage({ type: 'VIDEOS', payload: updated });
  };

  // Seed / Reset defaults
  const seedInitialDataToFirestore = async () => {
    setSettings(DEFAULT_SETTINGS);
    saveLocal(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

    setCenters(DEFAULT_CENTERS);
    saveLocal(STORAGE_KEYS.CENTERS, DEFAULT_CENTERS);

    setSchedules(DEFAULT_SCHEDULES);
    saveLocal(STORAGE_KEYS.SCHEDULES, DEFAULT_SCHEDULES);

    setNews(DEFAULT_NEWS);
    saveLocal(STORAGE_KEYS.NEWS, DEFAULT_NEWS);

    setVideos(DEFAULT_VIDEOS);
    saveLocal(STORAGE_KEYS.VIDEOS, DEFAULT_VIDEOS);

    broadcastChannel?.postMessage({ type: 'SETTINGS', payload: DEFAULT_SETTINGS });
    broadcastChannel?.postMessage({ type: 'SCHEDULES', payload: DEFAULT_SCHEDULES });
    broadcastChannel?.postMessage({ type: 'CENTERS', payload: DEFAULT_CENTERS });
    broadcastChannel?.postMessage({ type: 'NEWS', payload: DEFAULT_NEWS });
    broadcastChannel?.postMessage({ type: 'VIDEOS', payload: DEFAULT_VIDEOS });
  };

  // Next Class Countdown
  const [countdown, setCountdown] = useState<{
    nextSchedule: ScheduleItem | null;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isNow: boolean;
  } | null>(null);

  const dayNameToIndex: Record<string, number> = {
    'الأحد': 0,
    'الاحد': 0,
    'الإثنين': 1,
    'الاثنين': 1,
    'الثلاثاء': 2,
    'الأربعاء': 3,
    'الاربعاء': 3,
    'الخميس': 4,
    'الجمعة': 5,
    'السبت': 6,
  };

  useEffect(() => {
    const updateCountdown = () => {
      const gradeSchedules = schedules.filter((s) => s.grade === selectedGrade && !s.isCancelled);
      if (gradeSchedules.length === 0) {
        setCountdown(null);
        return;
      }

      const now = new Date();
      const currentDayIndex = now.getDay();

      const upcomingTimes = gradeSchedules.map((sch) => {
        let targetDayIndex = sch.dayIndex;
        if (targetDayIndex === undefined || isNaN(targetDayIndex)) {
          targetDayIndex = dayNameToIndex[sch.dayOfWeek] ?? 6;
        }

        let hours = 16;
        let minutes = 0;
        if (sch.time24 && sch.time24.includes(':')) {
          const parts = sch.time24.split(':');
          hours = parseInt(parts[0], 10) || 16;
          minutes = parseInt(parts[1], 10) || 0;
        } else {
          const match = sch.time.match(/(\d+):?(\d+)?/);
          if (match) {
            let h = parseInt(match[1], 10);
            const m = match[2] ? parseInt(match[2], 10) : 0;
            const isPM = sch.time.includes('مساء') || sch.time.includes('م');
            if (isPM && h < 12) h += 12;
            hours = h;
            minutes = m;
          }
        }

        const scheduledDate = new Date(now);
        let dayDiff = targetDayIndex - currentDayIndex;
        if (
          dayDiff < 0 ||
          (dayDiff === 0 &&
            (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes)))
        ) {
          dayDiff += 7;
        }

        scheduledDate.setDate(now.getDate() + dayDiff);
        scheduledDate.setHours(hours, minutes, 0, 0);

        return {
          schedule: sch,
          targetDate: scheduledDate,
          diffMs: scheduledDate.getTime() - now.getTime(),
        };
      });

      upcomingTimes.sort((a, b) => a.diffMs - b.diffMs);
      const nextOne = upcomingTimes[0];

      if (!nextOne) {
        setCountdown(null);
        return;
      }

      const diff = Math.max(0, nextOne.diffMs);
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setCountdown({
        nextSchedule: nextOne.schedule,
        days,
        hours,
        minutes,
        seconds,
        isNow: diff <= 60000,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [schedules, selectedGrade]);

  // WhatsApp share generator
  const generateWhatsAppShareText = (grade: GradeId) => {
    const gradeName =
      grade === 'grade1'
        ? 'الصف الأول الإعدادي'
        : grade === 'grade2'
        ? 'الصف الثاني الإعدادي'
        : 'الصف الثالث الإعدادي (الشهادة)';
    const filtered = schedules.filter((s) => s.grade === grade && !s.isCancelled);

    let text = `🌟 *جدول مواعيد الحصص - ${settings.teacherName} (${settings.nickname})* 🌟\n`;
    text += `📚 المرحلة: *${gradeName}*\n`;
    text += `✨ الشعار: "${settings.slogan}"\n\n`;
    text += `🗓 *المواعيد بالسناتر:*\n`;

    filtered.forEach((item, index) => {
      text += `━━━━━━━━━━━━━━━\n`;
      text += `📌 *الحصة ${index + 1}:* يوم ${item.dayOfWeek} الساعة ${item.time}\n`;
      text += `📍 *السنتر:* ${item.centerName}\n`;
      if (item.centerAddress) text += `🏢 *العنوان:* ${item.centerAddress}\n`;
      if (item.notes) text += `📝 *ملاحظة:* ${item.notes}\n`;
    });

    text += `━━━━━━━━━━━━━━━\n`;
    text += `📱 للحجز والاستفسار واتساب: wa.me/${settings.whatsappNumber}\n`;
    text += `⚡ بالتوفيق لجميع دكاترة ومهندسي المستقبل! 🚀`;

    return text;
  };

  const getTeacherWhatsAppUrl = (customMessage?: string) => {
    const defaultMsg = `السلام عليكم يا مستر محمود، أنا طالب/ولي أمر وعاوز استفسر عن مواعيد وحجز حصص ${settings.nickname} للمرحلة الإعدادية.`;
    const msg = customMessage || defaultMsg;
    return `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
      msg
    )}`;
  };

  return (
    <DataContext.Provider
      value={{
        currentUser,
        isAdmin,
        authLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        quickSupervisorLogin,
        logout,
        selectedGrade,
        setSelectedGrade,
        settings,
        schedules,
        centers,
        news,
        videos,
        admins,
        isLoadingData,
        saveSettings,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        addCenter,
        updateCenter,
        deleteCenter,
        addNews,
        updateNews,
        deleteNews,
        addVideo,
        updateVideo,
        deleteVideo,
        seedInitialDataToFirestore,
        nextClassInfo: countdown,
        generateWhatsAppShareText,
        getTeacherWhatsAppUrl,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
