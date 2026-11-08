import React from 'react';
import { useData } from '../context/DataContext';
import {
  GraduationCap,
  MessageCircle,
  Phone,
  Heart,
  ShieldCheck,
  Calendar,
  Video,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onScrollTo: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onScrollTo }) => {
  const { settings, getTeacherWhatsAppUrl } = useData();

  return (
    <footer className="bg-[#060b1e] border-t border-[#142352] pt-12 pb-8 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f5b83d] to-[#d8971f] text-[#0a1230] flex items-center justify-center font-black">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white">منصة {settings.nickname}</span>
            </div>
            <p className="text-slate-300 leading-relaxed max-w-md">
              المنصة الرسمية للأستاذ <strong className="text-white">{settings.teacherName}</strong>{' '}
              لطلاب المرحلة الإعدادية فقط (أولى وتانية وتالتة إعدادي). شعارنا الدائم:{' '}
              <span className="text-[#f5b83d] font-bold">"{settings.slogan}"</span>.
            </p>
            <div className="p-3 rounded-2xl bg-[#0c163b] border border-[#1b2b62] inline-block text-xs text-amber-200">
              🌟 التفوق عادة مش صدفة، مع السفير أنت دائماً في القمة!
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#f5b83d]" />
              <span>أقسام المنصة</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onScrollTo('schedules')}
                  className="hover:text-[#f5b83d] transition-colors"
                >
                  جدول مواعيد الحصص
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('videos')}
                  className="hover:text-[#f5b83d] transition-colors"
                >
                  فيديوهات الشرح والمراجعات
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('news')}
                  className="hover:text-[#f5b83d] transition-colors"
                >
                  لوحة الأخبار والتنبيهات
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('centers')}
                  className="hover:text-[#f5b83d] transition-colors"
                >
                  أماكن وعناوين السناتر
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>تواصل مع السفير</span>
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={getTeacherWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 font-bold"
                >
                  واتساب: {settings.displayPhone || settings.whatsappNumber}
                </a>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f1d47] text-slate-300 hover:text-[#f5b83d] border border-[#1e3470] text-xs font-bold transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>دخول لوحة المشرف</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#121c42] flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs text-center sm:text-right">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة السفير التعليمية • أ/ محمود عصام
          </div>
          <div className="flex items-center gap-1">
            <span>صُممت بأعلى معايير السرعة والأمان لمستقبل طلابنا</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
