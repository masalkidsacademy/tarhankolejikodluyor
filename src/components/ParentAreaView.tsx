import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  HeartHandshake,
  HelpCircle,
  MessageCircle,
  Sparkles,
  Users
} from 'lucide-react';
import { GRADES, SITE_CONFIG, UNPLUGGED_IDEAS } from '../config/siteConfig';
import { useProgress } from '../context/ProgressContext';
import { ACTIVITIES } from '../data/activities';
import { GradeLevelId } from '../types/platform';

interface ParentAreaViewProps {
  onOpenFamilyCoding: () => void;
  onOpenGradeActivities: (gradeId: GradeLevelId) => void;
}

export const ParentAreaView: React.FC<ParentAreaViewProps> = ({
  onOpenFamilyCoding,
  onOpenGradeActivities
}) => {
  const { state, completedActivityIds, earnedBadges } = useProgress();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Veli Alanı Hero */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="text-xs font-bold text-sky-700">VELİ REHBERİ · HESAP VEYA ÜYELİK GEREKTİRMEZ</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Veliyim — Birlikte Keşfedelim
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {SITE_CONFIG.institution} olarak düzenlediğimiz <strong>{SITE_CONFIG.eventDates}</strong>{' '}
          kapsamında amacımız çocuklarımızı ekran karşısında pasif izleyiciler olmaktan çıkarıp
          düşünen, deneyen, hatasını düzelten ve üreten bireyler olarak desteklemektir.
        </p>

        {/* Pedagojik Yaklaşım Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-violet-50/70 border border-violet-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-900">
              <MessageCircle className="w-4 h-4 text-violet-700" />
              DESTEKLEYİCİ İLETİŞİM YAKLAŞIMI 1
            </div>
            <p className="text-base font-bold text-slate-900">
              “Cevabı söylemek yerine ‘Sence hangi adımı değiştirmeliyiz?’ diye sorabilirsiniz.”
            </p>
            <p className="text-xs text-slate-600">
              Çocuğunuzun doğru komutu kendi başına keşfetmesi, öz güvenini ve algoritmik düşünme
              becerisini doğrudan güçlendirir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700" />
              DESTEKLEYİCİ İLETİŞİM YAKLAŞIMI 2
            </div>
            <p className="text-base font-bold text-slate-900">
              “Yanlış sonuç, yeni bir deneme için ipucudur.”
            </p>
            <p className="text-xs text-slate-600">
              Kodlamada hata yapmak başarısızlık değil, çözüm yolunu iyileştirmek için doğal bir geri
              bildirim adımıdır (Hata Ayıklama / Debugging).
            </p>
          </div>
        </div>
      </div>

      {/* Kodlama Neden Öğretiliyor? & Bu Cihazdaki Öğrenci İlerlemesi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-700" />
            <h2 className="text-xl font-bold text-slate-900">Kodlama Neden Öğretiliyor?</h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>{SITE_CONFIG.codingDefinition}</strong> Okulumuzda kodlama eğitimi yalnızca
            gelecekte yazılımcı olacak öğrenciler için değil; her öğrencinin analitik düşünme,
            sabırla problem çözme ve dijital araçları bilinçli üretici olarak kullanma becerisi
            kazanması için verilir.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {SITE_CONFIG.coreOutcomes.map((item) => (
              <div
                key={item.title}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
              >
                <div className="text-xs font-bold text-slate-900">{item.title}</div>
                <p className="text-xs text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Aynı Cihazda Kaydedilmiş Öğrenci İlerlemesi */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-bold text-emerald-700">
              BU CİHAZDA KAYITLI ÖĞRENCİ İLERLEMESİ
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {state.nickname ? `Öğrenci: ${state.nickname}` : 'Bu Tarayıcıdaki Çalışma Özeti'}
            </h3>
            <p className="text-xs text-slate-600">
              Not: Bu alan uzaktan öğrenci takip sistemi değildir; yalnızca şu anda kullandığınız
              bilgisayar veya tablette tamamlanan etkinlikleri gösterir.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Tamamlanan Etkinlik</div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
                  {completedActivityIds.length} / {ACTIVITIES.length}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Kazanılan Rozet</div>
                <div className="text-2xl font-bold text-violet-700 tabular-nums mt-0.5">
                  {earnedBadges.length} / 6
                </div>
              </div>
            </div>

            {completedActivityIds.length > 0 ? (
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-bold text-slate-700">Tamamlanan Etkinlikler:</div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {completedActivityIds.map((id) => {
                    const act = ACTIVITIES.find((a) => a.id === id);
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-1.5 text-xs text-emerald-900 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {act?.title} ({act?.gradeLabel})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Bu cihazda henüz tamamlanmış bir etkinlik bulunmuyor. Çocuğunuzla birlikte hemen bir
                kademe seçerek başlayabilirsiniz!
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenFamilyCoding}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs cursor-pointer"
          >
            <Users className="w-4 h-4" />
            Birlikte Yapabileceğimiz Aile Görevlerine Git
          </button>
        </div>
      </div>

      {/* Hangi Yaşta Hangi Kavramlarla Başlanıyor? & Çocuğum Ne Öğreniyor? */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Hangi Yaşta Hangi Kavramlarla Başlanıyor?
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Her kademe için eğitimsel kazanım açıklaması ve çocuğunuza yöneltebileceğiniz örnek
            sohbet sorusu:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GRADES.map((g) => (
            <div
              key={g.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">{g.label}</h3>
                  <span className="text-xs text-slate-500">
                    Kavramlar: {g.keyConcepts.join(' · ')}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>Eğitimsel Karşılığı:</strong> {g.parentOutcome}
                </p>
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950">
                  <strong>Evde Konuşma Sorusu:</strong> “{g.parentQuestion}”
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => onOpenGradeActivities(g.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  {g.label} Etkinliklerini İncele
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ekran Dışında Kodlama Fikirleri (Bilgisayarsız / Unplugged) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-emerald-700" />
          <h2 className="text-xl font-bold text-slate-900">
            Ekran Dışında Kodlama Fikirleri (Bilgisayarsız Etkinlikler)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          Kodlama yalnızca bilgisayarda veya tablette yapılmaz! Günlük yaşamda algoritmik düşünmeyi
          destekleyen şu oyunları evde ekran olmadan oynayabilirsiniz:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UNPLUGGED_IDEAS.map((idea) => (
            <div
              key={idea.title}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-900 text-sm">{idea.title}</span>
                <span>{idea.age}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{idea.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
