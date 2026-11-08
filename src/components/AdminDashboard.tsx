import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  GradeId,
  GRADES_LIST,
  ScheduleItem,
  CenterItem,
  NewsItem,
  VideoItem,
} from '../lib/firebase';
import {
  ShieldCheck,
  Calendar,
  Building2,
  Bell,
  Video,
  Settings,
  BookOpen,
  Users,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Phone,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Server,
  CloudUpload,
  Globe,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  onClose: () => void;
}

type AdminTab =
  | 'schedules'
  | 'centers'
  | 'news'
  | 'videos'
  | 'settings'
  | 'guide'
  | 'admins';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    currentUser,
    isAdmin,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    quickSupervisorLogin,
    logout,
    settings,
    saveSettings,
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    centers,
    addCenter,
    updateCenter,
    deleteCenter,
    news,
    addNews,
    updateNews,
    deleteNews,
    videos,
    addVideo,
    updateVideo,
    deleteVideo,
    admins,
    seedInitialDataToFirestore,
  } = useData();

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('schedules');

  // Edit / Form states
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [scheduleForm, setScheduleForm] = useState<Omit<ScheduleItem, 'id'>>({
    grade: 'grade3',
    dayOfWeek: 'السبت',
    dayIndex: 6,
    time: '04:00 مساءً',
    time24: '16:00',
    centerName: '',
    centerAddress: '',
    notes: '',
  });

  const [isAddingCenter, setIsAddingCenter] = useState(false);
  const [editingCenterId, setEditingCenterId] = useState<string | null>(null);
  const [centerForm, setCenterForm] = useState<Omit<CenterItem, 'id'>>({
    name: '',
    address: '',
    phone: '',
    mapLink: '',
    notes: '',
  });

  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<Omit<NewsItem, 'id'>>({
    title: '',
    content: '',
    grade: 'all',
    isUrgent: false,
    dateStr: 'اليوم',
    badgeLabel: 'جديد',
  });

  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState<Omit<VideoItem, 'id'>>({
    title: '',
    grade: 'grade3',
    youtubeUrl: '',
    isComingSoon: false,
    unitTitle: 'الوحدة الأولى',
    duration: '30 دقيقة',
    dateAdded: 'متاح الآن',
  });

  // Settings form
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Seed status
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Handle Login / Register
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail || !authPassword) {
      setAuthError('يرجى كتابة البريد الإلكتروني وكلمة المرور.');
      return;
    }
    setAuthSubmitting(true);
    try {
      if (authMode === 'login') {
        await loginWithEmail(authEmail, authPassword);
      } else {
        await registerWithEmail(authEmail, authPassword);
      }
      confetti({ particleCount: 40, spread: 50 });
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthSubmitting(true);
    try {
      await loginWithGoogle();
      confetti({ particleCount: 40, spread: 50 });
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'فشل تسجيل الدخول بحساب جوجل');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // Unauthenticated: Show Login / Register Screen
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md bg-[#0f1d47] border border-[#233878] rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-[#142352] text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f5b83d] to-[#d8971f] text-[#0a1230] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#f5b83d]/25">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-white">تسجيل دخول المشرف</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              لوحة تحكم أ/ محمود عصام (السفير) لتعديل المواعيد والمحتوى فورياً
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                البريد الإلكتروني:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-[#142352] border border-[#2b448a] rounded-xl pr-9 pl-3 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#f5b83d] dir-ltr text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                كلمة المرور:
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#142352] border border-[#2b448a] rounded-xl pr-9 pl-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#f5b83d] dir-ltr text-right"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f5b83d] to-[#d8971f] hover:from-amber-400 hover:to-amber-500 text-[#0a1230] font-black text-sm shadow-lg shadow-[#f5b83d]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : authMode === 'login' ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>دخول لوحة التحكم</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>إنشاء حساب مشرف جديد</span>
                </>
              )}
            </button>
          </form>

          {/* Google Login Option */}
          <div className="mt-4 pt-4 border-t border-[#1e3470]">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={authSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#142352] hover:bg-[#1a2e6b] text-slate-200 border border-[#2b448a] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>تسجيل الدخول السريع بحساب Google</span>
            </button>

            {/* Quick Demo Supervisor Login */}
            <button
              type="button"
              onClick={() => {
                quickSupervisorLogin();
                confetti({ particleCount: 40, spread: 50 });
              }}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-[#f5b83d]/15 hover:bg-[#f5b83d]/25 text-[#f5b83d] border border-[#f5b83d]/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>دخول مباشر وسريع كمشرف (أ/ محمود عصام) ⚡</span>
            </button>
          </div>

          {/* Toggle Login / Register */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setAuthError('');
              }}
              className="text-xs text-[#f5b83d] hover:underline"
            >
              {authMode === 'login'
                ? 'ليس لديك حساب مشرف؟ اضغط لإنشاء حساب جديد'
                : 'لديك حساب بالفعل؟ اضغط لتسجيل الدخول'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Authenticated Supervisor Dashboard
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-[#0a1230] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-[#0c173d] border-b border-[#1b2b62] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5b83d] to-[#d8971f] text-[#0a1230] flex items-center justify-center font-black shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>لوحة المشرف المعتمدة</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                متصل لايف 🟢
              </span>
            </h2>
            <div className="text-xs text-slate-400">
              مرحباً: <span className="text-slate-200 font-medium">{currentUser.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-[#142352] hover:bg-rose-600/20 hover:text-rose-300 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#233878]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#f5b83d] text-[#0a1230] hover:bg-amber-400 font-bold text-xs flex items-center gap-1 shadow-md"
          >
            <X className="w-4 h-4" />
            <span>إغلاق وعودة للموقع</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Tabs + Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar / Horizontal on mobile */}
        <nav className="w-full md:w-64 bg-[#0a1438] border-b md:border-b-0 md:border-l border-[#192b62] p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('schedules')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-right whitespace-nowrap ${
              activeTab === 'schedules'
                ? 'bg-[#f5b83d] text-[#0a1230] shadow-md font-black'
                : 'text-slate-300 hover:bg-[#142456] hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span>مواعيد الحصص ({schedules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('centers')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-right whitespace-nowrap ${
              activeTab === 'centers'
                ? 'bg-[#f5b83d] text-[#0a1230] shadow-md font-black'
                : 'text-slate-300 hover:bg-[#142456] hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>السناتر والفروع ({centers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-right whitespace-nowrap ${
              activeTab === 'news'
                ? 'bg-[#f5b83d] text-[#0a1230] shadow-md font-black'
                : 'text-slate-300 hover:bg-[#142456] hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>الأخبار والتنبيهات ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-right whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-[#f5b83d] text-[#0a1230] shadow-md font-black'
                : 'text-slate-300 hover:bg-[#142456] hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 shrink-0" />
            <span>فيديوهات الشرح ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-right whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#f5b83d] text-[#0a1230] shadow-md font-black'
                : 'text-slate-300 hover:bg-[#142456] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>إعدادات السفير والواتساب</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-right whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-[#0a1230] shadow-md font-black'
                : 'text-emerald-400 hover:bg-[#142456]'
            }`}
          >
            <CloudUpload className="w-4 h-4 shrink-0" />
            <span>دليل النشر المجاني 🚀</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-right whitespace-nowrap ${
              activeTab === 'admins'
                ? 'bg-[#f5b83d] text-[#0a1230] shadow-md font-black'
                : 'text-slate-300 hover:bg-[#142456] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>فريق المشرفين ({admins.length})</span>
          </button>
        </nav>

        {/* Tab Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a1230]">
          {/* ======================================================== */}
          {/* TAB 1: SCHEDULES MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'schedules' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0f1d47] p-4 rounded-2xl border border-[#20367a]">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#f5b83d]" />
                    <span>إدارة مواعيد الحصص الأسبوعية</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    أي تعديل أو إضافة هيظهر فوراً للطلاب في العدّاد التنازلي والجدول بدون إعادة تحميل.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsAddingSchedule(true);
                    setEditingScheduleId(null);
                    setScheduleForm({
                      grade: 'grade3',
                      dayOfWeek: 'السبت',
                      dayIndex: 6,
                      time: '04:00 مساءً',
                      time24: '16:00',
                      centerName: centers[0]?.name || 'سنتر النخبة',
                      centerAddress: centers[0]?.address || '',
                      notes: '',
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2b6cff] to-[#1e54cc] hover:from-[#3a78ff] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة ميعاد حصة جديد</span>
                </button>
              </div>

              {/* Add / Edit Form Modal or Card */}
              {isAddingSchedule && (
                <div className="bg-[#122254] p-5 rounded-2xl border border-[#2d4b99] space-y-4 animate-in fade-in-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[#20367a]">
                    <h4 className="text-sm font-black text-white">
                      {editingScheduleId ? 'تعديل ميعاد الحصة' : 'إضافة ميعاد حصة جديد'}
                    </h4>
                    <button
                      onClick={() => setIsAddingSchedule(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">الصف:</label>
                      <select
                        value={scheduleForm.grade}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, grade: e.target.value as GradeId })
                        }
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {GRADES_LIST.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">اليوم:</label>
                      <select
                        value={scheduleForm.dayOfWeek}
                        onChange={(e) => {
                          const val = e.target.value;
                          const mapDays: Record<string, number> = {
                            'السبت': 6,
                            'الأحد': 0,
                            'الإثنين': 1,
                            'الثلاثاء': 2,
                            'الأربعاء': 3,
                            'الخميس': 4,
                            'الجمعة': 5,
                          };
                          setScheduleForm({
                            ...scheduleForm,
                            dayOfWeek: val,
                            dayIndex: mapDays[val] ?? 6,
                          });
                        }}
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="السبت">السبت</option>
                        <option value="الأحد">الأحد</option>
                        <option value="الإثنين">الإثنين</option>
                        <option value="الثلاثاء">الثلاثاء</option>
                        <option value="الأربعاء">الأربعاء</option>
                        <option value="الخميس">الخميس</option>
                        <option value="الجمعة">الجمعة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        الساعة (بالعربي):
                      </label>
                      <input
                        type="text"
                        value={scheduleForm.time}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, time: e.target.value })
                        }
                        placeholder="مثال: 04:30 مساءً"
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        اسم السنتر:
                      </label>
                      <input
                        type="text"
                        value={scheduleForm.centerName}
                        onChange={(e) => {
                          const name = e.target.value;
                          const matchedCenter = centers.find((c) => c.name === name);
                          setScheduleForm({
                            ...scheduleForm,
                            centerName: name,
                            centerAddress: matchedCenter
                              ? matchedCenter.address
                              : scheduleForm.centerAddress,
                          });
                        }}
                        placeholder="مثال: سنتر النخبة التعليمي"
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        عنوان السنتر:
                      </label>
                      <input
                        type="text"
                        value={scheduleForm.centerAddress}
                        onChange={(e) =>
                          setScheduleForm({ ...scheduleForm, centerAddress: e.target.value })
                        }
                        placeholder="مثال: شارع التحرير أمام مدرسة الأورمان"
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      ملاحظات وتنبيهات الحصة:
                    </label>
                    <input
                      type="text"
                      value={scheduleForm.notes || ''}
                      onChange={(e) =>
                        setScheduleForm({ ...scheduleForm, notes: e.target.value })
                      }
                      placeholder="مثال: حضور بالملزمة وكشكول الواجب، كويز أول ربع ساعة"
                      className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsAddingSchedule(false)}
                      className="px-4 py-2 rounded-xl bg-[#0a1230] text-slate-300 text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={async () => {
                        if (!scheduleForm.centerName) {
                          alert('برجاء كتابة اسم السنتر');
                          return;
                        }
                        if (editingScheduleId) {
                          await updateSchedule(editingScheduleId, scheduleForm);
                        } else {
                          await addSchedule(scheduleForm);
                        }
                        setIsAddingSchedule(false);
                        confetti({ particleCount: 30, spread: 50 });
                      }}
                      className="px-5 py-2 rounded-xl bg-[#f5b83d] text-[#0a1230] font-black text-xs hover:bg-amber-400"
                    >
                      {editingScheduleId ? 'حفظ التعديلات' : 'إضافة الميعاد الآن'}
                    </button>
                  </div>
                </div>
              )}

              {/* Schedules Table */}
              <div className="bg-[#0f1d47] rounded-2xl border border-[#20367a] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#0a1438] text-slate-300 font-bold border-b border-[#20367a]">
                      <tr>
                        <th className="p-3">الصف</th>
                        <th className="p-3">اليوم والميعاد</th>
                        <th className="p-3">السنتر والعنوان</th>
                        <th className="p-3">الملاحظات</th>
                        <th className="p-3 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b2b62]">
                      {schedules.map((item) => {
                        const gradeObj = GRADES_LIST.find((g) => g.id === item.grade);
                        return (
                          <tr key={item.id} className="hover:bg-[#142352]/50 transition-colors">
                            <td className="p-3 font-bold text-amber-300">
                              {gradeObj?.shortName || item.grade}
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-white">يوم {item.dayOfWeek}</div>
                              <div className="text-slate-400">{item.time}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-bold text-white">{item.centerName}</div>
                              <div className="text-slate-400 text-[11px] line-clamp-1">
                                {item.centerAddress}
                              </div>
                            </td>
                            <td className="p-3 text-slate-300 max-w-xs">{item.notes || '—'}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingScheduleId(item.id);
                                    setScheduleForm({
                                      grade: item.grade,
                                      dayOfWeek: item.dayOfWeek,
                                      dayIndex: item.dayIndex,
                                      time: item.time,
                                      time24: item.time24,
                                      centerName: item.centerName,
                                      centerAddress: item.centerAddress,
                                      notes: item.notes || '',
                                    });
                                    setIsAddingSchedule(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-[#142352] text-slate-300 hover:text-white hover:bg-[#1f3675]"
                                  title="تعديل"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('هل أنت متأكد من حذف هذا الميعاد؟')) {
                                      await deleteSchedule(item.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white"
                                  title="حذف"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CENTERS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'centers' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0f1d47] p-4 rounded-2xl border border-[#20367a]">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-rose-400" />
                    <span>إدارة السناتر والفروع وأماكن التواجد</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    أضف فروعك وأرقام التليفونات ومواقع الخرائط عشان الطلاب وأولياء الأمور يوصلوا بسهولة.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsAddingCenter(true);
                    setEditingCenterId(null);
                    setCenterForm({
                      name: '',
                      address: '',
                      phone: '',
                      mapLink: '',
                      notes: '',
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة سنتر جديد</span>
                </button>
              </div>

              {/* Add / Edit Center Form */}
              {isAddingCenter && (
                <div className="bg-[#122254] p-5 rounded-2xl border border-[#2d4b99] space-y-4 animate-in fade-in-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[#20367a]">
                    <h4 className="text-sm font-black text-white">
                      {editingCenterId ? 'تعديل بيانات السنتر' : 'إضافة سنتر جديد'}
                    </h4>
                    <button
                      onClick={() => setIsAddingCenter(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        اسم السنتر:
                      </label>
                      <input
                        type="text"
                        value={centerForm.name}
                        onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })}
                        placeholder="مثال: سنتر النخبة التعليمي"
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        رقم هاتف السنتر:
                      </label>
                      <input
                        type="text"
                        value={centerForm.phone || ''}
                        onChange={(e) => setCenterForm({ ...centerForm, phone: e.target.value })}
                        placeholder="010XXXXXXXX"
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white dir-ltr text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      العنوان بالتفصيل:
                    </label>
                    <input
                      type="text"
                      value={centerForm.address}
                      onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })}
                      placeholder="الشارع، العلامة المميزة، الدور..."
                      className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        رابط الموقع على جوجل مابس (Google Maps Link):
                      </label>
                      <input
                        type="url"
                        value={centerForm.mapLink || ''}
                        onChange={(e) => setCenterForm({ ...centerForm, mapLink: e.target.value })}
                        placeholder="https://maps.google.com/..."
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white dir-ltr text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        ملاحظات عن القاعة أو الحجز:
                      </label>
                      <input
                        type="text"
                        value={centerForm.notes || ''}
                        onChange={(e) => setCenterForm({ ...centerForm, notes: e.target.value })}
                        placeholder="مكيف، قاعة مجهزة، الحجز من السكرتارية..."
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsAddingCenter(false)}
                      className="px-4 py-2 rounded-xl bg-[#0a1230] text-slate-300 text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={async () => {
                        if (!centerForm.name || !centerForm.address) {
                          alert('برجاء كتابة اسم وعنوان السنتر');
                          return;
                        }
                        if (editingCenterId) {
                          await updateCenter(editingCenterId, centerForm);
                        } else {
                          await addCenter(centerForm);
                        }
                        setIsAddingCenter(false);
                      }}
                      className="px-5 py-2 rounded-xl bg-rose-500 text-white font-black text-xs hover:bg-rose-400"
                    >
                      {editingCenterId ? 'حفظ التعديلات' : 'إضافة السنتر'}
                    </button>
                  </div>
                </div>
              )}

              {/* Centers List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {centers.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-[#0f1d47] border border-[#20367a] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-black text-white">{c.name}</h4>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingCenterId(c.id);
                              setCenterForm({
                                name: c.name,
                                address: c.address,
                                phone: c.phone || '',
                                mapLink: c.mapLink || '',
                                notes: c.notes || '',
                              });
                              setIsAddingCenter(true);
                            }}
                            className="p-1.5 rounded-lg bg-[#142352] text-slate-300 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('هل أنت متأكد من حذف هذا السنتر؟')) {
                                await deleteCenter(c.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 mb-2 leading-relaxed">{c.address}</p>
                      {c.phone && (
                        <div className="text-xs text-emerald-400 font-bold mb-1">
                          تليفون: {c.phone}
                        </div>
                      )}
                      {c.notes && <div className="text-[11px] text-slate-400">{c.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: NEWS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'news' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0f1d47] p-4 rounded-2xl border border-[#20367a]">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-emerald-400" />
                    <span>إدارة الأخبار والتنبيهات وشريط الإعلانات</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    أعلن عن الامتحانات الشاملة، مواعيد الملازم، وأي تنبيه طارئ يظهر بشريط الأخبار.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsAddingNews(true);
                    setEditingNewsId(null);
                    setNewsForm({
                      title: '',
                      content: '',
                      grade: 'all',
                      isUrgent: false,
                      dateStr: 'اليوم',
                      badgeLabel: 'جديد',
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة خبر جديد</span>
                </button>
              </div>

              {/* News Form */}
              {isAddingNews && (
                <div className="bg-[#122254] p-5 rounded-2xl border border-[#2d4b99] space-y-4 animate-in fade-in-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[#20367a]">
                    <h4 className="text-sm font-black text-white">
                      {editingNewsId ? 'تعديل الخبر' : 'إضافة خبر وتنبيه جديد'}
                    </h4>
                    <button
                      onClick={() => setIsAddingNews(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      عنوان الخبر أو التنبيه:
                    </label>
                    <input
                      type="text"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      placeholder="مثال: موعد الامتحان الشامل لجميع طلاب تالتة إعدادي 🏆"
                      className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      تفاصيل الخبر:
                    </label>
                    <textarea
                      rows={3}
                      value={newsForm.content}
                      onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                      placeholder="اكتب تفاصيل التنبيه، الجوائز، شروط الحضور..."
                      className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        الصف المستهدف:
                      </label>
                      <select
                        value={newsForm.grade}
                        onChange={(e) => setNewsForm({ ...newsForm, grade: e.target.value as any })}
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="all">لكل المراحل (عام)</option>
                        <option value="grade1">أولى إعدادي فقط</option>
                        <option value="grade2">تانية إعدادي فقط</option>
                        <option value="grade3">تالتة إعدادي فقط</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        نص الشارة:
                      </label>
                      <input
                        type="text"
                        value={newsForm.badgeLabel || ''}
                        onChange={(e) => setNewsForm({ ...newsForm, badgeLabel: e.target.value })}
                        placeholder="مثال: جديد، مهم جداً، امتحان"
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="isUrgentCheck"
                        checked={newsForm.isUrgent}
                        onChange={(e) => setNewsForm({ ...newsForm, isUrgent: e.target.checked })}
                        className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500"
                      />
                      <label
                        htmlFor="isUrgentCheck"
                        className="text-xs font-bold text-rose-300 cursor-pointer"
                      >
                        تنبيه عاجل (يظهر بشريط الأخبار بلون مميز)
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsAddingNews(false)}
                      className="px-4 py-2 rounded-xl bg-[#0a1230] text-slate-300 text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={async () => {
                        if (!newsForm.title || !newsForm.content) {
                          alert('برجاء كتابة عنوان وتفاصيل الخبر');
                          return;
                        }
                        if (editingNewsId) {
                          await updateNews(editingNewsId, newsForm);
                        } else {
                          await addNews(newsForm);
                        }
                        setIsAddingNews(false);
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-black text-xs hover:bg-emerald-400"
                    >
                      {editingNewsId ? 'حفظ التعديلات' : 'نشر الخبر فوراً'}
                    </button>
                  </div>
                </div>
              )}

              {/* News List */}
              <div className="space-y-3">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#0f1d47] border border-[#20367a] flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {item.isUrgent && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                            عاجل
                          </span>
                        )}
                        <span className="font-black text-white text-sm">{item.title}</span>
                        <span className="text-[11px] text-slate-400">({item.dateStr})</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {item.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingNewsId(item.id);
                          setNewsForm({
                            title: item.title,
                            content: item.content,
                            grade: item.grade,
                            isUrgent: !!item.isUrgent,
                            dateStr: item.dateStr,
                            badgeLabel: item.badgeLabel || '',
                          });
                          setIsAddingNews(true);
                        }}
                        className="p-1.5 rounded-lg bg-[#142352] text-slate-300 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
                            await deleteNews(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: VIDEOS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'videos' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0f1d47] p-4 rounded-2xl border border-[#20367a]">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#2b6cff]" />
                    <span>إدارة فيديوهات الشرح والمراجعات وتحديد "قريباً"</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    أضف لينكات يوتيوب، أو فعّل حالة "قريباً ⏳" للفيديوهات الجاري تصويرها أو رفعها.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsAddingVideo(true);
                    setEditingVideoId(null);
                    setVideoForm({
                      title: '',
                      grade: 'grade3',
                      youtubeUrl: '',
                      isComingSoon: false,
                      unitTitle: 'الوحدة الأولى',
                      duration: '30 دقيقة',
                      dateAdded: 'متاح الآن',
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2b6cff] to-[#1e54cc] hover:from-[#3a78ff] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة فيديو محاضرة جديد</span>
                </button>
              </div>

              {/* Video Form */}
              {isAddingVideo && (
                <div className="bg-[#122254] p-5 rounded-2xl border border-[#2d4b99] space-y-4 animate-in fade-in-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[#20367a]">
                    <h4 className="text-sm font-black text-white">
                      {editingVideoId ? 'تعديل بيانات الفيديو' : 'إضافة فيديو جديد'}
                    </h4>
                    <button
                      onClick={() => setIsAddingVideo(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      عنوان الفيديو أو المحاضرة:
                    </label>
                    <input
                      type="text"
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                      placeholder="مثال: أقوى مراجعة ليلة الامتحان الشامل وتريكات السفير"
                      className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">الصف:</label>
                      <select
                        value={videoForm.grade}
                        onChange={(e) =>
                          setVideoForm({ ...videoForm, grade: e.target.value as GradeId })
                        }
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {GRADES_LIST.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        الوحدة / الموضوع:
                      </label>
                      <input
                        type="text"
                        value={videoForm.unitTitle}
                        onChange={(e) => setVideoForm({ ...videoForm, unitTitle: e.target.value })}
                        placeholder="الوحدة الأولى - النحو / العلوم"
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        مدة الفيديو (اختياري):
                      </label>
                      <input
                        type="text"
                        value={videoForm.duration || ''}
                        onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                        placeholder="35 دقيقة"
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      رابط فيديو يوتيوب (YouTube URL):
                    </label>
                    <input
                      type="url"
                      value={videoForm.youtubeUrl}
                      onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white dir-ltr text-right"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a1230] border border-[#20367a] flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isComingSoonCheck"
                      checked={videoForm.isComingSoon}
                      onChange={(e) =>
                        setVideoForm({ ...videoForm, isComingSoon: e.target.checked })
                      }
                      className="w-5 h-5 rounded text-[#f5b83d] focus:ring-[#f5b83d]"
                    />
                    <label
                      htmlFor="isComingSoonCheck"
                      className="text-xs font-bold text-amber-300 cursor-pointer"
                    >
                      حالة "قريباً ⏳" (لو الفيديو لسه بيتحضر أو هيتصور، هيظهر للطلاب بشارة قريباً مع قفل التشغيل)
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsAddingVideo(false)}
                      className="px-4 py-2 rounded-xl bg-[#0a1230] text-slate-300 text-xs font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={async () => {
                        if (!videoForm.title) {
                          alert('برجاء كتابة عنوان الفيديو');
                          return;
                        }
                        if (editingVideoId) {
                          await updateVideo(editingVideoId, videoForm);
                        } else {
                          await addVideo(videoForm);
                        }
                        setIsAddingVideo(false);
                      }}
                      className="px-5 py-2 rounded-xl bg-[#2b6cff] text-white font-black text-xs hover:bg-[#3878ff]"
                    >
                      {editingVideoId ? 'حفظ التعديلات' : 'إضافة الفيديو'}
                    </button>
                  </div>
                </div>
              )}

              {/* Videos List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((v) => {
                  const gradeObj = GRADES_LIST.find((g) => g.id === v.grade);
                  return (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl bg-[#0f1d47] border border-[#20367a] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-[#2b6cff]/20 text-[#38bdf8] text-[10px] font-bold">
                              {gradeObj?.shortName || v.grade}
                            </span>
                            {v.isComingSoon ? (
                              <span className="px-2 py-0.5 rounded-md bg-[#f5b83d]/20 text-[#f5b83d] text-[10px] font-bold border border-[#f5b83d]/30">
                                قريباً ⏳
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                متاح الآن
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingVideoId(v.id);
                                setVideoForm({
                                  title: v.title,
                                  grade: v.grade,
                                  youtubeUrl: v.youtubeUrl || '',
                                  isComingSoon: !!v.isComingSoon,
                                  unitTitle: v.unitTitle || '',
                                  duration: v.duration || '',
                                  dateAdded: v.dateAdded || '',
                                });
                                setIsAddingVideo(true);
                              }}
                              className="p-1.5 rounded-lg bg-[#142352] text-slate-300 hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
                                  await deleteVideo(v.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1 leading-snug line-clamp-2">
                          {v.title}
                        </h4>
                        <div className="text-xs text-slate-400">{v.unitTitle}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: PLATFORM SETTINGS & WHATSAPP */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-[#0f1d47] p-5 sm:p-6 rounded-2xl border border-[#20367a]">
                <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                  <Settings className="w-5 h-5 text-[#f5b83d]" />
                  <span>إعدادات أ/ محمود عصام، أرقام الواتساب والشعار</span>
                </h3>
                <p className="text-xs text-slate-300 mb-6">
                  البيانات هنا بتتحكم في أزرار التواصل والمشاركة والشريط العلوي في الموقع كله.
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        اسم المدرس:
                      </label>
                      <input
                        type="text"
                        value={settingsForm.teacherName}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, teacherName: e.target.value })
                        }
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        اللقب أو الشهرة:
                      </label>
                      <input
                        type="text"
                        value={settingsForm.nickname}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, nickname: e.target.value })
                        }
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      الشعار الرسمي:
                    </label>
                    <input
                      type="text"
                      value={settingsForm.slogan}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, slogan: e.target.value })
                      }
                      className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-emerald-400 mb-1">
                        رقم واتساب المباشر (مع كود الدولة مثل 2010...):
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                        }
                        placeholder="201023456789"
                        className="w-full bg-[#0a1230] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-white dir-ltr text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        رقم الاتصال المعروض:
                      </label>
                      <input
                        type="text"
                        value={settingsForm.displayPhone}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, displayPhone: e.target.value })
                        }
                        placeholder="01023456789"
                        className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white dir-ltr text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      نص شريط الأخبار المتحرك (Ticker):
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.tickerText}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, tickerText: e.target.value })
                      }
                      className="w-full bg-[#0a1230] border border-[#2b448a] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={async () => {
                        setSettingsSaving(true);
                        setSettingsSuccess(false);
                        try {
                          await saveSettings(settingsForm);
                          setSettingsSuccess(true);
                          confetti({ particleCount: 30, spread: 40 });
                          setTimeout(() => setSettingsSuccess(false), 3000);
                        } finally {
                          setSettingsSaving(false);
                        }
                      }}
                      disabled={settingsSaving}
                      className="px-6 py-2.5 rounded-xl bg-[#f5b83d] text-[#0a1230] font-black text-xs hover:bg-amber-400 flex items-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      {settingsSaving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>حفظ جميع الإعدادات فوراً</span>
                    </button>

                    {settingsSuccess && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>تم الحفظ والتحديث لكل الطلاب!</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Seed / Reset default data button */}
              <div className="bg-[#121c45] p-5 rounded-2xl border border-[#20367a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f5b83d]" />
                    <span>تهيئة وحفظ البيانات النموذجية بضغطة واحدة في Firestore</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    لو عايز تملى الداتابيز بجداول وسناتر وفيديوهات جاهزة لأولى وتانية وتالتة إعدادي وتعدل عليها براحتك.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    if (
                      confirm(
                        'هل تريد حفظ البيانات النموذجية في قاعدة بيانات Firestore السحابية الآن؟'
                      )
                    ) {
                      setSeeding(true);
                      try {
                        await seedInitialDataToFirestore();
                        setSeedSuccess(true);
                        confetti({ particleCount: 50, spread: 60 });
                        setTimeout(() => setSeedSuccess(false), 3500);
                      } finally {
                        setSeeding(false);
                      }
                    }
                  }}
                  disabled={seeding}
                  className="px-4 py-2 rounded-xl bg-[#1f3675] hover:bg-[#2b4c9e] text-slate-200 border border-[#3b5fae] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                >
                  {seeding ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Server className="w-4 h-4 text-[#f5b83d]" />
                  )}
                  <span>{seedSuccess ? 'تم الحفظ بنجاح! 🎉' : 'رفع النماذج للداتابيز'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: FREE DEPLOYMENT & SETUP GUIDE (بالعامية المصرية) */}
          {/* ======================================================== */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-4xl text-slate-200 text-xs sm:text-sm leading-relaxed">
              <div className="bg-gradient-to-r from-[#13275c] via-[#0f1d47] to-[#13275c] p-6 rounded-3xl border border-[#2b4b9b] shadow-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40 mb-3">
                  <CloudUpload className="w-4 h-4" />
                  <span>دليل السفير للنشر المجاني خطوة بخطوة 🚀</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  إزاي ترفع موقع "السفير" على النت مجاناً 100% للطلاب؟
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">
                  شرح بالعامية المصرية المبسطة لطريقة نشر الموقع على Firebase Hosting أو Netlify أو Vercel، ومكان وضع مفاتيح الإعداد.
                </p>
              </div>

              {/* Step 1: Config Keys */}
              <div className="bg-[#0f1d47] p-5 sm:p-6 rounded-2xl border border-[#20367a]">
                <div className="flex items-center gap-2 text-amber-300 font-black text-sm sm:text-base mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#f5b83d] text-[#0a1230] flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span>مكان وضع مفاتيح إعدادات Firebase (Config Keys)</span>
                </div>
                <p className="text-slate-300 mb-3">
                  الموقع مربوط بالفعل تلقائياً بملف الإعدادات المدمج{' '}
                  <code className="text-[#f5b83d] bg-[#0a1230] px-2 py-0.5 rounded font-mono">
                    firebase-applet-config.json
                  </code>{' '}
                  الموجود في مسار المشروع الرئيسي. الملف ده جواه كل المفاتيح زي:
                </p>
                <div className="bg-[#0a1230] p-4 rounded-xl border border-[#1b2b62] font-mono text-xs text-slate-300 space-y-1 dir-ltr text-left">
                  <div>"projectId": "gen-lang-client-0237258060"</div>
                  <div>"apiKey": "AIzaSy..."</div>
                  <div>"firestoreDatabaseId": "ai-studio-42b3a8c9..."</div>
                </div>
                <p className="text-slate-400 text-xs mt-3">
                  💡 لو حبيت تنقل لمشروع Firebase خاص بيك في أي وقت: كل اللي هتعمله تفتح كونسول Firebase وتنسخ الـ config وتحطه في نفس الملف ده أو في متغيرات البيئة.
                </p>
              </div>

              {/* Step 2: Deployment with Firebase Hosting */}
              <div className="bg-[#0f1d47] p-5 sm:p-6 rounded-2xl border border-[#20367a]">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm sm:text-base mb-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-[#0a1230] flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span>طريقة النشر على Firebase Hosting (الموصى بها)</span>
                </div>
                <p className="text-slate-300 mb-3">
                  فايربيز بيقدملك استضافة مجانية وسريعة جداً مع شهادة أمان SSL ودومين مجاني ينتهي بـ{' '}
                  <code className="text-emerald-300 font-mono">.web.app</code>:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs sm:text-sm">
                  <li>
                    <strong>بناء المشروع (Build):</strong> في الترمينال اكتب الأمر:
                    <div className="bg-[#0a1230] p-2.5 rounded-lg border border-[#1b2b62] font-mono text-xs text-[#38bdf8] mt-1 dir-ltr text-left">
                      npm run build
                    </div>
                    (الأمر ده بيطلع فولدر اسمه <code className="text-amber-300 font-mono">dist</code> فيه كل ملفات الموقع جاهزة ومضغوطة بأعلى سرعة).
                  </li>
                  <li>
                    <strong>تثبيت أدوات فايربيز (لو مش عندك):</strong>
                    <div className="bg-[#0a1230] p-2.5 rounded-lg border border-[#1b2b62] font-mono text-xs text-[#38bdf8] mt-1 dir-ltr text-left">
                      npm install -g firebase-tools
                    </div>
                  </li>
                  <li>
                    <strong>تسجيل الدخول والربط:</strong>
                    <div className="bg-[#0a1230] p-2.5 rounded-lg border border-[#1b2b62] font-mono text-xs text-[#38bdf8] mt-1 dir-ltr text-left">
                      firebase login
                      <br />
                      firebase init hosting
                    </div>
                    اختار الفولدر العام <code className="text-amber-300">dist</code> ووافق على{' '}
                    <code className="text-amber-300">Single Page App (Yes)</code>.
                  </li>
                  <li>
                    <strong>النشر بضغطة واحدة:</strong>
                    <div className="bg-[#0a1230] p-2.5 rounded-lg border border-[#1b2b62] font-mono text-xs text-[#38bdf8] mt-1 dir-ltr text-left">
                      firebase deploy --only hosting
                    </div>
                    مبارك! في ثواني هيطلعلك لينك الموقع المباشر تشيره مع كل طلابك وأولياء الأمور 🚀
                  </li>
                </ol>
              </div>

              {/* Step 3: Deployment with Netlify / Vercel (Drag & Drop) */}
              <div className="bg-[#0f1d47] p-5 sm:p-6 rounded-2xl border border-[#20367a]">
                <div className="flex items-center gap-2 text-[#38bdf8] font-black text-sm sm:text-base mb-3">
                  <span className="w-6 h-6 rounded-full bg-[#2b6cff] text-white flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  <span>طريقة النشر السريع على Netlify (سحب وإفلات في دقيقة)</span>
                </div>
                <p className="text-slate-300 mb-2">
                  لو مش حابب تستخدم أوامر في التيرمينال، Netlify بيتيحلك ترفع الموقع بالسحب والإفلات:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-xs sm:text-sm">
                  <li>اعمل <code className="text-amber-300">npm run build</code> في المشروع.</li>
                  <li>افتح موقع <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-[#38bdf8] underline font-bold">netlify.com/drop</a></li>
                  <li>اسحب فولدر <code className="text-amber-300">dist</code> ورميه في الصفحة.</li>
                  <li>الموقع هيشتغل فوراً بدون أي إعدادات معقدة وبشهادة أمان مجانية.</li>
                </ol>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: ADMINS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'admins' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-[#0f1d47] p-5 rounded-2xl border border-[#20367a]">
                <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>فريق المشرفين والسكرتارية</span>
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  يمكن لأي مشرف مسجل الدخول إضافة وتعديل مواعيد الحصص والتنبيهات.
                </p>

                <div className="p-4 rounded-xl bg-[#0a1230] border border-[#1b2b62] mb-4">
                  <div className="text-xs font-bold text-amber-300 mb-1">المشرف الرئيسي:</div>
                  <div className="text-sm font-black text-white">marwanpabloo56@gmail.com</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    صلاحية كاملة (Super Admin) مع إمكانية إدارة المنصة بالكامل.
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">المشرفين النشطين حالياً:</div>
                  <div className="p-3 rounded-xl bg-[#142352] flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{currentUser.email}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      أنت (المستخدم الحالي)
                    </span>
                  </div>

                  {admins
                    .filter((a) => a.email !== currentUser.email && a.email !== 'marwanpabloo56@gmail.com')
                    .map((a) => (
                      <div
                        key={a.id}
                        className="p-3 rounded-xl bg-[#142352] flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-200">{a.email}</span>
                        <span className="text-slate-400 text-[10px]">{a.addedAt}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
