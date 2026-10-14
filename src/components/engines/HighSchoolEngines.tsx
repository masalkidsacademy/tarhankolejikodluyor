import React, { useEffect, useState } from 'react';
import { CheckCircle2, Play, RotateCcw, Save, Timer } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { playTone } from '../../utils/soundAndSpeech';

interface EngineProps {
  taskIndex: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  onTaskComplete: (taskIndex: number) => void;
}

// ============================================================================
// ETKİNLİK 13: ALGORİTMA LABORATUVARI (Lise)
// Kontrollü Sözde Kod (Pseudocode) Yorumlayıcısı ve Değişken İzleme Tablosu
// ============================================================================
interface TraceStep {
  lineIndex: number;
  explanation: string;
  vars: Record<string, number | string>;
  output?: string;
}

export const AlgorithmLabEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  // Girdi parametreleri ve algoritma ayarları
  const [inputScore, setInputScore] = useState<number>(55);
  const [bonusScore, setBonusScore] = useState<number>(20);
  const [passThreshold, setPassThreshold] = useState<number>(70);

  const [initialBudget, setInitialBudget] = useState<number>(100);
  const [dailyExpense, setDailyExpense] = useState<number>(25);
  const [daysLoop, setDaysLoop] = useState<number>(4);

  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const isBudgetTask = taskIndex === 1;

  const pseudoLines = isBudgetTask
    ? [
        `1. DEĞİŞKEN butce = ${initialBudget}`,
        `2. DEĞİŞKEN gunlukGider = ${dailyExpense}`,
        `3. TEKRARLA (${daysLoop} gün boyunca):`,
        `4.    butce = butce - gunlukGider`,
        `5. EĞER (butce < 20) İSE:`,
        `6.    ÇIKTI YAZ "Bütçe Uyarısı: Kalan " + butce`,
        `7. DEĞİLSE:`,
        `8.    ÇIKTI YAZ "Bütçe Yeterli: Kalan " + butce`
      ]
    : [
        `1. DEĞİŞKEN sinavPuani = ${inputScore}`,
        `2. DEĞİŞKEN projeBonusu = ${bonusScore}`,
        `3. DEĞİŞKEN toplamPuan = sinavPuani + projeBonusu`,
        `4. EĞER (toplamPuan >= ${passThreshold}) İSE:`,
        `5.    ÇIKTI YAZ "Başarılı: " + toplamPuan`,
        `6. DEĞİLSE:`,
        `7.    ÇIKTI YAZ "Geliştirilmeli: " + toplamPuan`
      ];

  const runControlledInterpreter = () => {
    playTone('step', soundEnabled);
    const steps: TraceStep[] = [];

    if (isBudgetTask) {
      let butce = initialBudget;
      const gider = dailyExpense;
      steps.push({
        lineIndex: 0,
        explanation: `Başlangıç bütçesi ${butce} TL olarak tanımlandı.`,
        vars: { butce }
      });
      steps.push({
        lineIndex: 1,
        explanation: `Günlük gider ${gider} TL olarak atandı.`,
        vars: { butce, gunlukGider: gider }
      });

      const boundedDays = Math.min(Math.max(daysLoop, 1), 10);
      for (let gun = 1; gun <= boundedDays; gun++) {
        butce = butce - gider;
        steps.push({
          lineIndex: 3,
          explanation: `Döngü ${gun}. Tur: Bütçeden ${gider} TL düşüldü, yeni bütçe = ${butce} TL.`,
          vars: { butce, gunlukGider: gider, gun }
        });
      }

      const warn = butce < 20;
      steps.push({
        lineIndex: 4,
        explanation: `Koşul kontrolü: (${butce} < 20) ifadesi ${warn ? 'DOĞRU' : 'YANLIŞ'} sonuç verdi.`,
        vars: { butce, gunlukGider: gider, kosulSonucu: warn ? 'DOĞRU' : 'YANLIŞ' }
      });

      if (warn) {
        steps.push({
          lineIndex: 5,
          explanation: `Koşul doğru olduğu için uyarı çıktısı üretildi.`,
          vars: { butce, gunlukGider: gider },
          output: `Bütçe Uyarısı: Kalan ${butce} TL`
        });
      } else {
        steps.push({
          lineIndex: 7,
          explanation: `DEĞİLSE bloğu çalıştı, bütçe yeterli çıktısı üretildi.`,
          vars: { butce, gunlukGider: gider },
          output: `Bütçe Yeterli: Kalan ${butce} TL`
        });
      }
    } else {
      const sinav = inputScore;
      const bonus = bonusScore;
      const toplam = sinav + bonus;
      steps.push({
        lineIndex: 0,
        explanation: `sinavPuani değişkenine ${sinav} atandı.`,
        vars: { sinavPuani: sinav }
      });
      steps.push({
        lineIndex: 1,
        explanation: `projeBonusu değişkenine ${bonus} atandı.`,
        vars: { sinavPuani: sinav, projeBonusu: bonus }
      });
      steps.push({
        lineIndex: 2,
        explanation: `toplamPuan hesaplandı: ${sinav} + ${bonus} = ${toplam}.`,
        vars: { sinavPuani: sinav, projeBonusu: bonus, toplamPuan: toplam }
      });
      const passed = toplam >= passThreshold;
      steps.push({
        lineIndex: 3,
        explanation: `Koşul testi: (${toplam} >= ${passThreshold}) -> ${passed ? 'DOĞRU' : 'YANLIŞ'}.`,
        vars: {
          sinavPuani: sinav,
          projeBonusu: bonus,
          toplamPuan: toplam,
          kosul: passed ? 'DOĞRU' : 'YANLIŞ'
        }
      });
      steps.push({
        lineIndex: passed ? 4 : 6,
        explanation: `Algoritma sonucu ekrana yazdırıldı.`,
        vars: { sinavPuani: sinav, projeBonusu: bonus, toplamPuan: toplam },
        output: passed ? `Başarılı: ${toplam}` : `Geliştirilmeli: ${toplam}`
      });
    }

    setTraceSteps(steps);
    setCurrentStepIdx(steps.length - 1);
    playTone('success', soundEnabled);
    onTaskComplete(taskIndex);
  };

  useEffect(() => {
    runControlledInterpreter();
  }, [taskIndex]);

  const activeTrace = traceSteps[currentStepIdx];

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
        <strong>Algoritma Yorumlayıcı Notu:</strong> Bu çalışma alanı, tam bir Python veya JavaScript
        derleyicisi değil; değişkenlerin her adımda bellekte nasıl değiştiğini şeffaf biçimde gösteren
        eğitim amaçlı bir <strong>sözde kod (pseudocode) yorumlayıcısıdır</strong>.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sol: Sözde Kod ve Girdi Ayarları */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">Sözde Kod (Pseudocode) Alanı</h4>
            <span className="text-xs font-mono text-violet-700">
              Adım: {traceSteps.length > 0 ? `${currentStepIdx + 1}/${traceSteps.length}` : '-'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-1.5">
            {pseudoLines.map((line, idx) => {
              const isHighlighted = activeTrace?.lineIndex === idx;
              return (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    isHighlighted
                      ? 'bg-amber-400/25 text-amber-200 border border-amber-400/50 font-bold'
                      : 'text-slate-300'
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>

          {/* Girdi Test Kontrolleri */}
          {isBudgetTask ? (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Başlangıç Bütçesi:</label>
                <input
                  type="number"
                  min={20}
                  max={500}
                  value={initialBudget}
                  onChange={(e) => setInitialBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Günlük Gider:</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={dailyExpense}
                  onChange={(e) => setDailyExpense(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Döngü Günü (1-8):</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={daysLoop}
                  onChange={(e) => setDaysLoop(Math.min(8, Math.max(1, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sınav Puanı:</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={inputScore}
                  onChange={(e) => setInputScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Proje Bonusu:</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={bonusScore}
                  onChange={(e) => setBonusScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Geçme Barajı:</label>
                <input
                  type="number"
                  min={40}
                  max={90}
                  value={passThreshold}
                  onChange={(e) => setPassThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={runControlledInterpreter}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Algoritmayı Çalıştır ve Değişkenleri İzle
          </button>
        </div>

        {/* Sağ: Adım Adım Değişken İzleme Tablosu */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h4 className="text-base font-bold text-slate-900">Değişken İzleme Tablosu (Trace)</h4>

          {traceSteps.length > 0 && (
            <>
              <div className="flex flex-wrap gap-1.5">
                {traceSteps.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                      currentStepIdx === idx
                        ? 'bg-violet-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Adım {idx + 1}
                  </button>
                ))}
              </div>

              {activeTrace && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950">
                    <strong>Adım {currentStepIdx + 1} Açıklaması:</strong> {activeTrace.explanation}
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th className="py-2 px-3 font-bold">Değişken Adı</th>
                          <th className="py-2 px-3 font-bold">Bellekteki Değeri</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono">
                        {Object.entries(activeTrace.vars).map(([k, v]) => (
                          <tr key={k}>
                            <td className="py-2 px-3 font-bold text-violet-800">{k}</td>
                            <td className="py-2 px-3 text-slate-900 tabular-nums">{String(v)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {activeTrace.output && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-mono font-bold text-emerald-950">
                      ÇIKTI EKRANI: &gt; {activeTrace.output}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ETKİNLİK 14: OKUL İÇİN DİJİTAL ÇÖZÜM (Lise)
// Çalışma Zamanlayıcısı veya Mini Bilgi Yarışması Üretim Atölyesi
// ============================================================================
export const DigitalSolutionEngine: React.FC<EngineProps> = ({
  soundEnabled,
  onTaskComplete
}) => {
  const { state, saveDigitalSolutionProject } = useProgress();
  const saved = state.digitalSolutionProject!;

  const [toolType, setToolType] = useState<'timer' | 'quiz'>(saved.type || 'quiz');
  const [title, setTitle] = useState<string>(saved.title);
  const [problemSolved, setProblemSolved] = useState<string>(saved.problemSolved);
  const [focusMins, setFocusMins] = useState<number>(saved.timerFocusMinutes || 25);
  const [breakMins, setBreakMins] = useState<number>(saved.timerBreakMinutes || 5);
  const [questions, setQuestions] = useState(saved.quizQuestions);

  // Canlı Önizleme Durumları (Timer)
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(focusMins * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Canlı Önizleme Durumları (Quiz)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [saveBanner, setSaveBanner] = useState<string>('');

  useEffect(() => {
    setTimerSecondsLeft(focusMins * 60);
    setTimerRunning(false);
  }, [focusMins]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setTimerSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const handleSaveSolution = () => {
    playTone('success', soundEnabled);
    saveDigitalSolutionProject({
      type: toolType,
      title: title.replace(/[<>]/g, '').slice(0, 80),
      problemSolved: problemSolved.replace(/[<>]/g, '').slice(0, 300),
      timerFocusMinutes: focusMins,
      timerBreakMinutes: breakMins,
      quizQuestions: questions,
      updatedAt: new Date().toISOString()
    });
    onTaskComplete(0);
    if (problemSolved.trim().length >= 10) {
      onTaskComplete(1);
      setSaveBanner('Projen ve çözüm açıklaman tarayıcıya başarıyla kaydedildi!');
    } else {
      setSaveBanner('Lütfen "Hangi sorunu çözdüm?" alanına en az bir cümlelik açıklama yaz.');
    }
  };

  const quizScore = questions.reduce((acc, q, idx) => {
    return acc + (quizAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);

  const fmtTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sol: Yapılandırma ve Ürün Tasarım Editörü */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-slate-900">1. Dijital Çözümünü Yapılandır</h4>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setToolType('quiz')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
              toolType === 'quiz'
                ? 'bg-violet-700 text-white border-violet-700'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            Mini Bilgi Yarışması
          </button>
          <button
            type="button"
            onClick={() => setToolType('timer')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
              toolType === 'timer'
                ? 'bg-violet-700 text-white border-violet-700'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            Odaklanma Zamanlayıcısı
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Uygulama Başlığı:</label>
          <input
            type="text"
            value={title}
            maxLength={70}
            onChange={(e) => setTitle(e.target.value.replace(/[<>]/g, ''))}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
          />
        </div>

        {toolType === 'timer' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Odaklanma Süresi (Dakika):
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={focusMins}
                onChange={(e) => setFocusMins(Math.max(1, Math.min(60, Number(e.target.value))))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mola Süresi (Dakika):
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={breakMins}
                onChange={(e) => setBreakMins(Math.max(1, Math.min(30, Number(e.target.value))))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Soru {qIdx + 1}:
                </label>
                <input
                  type="text"
                  value={q.question}
                  maxLength={110}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[<>]/g, '');
                    const copy = [...questions];
                    copy[qIdx] = { ...copy[qIdx], question: val };
                    setQuestions(copy);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>Doğru Seçenek:</span>
                  <select
                    value={q.correctIndex}
                    onChange={(e) => {
                      const copy = [...questions];
                      copy[qIdx] = { ...copy[qIdx], correctIndex: Number(e.target.value) };
                      setQuestions(copy);
                    }}
                    className="px-2 py-1 rounded border border-slate-300 bg-white font-bold"
                  >
                    <option value={0}>1. Seçenek ({q.options[0]})</option>
                    <option value={1}>2. Seçenek ({q.options[1]})</option>
                    <option value={2}>3. Seçenek ({q.options[2]})</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Hangi Sorunu Çözdüm? (Kullanıcı İhtiyacı Açıklaması):
          </label>
          <textarea
            rows={2}
            value={problemSolved}
            maxLength={250}
            onChange={(e) => setProblemSolved(e.target.value.replace(/[<>]/g, ''))}
            placeholder="Örn: Sınav haftasında arkadaşlarımızın ders çalışırken süreyi verimli yönetmesini sağladım."
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
          />
        </div>

        <button
          type="button"
          onClick={handleSaveSolution}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Projemi Kaydet ve Görevi Tamamla
        </button>

        {saveBanner && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveBanner}</span>
          </div>
        )}
      </div>

      {/* Sağ: Çalışan Canlı Önizleme */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-violet-700">CANLI ÜRÜN ÖNİZLEMESİ</span>
          <span className="text-xs text-slate-500">Tamamen etkileşimli çalışır</span>
        </div>

        <h5 className="text-lg font-bold text-slate-900">{title}</h5>

        {toolType === 'timer' ? (
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col items-center space-y-4">
            <Timer className="w-8 h-8 text-sky-400" />
            <div className="text-4xl font-mono font-bold tabular-nums tracking-wider">
              {fmtTime(timerSecondsLeft)}
            </div>
            <div className="text-xs text-slate-300">
              Hedef: {focusMins} dk Odaklanma · {breakMins} dk Mola
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTimerRunning((r) => !r)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                {timerRunning ? 'Duraklat' : 'Başlat'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSecondsLeft(focusMins * 60);
                }}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Sıfırla
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-900">
                  {qIdx + 1}. {q.question}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {q.options.map((opt, oIdx) => {
                    const selected = quizAnswers[qIdx] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                          selected
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                playTone('step', soundEnabled);
                setQuizSubmitted(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer"
            >
              Yarışma Sonucunu Hesapla
            </button>

            {quizSubmitted && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-950">
                Yarışma Sonucu: {questions.length} soruda {quizScore} doğru cevap!
              </div>
            )}
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <strong>Çözülen Sorun:</strong> {problemSolved}
        </div>
      </div>
    </div>
  );
};
