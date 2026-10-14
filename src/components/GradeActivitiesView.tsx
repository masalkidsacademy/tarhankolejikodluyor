import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Play,
  RotateCcw,
  Trash2,
  User
} from 'lucide-react';
import { BADGES, GRADES, SITE_CONFIG } from '../config/siteConfig';
import { useProgress } from '../context/ProgressContext';
import { ACTIVITIES } from '../data/activities';
import { GradeLevelId } from '../types/platform';
import { playTone } from '../utils/soundAndSpeech';

interface GradeActivitiesViewProps {
  onStartActivity: (activityId: string) => void;
  onOpenPassport: () => void;
}

export const GradeActivitiesView: React.FC<GradeActivitiesViewProps> = ({
  onStartActivity,
  onOpenPassport
}) => {
  const {
    state,
    setNickname,
    setSelectedGrade,
    getActivityStatus,
    resetAllProgress
  } = useProgress();

  const [showAllGrades, setShowAllGrades] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const currentGradeInfo =
    GRADES.find((g) => g.id === state.selectedGrade) || GRADES[2];

  const displayedActivities = showAllGrades
    ? ACTIVITIES
    : ACTIVITIES.filter((a) => a.grade === state.selectedGrade);

  const getStatusLabel = (status: 'not_started' | 'in_progress' | 'completed') => {
    if (status === 'completed') return 'Tamamlandı';
    if (status === 'in_progress') return 'Devam ediyor';
    return 'Başlanmadı';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Öğrenci Karşılama, Takma Ad ve Kademe Seçici */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-violet-700">
              ÖĞRENCİ ETKİNLİK MERKEZİ · {SITE_CONFIG.eventDates}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Kademeni Seç ve Kodlamaya Başla
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Kendi sınıf kademendeki etkinliklerle başlayabilir veya istediğin zaman diğer kademeleri
              özgürce keşfedebilirsin.
            </p>
          </div>

          {/* İsteğe Bağlı Takma Ad & Ortak Bilgisayar Sıfırlama */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <User className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                value={state.nickname}
                maxLength={25}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Takma adın (isteğe bağlı)"
                aria-label="İsteğe bağlı takma ad"
                className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none w-40"
              />
            </div>

            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-800 text-slate-700 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Yeni Öğrenci / Sıfırla
            </button>
          </div>
        </div>

        {confirmReset && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-medium text-rose-950">
              Ortak bilgisayar için mevcut öğrenci ilerlemesini ve takma adı sıfırlamak istiyor
              musunuz?
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  resetAllProgress();
                  setConfirmReset(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Evet, Sıfırla
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}

        {/* 7 Kademe Seçici Sekmeler (Etkileşimli Filtre Kontrolleri) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Kademe Seçimi:</span>
            <button
              type="button"
              onClick={() => {
                playTone('click', state.soundEnabled);
                setShowAllGrades((prev) => !prev);
              }}
              className="text-xs font-bold text-violet-700 hover:underline cursor-pointer"
            >
              {showAllGrades
                ? 'Yalnızca Seçili Kademeyi Göster'
                : 'Tüm Kademeleri Birlikte Göster (14 Etkinlik)'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl">
            {GRADES.map((g) => {
              const isSelected = !showAllGrades && state.selectedGrade === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    playTone('click', state.soundEnabled);
                    setShowAllGrades(false);
                    setSelectedGrade(g.id);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seçili Kademe Özeti */}
        {!showAllGrades && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-bold text-slate-900 text-sm">{currentGradeInfo.label}</span>
                <span aria-hidden="true">·</span>
                <span>Odak Kavramlar: {currentGradeInfo.keyConcepts.join(', ')}</span>
              </div>
              <p className="text-xs text-slate-600">{currentGradeInfo.summary}</p>
            </div>
            {currentGradeInfo.isEarlyChildhood && (
              <div className="text-xs font-bold text-amber-900 shrink-0">
                👨‍👩‍👧 Bir yetişkinle birlikte keşfedebilirsin.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Etkinlik Kartları (Zero-Pill disipliniyle temiz tipografik üst veri) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedActivities.map((act) => {
          const rec = getActivityStatus(act.id);
          const statusLabel = getStatusLabel(rec.status);
          const badgeObj = BADGES.find((b) => b.id === act.badge);

          return (
            <div
              key={act.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                {/* Kutusuz, nokta ayraçlı statik üst veri */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-violet-700">{act.gradeLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Düzey: {act.level}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {act.duration}
                    </span>
                  </div>

                  <span
                    className={`font-bold flex items-center gap-1 ${
                      rec.status === 'completed'
                        ? 'text-emerald-700'
                        : rec.status === 'in_progress'
                        ? 'text-amber-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {rec.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                    Durum: {statusLabel}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900">{act.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{act.description}</p>

                <div className="pt-2 space-y-1 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800">Öğrenilecek Kavramlar:</strong>{' '}
                    {act.concepts.join(' · ')}
                  </div>
                  <div>
                    <strong className="text-slate-800">Kazanılacak Rozet:</strong>{' '}
                    {badgeObj?.title} ({rec.completedTaskIds.length}/{act.tasks.length} görev
                    tamamlandı)
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">{act.completionCriteria}</span>
                <button
                  type="button"
                  onClick={() => {
                    playTone('click', state.soundEnabled);
                    onStartActivity(act.id);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {rec.status === 'completed'
                    ? 'Tekrar Oyna'
                    : rec.status === 'in_progress'
                    ? 'Devam Et'
                    : 'Başla'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alt Pasaport ve Diğer Kademeler Yönlendirmesi */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Award className="w-7 h-7 text-amber-500 shrink-0" />
          <div>
            <div className="text-sm font-bold text-slate-900">
              Kazandığın Rozetleri ve Katılım Belgeni Gör
            </div>
            <p className="text-xs text-slate-600">
              {SITE_CONFIG.storageNotice}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAllGrades((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
          >
            <Compass className="w-4 h-4" />
            {showAllGrades ? 'Kadememe Dön' : 'Tüm Kademeleri Keşfet'}
          </button>
          <button
            type="button"
            onClick={onOpenPassport}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
          >
            Kodlama Pasaportum <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
