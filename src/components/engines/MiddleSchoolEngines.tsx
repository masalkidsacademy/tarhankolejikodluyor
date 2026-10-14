import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Droplets,
  Lightbulb,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Trash2
} from 'lucide-react';
import { playTone } from '../../utils/soundAndSpeech';

interface EngineProps {
  taskIndex: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  onTaskComplete: (taskIndex: number) => void;
}

// ============================================================================
// ETKİNLİK 9: SU YOLUNU KODLA (5–6. Sınıf)
// ============================================================================
type WaterCmd =
  | 'MOVE_RIGHT'
  | 'MOVE_DOWN'
  | 'MOVE_UP'
  | 'MOVE_LEFT'
  | 'PLACE_CHANNEL'
  | 'REPEAT_LAST_2_X3';

interface WaterTaskMap {
  title: string;
  source: { x: number; y: number };
  garden: { x: number; y: number };
  rocks: { x: number; y: number }[];
  requiredPath: { x: number; y: number }[];
}

const WATER_MAPS: WaterTaskMap[] = [
  {
    title: '1. Görev: Düz Su Hattı (Kaynak: (0,1) → Bahçe: (4,1))',
    source: { x: 0, y: 1 },
    garden: { x: 4, y: 1 },
    rocks: [{ x: 2, y: 0 }, { x: 2, y: 2 }],
    requiredPath: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 }
    ]
  },
  {
    title: '2. Görev: L Şeklinde Dönüşlü Su Kanalı',
    source: { x: 0, y: 0 },
    garden: { x: 3, y: 3 },
    rocks: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
    requiredPath: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 2 }
    ]
  },
  {
    title: '3. Görev: Kayalık Arazide Basamaklı Kanal',
    source: { x: 0, y: 1 },
    garden: { x: 4, y: 3 },
    rocks: [
      { x: 2, y: 1 },
      { x: 1, y: 3 }
    ],
    requiredPath: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 }
    ]
  }
];

