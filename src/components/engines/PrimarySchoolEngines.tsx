import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CornerUpLeft,
  CornerUpRight,
  MoveUp,
  Play,
  Plus,
  Repeat,
  RotateCcw,
  Sparkles,
  Square,
  Trash2
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { StoryBlock } from '../../types/platform';
import { playTone } from '../../utils/soundAndSpeech';

interface EngineProps {
  taskIndex: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  onTaskComplete: (taskIndex: number) => void;
}

// ============================================================================
// ETKİNLİK 5: HAZİNEYE GİDEN KOD (1–2. Sınıf)
// ============================================================================
type Facing = 'N' | 'E' | 'S' | 'W';
type RelCmd = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT';

interface TreasureMap {
  start: { x: number; y: number; facing: Facing };
  goal: { x: number; y: number };
  obstacles: { x: number; y: number }[];
}

const TREASURE_MAPS: TreasureMap[] = [
  {
    start: { x: 0, y: 1, facing: 'E' },
    goal: { x: 2, y: 2 },
    obstacles: [{ x: 0, y: 2 }, { x: 1, y: 2 }]
  },
  {
    start: { x: 0, y: 3, facing: 'E' },
    goal: { x: 3, y: 1 },
    obstacles: [
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 0, y: 1 }
    ]
  },
  {
    start: { x: 1, y: 1, facing: 'E' },
    goal: { x: 3, y: 3 },
    obstacles: [{ x: 2, y: 2 }] // Üst veya alt yoldan gidilebilir (alternatif çözümler geçerli)
  },
  {
    start: { x: 0, y: 4, facing: 'N' },
    goal: { x: 4, y: 0 },
    obstacles: [
      { x: 1, y: 4 },
      { x: 1, y: 3 },
      { x: 3, y: 1 },
      { x: 3, y: 2 }
    ]
  }
];

function rotateFacing(facing: Facing, turn: 'LEFT' | 'RIGHT'): Facing {
  const order: Facing[] = ['N', 'E', 'S', 'W'];
  const idx = order.indexOf(facing);
  return turn === 'RIGHT' ? order[(idx + 1) % 4] : order[(idx + 3) % 4];
}

function stepForward(x: number, y: number, facing: Facing): { x: number; y: number } {
  if (facing === 'N') return { x, y: y - 1 };
  if (facing === 'S') return { x, y: y + 1 };
  if (facing === 'E') return { x: x + 1, y };
  return { x: x - 1, y };
}

function getFacingLabel(f: Facing): string {
  if (f === 'N') return 'Yukarı (Kuzey)';
  if (f === 'S') return 'Aşağı (Güney)';
  if (f === 'E') return 'Sağa (Doğu)';
  return 'Sola (Batı)';
}

