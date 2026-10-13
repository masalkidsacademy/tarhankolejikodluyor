import React, { useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2
} from 'lucide-react';
import { BADGES, GRADES, SITE_CONFIG } from '../config/siteConfig';
import { useProgress } from '../context/ProgressContext';
import { ACTIVITIES } from '../data/activities';
import { playTone } from '../utils/soundAndSpeech';

interface PassportAndCertificateViewProps {
  onSelectActivity: (activityId: string) => void;
}

export const PassportAndCertificateView: React.FC<PassportAndCertificateViewProps> = ({
  onSelectActivity
}) => {
  const {
    state,
    setNickname,
    setSelectedGrade,
    completedActivityIds,
    earnedBadges,
    learnedConcepts,
    nextRecommendedActivity,
    resetAllProgress
  } = useProgress();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedGradeObj =
    GRADES.find((g) => g.id === state.selectedGrade) || GRADES[2];
  const displayDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleDownloadCertificatePng = () => {
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playTone('success', state.soundEnabled);

    // Sertifika görselini yüksek çözünürlüklü Canvas'a çiz
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dış ve iç çerçeve
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';

    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#4F46E5';
    ctx.fillText(SITE_CONFIG.institution.toUpperCase(), canvas.width / 2, 95);

    ctx.font = 'bold 30px "Outfit", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(SITE_CONFIG.certificateTitle, canvas.width / 2, 145);

    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(SITE_CONFIG.eventDates, canvas.width / 2, 180);

    // Öğrenci Takma Adı
    ctx.font = 'bold 34px "Outfit", sans-serif';
    ctx.fillStyle = '#0284C7';
    ctx.fillText(
      state.nickname.trim() || 'Geleceğin Kodlayıcısı',
      canvas.width / 2,
      250
    );

    ctx.font = '500 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.fillText(
      `Kademe: ${selectedGradeObj.label}  ·  Tamamlanan Etkinlik: ${completedActivityIds.length}  ·  Kazanılan Rozet: ${earnedBadges.length}`,
      canvas.width / 2,
      295
    );

    ctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(
      'Algoritma, döngü, koşul ve hata ayıklama etkinliklerini keşfederek üretim yaptığı için teşekkür ederiz.',
      canvas.width / 2,
      340
    );

    // Alt Bilgiler
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText(
      `${SITE_CONFIG.coordinatorName} — ${SITE_CONFIG.coordinatorTitle}`,
      canvas.width / 2,
      415
    );

    ctx.font = '400 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`Düzenlenme Tarihi: ${displayDate}`, canvas.width / 2, 445);

    const link = document.createElement('a');
    link.download = 'tarhan-koleji-kodlama-haftasi-katilim-belgesi.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Gizli Canvas (PNG Belge İndirme İçin) */}
      <canvas ref={certCanvasRef} width={960} height={520} className="hidden" />

      {/* Üst Özet ve Takma Ad / Kademe Ayarı (Yazdırmada Gizlenir) */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-violet-700">KİŞİSEL VERİ TOPLANMAZ · YEREL PASAPORT</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Kodlama Pasaportum ve Katılım Belgem
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {SITE_CONFIG.storageNotice}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Yeni Öğrenci / İlerlemeyi Sıfırla
          </button>
        </div>

        {/* Sıfırlama Onay Kutusu */}
        {confirmResetOpen && (
          <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-rose-950">
              <strong>Onay Gerekiyor:</strong> Bu cihazdaki tüm tamamlanan görevler, kazanılan
              rozetler ve kaydedilen projeler silinecek. Ortak okul bilgisayarında yeni öğrenciye
              geçmek için sıfırlamak istiyor musunuz?
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  resetAllProgress();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Evet, Verilerimi Temizle
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}

        {/* Takma Ad ve Kademe Düzenleme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              İsteğe Bağlı Takma Ad (Gerçek soyad/numara yazmayın):
            </label>
            <input
              type="text"
              value={state.nickname}
              maxLength={28}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Örn: KodKaşifi, RobiDostu..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Seçili Kademe:
            </label>
            <select
              value={state.selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value as typeof state.selectedGrade)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              {GRADES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => onSelectActivity(nextRecommendedActivity.id)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Önerilen: {nextRecommendedActivity.title}
            </button>
          </div>
        </div>
      </div>

      {/* 6 Rozet Koleksiyonu (Yazdırmada Gizlenir) */}
      <div className="no-print space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Rozet Koleksiyonum ({earnedBadges.length} / {BADGES.length})
          </h2>
          <span className="text-xs text-slate-500">
            Rozetler gerçek görev tamamlama koşullarına bağlıdır
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = earnedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-colors ${
                  isUnlocked
                    ? 'bg-white border-emerald-400 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{badge.title}</h3>
                      <span className="text-xs font-semibold text-slate-500">
                        {isUnlocked ? '✓ Kazanıldı' : 'Henüz Açılmadı'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-3">{badge.description}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <strong>Koşul:</strong> {badge.criteriaText}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tamamlanan Etkinlikler ve Öğrenilen Kavramlar (Yazdırmada Gizlenir) */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Tamamlanan Etkinlikler ({completedActivityIds.length} / {ACTIVITIES.length})
          </h3>
          {completedActivityIds.length === 0 ? (
            <p className="text-xs text-slate-500">
              Henüz tamamlanmış etkinlik yok. Bir etkinliği açıp görevlerini tamamladığında burada
              listelenir.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {completedActivityIds.map((actId) => {
                const act = ACTIVITIES.find((a) => a.id === actId);
                if (!act) return null;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => onSelectActivity(act.id)}
                    className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-left flex items-center justify-between hover:bg-emerald-100/70 cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{act.title}</div>
                      <div className="text-[11px] text-slate-600">{act.gradeLabel}</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Keşfettiğim Kavramlar ({learnedConcepts.length})
          </h3>
          {learnedConcepts.length === 0 ? (
            <p className="text-xs text-slate-500">
              Etkinlikleri tamamladıkça Sıralama, Döngü, Koşul, Değişken ve Hata Ayıklama gibi
              kavramlar pasaportuna eklenir.
            </p>
          ) : (
            <div className="text-xs text-slate-800 leading-relaxed">
              {learnedConcepts.join('  ·  ')}
            </div>
          )}
        </div>
      </div>

      {/* YAZDIRILABİLİR KATILIM BELGESİ */}
      <div className="bg-white border-2 border-indigo-600 rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Yazdırılabilir Katılım Belgesi</h2>
            <p className="text-xs text-slate-600">
              Belgeyi doğrudan yazıcıdan çıkarabilir veya PNG görseli olarak indirebilirsiniz.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCertificatePng}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              PNG Olarak İndir
            </button>
            <button
              type="button"
              onClick={handlePrintCertificate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Belgeyi Yazdır
            </button>
          </div>
        </div>

        {/* Belge İçeriği */}
        <div className="border-2 border-slate-300 rounded-2xl p-6 sm:p-10 text-center space-y-5 bg-gradient-to-b from-white to-slate-50/60">
          <div className="text-xs font-bold tracking-wider text-indigo-700 uppercase">
            {SITE_CONFIG.institution}
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {SITE_CONFIG.certificateTitle}
          </h3>

          <div className="text-xs font-semibold text-slate-600">
            {SITE_CONFIG.eventDates} · “{SITE_CONFIG.slogan}”
          </div>

          <div className="py-4 border-y border-slate-200 max-w-xl mx-auto space-y-2">
            <div className="text-xs text-slate-500">KATILIMCI ÖĞRENCİ / TAKMA AD</div>
            <div className="text-2xl sm:text-3xl font-bold text-sky-700">
              {state.nickname.trim() || 'Geleceğin Kodlayıcısı'}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-700 pt-2">
              <span>
                Kademe: <strong>{selectedGradeObj.label}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Tamamlanan Etkinlik Sayısı:{' '}
                <strong className="tabular-nums">{completedActivityIds.length}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Kazanılan Rozet Sayısı:{' '}
                <strong className="tabular-nums">{earnedBadges.length}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Tarih: <strong>{displayDate}</strong>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
            “{SITE_CONFIG.coreApproach}” anlayışıyla algoritma, sıralama, döngü, koşul ve hata
            ayıklama etkinliklerine katılarak kendi dijital üretimlerini gerçekleştirdiği için
            tebrik ederiz.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-around gap-4 text-xs text-slate-700">
            <div>
              <div className="font-bold text-slate-900">{SITE_CONFIG.institution}</div>
              <div className="text-slate-500">{SITE_CONFIG.eventDates}</div>
            </div>
            <div>
              <div className="font-bold text-slate-900">{SITE_CONFIG.coordinatorName}</div>
              <div className="text-slate-500">{SITE_CONFIG.coordinatorTitle}</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto pt-2">
            {SITE_CONFIG.certificateDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