export const WaterChannelEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  const map = WATER_MAPS[Math.min(taskIndex, WATER_MAPS.length - 1)];
  const [commands, setCommands] = useState<WaterCmd[]>([
    'MOVE_RIGHT',
    'PLACE_CHANNEL',
    'REPEAT_LAST_2_X3'
  ]);
  const [builderPos, setBuilderPos] = useState<{ x: number; y: number }>(map.source);
  const [channels, setChannels] = useState<{ x: number; y: number }[]>([]);
  const [waterCells, setWaterCells] = useState<{ x: number; y: number }[]>([]);
  const [leakCoord, setLeakCoord] = useState<{ x: number; y: number } | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'retry'; text: string }>({
    type: 'idle',
    text: 'Önce "Kodu Çalıştır" ile kanalları yerleştir, ardından "Suyu Test Et" ile suyun bahçeye ulaşıp ulaşmadığını kontrol et!'
  });
  const timerRef = useRef<number | null>(null);

  const stopAll = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setActiveIdx(null);
  };

  useEffect(() => {
    stopAll();
    setBuilderPos(map.source);
    setChannels([]);
    setWaterCells([]);
    setLeakCoord(null);
    if (taskIndex === 0) {
      setCommands(['MOVE_RIGHT', 'PLACE_CHANNEL', 'REPEAT_LAST_2_X3']);
    } else {
      setCommands(['MOVE_RIGHT', 'PLACE_CHANNEL']);
    }
    setFeedback({
      type: 'idle',
      text: 'Önce "Kodu Çalıştır" ile kanalları yerleştir, ardından "Suyu Test Et" ile bağlantıyı doğrula.'
    });
    return () => stopAll();
  }, [taskIndex]);

  const runBuilder = () => {
    stopAll();
    if (commands.length === 0) return;

    setIsRunning(true);
    setBuilderPos(map.source);
    setChannels([]);
    setWaterCells([]);
    setLeakCoord(null);

    // Komutları aç (REPEAT_LAST_2_X3 kendisinden önceki 2 komutu 2 kez daha ekler -> toplam 3 kez)
    const expanded: { cmd: WaterCmd; origIdx: number }[] = [];
    commands.forEach((cmd, idx) => {
      if (cmd === 'REPEAT_LAST_2_X3') {
        const len = expanded.length;
        if (len >= 2) {
          const c1 = expanded[len - 2].cmd;
          const c2 = expanded[len - 1].cmd;
          expanded.push({ cmd: c1, origIdx: idx }, { cmd: c2, origIdx: idx });
          expanded.push({ cmd: c1, origIdx: idx }, { cmd: c2, origIdx: idx });
        } else if (len === 1) {
          const c1 = expanded[0].cmd;
          expanded.push({ cmd: c1, origIdx: idx }, { cmd: c1, origIdx: idx });
        }
      } else {
        expanded.push({ cmd, origIdx: idx });
      }
    });

    let cx = map.source.x;
    let cy = map.source.y;
    const built: { x: number; y: number }[] = [];
    let step = 0;

    const tick = () => {
      if (step >= expanded.length) {
        setIsRunning(false);
        setActiveIdx(null);
        setFeedback({
          type: 'idle',
          text: `İnşaat tamamlandı (${built.length} kanal yerleştirildi). Şimdi "Suyu Test Et" düğmesine basarak su akışını kontrol et!`
        });
        return;
      }

      const item = expanded[step];
      setActiveIdx(item.origIdx);
      let nx = cx;
      let ny = cy;
      if (item.cmd === 'MOVE_RIGHT') nx += 1;
      if (item.cmd === 'MOVE_LEFT') nx -= 1;
      if (item.cmd === 'MOVE_DOWN') ny += 1;
      if (item.cmd === 'MOVE_UP') ny -= 1;

      if (item.cmd !== 'PLACE_CHANNEL') {
        if (nx < 0 || nx >= 5 || ny < 0 || ny >= 4) {
          setIsRunning(false);
          playTone('warning', soundEnabled);
          setFeedback({
            type: 'retry',
            text: `İnşaat robotu (${cx},${cy}) koordinatından harita dışına çıkmaya çalıştı!`
          });
          return;
        }
        if (map.rocks.some((r) => r.x === nx && r.y === ny)) {
          setIsRunning(false);
          playTone('warning', soundEnabled);
          setFeedback({
            type: 'retry',
            text: `(${nx},${ny}) koordinatında kaya var! Kanalı kayanın etrafından dolaştır.`
          });
          return;
        }
        cx = nx;
        cy = ny;
        setBuilderPos({ x: cx, y: cy });
      } else {
        if (!built.some((b) => b.x === cx && b.y === cy)) {
          built.push({ x: cx, y: cy });
          setChannels([...built]);
        }
      }

      playTone('step', soundEnabled);
      step += 1;
      timerRef.current = window.setTimeout(tick, 320);
    };

    tick();
  };

  const testWaterFlow = () => {
    stopAll();
    // BFS ile kaynaktan bahçeye kanallar üzerinden bağlantı var mı kontrol et
    const visited: { x: number; y: number }[] = [{ ...map.source }];
    const queue: { x: number; y: number }[] = [{ ...map.source }];
    let reachedGarden = false;
    let lastReached = { ...map.source };

    const isPassable = (x: number, y: number) => {
      if (x === map.garden.x && y === map.garden.y) return true;
      return channels.some((c) => c.x === x && c.y === y);
    };

    while (queue.length > 0) {
      const curr = queue.shift()!;
      lastReached = curr;
      if (curr.x === map.garden.x && curr.y === map.garden.y) {
        reachedGarden = true;
        break;
      }
      const neighbors = [
        { x: curr.x + 1, y: curr.y },
        { x: curr.x - 1, y: curr.y },
        { x: curr.x, y: curr.y + 1 },
        { x: curr.x, y: curr.y - 1 }
      ];
      for (const nb of neighbors) {
        if (
          nb.x >= 0 &&
          nb.x < 5 &&
          nb.y >= 0 &&
          nb.y < 4 &&
          !visited.some((v) => v.x === nb.x && v.y === nb.y) &&
          isPassable(nb.x, nb.y)
        ) {
          visited.push(nb);
          queue.push(nb);
        }
      }
    }

    setWaterCells(visited);
    if (reachedGarden) {
      setLeakCoord(null);
      playTone('success', soundEnabled);
      setFeedback({
        type: 'success',
        text: 'Tebrikler! Su kesintisiz biçimde bahçeye ulaştı ve fidanlar yeşerdi!'
      });
      onTaskComplete(taskIndex);
    } else {
      // İlk eksik gerekli koordinatı bul
      const missing =
        map.requiredPath.find((req) => !channels.some((c) => c.x === req.x && c.y === req.y)) ||
        lastReached;
      setLeakCoord(missing);
      playTone('warning', soundEnabled);
      setFeedback({
        type: 'retry',
        text: `Su bahçeye ulaşamadı! (${missing.x},${missing.y}) koordinatında kanal bağlantısı kesik. Kırmızı işaretli kareye kanal yerleştir.`
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">{map.title}</span>
          <span className="text-xs font-mono text-slate-600">
            Robot Konumu: ({builderPos.x},{builderPos.y})
          </span>
        </div>

        <div className="flex justify-center py-5 bg-amber-50/40 rounded-xl border border-amber-200">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 20 }).map((_, idx) => {
              const x = idx % 5;
              const y = Math.floor(idx / 5);
              const isSource = map.source.x === x && map.source.y === y;
              const isGarden = map.garden.x === x && map.garden.y === y;
              const isRock = map.rocks.some((r) => r.x === x && r.y === y);
              const hasChannel = channels.some((c) => c.x === x && c.y === y);
              const hasWater = waterCells.some((w) => w.x === x && w.y === y);
              const isLeak = leakCoord?.x === x && leakCoord?.y === y;
              const isBuilder = builderPos.x === x && builderPos.y === y;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-15 h-15 sm:w-17 sm:h-17 rounded-xl border-2 flex flex-col items-center justify-center relative transition-colors ${
                    isLeak
                      ? 'bg-rose-100 border-rose-600'
                      : isSource
                      ? 'bg-sky-200 border-sky-600'
                      : isGarden
                      ? hasWater
                        ? 'bg-emerald-200 border-emerald-600'
                        : 'bg-amber-100 border-amber-500'
                      : isRock
                      ? 'bg-slate-300 border-slate-500'
                      : hasWater
                      ? 'bg-sky-100 border-sky-500'
                      : hasChannel
                      ? 'bg-cyan-50 border-cyan-500'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="absolute top-0.5 left-1 text-[9px] font-mono text-slate-400">
                    {x},{y}
                  </span>
                  {isSource && <span className="text-xl" title="Su Kaynağı">💧</span>}
                  {isGarden && <span className="text-xl" title="Bahçe">{hasWater ? '🌳' : '🌱'}</span>}
                  {isRock && <span className="text-xl" title="Kaya">🪨</span>}
                  {!isSource && !isGarden && !isRock && hasChannel && (
                    <span className="text-xs font-bold text-cyan-900">
                      {hasWater ? '🌊 Kanal' : '🧱 Kanal'}
                    </span>
                  )}
                  {isLeak && !hasChannel && (
                    <span className="text-[10px] font-bold text-rose-900">Kesik!</span>
                  )}
                  {isBuilder && (
                    <span className="absolute bottom-0.5 right-1 text-sm" title="İnşaat Robotu">
                      🤖
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Komut Listesi */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700">
              İnşaat Algoritması ({commands.length}/14):
            </span>
            <button
              type="button"
              onClick={() => setCommands((prev) => prev.slice(0, -1))}
              className="text-xs font-bold text-rose-700 hover:underline cursor-pointer"
            >
              Son Komutu Sil
            </button>
          </div>
          <div className="min-h-14 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-1.5">
            {commands.map((cmd, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${
                  activeIdx === idx
                    ? 'bg-amber-100 border-amber-500 text-amber-950'
                    : cmd === 'REPEAT_LAST_2_X3'
                    ? 'bg-violet-100 border-violet-300 text-violet-950'
                    : cmd === 'PLACE_CHANNEL'
                    ? 'bg-cyan-100 border-cyan-300 text-cyan-950'
                    : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                {idx + 1}.{' '}
                {cmd === 'MOVE_RIGHT'
                  ? '➡️ Sağa'
                  : cmd === 'MOVE_DOWN'
                  ? '⬇️ Aşağı'
                  : cmd === 'MOVE_UP'
                  ? '⬆️ Yukarı'
                  : cmd === 'MOVE_LEFT'
                  ? '⬅️ Sola'
                  : cmd === 'PLACE_CHANNEL'
                  ? '🧱 Kanal Yerleştir'
                  : '🔁 Son 2 Adımı 3× Tekrarla'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Kontroller */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-slate-900">Kanal İnşa Blokları</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => commands.length < 14 && setCommands((p) => [...p, 'MOVE_RIGHT'])}
            className="py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 font-bold text-xs cursor-pointer"
          >
            + ➡️ Sağa İlerle
          </button>
          <button
            type="button"
            onClick={() => commands.length < 14 && setCommands((p) => [...p, 'MOVE_DOWN'])}
            className="py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 font-bold text-xs cursor-pointer"
          >
            + ⬇️ Aşağı İlerle
          </button>
          <button
            type="button"
            onClick={() => commands.length < 14 && setCommands((p) => [...p, 'MOVE_UP'])}
            className="py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 font-bold text-xs cursor-pointer"
          >
            + ⬆️ Yukarı İlerle
          </button>
          <button
            type="button"
            onClick={() => commands.length < 14 && setCommands((p) => [...p, 'MOVE_LEFT'])}
            className="py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 font-bold text-xs cursor-pointer"
          >
            + ⬅️ Sola İlerle
          </button>
        </div>

        <button
          type="button"
          onClick={() => commands.length < 14 && setCommands((p) => [...p, 'PLACE_CHANNEL'])}
          className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer"
        >
          + 🧱 Bulunduğun Kareye Kanal Yerleştir
        </button>

        <button
          type="button"
          onClick={() => commands.length < 14 && setCommands((p) => [...p, 'REPEAT_LAST_2_X3'])}
          className="w-full py-2.5 px-4 rounded-xl bg-violet-100 hover:bg-violet-200 border border-violet-300 text-violet-950 font-bold text-xs cursor-pointer"
        >
          + 🔁 Döngü: Son 2 Komutu 3 Kez Tekrarla
        </button>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="button"
            onClick={runBuilder}
            disabled={isRunning}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            1. Kodu Çalıştır
          </button>
          <button
            type="button"
            onClick={testWaterFlow}
            disabled={isRunning}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer"
          >
            <Droplets className="w-4 h-4" />
            2. Suyu Test Et
          </button>
          <button
            type="button"
            onClick={() => {
              stopAll();
              setCommands([]);
              setChannels([]);
              setWaterCells([]);
              setLeakCoord(null);
              setBuilderPos(map.source);
            }}
            className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            Sıfırla
          </button>
        </div>

        <div
          className={`p-3.5 rounded-xl border text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : feedback.type === 'retry'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {feedback.text}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ETKİNLİK 10: OYUN TASARIM ATÖLYESİ (5–6. Sınıf)
// ============================================================================
export const GameWorkshopEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  // Oyun yapılandırma değişkenleri
  const [heroAvatar, setHeroAvatar] = useState<'🤖' | '🚀' | '🐱'>('🤖');
  const [durationSec, setDurationSec] = useState<number>(20);
  const [targetScore, setTargetScore] = useState<number>(6);
  const [stepSpeed, setStepSpeed] = useState<number>(1);
  // Kural blokları
  const [starPoints, setStarPoints] = useState<number>(1);
  const [hazardPenalty, setHazardPenalty] = useState<number>(1);
  const [crystalBonusTime, setCrystalBonusTime] = useState<boolean>(true);

  // Oyun çalışma durumu (6x5 arena)
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState({ x: 2, y: 2 });
  const [star, setStar] = useState({ x: 4, y: 1 });
  const [hazard, setHazard] = useState({ x: 1, y: 3 });
  const [crystal, setCrystal] = useState({ x: 5, y: 4 });
  const [gameResult, setGameResult] = useState<'idle' | 'won' | 'timeout'>('idle');

  const randomCell = (excludeX: number, excludeY: number) => {
    let nx = Math.floor(Math.random() * 6);
    let ny = Math.floor(Math.random() * 5);
    if (nx === excludeX && ny === excludeY) {
      nx = (nx + 2) % 6;
      ny = (ny + 1) % 5;
    }
    return { x: nx, y: ny };
  };

  const startGame = () => {
    playTone('click', soundEnabled);
    setScore(0);
    setTimeLeft(durationSec);
    setPlayer({ x: 2, y: 2 });
    setStar({ x: 4, y: 1 });
    setHazard({ x: 1, y: 3 });
    setCrystal({ x: 5, y: 3 });
    setGameResult('idle');
    setIsPlaying(true);
  };

  const movePlayer = (dx: number, dy: number) => {
    if (!isPlaying) return;
    setPlayer((prev) => {
      const nx = Math.max(0, Math.min(5, prev.x + dx * stepSpeed));
      const ny = Math.max(0, Math.min(4, prev.y + dy * stepSpeed));

      // Çarpışma kurallarını kontrol et
      if (nx === star.x && ny === star.y) {
        playTone('step', soundEnabled);
        setScore((s) => {
          const nextScore = s + starPoints;
          if (nextScore >= targetScore) {
            setIsPlaying(false);
            setGameResult('won');
            playTone('success', soundEnabled);
            onTaskComplete(taskIndex);
          }
          return nextScore;
        });
        setStar(randomCell(nx, ny));
      }

      if (nx === hazard.x && ny === hazard.y) {
        playTone('warning', soundEnabled);
        setScore((s) => Math.max(0, s - hazardPenalty));
        setHazard(randomCell(nx, ny));
      }

      if (nx === crystal.x && ny === crystal.y) {
        playTone('step', soundEnabled);
        if (crystalBonusTime) {
          setTimeLeft((t) => t + 3);
        } else {
          setScore((s) => s + 1);
        }
        setCrystal(randomCell(nx, ny));
      }

      return { x: nx, y: ny };
    });
  };

  // Klavye kontrolleri
  useEffect(() => {
    if (!isPlaying) return;
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        movePlayer(1, 0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, star, hazard, crystal, starPoints, hazardPenalty, crystalBonusTime, stepSpeed, targetScore]);

  // Süre sayacı
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsPlaying(false);
          setGameResult('timeout');
          playTone('warning', soundEnabled);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, soundEnabled]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Oyun Sahnesi */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="text-sm font-bold text-slate-900">
            Puan: <span className="text-emerald-700 tabular-nums">{score}</span> / {targetScore}
          </div>
          <div className="text-sm font-bold text-slate-900">
            Kalan Süre: <span className="text-violet-700 tabular-nums">{timeLeft} sn</span>
          </div>
          <div className="text-xs text-slate-500">
            Adım Hızı: {stepSpeed === 1 ? 'Normal (1 kare)' : 'Hızlı (2 kare)'}
          </div>
        </div>

        {/* 6x5 Oyun Arenası */}
        <div className="flex justify-center py-4 bg-slate-900 rounded-2xl border border-slate-800">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 30 }).map((_, idx) => {
              const x = idx % 6;
              const y = Math.floor(idx / 6);
              const isPlayer = player.x === x && player.y === y;
              const isStar = star.x === x && star.y === y;
              const isHazard = hazard.x === x && hazard.y === y;
              const isCrystal = crystal.x === x && crystal.y === y;

              return (
                <div
                  key={idx}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border flex items-center justify-center text-2xl transition-colors ${
                    isPlayer
                      ? 'bg-sky-500/30 border-sky-400'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  {isPlayer ? (
                    <span aria-label="Oyuncu">{heroAvatar}</span>
                  ) : isStar ? (
                    <span aria-label="Yıldız">⭐</span>
                  ) : isHazard ? (
                    <span aria-label="Engel">🌵</span>
                  ) : isCrystal ? (
                    <span aria-label="Bonus Kristal">💎</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobil ve Masaüstü Dokunmatik Yön Düğmeleri */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <span className="text-xs font-medium text-slate-500">
            Klavye yön tuşları (WASD) veya aşağıdaki ekran düğmeleriyle hareket et:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!isPlaying}
              onClick={() => movePlayer(-1, 0)}
              aria-label="Sola Git"
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={!isPlaying}
                onClick={() => movePlayer(0, -1)}
                aria-label="Yukarı Git"
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold disabled:opacity-40 cursor-pointer"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <button
                type="button"
                disabled={!isPlaying}
                onClick={() => movePlayer(0, 1)}
                aria-label="Aşağı Git"
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold disabled:opacity-40 cursor-pointer"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              disabled={!isPlaying}
              onClick={() => movePlayer(1, 0)}
              aria-label="Sağa Git"
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 font-bold disabled:opacity-40 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {gameResult !== 'idle' && (
          <div
            className={`p-4 rounded-xl border text-sm font-bold ${
              gameResult === 'won'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            {gameResult === 'won'
              ? `Tebrikler! Süre bitmeden ${score} puana ulaşarak kendi tasarladığın oyunu kazandın!`
              : 'Süre doldu! İstersen sağdaki panelden süreyi artırabilir veya yıldız puanını yükselterek tekrar deneyebilirsin.'}
          </div>
        )}
      </div>

      {/* Sağ: Oyun Kuralları ve Değişkenler */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-violet-700" />
          <h4 className="text-base font-bold text-slate-900">Değişkenler ve Kural Blokları</h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Karakter:</label>
            <select
              value={heroAvatar}
              onChange={(e) => setHeroAvatar(e.target.value as '🤖' | '🚀' | '🐱')}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
            >
              <option value="🤖">🤖 Robot Robi</option>
              <option value="🚀">🚀 Uzay Mekikleri</option>
              <option value="🐱">🐱 Süper Kedi</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Süre (Değişken):</label>
            <select
              value={durationSec}
              onChange={(e) => {
                const v = Number(e.target.value);
                setDurationSec(v);
                if (!isPlaying) setTimeLeft(v);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
            >
              <option value={15}>15 Saniye</option>
              <option value={20}>20 Saniye</option>
              <option value={35}>35 Saniye</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hedef Puan:</label>
            <select
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
            >
              <option value={5}>5 Puan</option>
              <option value={6}>6 Puan</option>
              <option value={10}>10 Puan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Karakter Hızı:</label>
            <select
              value={stepSpeed}
              onChange={(e) => setStepSpeed(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
            >
              <option value={1}>Normal (1 Kare)</option>
              <option value={2}>Hızlı (2 Kare)</option>
            </select>
          </div>
        </div>

        {/* Koşul / Kural Blokları */}
        <div className="space-y-2.5 pt-1">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950">
              ⭐ EĞER Yıldıza Değerse Puanı Artır:
            </span>
            <select
              value={starPoints}
              onChange={(e) => setStarPoints(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-amber-300 bg-white text-xs font-bold"
            >
              <option value={1}>+1 Puan</option>
              <option value={2}>+2 Puan</option>
              <option value={3}>+3 Puan</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-950">
              🌵 EĞER Engele Değerse Puanı Azalt:
            </span>
            <select
              value={hazardPenalty}
              onChange={(e) => setHazardPenalty(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-rose-300 bg-white text-xs font-bold"
            >
              <option value={1}>-1 Puan</option>
              <option value={2}>-2 Puan</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
            <span className="text-xs font-bold text-sky-950">
              💎 EĞER Kristale Değerse:
            </span>
            <select
              value={crystalBonusTime ? 'time' : 'score'}
              onChange={(e) => setCrystalBonusTime(e.target.value === 'time')}
              className="px-2 py-1 rounded-lg border border-sky-300 bg-white text-xs font-bold"
            >
              <option value="time">Süreye +3 sn Ekle</option>
              <option value="score">Puana +1 Ekle</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={startGame}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          {isPlaying ? 'Oyunu Yeniden Başlat' : 'Tasarladığın Oyunu Başlat'}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// ETKİNLİK 11: AKILLI OKUL SİMÜLATÖRÜ (7–8. Sınıf)
// ============================================================================
export const SmartSchoolEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  // Sensör değerleri
  const [lightLevel, setLightLevel] = useState<number>(25); // 0 - 100 lüks
  const [motionDetected, setMotionDetected] = useState<boolean>(true);

  // Öğrencinin kurduğu kural
  const [lightThreshold, setLightThreshold] = useState<number>(40);
  const [logicalOp, setLogicalOp] = useState<'AND' | 'OR'>('AND');
  const [testedScenarios, setTestedScenarios] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string>(
    'Sensör kuralını "VE (AND)" operatörüyle kur ve 4 test senaryosunu sırayla dene.'
  );

  const isDark = lightLevel < lightThreshold;
  const lampOn = logicalOp === 'AND' ? isDark && motionDetected : isDark || motionDetected;

  const isRuleOptimal = logicalOp === 'AND' && lightThreshold === 40;

  const runScenario = (idx: number, light: number, motion: boolean) => {
    playTone('click', soundEnabled);
    setLightLevel(light);
    setMotionDetected(motion);

    if (!isRuleOptimal) {
      playTone('warning', soundEnabled);
      setFeedback(
        'Dikkat: Enerji tasarrufu için kuralda ışık eşiği "< 40 lüks" ve mantıksal operatör "VE (AND)" olmalıdır! Önce kuralı düzelt.'
      );
      return;
    }

    const updated = testedScenarios.includes(idx)
      ? testedScenarios
      : [...testedScenarios, idx];
    setTestedScenarios(updated);
    onTaskComplete(0);

    if (updated.length >= 4) {
      playTone('success', soundEnabled);
      setFeedback(
        'Tebrikler! 4 sensör senaryosunun tamamını doğruladın. Lambalar yalnızca karanlıkta ve sınıfta biri varken yanıyor!'
      );
      onTaskComplete(1);
    } else {
      setFeedback(`${updated.length}/4 senaryo test edildi. Diğer senaryo düğmelerine de tıkla!`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sol: Sensörler ve Sınıf Görünümü */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">Akıllı Sınıf Sensör Laboratuvarı</span>
          <span className="text-xs font-mono text-slate-600">
            Çıktı: {lampOn ? '💡 LAMBA AÇIK' : '🌑 LAMBA KAPALI'}
          </span>
        </div>

        {/* Görsel Sınıf Durumu */}
        <div
          className={`p-6 rounded-2xl border-2 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4 ${
            lampOn
              ? 'bg-amber-50 border-amber-400 text-slate-900'
              : lightLevel < 40
              ? 'bg-slate-900 border-slate-700 text-white'
              : 'bg-sky-50 border-sky-200 text-slate-900'
          }`}
        >
          <div className="space-y-1">
            <div className="text-xs font-bold opacity-75">SINIF ORTAM DURUMU</div>
            <div className="text-lg font-bold">
              {lightLevel < 40 ? '🌙 Dış Ortam Karanlık' : '☀️ Dış Ortam Aydınlık'} ({lightLevel} lüks)
            </div>
            <div className="text-sm font-medium">
              Hareket Sensörü: <strong>{motionDetected ? '🏃 Sınıfta Öğrenci Var' : '🚫 Sınıf Boş'}</strong>
            </div>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl bg-white/90 text-slate-900 border border-slate-200 min-w-36">
            <Lightbulb
              className={`w-10 h-10 ${
                lampOn ? 'text-amber-500 fill-amber-400' : 'text-slate-400'
              }`}
            />
            <span className="text-xs font-bold mt-1.5">
              {lampOn ? 'Lamba: AÇIK' : 'Lamba: KAPALI'}
            </span>
          </div>
        </div>

        {/* Sensör Kontrolleri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Işık Seviyesi Sensörü: <span className="font-mono">{lightLevel} lüks</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={lightLevel}
              onChange={(e) => setLightLevel(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>0 (Gece)</span>
              <span>40 (Eşik)</span>
              <span>100 (Gündüz)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-700">Hareket Sensörü (PIR):</span>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setMotionDetected(true)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold cursor-pointer ${
                  motionDetected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                Hareket Var (1)
              </button>
              <button
                type="button"
                onClick={() => setMotionDetected(false)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold cursor-pointer ${
                  !motionDetected
                    ? 'bg-slate-800 text-white'
                    : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                Hareket Yok (0)
              </button>
            </div>
          </div>
        </div>

        {/* 4 Test Senaryosu */}
        <div>
          <div className="text-xs font-bold text-slate-700 mb-2">
            4 Zorunlu Test Senaryosu ({testedScenarios.length}/4 Tamamlandı):
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 1, title: '1. Gündüz & Boş Sınıf', light: 80, motion: false },
              { id: 2, title: '2. Gündüz & Dolu Sınıf', light: 75, motion: true },
              { id: 3, title: '3. Akşam & Boş Sınıf', light: 15, motion: false },
              { id: 4, title: '4. Akşam & Dolu Sınıf', light: 15, motion: true }
            ].map((sc) => {
              const done = testedScenarios.includes(sc.id);
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => runScenario(sc.id, sc.light, sc.motion)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer ${
                    done
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span>{sc.title}</span>
                  {done && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sağ: Kural Kurucu ve Mantıksal Değerlendirme */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-slate-900">Koşul Kuralını Kodla</h4>

        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 font-mono text-xs">
          <div className="text-amber-300 font-bold">EĞER (IF):</div>
          <div className="flex items-center justify-between gap-2 bg-slate-800 p-2.5 rounded-lg">
            <span>Işık Seviyesi &lt;</span>
            <select
              value={lightThreshold}
              onChange={(e) => setLightThreshold(Number(e.target.value))}
              className="bg-slate-700 text-white px-2 py-1 rounded font-bold"
            >
              <option value={40}>40 lüks (Karanlık)</option>
              <option value={90}>90 lüks (Aydınlık)</option>
            </select>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setLogicalOp('AND')}
              className={`px-4 py-1.5 rounded-lg font-bold cursor-pointer ${
                logicalOp === 'AND' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              VE (AND)
            </button>
            <button
              type="button"
              onClick={() => setLogicalOp('OR')}
              className={`px-4 py-1.5 rounded-lg font-bold cursor-pointer ${
                logicalOp === 'OR' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              VEYA (OR)
            </button>
          </div>

          <div className="bg-slate-800 p-2.5 rounded-lg">
            Hareket Sensörü == <strong>HAREKET VAR</strong>
          </div>

          <div className="text-emerald-400 font-bold">
            İSE: Lambayı AÇ | DEĞİLSE: Lambayı KAPAT
          </div>
        </div>

        {/* Canlı Mantıksal Tablo */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="font-bold text-slate-800">Canlı Girdi – Çıktı Analizi:</div>
          <div className="flex justify-between">
            <span>Koşul 1 (Işık &lt; {lightThreshold}):</span>
            <strong className={isDark ? 'text-emerald-700' : 'text-rose-700'}>
              {isDark ? 'DOĞRU (1)' : 'YANLIŞ (0)'}
            </strong>
          </div>
          <div className="flex justify-between">
            <span>Koşul 2 (Hareket Var):</span>
            <strong className={motionDetected ? 'text-emerald-700' : 'text-rose-700'}>
              {motionDetected ? 'DOĞRU (1)' : 'YANLIŞ (0)'}
            </strong>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold">
            <span>Sonuç ({logicalOp === 'AND' ? 'VE' : 'VEYA'}):</span>
            <span className={lampOn ? 'text-amber-700' : 'text-slate-700'}>
              {lampOn ? 'LAMBA AÇIK (1)' : 'LAMBA KAPALI (0)'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 text-xs font-medium text-violet-950">
          {feedback}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ETKİNLİK 12: YAPAY ZEKÂYI TEST EDİYORUM (7–8. Sınıf)
// ============================================================================
interface SampleObject {
  id: string;
  name: string;
  shapeType: 'angular' | 'round'; // Gerçek sınıfı
  edges: number; // 0 (yuvarlak) veya 3, 4, 6 (köşeli)
  colorName: 'Kırmızı' | 'Mavi' | 'Yeşil';
  colorCode: number; // 1, 2, 3
  sizeName: 'Küçük' | 'Büyük';
}

const TRAINING_POOL: SampleObject[] = [
  { id: 'tr-1', name: 'Kırmızı Kare', shapeType: 'angular', edges: 4, colorName: 'Kırmızı', colorCode: 1, sizeName: 'Büyük' },
  { id: 'tr-2', name: 'Mavi Daire', shapeType: 'round', edges: 0, colorName: 'Mavi', colorCode: 2, sizeName: 'Küçük' },
  { id: 'tr-3', name: 'Mavi Üçgen', shapeType: 'angular', edges: 3, colorName: 'Mavi', colorCode: 2, sizeName: 'Küçük' },
  { id: 'tr-4', name: 'Kırmızı Çember', shapeType: 'round', edges: 0, colorName: 'Kırmızı', colorCode: 1, sizeName: 'Büyük' },
  { id: 'tr-5', name: 'Yeşil Altıgen', shapeType: 'angular', edges: 6, colorName: 'Yeşil', colorCode: 3, sizeName: 'Büyük' },
  { id: 'tr-6', name: 'Yeşil Oval', shapeType: 'round', edges: 0, colorName: 'Yeşil', colorCode: 3, sizeName: 'Küçük' }
];

const TEST_OBJECTS: SampleObject[] = [
  { id: 'ts-1', name: 'Mavi Kare (Test)', shapeType: 'angular', edges: 4, colorName: 'Mavi', colorCode: 2, sizeName: 'Büyük' },
  { id: 'ts-2', name: 'Kırmızı Daire (Test)', shapeType: 'round', edges: 0, colorName: 'Kırmızı', colorCode: 1, sizeName: 'Küçük' },
  { id: 'ts-3', name: 'Yeşil Üçgen (Test)', shapeType: 'angular', edges: 3, colorName: 'Yeşil', colorCode: 3, sizeName: 'Büyük' },
  { id: 'ts-4', name: 'Yeşil Halka (Test)', shapeType: 'round', edges: 0, colorName: 'Yeşil', colorCode: 3, sizeName: 'Büyük' },
  { id: 'ts-5', name: 'Kırmızı Altıgen (Test)', shapeType: 'angular', edges: 6, colorName: 'Kırmızı', colorCode: 1, sizeName: 'Küçük' },
  { id: 'ts-6', name: 'Mavi Oval (Test)', shapeType: 'round', edges: 0, colorName: 'Mavi', colorCode: 2, sizeName: 'Büyük' }
];

export const AiClassifierEngine: React.FC<EngineProps> = ({
  soundEnabled,
  onTaskComplete
}) => {
  // Kullanıcının verdiği etiketler: Record<sampleId, 'A' | 'B' | undefined>
  // Başlangıçta yalnızca 2 tek tip örnek etiketli (Kırmızı Kare -> A, Mavi Daire -> B)
  const [labels, setLabels] = useState<Record<string, 'A' | 'B'>>({
    'tr-1': 'A',
    'tr-2': 'B'
  });
  const [hasObservedBias, setHasObservedBias] = useState(false);

  const setSampleLabel = (id: string, group: 'A' | 'B' | null) => {
    playTone('click', soundEnabled);
    setLabels((prev) => {
      const next = { ...prev };
      if (!group) delete next[id];
      else next[id] = group;
      return next;
    });
  };

  // Açıklanabilir en yakın örnek (Nearest Neighbor) sınıflandırması
  // Eğer eğitim kümesinde yalnızca tek renk varsa renk benzerliği modeli yanıltır; çok renkli örnekler eklendiğinde kenar sayısı (köşe) belirleyici olur.
  const labeledSamples = TRAINING_POOL.filter((s) => labels[s.id] !== undefined);

  const classifyTestItem = (testItem: SampleObject) => {
    if (labeledSamples.length === 0) {
      return { predicted: null, nearestSample: null, isCorrect: false };
    }

    // Eğitim verisinde renk çeşitliliği var mı?
    const aColors = new Set(
      labeledSamples.filter((s) => labels[s.id] === 'A').map((s) => s.colorCode)
    );
    const colorWeight = aColors.size <= 1 ? 6 : 1; // Tek tip veri varsa model renge aşırı odaklanır (veri önyargısı simülasyonu)
    const edgeWeight = 2;

    let bestSample = labeledSamples[0];
    let bestDist = Infinity;

    for (const candidate of labeledSamples) {
      const edgeDiff = Math.abs((candidate.edges > 0 ? 4 : 0) - (testItem.edges > 0 ? 4 : 0)) * edgeWeight;
      const colorDiff = (candidate.colorCode === testItem.colorCode ? 0 : 1) * colorWeight;
      const dist = edgeDiff + colorDiff;
      if (dist < bestDist) {
        bestDist = dist;
        bestSample = candidate;
      }
    }

    const predicted = labels[bestSample.id];
    const expected = testItem.shapeType === 'angular' ? 'A' : 'B';
    return {
      predicted,
      nearestSample: bestSample,
      isCorrect: predicted === expected
    };
  };

  const results = TEST_OBJECTS.map((t) => ({
    item: t,
    ...classifyTestItem(t)
  }));

  const correctCount = results.filter((r) => r.isCorrect).length;

  const handleTestEvaluate = () => {
    playTone('step', soundEnabled);
    if (labeledSamples.length <= 2) {
      setHasObservedBias(true);
      onTaskComplete(0);
    }
    if (correctCount >= 5 && labeledSamples.length >= 4) {
      playTone('success', soundEnabled);
      onTaskComplete(0);
      onTaskComplete(1);
    }
  };

  return (
    <div className="space-y-5">
      {/* Şeffaf Eğitim Simülasyonu Açıklaması */}
      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950">
        <strong>Eğitim Simülasyonu Bilgilendirmesi:</strong> Bu çalışma alanı, gerçek bir yapay zekâ
        modelinin eğitim sürecini basitleştiren açıklanabilir bir sınıflandırma simülasyonudur. Sistem,
        etiketlediğiniz eğitim örneklerinin <strong>kenar sayısı ve renk</strong> özelliklerine olan
        yakınlığını hesaplayarak yeni nesneleri tahmin eder.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sol: Eğitim Verisi Etiketleme */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">
              1. Eğitim Verilerini Etiketle ({labeledSamples.length}/6)
            </h4>
            <button
              type="button"
              onClick={() => setLabels({ 'tr-1': 'A', 'tr-2': 'B' })}
              className="text-xs font-bold text-slate-600 hover:underline cursor-pointer"
            >
              Az Veriye Sıfırla
            </button>
          </div>
          <p className="text-xs text-slate-600">
            Hedef Kural: <strong>A Grubu = Köşeli Şekiller</strong> (Kare, Üçgen, Altıgen) ·{' '}
            <strong>B Grubu = Yuvarlak Şekiller</strong> (Daire, Çember, Oval)
          </p>

          <div className="space-y-2.5">
            {TRAINING_POOL.map((sample) => {
              const currentLabel = labels[sample.id];
              return (
                <div
                  key={sample.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{sample.name}</div>
                    <div className="text-[11px] text-slate-500">
                      Özellikler: Renk={sample.colorName} · Köşe={sample.edges} · Boyut={sample.sizeName}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSampleLabel(sample.id, 'A')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        currentLabel === 'A'
                          ? 'bg-violet-700 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      Grup A (Köşeli)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSampleLabel(sample.id, 'B')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        currentLabel === 'B'
                          ? 'bg-amber-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700'
                      }`}
                    >
                      Grup B (Yuvarlak)
                    </button>
                    {currentLabel && (
                      <button
                        type="button"
                        onClick={() => setSampleLabel(sample.id, null)}
                        className="px-2 py-1.5 text-xs text-slate-500 hover:text-rose-700 cursor-pointer"
                      >
                        Çıkar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sağ: Test Sonuçları ve Dayanak Gösterimi */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900">2. Test Nesneleri ve Tahminler</h4>
            <span className="text-sm font-bold text-emerald-700 tabular-nums">
              Doğru Tahmin: {correctCount} / {TEST_OBJECTS.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {results.map((res) => (
              <div
                key={res.item.id}
                className={`p-3 rounded-xl border text-xs ${
                  res.isCorrect
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-300 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{res.item.name}</span>
                  <span>
                    Tahmin:{' '}
                    {res.predicted === 'A'
                      ? 'Grup A (Köşeli)'
                      : res.predicted === 'B'
                      ? 'Grup B (Yuvarlak)'
                      : 'Veri Yok'}{' '}
                    {res.isCorrect ? '✓ Doğru' : '✗ Hatalı'}
                  </span>
                </div>
                {res.nearestSample && (
                  <div className="mt-1 text-[11px] opacity-85">
                    Dayandığı en yakın eğitim örneği: <strong>{res.nearestSample.name}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleTestEvaluate}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
          >
            Modeli Test Et ve Sonucu Kaydet ({correctCount}/6 Doğru)
          </button>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            {labeledSamples.length <= 2
              ? 'Gözlem: Yalnızca 2 örnek etiketliyken model "Mavi Kare"yi sırf mavi olduğu için "Mavi Daire"ye benzetip yanlış sınıflandırıyor! Şimdi diğer örnekleri de etiketleyerek hatayı düzelt.'
              : correctCount >= 5
              ? 'Tebrikler! Farklı renklerde eğitim örnekleri ekleyince model rengin aldatıcı olduğunu anlayıp kenar sayısına odaklandı ve 6/6 doğru tahmin yaptı!'
              : `Şu an ${correctCount}/6 doğru tahmin var. Etiketlerin A (Köşeli) ve B (Yuvarlak) kuralına uygun olduğundan emin ol.`}
          </div>
        </div>
      </div>
    </div>
  );
};
