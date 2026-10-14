import React from 'react';
import {
  ArrowRight,
  Award,
  Bot,
  CheckCircle2,
  Code2,
  Compass,
  Cpu,
  HelpCircle,
  Play,
  Sparkles,
  Users
} from 'lucide-react';
import {
  BADGES,
  FAMILY_TASKS,
  FAQ_ITEMS,
  GRADES,
  SITE_CONFIG,
  UNPLUGGED_IDEAS
} from '../config/siteConfig';
import { useProgress } from '../context/ProgressContext';
import { ACTIVITIES } from '../data/activities';
import { GradeLevelId } from '../types/platform';
import { playTone } from '../utils/soundAndSpeech';

interface HomeViewProps {
  onSelectStudentFlow: (gradeId?: GradeLevelId) => void;
  onSelectParentFlow: () => void;
  onSelectFamilyFlow: () => void;
  onSelectPassportFlow: () => void;
  onStartActivity: (activityId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectStudentFlow,
  onSelectParentFlow,
  onSelectFamilyFlow,
  onSelectPassportFlow,
  onStartActivity
}) => {
  const {
    state,
    setSelectedGrade,
    completedActivityIds,
    earnedBadges,
    nextRecommendedActivity
  } = useProgress();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* HERO BÖLÜMÜ — İki Belirgin Giriş Akışı (Öğrenci & Veli) */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            {/* Kurumsal Etkinlik Üst Bilgisi (Zero-Pill disipliniyle temiz tipografi) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-violet-700">
              <span>{SITE_CONFIG.institution}</span>
              <span aria-hidden="true">·</span>
              <span>{SITE_CONFIG.eventDates}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              {SITE_CONFIG.heroHeading}
            </h1>

            <p className="text-lg sm:text-xl font-semibold text-sky-700">
              “{SITE_CONFIG.slogan}”
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {SITE_CONFIG.heroDescription} Anaokulundan liseye kadar her yaşa uygun çevrim içi
              kodlama görevleriyle <strong>“{SITE_CONFIG.coreApproach}”</strong>
            </p>

            {/* İki Belirgin Ana Seçenek + Kısa Kısayollar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  playTone('click', state.soundEnabled);
                  onSelectStudentFlow();
                }}
                className="flex flex-col justify-between p-4 rounded-2xl bg-violet-700 hover:bg-violet-800 text-white text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-xs font-semibold text-violet-200">1. SEÇENEK · ÖĞRENCİ</span>
                  <Play className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-base font-bold">Öğrenciyim — Kodlamaya Başla</div>
                <div className="text-xs text-violet-100 mt-1">
                  Kademeni seç, görevleri çalıştır ve rozetleri topla
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  playTone('click', state.soundEnabled);
                  onSelectParentFlow();
                }}
                className="flex flex-col justify-between p-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-200 text-slate-900 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-xs font-bold text-sky-800">2. SEÇENEK · VELİ</span>
                  <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-base font-bold">Veliyim — Birlikte Keşfedelim</div>
                <div className="text-xs text-slate-600 mt-1">
                  Veli Alanını Keşfet, kazanımları ve aile görevlerini incele
                </div>
              </button>
            </div>
          </div>

          {/* Sağ Görsel Sahne: Rehber Robot Robi ve Hızlı Başlangıç Kartı */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 space-y-5 border border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
                <Bot className="w-8 h-8 text-sky-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300">REHBER ROBOT ROBİ</div>
                <div className="text-base font-bold">“Hoş geldin! Bugün ne üretmek istersin?”</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/10 border border-white/15 space-y-2 text-xs leading-relaxed text-slate-200">
              <div className="font-bold text-white">Hızlı Etkinlik Önerisi:</div>
              <div>
                Seçili kademen için sıradaki görev:{' '}
                <strong className="text-amber-300">{nextRecommendedActivity.title}</strong> (
                {nextRecommendedActivity.gradeLabel})
              </div>
              <button
                type="button"
                onClick={() => onStartActivity(nextRecommendedActivity.id)}
                className="mt-2 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Hemen Bu Etkinliği Aç
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-lg font-bold font-mono tabular-nums text-sky-300">7</div>
                <div className="text-[11px] text-slate-300">Eğitim Kademesi</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-lg font-bold font-mono tabular-nums text-amber-300">14</div>
                <div className="text-[11px] text-slate-300">Çevrim İçi Atölye</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-lg font-bold font-mono tabular-nums text-emerald-300">6</div>
                <div className="text-[11px] text-slate-300">Başarı Rozeti</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BÖLÜM 1 & 2: Kodlama Haftası Nedir? & Kodlama Yalnızca Bilgisayarda mı Yapılır? */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-violet-700" />
            <h2 className="text-xl font-bold text-slate-900">Kodlama Haftası Nedir?</h2>
          </div>

          <p className="text-base font-bold text-slate-900 bg-violet-50 border border-violet-200 p-4 rounded-xl">
            “{SITE_CONFIG.codingDefinition}”
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong>{SITE_CONFIG.eventDates}</strong> boyunca {SITE_CONFIG.institution} öğrencileri
            ve velileri; algoritma kurma, sıralama, döngü, koşul, değişken ve hata ayıklama
            kavramlarını bizzat komut oluşturup çalıştırarak deneyimler.
          </p>

          <div className="pt-2">
            <div className="text-xs font-bold text-slate-700 mb-2.5">TEMEL KAZANIMLARIMIZ:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SITE_CONFIG.coreOutcomes.map((out) => (
                <div
                  key={out.title}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                >
                  <div className="text-xs font-bold text-slate-900">{out.title}</div>
                  <p className="text-xs text-slate-600">{out.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-700" />
              <h2 className="text-xl font-bold text-slate-900">
                Kodlama Yalnızca Bilgisayarda mı Yapılır?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hayır! Kodlama bir düşünme biçimidir. Yemek tarifi hazırlamak, sabah okula hazırlanma
              sırasını planlamak, çorapları eşleştirmek veya bir arkadaşımıza yol tarif etmek de
              birer <strong>algoritmadır</strong>.
            </p>

            <div className="space-y-2 pt-1">
              {UNPLUGGED_IDEAS.slice(0, 3).map((idea) => (
                <div
                  key={idea.title}
                  className="p-3 rounded-xl bg-sky-50/60 border border-sky-200 text-xs"
                >
                  <div className="font-bold text-slate-900">{idea.title}</div>
                  <p className="text-slate-600 mt-0.5">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onSelectParentFlow}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            Veli Alanında Tüm Bilgisayarsız Fikirleri Gör <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* BÖLÜM 3: Yaşına Uygun Etkinliği Seç (7 Kademe Kartları) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Yaşına Uygun Etkinliği Seç</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Anaokulu 3 yaştan liseye kadar 7 kademede toplam 14 etkileşimli kodlama etkinliği seni
              bekliyor:
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectStudentFlow()}
            className="text-xs font-bold text-violet-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Tüm 14 Etkinliği Listele <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GRADES.map((g) => {
            const gradeActs = ACTIVITIES.filter((a) => a.grade === g.id);
            const doneInGrade = gradeActs.filter((a) =>
              completedActivityIds.includes(a.id)
            ).length;

            return (
              <div
                key={g.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-violet-700">{g.ageRange}</span>
                    <span className="tabular-nums">
                      {doneInGrade}/{gradeActs.length} tamamlandı
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{g.label}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.summary}</p>
                  <div className="pt-1 space-y-1">
                    {gradeActs.map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => onStartActivity(act.id)}
                        className="w-full text-left text-xs font-semibold text-slate-800 hover:text-violet-700 flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <span className="truncate">• {act.title}</span>
                        {completedActivityIds.includes(act.id) && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedGrade(g.id);
                    onSelectStudentFlow(g.id);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  {g.shortLabel} Etkinliklerini Aç
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* BÖLÜM 4 & 5: Ailece Kodlama Görevleri & Kodlama Pasaportum */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-700" />
              <h2 className="text-xl font-bold text-slate-900">Ailece Kodlama Görevleri</h2>
            </div>
            <span className="text-xs text-slate-500">3 Ortak Aile Etkinliği</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            Öğrenci ve velinin birlikte tamamladığı özel görevler! Fiziksel hareket algoritması,
            birlikte hata avı ve PNG olarak indirilebilir ortak aile deseni atölyesi:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FAMILY_TASKS.map((ft) => (
              <div
                key={ft.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{ft.title}</div>
                  <p className="text-[11px] text-slate-600 mt-1">{ft.subtitle}</p>
                </div>
                <div className="text-[11px] text-violet-700 font-semibold">{ft.duration}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onSelectFamilyFlow}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-bold cursor-pointer"
          >
            Ailece Kodlama Bölümünü Aç <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Kodlama Pasaportum Özeti */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900">Kodlama Pasaportum</h2>
            </div>
            <p className="text-xs text-slate-600">
              Tamamladığın etkinlikleri, öğrendiğin kavramları, 6 özel rozeti ve yazdırılabilir{' '}
              <strong>Kodlama Haftası Katılım Belgeni</strong> pasaportunda görüntüle.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Tamamlanan Etkinlik</div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
                  {completedActivityIds.length} / {ACTIVITIES.length}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Kazanılan Rozet</div>
                <div className="text-2xl font-bold text-emerald-700 tabular-nums mt-0.5">
                  {earnedBadges.length} / {BADGES.length}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onSelectPassportFlow}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-2"
          >
            Pasaportumu ve Katılım Belgemi Aç <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* BÖLÜM 6: Sık Sorulan Sorular */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-700" />
          <h2 className="text-xl font-bold text-slate-900">Sık Sorulan Sorular</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_ITEMS.map((faq) => (
            <div
              key={faq.question}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
            >
              <h3 className="text-sm font-bold text-slate-900">{faq.question}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
