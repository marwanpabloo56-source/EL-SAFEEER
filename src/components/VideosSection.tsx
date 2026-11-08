import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { VideoItem, GRADES_LIST, GradeId } from '../lib/firebase';
import {
  Video,
  Play,
  Clock,
  Sparkles,
  ExternalLink,
  X,
  Lock,
  Layers,
  CheckCircle,
} from 'lucide-react';

export const VideosSection: React.FC = () => {
  const { videos, selectedGrade, setSelectedGrade, settings } = useData();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'available' | 'comingSoon'>('all');

  // Filter videos for the current grade
  const gradeVideos = videos.filter((v) => {
    const matchGrade = v.grade === selectedGrade;
    if (!matchGrade) return false;
    if (filterType === 'available') return !v.isComingSoon;
    if (filterType === 'comingSoon') return v.isComingSoon;
    return true;
  });

  const currentGradeObj = GRADES_LIST.find((g) => g.id === selectedGrade) || GRADES_LIST[0];

  // Helper to extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
      }
    } catch {
      // ignore
    }
    return url;
  };

  return (
    <section id="videos" className="py-12 sm:py-16 relative bg-[#070e26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2b6cff]/15 text-[#38bdf8] text-xs font-black border border-[#2b6cff]/30 mb-3">
            <Video className="w-3.5 h-3.5" />
            <span>المكتبة التعليمية ومراجعات السفير</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            فيديوهات الشرح والمراجعات النهائية
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            شروحات مبسطة، وتريكات ليلة الامتحان، وفيديوهات بنك الأسئلة المخصصة لـ {currentGradeObj.name}.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#0f1d47]/70 p-3 rounded-2xl border border-[#1e3472]">
          {/* Grade tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {GRADES_LIST.map((grade) => (
              <button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  selectedGrade === grade.id
                    ? 'bg-[#2b6cff] text-white shadow-md shadow-[#2b6cff]/30'
                    : 'bg-[#142352] text-slate-300 hover:text-white'
                }`}
              >
                {grade.shortName}
              </button>
            ))}
          </div>

          {/* Availability filter */}
          <div className="flex items-center gap-1.5 bg-[#0a1230] p-1 rounded-xl border border-[#1b2b62] w-full sm:w-auto justify-center">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterType === 'all'
                  ? 'bg-[#1e3472] text-[#f5b83d]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل ({videos.filter((v) => v.grade === selectedGrade).length})
            </button>
            <button
              onClick={() => setFilterType('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterType === 'available'
                  ? 'bg-[#1e3472] text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              متاح الآن ({videos.filter((v) => v.grade === selectedGrade && !v.isComingSoon).length})
            </button>
            <button
              onClick={() => setFilterType('comingSoon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterType === 'comingSoon'
                  ? 'bg-[#1e3472] text-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              قريباً ⏳ ({videos.filter((v) => v.grade === selectedGrade && v.isComingSoon).length})
            </button>
          </div>
        </div>

        {/* Videos Grid */}
        {gradeVideos.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#0f1d47]/40 border border-[#233878]">
            <Video className="w-12 h-12 text-[#2b6cff] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-white mb-1">
              جاري تجهيز فيديوهات ومراجعات جديدة لهذا القسم
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              تابعنا على مدار الأسبوع لمشاهدة أقوى الشروحات الحصرية مع مستر محمود عصام.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {gradeVideos.map((video) => (
              <div
                key={video.id}
                className="group rounded-3xl bg-[#0f1d47]/90 border border-[#20367a] hover:border-[#2b6cff]/60 overflow-hidden shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col"
              >
                {/* Video Card Thumbnail / Poster */}
                <div className="relative aspect-video bg-gradient-to-br from-[#122254] via-[#0b163a] to-[#0a1230] flex items-center justify-center p-4 overflow-hidden border-b border-[#1b2b62]">
                  {/* Subtle decorative grid/glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2b6cff]/20 via-transparent to-transparent pointer-events-none" />

                  {video.isComingSoon ? (
                    // Coming Soon Lock Badge
                    <div className="flex flex-col items-center justify-center text-center p-4 z-10">
                      <div className="w-13 h-13 rounded-2xl bg-[#f5b83d]/15 border border-[#f5b83d]/30 text-[#f5b83d] flex items-center justify-center mb-2 shadow-lg animate-soft-pulse">
                        <Lock className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#f5b83d]/20 text-[#f5b83d] text-xs font-black border border-[#f5b83d]/30">
                        قريباً - انتظرونا يا بطل ⏳
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">جاري المونتاج والرفع</span>
                    </div>
                  ) : (
                    // Playable Video Thumbnail with click to play
                    <div
                      onClick={() => setActiveVideo(video)}
                      className="cursor-pointer flex flex-col items-center justify-center z-10 w-full h-full group-hover:scale-105 transition-transform"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#2b6cff] group-hover:bg-[#f5b83d] text-white group-hover:text-[#0a1230] flex items-center justify-center shadow-xl shadow-[#2b6cff]/30 transition-colors">
                        <Play className="w-7 h-7 fill-current mr-0.5" />
                      </div>
                      <span className="mt-3 text-xs font-bold text-slate-200 group-hover:text-[#f5b83d] transition-colors flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#f5b83d]" />
                        <span>اضغط للمشاهدة الآن</span>
                      </span>
                    </div>
                  )}

                  {/* Top-right Unit pill */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0a1230]/80 backdrop-blur-md text-[11px] font-bold text-slate-300 border border-[#2b448a] flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#f5b83d]" />
                      <span>{video.unitTitle}</span>
                    </span>
                  </div>

                  {/* Top-left Duration */}
                  {video.duration && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-[#0a1230]/80 text-[10px] font-bold text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{video.duration}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Video Info Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#f5b83d] transition-colors leading-snug line-clamp-2 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                      <span>تقديم: {settings.teacherName} ({settings.nickname})</span>
                      {video.dateAdded && <span>• {video.dateAdded}</span>}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 border-t border-[#1b2b62] flex items-center justify-between">
                    {video.isComingSoon ? (
                      <div className="w-full text-center py-2 rounded-xl bg-[#142352] text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>سيتم إتاحة الفيديو خلال أيام</span>
                      </div>
                    ) : (
                      <div className="w-full flex items-center gap-2">
                        <button
                          onClick={() => setActiveVideo(video)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#2b6cff] hover:bg-[#3878ff] text-white text-xs font-bold transition-colors shadow-md"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>شاهد المحاضرة</span>
                        </button>
                        {video.youtubeUrl && (
                          <a
                            href={video.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-[#142352] hover:bg-[#1f3675] text-slate-300 hover:text-white transition-colors"
                            title="فتح على يوتيوب"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Player */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-[#0f1d47] border border-[#233878] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-4 bg-[#0c163b] border-b border-[#1e3470] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {activeVideo.title}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-xl bg-[#142352] hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Responsive 16:9 Iframe Player */}
              <div className="relative aspect-video bg-black">
                {activeVideo.youtubeUrl ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeVideo.youtubeUrl)}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    رابط الفيديو غير متوفر
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#0a1230] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#f5b83d]" />
                  <span>{currentGradeObj.name} • {activeVideo.unitTitle}</span>
                </div>
                {activeVideo.youtubeUrl && (
                  <a
                    href={activeVideo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#38bdf8] hover:underline font-bold"
                  >
                    <span>فتح مباشرة على تطبيق يوتيوب</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
