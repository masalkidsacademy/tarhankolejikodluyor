import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  Play,
  RotateCcw,
  Trash2,
  Users
} from 'lucide-react';
import { FAMILY_TASKS } from '../config/siteConfig';
import { useProgress } from '../context/ProgressContext';
import { playTone } from '../utils/soundAndSpeech';

export const FamilyCodingView: React.FC = () => {
  const { state, markFamilyTaskCompleted } = useProgress();
  const [activeTab, setActiveTab] = useState<'aile-1' | 'aile-2' | 'aile-3'>('aile-1');

  // --- Görev A: Çocuğum Beni Kodluyor ---
  const [seatedMode, setSeatedMode] = useState(false);
  const [parentMoves, setParentMoves] = useState<string[]>([
    '2 Adım İleri Yürü',
    'Sağa Dön',
    'El Salla ve Gülümse'
  ]);
  const [executedIndex, setExecutedIndex] = useState<number | null>(null);
  const [reflectionA, setReflectionA] = useState(state.familyReflections['aile-1'] || '');

  // --- Görev B: Birlikte Hata Avı ---
  type Dir = 'RIGHT' | 'DOWN' | 'LEFT' | 'UP';
  const [familyBugCode, setFamilyBugCode] = useState<Dir[]>(['RIGHT', 'DOWN', 'DOWN', 'RIGHT']);
  const [familyRobotPos, setFamilyRobotPos] = useState({ x: 0, y: 0 });
  const [familyBugFeedback, setFamilyBugFeedback] = useState(
    'Mevcut kodda 2. adımda robot engele çarpıyor. Birlikte "Sence hangi adımı değiştirmeliyiz?" diye konuşup düzeltin!'
  );
  const [reflectionB, setReflectionB] = useState(state.familyReflections['aile-2'] || '');

  // --- Görev C: Aile Desenimiz (Canvas + PNG İndirme) ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [patternShape, setPatternShape] = useState<'star' | 'hexagon' | 'circle'>('star');
  const [patternColor, setPatternColor] = useState<'#4F46E5' | '#0284C7' | '#F97316' | '#10B981'>('#4F46E5');
  const [patternRepeat, setPatternRepeat] = useState<number>(8);
  const [familyNameTag, setFamilyNameTag] = useState<string>('Bizim Aile Desenimiz');
  const [reflectionC, setReflectionC] = useState(state.familyReflections['aile-3'] || '');

  const drawFamilyCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Çerçeve
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    // Başlık
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(familyNameTag || 'Tarhan Koleji Aile Deseni', canvas.width / 2, 44);

    // Döngüyle Mandala / Desen Çizimi
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 12;
    const radius = 85;

    for (let i = 0; i < patternRepeat; i++) {
      const angle = (i * 2 * Math.PI) / patternRepeat;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = patternColor;
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2;

      if (patternShape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (patternShape === 'hexagon') {
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const sa = (s * Math.PI) / 3;
          const sx = Math.cos(sa) * 24;
          const sy = Math.sin(sa) * 24;
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Yıldız
        ctx.beginPath();
        for (let p = 0; p < 10; p++) {
          const r = p % 2 === 0 ? 25 : 11;
          const a = (p * Math.PI) / 5;
          const sx = Math.cos(a) * r;
          const sy = Math.sin(a) * r;
          if (p === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    // Merkez rozet
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${patternRepeat}×`, cx, cy + 5);
  };

  useEffect(() => {
    if (activeTab === 'aile-3') {
      drawFamilyCanvas();
    }
  }, [activeTab, patternShape, patternColor, patternRepeat, familyNameTag]);

  const downloadPatternPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playTone('success', state.soundEnabled);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'tarhan-koleji-aile-desenimiz.png';
    link.href = dataUrl;
    link.click();
    markFamilyTaskCompleted('aile-3', reflectionC);
  };

  const runFamilyBugMap = () => {
    const obstacles = [
      { x: 1, y: 1 },
      { x: 1, y: 2 }
    ];
    const goal = { x: 3, y: 2 };
    let cx = 0;
    let cy = 0;

    for (let i = 0; i < familyBugCode.length; i++) {
      const d = familyBugCode[i];
      const nx = d === 'RIGHT' ? cx + 1 : d === 'LEFT' ? cx - 1 : cx;
      const ny = d === 'DOWN' ? cy + 1 : d === 'UP' ? cy - 1 : cy;
      if (nx < 0 || nx >= 4 || ny < 0 || ny >= 4) {
        setFamilyRobotPos({ x: cx, y: cy });
        playTone('warning', state.soundEnabled);
        setFamilyBugFeedback(`${i + 1}. adımda robot harita dışına çıktı! Birlikte o adımı değiştirin.`);
        return;
      }
      if (obstacles.some((o) => o.x === nx && o.y === ny)) {
        setFamilyRobotPos({ x: cx, y: cy });
        playTone('warning', state.soundEnabled);
        setFamilyBugFeedback(
          `${i + 1}. adımda robot (${nx},${ny}) karesindeki engele çarptı! Önce sağa devam edip sonra aşağı inmeyi deneyin.`
        );
        return;
      }
      cx = nx;
      cy = ny;
    }

    setFamilyRobotPos({ x: cx, y: cy });
    if (cx === goal.x && cy === goal.y) {
      playTone('success', state.soundEnabled);
      setFamilyBugFeedback('Harika! Ailece hatayı bulup düzelttiniz ve kütüphaneye ulaştınız!');
      markFamilyTaskCompleted('aile-2', reflectionB);
    } else {
      playTone('warning', state.soundEnabled);
      setFamilyBugFeedback('Robot engele çarpmadı ama henüz kütüphaneye (📚) ulaşmadı. Adım ekleyin!');
    }
  };

  const completedCount = Object.values(state.familyTasksCompleted).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Başlık */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-bold text-violet-700">AİLECE KODLAMA ŞENLİĞİ</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Birlikte Keşfedelim, Birlikte Kodlayalım
          </h1>
          <p className="text-sm text-slate-600">
            Aşağıdaki üç etkileşimli görev, öğrenci ve velinin ekran başında ve ekran dışında iş birliği
            yapması için tasarlandı. En az bir görevi tamamladığınızda{' '}
            <strong className="text-slate-900">“Ailece Kodladık”</strong> rozeti açılır!
          </p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 shrink-0">
          <Award className="w-8 h-8 text-emerald-600" />
          <div>
            <div className="text-xs font-bold text-emerald-950">Aile Görev İlerlemesi</div>
            <div className="text-sm font-bold text-emerald-800 tabular-nums">
              {completedCount} / 3 Görev Tamamlandı
            </div>
          </div>
        </div>
      </div>

      {/* Görev Seçici Sekmeler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FAMILY_TASKS.map((task, idx) => {
          const isDone = Boolean(state.familyTasksCompleted[task.id]);
          const isSelected = activeTab === task.id;
          return (
            <button
              key={task.id}
              type="button"
              onClick={() => {
                playTone('click', state.soundEnabled);
                setActiveTab(task.id);
              }}
              className={`p-5 rounded-2xl border-2 text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold opacity-75">GÖREV {idx + 1} · {task.duration}</span>
                {isDone && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Tamamlandı
                  </span>
                )}
              </div>
              <div className="text-base font-bold">{task.title}</div>
              <p className={`text-xs mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                {task.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* GÖREV A: ÇOCUĞUM BENİ KODLUYOR */}
      {activeTab === 'aile-1' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">A. Çocuğum Beni Kodluyor</h2>
              <p className="text-xs text-slate-600 mt-1">
                Öğrenci ekranda komut dizisini oluşturur; velimiz ise odadaki güvenli alanda robot olup
                komutları sırasıyla uygular!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSeatedMode((s) => !s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                seatedMode
                  ? 'bg-violet-700 text-white border-violet-700'
                  : 'bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              {seatedMode ? '✓ Oturarak Yapılabilir Hareketler Açık' : 'Oturarak Yapılabilir Alternatif Hareketlere Geç'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-sm font-bold text-slate-800">
                1. Komut Ekle ({seatedMode ? 'Oturarak Mod' : 'Ayakta Mod'}):
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {(seatedMode
                  ? [
                      'Sağ Elini Kaldır',
                      'Sol Elini Kaldır',
                      '2 Kez Alkışla',
                      'Başını Hafifçe Eğ',
                      'Gülümse ve El Salla',
                      'Omuzlarını Kaldır'
                    ]
                  : [
                      '2 Adım İleri Yürü',
                      'Sağa 90 Derece Dön',
                      'Sola 90 Derece Dön',
                      '2 Kez Alkışla',
                      'El Salla ve Gülümse',
                      'Olduğun Yerde Zıpla'
                    ]
                ).map((move) => (
                  <button
                    key={move}
                    type="button"
                    onClick={() => {
                      if (parentMoves.length < 8) {
                        playTone('click', state.soundEnabled);
                        setParentMoves((prev) => [...prev, move]);
                      }
                    }}
                    className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 font-bold text-xs text-left cursor-pointer"
                  >
                    + {move}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  2. Velinin Uygulayacağı Komut Sırası ({parentMoves.length}):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setParentMoves([]);
                    setExecutedIndex(null);
                  }}
                  className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
                >
                  Temizle
                </button>
              </div>

              <div className="space-y-2">
                {parentMoves.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border-2 text-xs font-bold flex items-center justify-between ${
                      executedIndex === idx
                        ? 'bg-amber-100 border-amber-500 text-amber-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>
                      {idx + 1}. {m}
                    </span>
                    <button
                      type="button"
                      onClick={() => setParentMoves((p) => p.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (parentMoves.length === 0) return;
                    playTone('step', state.soundEnabled);
                    const nextIdx =
                      executedIndex === null
                        ? 0
                        : executedIndex + 1 < parentMoves.length
                        ? executedIndex + 1
                        : 0;
                    setExecutedIndex(nextIdx);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer"
                >
                  Adım Adım Veliyi Çalıştır
                </button>
                <button
                  type="button"
                  disabled={parentMoves.length < 2}
                  onClick={() => {
                    playTone('success', state.soundEnabled);
                    markFamilyTaskCompleted('aile-1', reflectionA);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer disabled:opacity-40"
                >
                  Uyguladık ve Tamamladık!
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center">
            <span className="text-xs font-bold text-slate-700 shrink-0">
              Birlikte ne keşfettik?
            </span>
            <input
              type="text"
              value={reflectionA}
              onChange={(e) => setReflectionA(e.target.value.replace(/[<>]/g, ''))}
              placeholder="Ailece gözleminizi buraya not edebilirsiniz..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs w-full"
            />
          </div>
        </div>
      )}

      {/* GÖREV B: BİRLİKTE HATA AVI */}
      {activeTab === 'aile-2' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">B. Birlikte Hata Avı</h2>
            <p className="text-xs text-slate-600 mt-1">
              Robotun (0,0) noktasından (3,2) karesindeki Okul Kütüphanesine (📚) gitmesi gerekiyor.
              Hatalı komutu birlikte bulup düzeltin!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 flex justify-center py-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="grid grid-cols-4 gap-2.5">
                {Array.from({ length: 16 }).map((_, idx) => {
                  const x = idx % 4;
                  const y = Math.floor(idx / 4);
                  const isRobot = familyRobotPos.x === x && familyRobotPos.y === y;
                  const isGoal = x === 3 && y === 2;
                  const isObs = (x === 1 && y === 1) || (x === 1 && y === 2);
                  return (
                    <div
                      key={idx}
                      className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-2xl ${
                        isRobot
                          ? 'bg-sky-100 border-sky-600'
                          : isGoal
                          ? 'bg-amber-50 border-amber-400'
                          : isObs
                          ? 'bg-slate-200 border-slate-400'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {isObs ? '🪨' : isRobot ? '🤖' : isGoal ? '📚' : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {(['RIGHT', 'DOWN', 'LEFT', 'UP'] as Dir[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => familyBugCode.length < 8 && setFamilyBugCode((p) => [...p, d])}
                    className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 font-bold text-xs cursor-pointer"
                  >
                    + {d === 'RIGHT' ? '➡️ Sağ' : d === 'DOWN' ? '⬇️ Aşağı' : d === 'LEFT' ? '⬅️ Sol' : '⬆️ Yukarı'}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFamilyBugCode(['RIGHT', 'DOWN', 'DOWN', 'RIGHT']);
                    setFamilyRobotPos({ x: 0, y: 0 });
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Sıfırla
                </button>
              </div>

              <div className="space-y-1.5">
                {familyBugCode.map((cmd, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <span>
                      {i + 1}. {cmd === 'RIGHT' ? '➡️ Sağa Git' : cmd === 'DOWN' ? '⬇️ Aşağı Git' : cmd === 'LEFT' ? '⬅️ Sola Git' : '⬆️ Yukarı Git'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFamilyBugCode((p) => p.filter((_, idx) => idx !== i))}
                      className="text-rose-600 hover:underline text-xs"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={runFamilyBugMap}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Rotayı Birlikte Test Et
              </button>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950">
                {familyBugFeedback}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GÖREV C: AİLE DESENİMİZ (PNG İNDİRİLEBİLİR) */}
      {activeTab === 'aile-3' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">C. Aile Desenimiz (PNG İndirilebilir)</h2>
            <p className="text-xs text-slate-600 mt-1">
              Şekil, renk ve döngü tekrar sayısını birlikte seçerek ortak aile desenini oluşturun ve
              cihazınıza PNG olarak indirin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 flex justify-center">
              <canvas
                ref={canvasRef}
                width={360}
                height={300}
                className="rounded-2xl border border-slate-200 shadow-xs max-w-full h-auto"
              />
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Desen Başlığı:
                </label>
                <input
                  type="text"
                  value={familyNameTag}
                  maxLength={32}
                  onChange={(e) => setFamilyNameTag(e.target.value.replace(/[<>]/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'star', label: '★ Yıldız' },
                  { id: 'hexagon', label: '⬢ Altıgen' },
                  { id: 'circle', label: '● Daire' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPatternShape(s.id as 'star' | 'hexagon' | 'circle')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                      patternShape === s.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { hex: '#4F46E5', name: 'Mor' },
                  { hex: '#0284C7', name: 'Turkuaz' },
                  { hex: '#F97316', name: 'Turuncu' },
                  { hex: '#10B981', name: 'Yeşil' }
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() =>
                      setPatternColor(c.hex as '#4F46E5' | '#0284C7' | '#F97316' | '#10B981')
                    }
                    className={`py-2 px-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      patternColor === c.hex
                        ? 'ring-2 ring-slate-900 font-bold'
                        : 'border-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Döngü Tekrar Sayısı: {patternRepeat} Kez Tekrarla
                </label>
                <input
                  type="range"
                  min={4}
                  max={16}
                  step={2}
                  value={patternRepeat}
                  onChange={(e) => setPatternRepeat(Number(e.target.value))}
                  className="w-full accent-violet-600 cursor-pointer"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadPatternPng}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Deseni PNG Olarak İndir ve Görevi Tamamla
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTone('success', state.soundEnabled);
                    markFamilyTaskCompleted('aile-3', reflectionC);
                  }}
                  className="py-3 px-4 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-950 font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  Görevi Onayla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
