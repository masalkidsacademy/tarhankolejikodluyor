import React, { useState } from 'react';
import { RotateCcw, Trash2, Volume2, VolumeX } from 'lucide-react';
import { ActivityWorkspace } from './components/ActivityWorkspace';
import { FamilyCodingView } from './components/FamilyCodingView';
import { GradeActivitiesView } from './components/GradeActivitiesView';
import { HomeView } from './components/HomeView';
import { ParentAreaView } from './components/ParentAreaView';
import { PassportAndCertificateView } from './components/PassportAndCertificateView';
import { SITE_CONFIG } from './config/siteConfig';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { getActivityById } from './data/activities';
import { GradeLevelId } from './types/platform';
import { stopSpeech } from './utils/soundAndSpeech';

type ActivePage = 'home' | 'activities' | 'workspace' | 'family' | 'parent' | 'passport';

const MainPlatformContent: React.FC = () => {
  const {
    state,
    setSelectedGrade,
    toggleSound,
    toggleReducedMotion,
    resetAllProgress,
    completedActivityIds,
    earnedBadges
  } = useProgress();

  const [page, setPage] = useState<ActivePage>('home');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('etkinlik-5');
  const [quickResetModal, setQuickResetModal] = useState(false);

  const navigateTo = (nextPage: ActivePage) => {
    stopSpeech();
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openActivity = (activityId: string) => {
    stopSpeech();
    setSelectedActivityId(activityId);
    setPage('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentActivity = getActivityById(selectedActivityId) || getActivityById('etkinlik-1')!;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* ÜST GEZİNME ÇUBUĞU (Strict Top Bar Contract: 3 Zones, gap-8) */}
      <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title (Single text element wordmark or optional real logo) */}
          {SITE_CONFIG.logoUrl ? (
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <img
                src={SITE_CONFIG.logoUrl}
                alt={SITE_CONFIG.siteName}
                referrerPolicy="no-referrer"
                className="h-8 w-auto object-contain"
              />
              <span>{SITE_CONFIG.siteName}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-lg font-bold tracking-tight text-slate-900 hover:text-violet-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {SITE_CONFIG.siteName}
            </button>
          )}

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                page === 'home' ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2 decoration-violet-600' : ''
              }`}
            >
              Ana Sayfa
            </button>
            <button
              type="button"
              onClick={() => navigateTo('activities')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                page === 'activities' || page === 'workspace'
                  ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2 decoration-violet-600'
                  : ''
              }`}
            >
              Etkinlikler
            </button>
            <button
              type="button"
              onClick={() => navigateTo('family')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                page === 'family' ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2 decoration-violet-600' : ''
              }`}
            >
              Ailece Kodlama
            </button>
            <button
              type="button"
              onClick={() => navigateTo('parent')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                page === 'parent' ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2 decoration-violet-600' : ''
              }`}
            >
              Veli Alanı
            </button>
            <button
              type="button"
              onClick={() => navigateTo('passport')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 ${
                page === 'passport' ? 'text-slate-900 font-bold underline underline-offset-8 decoration-2 decoration-violet-600' : ''
              }`}
            >
              Pasaportum
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('activities')}
              className="px-4 py-2 text-xs font-bold text-white bg-violet-700 hover:bg-violet-800 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Kodlamaya Başla
            </button>
          </div>
        </div>
      </header>

      {/* Çalışma Alanı Araç Çubuğu ve Mobil Gezinme (Header Altında) */}
      <div className="no-print bg-slate-100/80 border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Mobil Gezinme Kısayolları */}
          <div className="flex md:hidden items-center gap-3 overflow-x-auto py-0.5 font-semibold text-slate-700">
            <button type="button" onClick={() => navigateTo('home')} className="whitespace-nowrap">
              Ana Sayfa
            </button>
            <span>·</span>
            <button type="button" onClick={() => navigateTo('activities')} className="whitespace-nowrap">
              Etkinlikler
            </button>
            <span>·</span>
            <button type="button" onClick={() => navigateTo('family')} className="whitespace-nowrap">
              Ailece
            </button>
            <span>·</span>
            <button type="button" onClick={() => navigateTo('parent')} className="whitespace-nowrap">
              Veli Alanı
            </button>
            <span>·</span>
            <button type="button" onClick={() => navigateTo('passport')} className="whitespace-nowrap">
              Pasaportum
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-600">
            <span>{SITE_CONFIG.institution}</span>
            <span aria-hidden="true">·</span>
            <span>{SITE_CONFIG.eventDates}</span>
            <span aria-hidden="true">·</span>
            <span>
              Tamamlanan: <strong className="text-slate-900 tabular-nums">{completedActivityIds.length}/14</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Rozet: <strong className="text-violet-700 tabular-nums">{earnedBadges.length}/6</strong>
            </span>
          </div>

          {/* Erişilebilirlik, Ses ve Ortak Bilgisayar Sıfırlama Kontrolleri */}
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={state.soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-semibold cursor-pointer whitespace-nowrap shrink-0"
            >
              {state.soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" /> Ses Açık
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" /> Ses Kapalı
                </>
              )}
            </button>

            <span aria-hidden="true" className="text-slate-300">·</span>

            <button
              type="button"
              onClick={toggleReducedMotion}
              className="text-slate-700 hover:text-slate-950 font-semibold cursor-pointer whitespace-nowrap shrink-0"
            >
              {state.reducedMotion ? 'Hareket Azaltma: Açık' : 'Hareket Azaltma: Kapalı'}
            </button>

            <span aria-hidden="true" className="text-slate-300">·</span>

            <button
              type="button"
              onClick={() => setQuickResetModal(true)}
              className="inline-flex items-center gap-1 text-rose-700 hover:text-rose-900 font-semibold cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Yeni Öğrenci
            </button>
          </div>
        </div>
      </div>

      {/* Ortak Okul Bilgisayarı İçin Sıfırlama Onay Kutusu */}
      {quickResetModal && (
        <div className="no-print bg-rose-50 border-b border-rose-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-950">
            <span>
              <strong>Ortak Bilgisayar Onayı:</strong> Mevcut öğrencinin bu cihazdaki ilerlemesini,
              rozetlerini ve projelerini sıfırlayıp yeni öğrenci için temizlemek istiyor musunuz?
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  resetAllProgress();
                  setQuickResetModal(false);
                  navigateTo('home');
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Evet, Sıfırla
              </button>
              <button
                type="button"
                onClick={() => setQuickResetModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold cursor-pointer"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANA İÇERİK ALANI */}
      <main className="flex-1">
        {page === 'home' && (
          <HomeView
            onSelectStudentFlow={(gradeId?: GradeLevelId) => {
              if (gradeId) setSelectedGrade(gradeId);
              navigateTo('activities');
            }}
            onSelectParentFlow={() => navigateTo('parent')}
            onSelectFamilyFlow={() => navigateTo('family')}
            onSelectPassportFlow={() => navigateTo('passport')}
            onStartActivity={openActivity}
          />
        )}

        {page === 'activities' && (
          <GradeActivitiesView
            onStartActivity={openActivity}
            onOpenPassport={() => navigateTo('passport')}
          />
        )}

        {page === 'workspace' && (
          <ActivityWorkspace
            activity={currentActivity}
            onBack={() => navigateTo('activities')}
            onSelectActivity={openActivity}
          />
        )}

        {page === 'family' && <FamilyCodingView />}

        {page === 'parent' && (
          <ParentAreaView
            onOpenFamilyCoding={() => navigateTo('family')}
            onOpenGradeActivities={(gradeId) => {
              setSelectedGrade(gradeId);
              navigateTo('activities');
            }}
          />
        )}

        {page === 'passport' && (
          <PassportAndCertificateView onSelectActivity={openActivity} />
        )}
      </main>

      {/* KURUMSAL ALT BİLGİ (Footer) */}
      <footer className="no-print bg-white border-t border-slate-200 mt-12 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-slate-600">
          <div className="space-y-1">
            <div className="font-bold text-slate-900 text-sm">
              {SITE_CONFIG.siteName} — {SITE_CONFIG.slogan}
            </div>
            <div>
              {SITE_CONFIG.institution} · {SITE_CONFIG.eventDates}
            </div>
            <div>
              Koordinatör: <strong className="text-slate-800">{SITE_CONFIG.coordinatorName}</strong> (
              {SITE_CONFIG.coordinatorTitle})
            </div>
          </div>

          <div className="max-w-md space-y-2 md:text-right">
            <p className="text-[11px] text-slate-500">{SITE_CONFIG.storageNotice}</p>
            <div className="flex flex-wrap md:justify-end gap-4 font-semibold text-slate-700">
              <button type="button" onClick={() => navigateTo('activities')} className="hover:underline cursor-pointer">
                14 Etkinlik
              </button>
              <button type="button" onClick={() => navigateTo('family')} className="hover:underline cursor-pointer">
                Ailece Kodlama
              </button>
              <button type="button" onClick={() => navigateTo('parent')} className="hover:underline cursor-pointer">
                Veli Alanı
              </button>
              <button type="button" onClick={() => navigateTo('passport')} className="hover:underline cursor-pointer">
                Katılım Belgesi
              </button>
              <button
                type="button"
                onClick={() => setQuickResetModal(true)}
                className="text-rose-700 hover:underline cursor-pointer"
              >
                Verilerimi Temizle
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ProgressProvider>
      <MainPlatformContent />
    </ProgressProvider>
  );
}