export const TreasureRobotEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  const map = TREASURE_MAPS[Math.min(taskIndex, TREASURE_MAPS.length - 1)];
  const [commands, setCommands] = useState<RelCmd[]>([]);
  const [robot, setRobot] = useState(map.start);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [errorIdx, setErrorIdx] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'retry'; text: string }>({
    type: 'idle',
    text: 'Robotun üzerindeki beyaz ok baktığı yönü gösterir. "İleri" komutu robotu baktığı yönde 1 kare ilerletir.'
  });
  const timerRef = useRef<number | null>(null);

  const stopRun = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setActiveIdx(null);
  };

  useEffect(() => {
    stopRun();
    setCommands([]);
    setRobot(map.start);
    setErrorIdx(null);
    setFeedback({
      type: 'idle',
      text: 'Robotun üzerindeki beyaz ok baktığı yönü gösterir. "İleri" komutu robotu baktığı yönde 1 kare ilerletir.'
    });
    return () => stopRun();
  }, [taskIndex]);

  const addCmd = (cmd: RelCmd) => {
    if (isRunning || commands.length >= 14) return;
    playTone('click', soundEnabled);
    setErrorIdx(null);
    setRobot(map.start);
    setCommands((prev) => [...prev, cmd]);
  };

  const runCode = () => {
    stopRun();
    if (commands.length === 0) {
      playTone('warning', soundEnabled);
      setFeedback({ type: 'retry', text: 'Önce komut bloklarından ekleyerek bir algoritma oluşturmalısın.' });
      return;
    }

    setIsRunning(true);
    setErrorIdx(null);
    setRobot(map.start);

    let cx = map.start.x;
    let cy = map.start.y;
    let cf: Facing = map.start.facing;
    let step = 0;

    const tick = () => {
      if (step >= commands.length) {
        setIsRunning(false);
        setActiveIdx(null);
        if (cx === map.goal.x && cy === map.goal.y) {
          playTone('success', soundEnabled);
          setFeedback({
            type: 'success',
            text: 'Harika! Hazine sandığına ulaştın! Geçerli rotayı başarıyla kodladın.'
          });
          onTaskComplete(taskIndex);
        } else {
          playTone('warning', soundEnabled);
          setFeedback({
            type: 'retry',
            text: 'Robot komutları tamamladı ancak henüz hazine karesine ulaşmadı. Son adımları kontrol et!'
          });
        }
        return;
      }

      setActiveIdx(step);
      const cmd = commands[step];
      if (cmd === 'TURN_LEFT') {
        cf = rotateFacing(cf, 'LEFT');
        setRobot({ x: cx, y: cy, facing: cf });
        playTone('step', soundEnabled);
      } else if (cmd === 'TURN_RIGHT') {
        cf = rotateFacing(cf, 'RIGHT');
        setRobot({ x: cx, y: cy, facing: cf });
        playTone('step', soundEnabled);
      } else {
        const next = stepForward(cx, cy, cf);
        if (next.x < 0 || next.x >= 5 || next.y < 0 || next.y >= 5) {
          playTone('warning', soundEnabled);
          setIsRunning(false);
          setErrorIdx(step);
          setFeedback({
            type: 'retry',
            text: `${step + 1}. komutta (İleri) robot harita sınırına çarptı! İşaretli adımı değiştirmeyi dene.`
          });
          return;
        }
        if (map.obstacles.some((o) => o.x === next.x && o.y === next.y)) {
          playTone('warning', soundEnabled);
          setIsRunning(false);
          setErrorIdx(step);
          setFeedback({
            type: 'retry',
            text: `${step + 1}. komutta (İleri) kayaya çarptı! İlerisindeki kayadan kaçınmak için önce dönmelisin.`
          });
          return;
        }
        cx = next.x;
        cy = next.y;
        setRobot({ x: cx, y: cy, facing: cf });
        playTone('step', soundEnabled);
      }

      step += 1;
      timerRef.current = window.setTimeout(tick, 480);
    };

    timerRef.current = window.setTimeout(tick, 250);
  };

  const rotationDeg =
    robot.facing === 'N' ? 0 : robot.facing === 'E' ? 90 : robot.facing === 'S' ? 180 : 270;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-sm font-bold text-slate-900">5×5 Hazine Adası</span>
          <span className="text-xs font-medium text-sky-800">
            Robotun Baktığı Yön: <strong>{getFacingLabel(robot.facing)}</strong>
          </span>
        </div>

        {taskIndex === 0 && (
          <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950">
            <strong>Görsel Rehber:</strong> Robotun üzerindeki beyaz üçgen ok ne tarafa bakıyorsa{' '}
            <strong>"İleri"</strong> komutu robotu o yöne götürür.{' '}
            <strong>"Sağa Dön / Sola Dön"</strong> ise robotu olduğu karede döndürür.
          </div>
        )}

        <div className="flex justify-center py-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => {
              const x = idx % 5;
              const y = Math.floor(idx / 5);
              const isRobot = robot.x === x && robot.y === y;
              const isGoal = map.goal.x === x && map.goal.y === y;
              const isObstacle = map.obstacles.some((o) => o.x === x && o.y === y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center relative ${
                    isRobot
                      ? 'bg-sky-100 border-sky-600'
                      : isGoal
                      ? 'bg-amber-50 border-amber-400'
                      : isObstacle
                      ? 'bg-slate-200 border-slate-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {isObstacle && <span className="text-xl" aria-label="Kaya">🪨</span>}
                  {isGoal && !isRobot && <span className="text-2xl" aria-label="Hazine">💎</span>}
                  {isRobot && (
                    <div
                      className="w-11 h-11 rounded-full bg-sky-700 text-white flex items-center justify-center transition-transform duration-300 shadow-xs"
                      style={{ transform: `rotate(${rotationDeg}deg)` }}
                      aria-label={`Robot, bakış yönü ${getFacingLabel(robot.facing)}`}
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3L20 19H4L12 3Z" fill="white" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Komut Dizisi */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              Algoritma Blokları ({commands.length}/14):
            </span>
            <button
              type="button"
              disabled={isRunning || commands.length === 0}
              onClick={() => {
                setErrorIdx(null);
                setRobot(map.start);
                setCommands((prev) => prev.slice(0, -1));
              }}
              className="text-xs font-bold text-rose-700 hover:underline disabled:opacity-40 cursor-pointer"
            >
              Son Bloğu Sil
            </button>
          </div>
          <div className="min-h-14 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-2">
            {commands.length === 0 ? (
              <span className="text-xs text-slate-500">
                Sağdaki "İleri", "Sola Dön" ve "Sağa Dön" bloklarını ekle.
              </span>
            ) : (
              commands.map((cmd, idx) => (
                <div
                  key={idx}
                  className={`px-2.5 py-1.5 rounded-lg border-2 text-xs font-bold flex items-center gap-1 ${
                    errorIdx === idx
                      ? 'bg-rose-100 border-rose-600 text-rose-950'
                      : activeIdx === idx
                      ? 'bg-amber-100 border-amber-500 text-amber-950 scale-105'
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <span className="text-slate-400 tabular-nums">{idx + 1}.</span>
                  <span>
                    {cmd === 'FORWARD'
                      ? '⬆️ İleri'
                      : cmd === 'TURN_LEFT'
                      ? '↺ Sola Dön'
                      : '↻ Sağa Dön'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sağ Kontroller */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-slate-900">Komut Blokları</h4>
        <div className="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            disabled={isRunning}
            onClick={() => addCmd('FORWARD')}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-950 font-bold text-sm cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <MoveUp className="w-5 h-5" /> İleri Git (Baktığı Yönde 1 Kare)
            </span>
            <Plus className="w-4 h-4" />
          </button>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isRunning}
              onClick={() => addCmd('TURN_LEFT')}
              className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-violet-50 hover:bg-violet-100 border-2 border-violet-300 text-violet-950 font-bold text-sm cursor-pointer"
            >
              <CornerUpLeft className="w-5 h-5" /> Sola Dön
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => addCmd('TURN_RIGHT')}
              className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-violet-50 hover:bg-violet-100 border-2 border-violet-300 text-violet-950 font-bold text-sm cursor-pointer"
            >
              <CornerUpRight className="w-5 h-5" /> Sağa Dön
            </button>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={runCode}
            disabled={isRunning}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Çalıştır
          </button>
          <button
            type="button"
            onClick={() => {
              stopRun();
              setCommands([]);
              setRobot(map.start);
              setErrorIdx(null);
            }}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </button>
        </div>

        <div
          className={`p-4 rounded-xl border text-sm font-medium ${
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
// ETKİNLİK 6: DÖNGÜYLE DESEN ÇİZ (1–2. Sınıf)
// ============================================================================
type StampType = 'STAR' | 'CIRCLE' | 'TRIANGLE' | 'DIAMOND';

const STAMP_INFO: Record<StampType, { label: string; symbol: string; color: string }> = {
  STAR: { label: 'Yıldız', symbol: '★', color: 'text-amber-500 bg-amber-50 border-amber-300' },
  CIRCLE: { label: 'Daire', symbol: '●', color: 'text-rose-600 bg-rose-50 border-rose-300' },
  TRIANGLE: { label: 'Üçgen', symbol: '▲', color: 'text-emerald-600 bg-emerald-50 border-emerald-300' },
  DIAMOND: { label: 'Elmas', symbol: '◆', color: 'text-sky-600 bg-sky-50 border-sky-300' }
};

const LOOP_PATTERN_TARGETS: StampType[][] = [
  ['STAR', 'CIRCLE', 'STAR', 'CIRCLE', 'STAR', 'CIRCLE'],
  ['STAR', 'CIRCLE', 'STAR', 'CIRCLE', 'STAR', 'CIRCLE'],
  [
    'TRIANGLE',
    'DIAMOND',
    'STAR',
    'TRIANGLE',
    'DIAMOND',
    'STAR',
    'TRIANGLE',
    'DIAMOND',
    'STAR',
    'TRIANGLE',
    'DIAMOND',
    'STAR'
  ]
];

export const LoopPatternEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  const targetPattern = LOOP_PATTERN_TARGETS[Math.min(taskIndex, LOOP_PATTERN_TARGETS.length - 1)];
  const isFlatTask = taskIndex === 0;

  const [flatStamps, setFlatStamps] = useState<StampType[]>([]);
  const [loopBody, setLoopBody] = useState<StampType[]>(['STAR', 'CIRCLE']);
  const [repeatCount, setRepeatCount] = useState<number>(3);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'retry'; text: string }>({
    type: 'idle',
    text: isFlatTask
      ? '1. Görevde şekilleri tek tek ekleyerek 6 adımlık hedef deseni oluştur.'
      : 'Şimdi "Tekrar Et" döngü bloğunun içine tekrar eden şekilleri koy ve tekrar sayısını ayarla!'
  });

  useEffect(() => {
    if (taskIndex === 0) {
      setFlatStamps([]);
      setFeedback({
        type: 'idle',
        text: '1. Görevde şekilleri tek tek ekleyerek 6 adımlık hedef deseni oluştur.'
      });
    } else if (taskIndex === 1) {
      setLoopBody(['STAR', 'CIRCLE']);
      setRepeatCount(3);
      setFeedback({
        type: 'idle',
        text: 'Bak! 6 ayrı blok yerine 1 döngü bloğuyla aynı deseni üretebilirsin. Kontrol Et düğmesine bas!'
      });
    } else {
      setLoopBody(['TRIANGLE', 'DIAMOND']);
      setRepeatCount(2);
      setFeedback({
        type: 'idle',
        text: 'Hedef desendeki 12 şekli üretmek için döngü içindeki şekilleri ve tekrar sayısını (4 kez) ayarla!'
      });
    }
  }, [taskIndex, isFlatTask]);

  const generatedPattern: StampType[] = isFlatTask
    ? flatStamps
    : Array.from({ length: repeatCount }).flatMap(() => loopBody);

  const verifyPattern = () => {
    const matches =
      generatedPattern.length === targetPattern.length &&
      generatedPattern.every((val, i) => val === targetPattern[i]);

    if (matches) {
      playTone('success', soundEnabled);
      setFeedback({
        type: 'success',
        text: isFlatTask
          ? 'Tebrikler! 6 ayrı komut bloğuyla deseni çizdin. Şimdi 2. Göreve geçip aynı işi döngüyle çok daha kısa yapalım!'
          : `Harika! ${targetPattern.length} şekillik deseni döngü bloğu sayesinde çok daha az kodla ürettin!`
      });
      onTaskComplete(taskIndex);
    } else {
      playTone('warning', soundEnabled);
      setFeedback({
        type: 'retry',
        text: `Oluşan desen (${generatedPattern.length} şekil) hedef desenle (${targetPattern.length} şekil) henüz aynı değil. Şekil sırasını veya tekrar sayısını kontrol et!`
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div>
          <span className="text-xs font-bold text-slate-500">HEDEF DESEN ({targetPattern.length} Şekil):</span>
          <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-2">
            {targetPattern.map((st, idx) => (
              <div
                key={idx}
                className={`px-2.5 py-1.5 rounded-lg border text-sm font-bold flex items-center gap-1 ${STAMP_INFO[st].color}`}
              >
                <span>{STAMP_INFO[st].symbol}</span>
                <span className="text-xs">{STAMP_INFO[st].label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-700">
              SENİN KODUNUN ÜRETTİĞİ DESEN ({generatedPattern.length} Şekil):
            </span>
            <span className="text-xs font-semibold text-slate-600">
              {isFlatTask
                ? `Kullanılan Blok: ${flatStamps.length}`
                : `1 Döngü Bloğu + ${loopBody.length} İç Şekil`}
            </span>
          </div>
          <div className="mt-2 min-h-16 p-3 rounded-xl bg-violet-50/50 border border-violet-200 flex flex-wrap gap-2">
            {generatedPattern.length === 0 ? (
              <span className="text-xs text-slate-500">Sağdan şekil eklediğinde desenin burada anında görünür.</span>
            ) : (
              generatedPattern.map((st, idx) => (
                <div
                  key={idx}
                  className={`px-2.5 py-1.5 rounded-lg border text-sm font-bold flex items-center gap-1 ${STAMP_INFO[st].color}`}
                >
                  <span>{STAMP_INFO[st].symbol}</span>
                  <span className="text-xs">{STAMP_INFO[st].label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-slate-900">
          {isFlatTask ? 'Düz Komutlarla Ekle' : 'Döngü Bloğunu Ayarla'}
        </h4>

        {!isFlatTask && (
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                <Repeat className="w-4 h-4" /> Tekrar Sayısı:
              </span>
              <div className="flex items-center gap-1.5">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      playTone('click', soundEnabled);
                      setRepeatCount(n);
                    }}
                    className={`w-8 h-8 rounded-lg font-bold text-xs cursor-pointer ${
                      repeatCount === n
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-amber-300 text-amber-900'
                    }`}
                  >
                    {n}×
                  </button>
                ))}
              </div>
            </div>
            <div className="text-xs text-amber-900">
              Döngü İçindeki Şekiller ({loopBody.length}/4):
            </div>
            <div className="flex flex-wrap gap-1.5 bg-white p-2.5 rounded-lg border border-amber-200 min-h-11">
              {loopBody.map((st, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded border text-xs font-bold ${STAMP_INFO[st].color}`}
                >
                  {STAMP_INFO[st].symbol} {STAMP_INFO[st].label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          {(Object.keys(STAMP_INFO) as StampType[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                playTone('click', soundEnabled);
                if (isFlatTask) {
                  if (flatStamps.length < 12) setFlatStamps((prev) => [...prev, st]);
                } else {
                  if (loopBody.length < 4) setLoopBody((prev) => [...prev, st]);
                }
              }}
              className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${STAMP_INFO[st].color}`}
            >
              <span className="text-base">{STAMP_INFO[st].symbol}</span>
              <span>+ {STAMP_INFO[st].label}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={verifyPattern}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Deseni Kontrol Et
          </button>
          <button
            type="button"
            onClick={() => {
              if (isFlatTask) setFlatStamps((prev) => prev.slice(0, -1));
              else setLoopBody((prev) => prev.slice(0, -1));
            }}
            className="py-3 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold cursor-pointer"
          >
            Sil
          </button>
          <button
            type="button"
            onClick={() => {
              if (isFlatTask) setFlatStamps([]);
              else setLoopBody([]);
            }}
            className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
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
// ETKİNLİK 7: HİKÂYEMİ KODLUYORUM (3–4. Sınıf)
// ============================================================================
const CHARACTERS = {
  robot: { name: 'Robi', emoji: '🤖' },
  astronot: { name: 'Astronot Ela', emoji: '👩‍🚀' },
  tilki: { name: 'Bilge Tilki', emoji: '🦊' },
  'bilim-insani': { name: 'Mucit Can', emoji: '🧑‍🔬' }
};

const BACKGROUNDS = {
  'okul-bahcesi': { name: 'Okul Bahçesi', classes: 'from-sky-100 via-emerald-50 to-emerald-100' },
  'uzay-ussu': { name: 'Uzay Üssü', classes: 'from-indigo-950 via-violet-900 to-slate-900 text-white' },
  kutuphane: { name: 'Bilim Kütüphanesi', classes: 'from-amber-50 via-orange-50 to-yellow-100' },
  orman: { name: 'Yeşil Orman', classes: 'from-emerald-100 via-teal-50 to-green-200' }
};

export const StoryEditorEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  const { state, saveStoryProject } = useProgress();
  const saved = state.storyProject;

  const [character, setCharacter] = useState<keyof typeof CHARACTERS>(
    saved?.character || 'robot'
  );
  const [bg, setBg] = useState<keyof typeof BACKGROUNDS>(saved?.background || 'okul-bahcesi');
  const [blocks, setBlocks] = useState<StoryBlock[]>(
    saved?.blocks || [
      { id: 's1', type: 'start' },
      { id: 's2', type: 'say', value: 'Merhaba Tarhan Koleji!' },
      { id: 's3', type: 'move_right' },
      { id: 's4', type: 'bg_change', value: 'uzay-ussu' },
      { id: 's5', type: 'repeat_2' }
    ]
  );

  // Sahne çalışma durumu
  const [stageX, setStageX] = useState<number>(0);
  const [stageBg, setStageBg] = useState<keyof typeof BACKGROUNDS>(bg);
  const [speechBubble, setSpeechBubble] = useState<string>('');
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customText, setCustomText] = useState('Kodlama ile hayallerimizi üretiyoruz!');
  const [feedback, setFeedback] = useState<string>(
    'Hikâye bloklarını sırala, konuşma metnini özelleştir ve "Hikâyeyi Oynat" düğmesine bas!'
  );
  const timerRef = useRef<number | null>(null);

  const stopStory = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setActiveBlockId(null);
  };

  useEffect(() => {
    setStageBg(bg);
  }, [bg]);

  useEffect(() => {
    return () => stopStory();
  }, []);

  const persistProject = (
    nextChar = character,
    nextBg = bg,
    nextBlocks = blocks
  ) => {
    saveStoryProject({
      character: nextChar,
      background: nextBg,
      blocks: nextBlocks,
      updatedAt: new Date().toISOString()
    });
  };

  const addBlock = (type: StoryBlock['type'], value?: string) => {
    if (isPlaying || blocks.length >= 12) return;
    playTone('click', soundEnabled);
    const next: StoryBlock[] = [
      ...blocks,
      { id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`, type, value }
    ];
    setBlocks(next);
    persistProject(character, bg, next);
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    if (isPlaying) return;
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const copy = [...blocks];
    const [item] = copy.splice(idx, 1);
    copy.splice(target, 0, item);
    setBlocks(copy);
    persistProject(character, bg, copy);
  };

  const removeBlock = (idx: number) => {
    if (isPlaying) return;
    const copy = blocks.filter((_, i) => i !== idx);
    setBlocks(copy);
    persistProject(character, bg, copy);
  };

  const playStory = () => {
    stopStory();
    if (blocks.length === 0 || blocks[0].type !== 'start') {
      playTone('warning', soundEnabled);
      setFeedback('Hikâyenin başlaması için en üstte "Başlayınca" bloğu bulunmalıdır!');
      return;
    }

    setIsPlaying(true);
    setStageX(0);
    setStageBg(bg);
    setSpeechBubble('');

    // Tekrar et bloğu varsa kendisinden önceki hareketi/konuşmayı 2 kez tekrarlar
    const expanded: StoryBlock[] = [];
    blocks.forEach((b) => {
      expanded.push(b);
      if (b.type === 'repeat_2' && expanded.length >= 2) {
        const prev = expanded[expanded.length - 2];
        if (prev && prev.type !== 'start') {
          expanded.push(prev);
        }
      }
    });

    let step = 0;
    const runNext = () => {
      if (step >= expanded.length) {
        setIsPlaying(false);
        setActiveBlockId(null);
        playTone('success', soundEnabled);
        const hasSay = blocks.some((b) => b.type === 'say');
        const hasMove = blocks.some((b) => b.type === 'move_right' || b.type === 'move_left');
        const hasBg = blocks.some((b) => b.type === 'bg_change');
        if (hasSay && hasMove) {
          onTaskComplete(0);
        }
        if (hasSay && hasMove && hasBg) {
          onTaskComplete(1);
        }
        setFeedback('Hikâye başarıyla sahnelendi ve tarayıcı hafızasına kaydedildi!');
        return;
      }

      const curr = expanded[step];
      setActiveBlockId(curr.id);
      playTone('step', soundEnabled);

      if (curr.type === 'move_right') {
        setStageX((x) => Math.min(x + 48, 110));
      } else if (curr.type === 'move_left') {
        setStageX((x) => Math.max(x - 48, -110));
      } else if (curr.type === 'say') {
        setSpeechBubble(curr.value || 'Merhaba!');
      } else if (curr.type === 'bg_change') {
        const nextBgKey = (curr.value as keyof typeof BACKGROUNDS) || 'uzay-ussu';
        setStageBg(nextBgKey);
      }

      step += 1;
      timerRef.current = window.setTimeout(runNext, curr.type === 'wait' ? 1000 : 750);
    };

    runNext();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sahne Alanı */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">Hikâye Sahnesi</span>
          <span className="text-xs text-slate-500">
            Sahne: {BACKGROUNDS[stageBg].name}
          </span>
        </div>

        <div
          className={`h-64 rounded-2xl bg-gradient-to-b ${BACKGROUNDS[stageBg].classes} border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden p-4 transition-colors duration-500`}
        >
          {speechBubble && (
            <div className="mb-3 px-4 py-2 rounded-2xl bg-white text-slate-900 text-sm font-bold shadow-sm border border-slate-200 max-w-xs text-center">
              “{speechBubble}”
            </div>
          )}
          <div
            className="text-6xl transition-transform duration-300 select-none"
            style={{ transform: `translateX(${stageX}px)` }}
            aria-label={CHARACTERS[character].name}
          >
            {CHARACTERS[character].emoji}
          </div>
          <span className="mt-2 text-xs font-bold px-2.5 py-1 rounded bg-black/20 backdrop-blur-xs">
            {CHARACTERS[character].name}
          </span>
        </div>

        {/* Karakter ve Başlangıç Sahnesi Seçimi */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Karakter Seç:</label>
            <select
              value={character}
              onChange={(e) => {
                const val = e.target.value as keyof typeof CHARACTERS;
                setCharacter(val);
                persistProject(val, bg, blocks);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-900"
            >
              {Object.entries(CHARACTERS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.emoji} {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Başlangıç Sahnesi:</label>
            <select
              value={bg}
              onChange={(e) => {
                const val = e.target.value as keyof typeof BACKGROUNDS;
                setBg(val);
                persistProject(character, val, blocks);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-900"
            >
              {Object.entries(BACKGROUNDS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={playStory}
            disabled={isPlaying}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Hikâyeyi Oynat
          </button>
          <button
            type="button"
            onClick={stopStory}
            disabled={!isPlaying}
            className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs cursor-pointer disabled:opacity-40"
          >
            <Square className="w-4 h-4" />
            Durdur
          </button>
          <button
            type="button"
            onClick={() => {
              stopStory();
              setStageX(0);
              setStageBg(bg);
              setSpeechBubble('');
            }}
            className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Başa Sar
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
          {feedback}
        </div>
      </div>

      {/* Blok Editörü */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900">Hikâye Blokları Ekle</h4>
          <button
            type="button"
            onClick={() => {
              stopStory();
              const sample: StoryBlock[] = [
                { id: 'smp-1', type: 'start' },
                { id: 'smp-2', type: 'say', value: 'Merhaba! Ben Robi, maceraya hazır mısın?' },
                { id: 'smp-3', type: 'move_right' },
                { id: 'smp-4', type: 'bg_change', value: 'uzay-ussu' },
                { id: 'smp-5', type: 'say', value: 'Uzay üssüne ışınlandık!' },
                { id: 'smp-6', type: 'repeat_2' }
              ];
              setBlocks(sample);
              persistProject(character, bg, sample);
            }}
            className="text-xs font-bold text-violet-700 hover:underline cursor-pointer"
          >
            Örnek Hikâye Yükle
          </button>
        </div>

        {/* Konuşma Bloğu Ekleme */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customText}
            maxLength={60}
            onChange={(e) => setCustomText(e.target.value.replace(/[<>]/g, ''))}
            placeholder="Karakter ne söylesin?"
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
          />
          <button
            type="button"
            onClick={() => addBlock('say', customText || 'Merhaba!')}
            className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
          >
            + Konuş Ekle
          </button>
        </div>

        {/* Diğer Bloklar */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addBlock('start')}
            className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold cursor-pointer"
          >
            + Başlayınca
          </button>
          <button
            type="button"
            onClick={() => addBlock('move_right')}
            className="px-3 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-950 text-xs font-bold cursor-pointer"
          >
            + Sağa Git
          </button>
          <button
            type="button"
            onClick={() => addBlock('move_left')}
            className="px-3 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-950 text-xs font-bold cursor-pointer"
          >
            + Sola Git
          </button>
          <button
            type="button"
            onClick={() => addBlock('wait')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
          >
            + Bekle (1 sn)
          </button>
          <button
            type="button"
            onClick={() => addBlock('bg_change', 'uzay-ussu')}
            className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-bold cursor-pointer"
          >
            + Sahne: Uzay Üssü
          </button>
          <button
            type="button"
            onClick={() => addBlock('bg_change', 'orman')}
            className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-bold cursor-pointer"
          >
            + Sahne: Orman
          </button>
          <button
            type="button"
            onClick={() => addBlock('repeat_2')}
            className="px-3 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-950 text-xs font-bold cursor-pointer"
          >
            + Tekrar Et (2×)
          </button>
        </div>

        {/* Kod Sırası */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {blocks.map((b, idx) => {
            const isCurr = activeBlockId === b.id;
            return (
              <div
                key={b.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border-2 text-xs font-bold ${
                  isCurr
                    ? 'bg-amber-100 border-amber-500 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-400 tabular-nums">{idx + 1}.</span>
                  {b.type === 'start' && <span className="text-amber-800">🚩 Başlayınca</span>}
                  {b.type === 'move_right' && <span className="text-sky-800">➡️ Sağa Git</span>}
                  {b.type === 'move_left' && <span className="text-sky-800">⬅️ Sola Git</span>}
                  {b.type === 'wait' && <span>⏳ Bekle (1 sn)</span>}
                  {b.type === 'say' && (
                    <span className="text-violet-800 truncate">💬 Konuş: “{b.value}”</span>
                  )}
                  {b.type === 'bg_change' && (
                    <span className="text-emerald-800">
                      🏞️ Arka Planı Değiştir: {BACKGROUNDS[(b.value as keyof typeof BACKGROUNDS) || 'uzay-ussu'].name}
                    </span>
                  )}
                  {b.type === 'repeat_2' && (
                    <span className="text-orange-800">🔁 Önceki Adımı Tekrar Et (2×)</span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, -1)}
                    aria-label="Yukarı Taşı"
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 1)}
                    aria-label="Aşağı Taşı"
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(idx)}
                    aria-label="Bloğu Sil"
                    className="p-1 hover:bg-rose-100 text-rose-700 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ETKİNLİK 8: HATA DEDEKTİFİ (3–4. Sınıf) — 5 Senaryo
// ============================================================================
type GridDir = 'RIGHT' | 'LEFT' | 'UP' | 'DOWN';

interface BugScenario {
  title: string;
  start: { x: number; y: number };
  goal: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  buggyCode: GridDir[];
  predictionOptions: string[];
  correctPredictionIndex: number;
}

const BUG_SCENARIOS: BugScenario[] = [
  {
    title: 'Senaryo 1: Eksik Adım Vakası',
    start: { x: 0, y: 1 },
    goal: { x: 3, y: 1 },
    obstacles: [{ x: 1, y: 0 }, { x: 2, y: 2 }],
    buggyCode: ['RIGHT', 'RIGHT'],
    predictionOptions: [
      'Hedefe 1 kare kala erken duracak',
      'Engele çarpacak',
      'Harita dışına çıkacak'
    ],
    correctPredictionIndex: 0
  },
  {
    title: 'Senaryo 2: Yanlış Yön Hatası',
    start: { x: 0, y: 0 },
    goal: { x: 2, y: 2 },
    obstacles: [{ x: 2, y: 0 }],
    buggyCode: ['RIGHT', 'UP', 'DOWN', 'RIGHT'],
    predictionOptions: [
      '2. adımda yukarı gidip harita sınırına çarpacak',
      'Doğrudan hedefe ulaşacak',
      'Başlangıç karesinde kalacak'
    ],
    correctPredictionIndex: 0
  },
  {
    title: 'Senaryo 3: Fazla Komut Tuzağı',
    start: { x: 0, y: 2 },
    goal: { x: 2, y: 1 },
    obstacles: [{ x: 3, y: 1 }],
    buggyCode: ['RIGHT', 'RIGHT', 'UP', 'RIGHT'],
    predictionOptions: [
      'Hedefe ulaştıktan sonra durmayıp sağdaki kayaya çarpacak',
      'Hiç hareket etmeyecek',
      'Aşağı inecek'
    ],
    correctPredictionIndex: 0
  },
  {
    title: 'Senaryo 4: Sırası Karışmış Algoritma',
    start: { x: 0, y: 0 },
    goal: { x: 2, y: 1 },
    obstacles: [{ x: 0, y: 1 }],
    buggyCode: ['DOWN', 'RIGHT', 'RIGHT'],
    predictionOptions: [
      'İlk adımda hemen altındaki kayaya çarpacak',
      'Hedefe sorunsuz varacak',
      'Sola gidecek'
    ],
    correctPredictionIndex: 0
  },
  {
    title: 'Senaryo 5: Usta Dedektif Görevi',
    start: { x: 0, y: 3 },
    goal: { x: 3, y: 0 },
    obstacles: [
      { x: 1, y: 3 },
      { x: 2, y: 1 }
    ],
    buggyCode: ['RIGHT', 'UP', 'UP', 'RIGHT'],
    predictionOptions: [
      'İlk adımda sağdaki engele çarpacak',
      'Hedefe ulaşacak',
      'Aşağıya düşecek'
    ],
    correctPredictionIndex: 0
  }
];

export const BugDetectiveEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  const scenario = BUG_SCENARIOS[Math.min(taskIndex, BUG_SCENARIOS.length - 1)];
  const [code, setCode] = useState<GridDir[]>(scenario.buggyCode);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [pos, setPos] = useState(scenario.start);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'retry'; text: string }>({
    type: 'idle',
    text: 'Önce 1. Adımda hatalı kodun ne yapacağını tahmin et, sonra kodu onar ve çalıştır!'
  });

  useEffect(() => {
    setCode(scenario.buggyCode);
    setPrediction(null);
    setPos(scenario.start);
    setFeedback({
      type: 'idle',
      text: 'Önce 1. Adımda hatalı kodun ne yapacağını tahmin et, sonra kodu onar ve çalıştır!'
    });
  }, [taskIndex]);

  const runTest = () => {
    if (prediction === null) {
      playTone('warning', soundEnabled);
      setFeedback({
        type: 'retry',
        text: 'Dedektif kuralı: Kodu çalıştırmadan önce "1. Adım: Tahmin Et" kutusundan bir seçenek işaretlemelisin!'
      });
      return;
    }

    let cx = scenario.start.x;
    let cy = scenario.start.y;
    for (let i = 0; i < code.length; i++) {
      const cmd = code[i];
      const nx = cmd === 'RIGHT' ? cx + 1 : cmd === 'LEFT' ? cx - 1 : cx;
      const ny = cmd === 'DOWN' ? cy + 1 : cmd === 'UP' ? cy - 1 : cy;

      if (nx < 0 || nx >= 4 || ny < 0 || ny >= 4) {
        setPos({ x: cx, y: cy });
        playTone('warning', soundEnabled);
        setFeedback({
          type: 'retry',
          text: `${i + 1}. adımda robot harita dışına çıktı! Bu komutu sil veya değiştir.`
        });
        return;
      }
      if (scenario.obstacles.some((o) => o.x === nx && o.y === ny)) {
        setPos({ x: cx, y: cy });
        playTone('warning', soundEnabled);
        setFeedback({
          type: 'retry',
          text: `${i + 1}. adımda robot kayaya çarptı! Sıralamayı veya yönü değiştir.`
        });
        return;
      }
      cx = nx;
      cy = ny;
    }

    setPos({ x: cx, y: cy });
    if (cx === scenario.goal.x && cy === scenario.goal.y) {
      playTone('success', soundEnabled);
      setFeedback({
        type: 'success',
        text: 'Tebrikler Usta Dedektif! Hatayı başarıyla onardın ve hedefe ulaştın!'
      });
      onTaskComplete(taskIndex);
    } else {
      playTone('warning', soundEnabled);
      setFeedback({
        type: 'retry',
        text: 'Robot engele çarpmadı ama henüz bayrağa da ulaşmadı. Eksik adımları tamamla!'
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <span className="text-sm font-bold text-slate-900">{scenario.title}</span>
        <div className="flex justify-center py-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, idx) => {
              const x = idx % 4;
              const y = Math.floor(idx / 4);
              const isRobot = pos.x === x && pos.y === y;
              const isGoal = scenario.goal.x === x && scenario.goal.y === y;
              const isObs = scenario.obstacles.some((o) => o.x === x && o.y === y);
              return (
                <div
                  key={idx}
                  className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center ${
                    isRobot
                      ? 'bg-sky-100 border-sky-600'
                      : isGoal
                      ? 'bg-amber-50 border-amber-400'
                      : isObs
                      ? 'bg-slate-200 border-slate-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {isObs && <span className="text-xl">🪨</span>}
                  {isGoal && !isRobot && <span className="text-2xl">🚩</span>}
                  {isRobot && <span className="text-2xl">🕵️‍♂️</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tahmin Bölümü */}
        <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 space-y-2">
          <div className="text-xs font-bold text-violet-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            1. Adım: Başlangıçtaki Hatalı Kod Çalışırsa Ne Olur? (Tahmin Et)
          </div>
          <div className="space-y-1.5">
            {scenario.predictionOptions.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  playTone('click', soundEnabled);
                  setPrediction(idx);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  prediction === idx
                    ? 'bg-violet-700 text-white border-violet-700'
                    : 'bg-white text-slate-800 border-violet-200 hover:bg-violet-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Kod Onarım Alanı */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900">2. Adım: Kodu Test Et ve Onar</h4>
          <button
            type="button"
            onClick={() => {
              setCode(scenario.buggyCode);
              setPos(scenario.start);
            }}
            className="text-xs font-bold text-slate-600 hover:underline cursor-pointer"
          >
            Hatalı Koda Dön
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(['RIGHT', 'LEFT', 'UP', 'DOWN'] as GridDir[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                if (code.length < 10) setCode((prev) => [...prev, d]);
              }}
              className="py-2 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-950 font-bold text-xs cursor-pointer"
            >
              + {d === 'RIGHT' ? '➡️ Sağ' : d === 'LEFT' ? '⬅️ Sol' : d === 'UP' ? '⬆️ Yukarı' : '⬇️ Aşağı'}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          {code.map((cmd, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
            >
              <span>
                {idx + 1}. {cmd === 'RIGHT' ? '➡️ Sağa Git' : cmd === 'LEFT' ? '⬅️ Sola Git' : cmd === 'UP' ? '⬆️ Yukarı Git' : '⬇️ Aşağı Git'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (idx === 0) return;
                    const copy = [...code];
                    const [it] = copy.splice(idx, 1);
                    copy.splice(idx - 1, 0, it);
                    setCode(copy);
                  }}
                  className="p-1 hover:bg-slate-200 rounded"
                  aria-label="Yukarı taşı"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCode((prev) => prev.filter((_, i) => i !== idx))}
                  className="p-1 hover:bg-rose-100 text-rose-700 rounded"
                  aria-label="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={runTest}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          Kodu Çalıştır ve Kontrol Et
        </button>

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
