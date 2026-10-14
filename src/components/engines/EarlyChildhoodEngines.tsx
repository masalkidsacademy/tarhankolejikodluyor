import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Play,
  Repeat,
  RotateCcw,
  Trash2,
  Volume2
} from 'lucide-react';
import { playTone, speakTurkishText } from '../../utils/soundAndSpeech';

interface EngineProps {
  taskIndex: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  onTaskComplete: (taskIndex: number) => void;
}

// ============================================================================
// ETKİNLİK 1: MİNİK ROBOT EVE GİDİYOR (Anaokulu 3 Yaş)
// ============================================================================
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const PRESCHOOL_MAPS = [
  {
    cols: 3,
    rows: 1,
    start: { x: 0, y: 0 },
    goal: { x: 1, y: 0 }
  },
  {
    cols: 3,
    rows: 1,
    start: { x: 0, y: 0 },
    goal: { x: 2, y: 0 }
  },
  {
    cols: 3,
    rows: 2,
    start: { x: 0, y: 0 },
    goal: { x: 2, y: 1 }
  }
];

export const PreschoolGridEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  const map = PRESCHOOL_MAPS[Math.min(taskIndex, PRESCHOOL_MAPS.length - 1)];
  const [commands, setCommands] = useState<Dir[]>([]);
  const [robotPos, setRobotPos] = useState<{ x: number; y: number }>(map.start);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'retry'; text: string }>({
    type: 'idle',
    text: 'Ok düğmelerine dokunarak komut ekle, sonra yeşil Başlat düğmesine bas!'
  });
  const timerRef = useRef<number | null>(null);

  const stopExecution = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setActiveStep(null);
  };

  useEffect(() => {
    stopExecution();
    setCommands([]);
    setRobotPos(map.start);
    setFeedback({
      type: 'idle',
      text: 'Ok düğmelerine dokunarak komut ekle, sonra yeşil Başlat düğmesine bas!'
    });
    return () => stopExecution();
  }, [taskIndex]);

  const addDir = (dir: Dir) => {
    if (isRunning || commands.length >= 6) return;
    playTone('click', soundEnabled);
    setCommands((prev) => [...prev, dir]);
    setRobotPos(map.start);
    setFeedback({ type: 'idle', text: 'Harika! Şimdi Başlat düğmesine basabilirsin.' });
  };

  const resetAll = () => {
    stopExecution();
    playTone('click', soundEnabled);
    setCommands([]);
    setRobotPos(map.start);
    setFeedback({ type: 'idle', text: 'Sıfırlandı. Yeniden okları seçebilirsin!' });
  };

  const runCommands = () => {
    stopExecution();
    if (commands.length === 0) {
      playTone('warning', soundEnabled);
      setFeedback({ type: 'retry', text: 'Önce mavi yön oklarından en az birine dokunmalısın.' });
      return;
    }

    setIsRunning(true);
    setRobotPos(map.start);
    let currentX = map.start.x;
    let currentY = map.start.y;
    let step = 0;

    const executeNext = () => {
      if (step >= commands.length) {
        setIsRunning(false);
        setActiveStep(null);
        if (currentX === map.goal.x && currentY === map.goal.y) {
          playTone('success', soundEnabled);
          setFeedback({
            type: 'success',
            text: 'Tebrikler! Minik Robot evine ulaştı!'
          });
          onTaskComplete(taskIndex);
        } else {
          playTone('warning', soundEnabled);
          setFeedback({
            type: 'retry',
            text: 'Robot henüz eve ulaşamadı. Okları kontrol edip tekrar deneyelim!'
          });
        }
        return;
      }

      setActiveStep(step);
      const cmd = commands[step];
      let nextX = currentX;
      let nextY = currentY;
      if (cmd === 'RIGHT') nextX += 1;
      if (cmd === 'LEFT') nextX -= 1;
      if (cmd === 'DOWN') nextY += 1;
      if (cmd === 'UP') nextY -= 1;

      if (nextX < 0 || nextX >= map.cols || nextY < 0 || nextY >= map.rows) {
        playTone('warning', soundEnabled);
        setIsRunning(false);
        setFeedback({
          type: 'retry',
          text: `${step + 1}. adımda robot yolun dışına çıktı. İşaretli oku değiştirmeyi dene!`
        });
        return;
      }

      currentX = nextX;
      currentY = nextY;
      setRobotPos({ x: currentX, y: currentY });
      playTone('step', soundEnabled);
      step += 1;
      timerRef.current = window.setTimeout(executeNext, 550);
    };

    timerRef.current = window.setTimeout(executeNext, 300);
  };

  const renderArrowLabel = (d: Dir) => {
    if (d === 'RIGHT') return { icon: <ArrowRight className="w-7 h-7" />, label: 'Sağ' };
    if (d === 'LEFT') return { icon: <ArrowLeft className="w-7 h-7" />, label: 'Sol' };
    if (d === 'UP') return { icon: <ArrowUp className="w-7 h-7" />, label: 'Yukarı' };
    return { icon: <ArrowDown className="w-7 h-7" />, label: 'Aşağı' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Sol Sahne */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-700">Oyun Parkuru</span>
          <button
            type="button"
            onClick={() =>
              speakTurkishText(
                'Ok düğmelerine basarak minik robotu kırmızı çatılı evine götür.',
                soundEnabled
              )
            }
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            Sesli Anlat
          </button>
        </div>

        <div className="flex justify-center py-6 bg-slate-50 rounded-xl border border-slate-200">
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${map.cols}, minmax(88px, 108px))` }}
          >
            {Array.from({ length: map.rows * map.cols }).map((_, idx) => {
              const x = idx % map.cols;
              const y = Math.floor(idx / map.cols);
              const isRobot = robotPos.x === x && robotPos.y === y;
              const isGoal = map.goal.x === x && map.goal.y === y;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-colors ${
                    isRobot
                      ? 'bg-cyan-50 border-cyan-500'
                      : isGoal
                      ? 'bg-amber-50 border-amber-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {isGoal && !isRobot && (
                    <div className="flex flex-col items-center" aria-label="Hedef Ev">
                      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                        <path d="M8 22L24 8L40 22V40H8V22Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
                        <path d="M5 23L24 7L43 23" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
                        <rect x="20" y="27" width="8" height="13" rx="2" fill="#D97706" />
                      </svg>
                      <span className="text-xs font-bold text-amber-900 mt-1">EV</span>
                    </div>
                  )}
                  {isRobot && (
                    <div className="flex flex-col items-center" aria-label="Minik Robot">
                      <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
                        <rect x="12" y="16" width="32" height="28" rx="8" fill="#0284C7" />
                        <circle cx="28" cy="9" r="4" fill="#F97316" />
                        <line x1="28" y1="12" x2="28" y2="16" stroke="#0284C7" strokeWidth="3" />
                        <circle cx="22" cy="27" r="4" fill="white" />
                        <circle cx="34" cy="27" r="4" fill="white" />
                        <circle cx="23" cy="27" r="2" fill="#0F172A" />
                        <circle cx="35" cy="27" r="2" fill="#0F172A" />
                        <path d="M21 36C23 39 33 39 35 36" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <span className="text-xs font-bold text-cyan-900">ROBİ</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Komut Kuyruğu */}
        <div className="mt-5">
          <div className="text-xs font-semibold text-slate-600 mb-2">
            Seçtiğin Komut Sırası ({commands.length}/6):
          </div>
          <div className="min-h-16 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
            {commands.length === 0 ? (
              <span className="text-sm text-slate-500">
                Henüz ok seçilmedi. Sağdaki büyük oklara dokun!
              </span>
            ) : (
              commands.map((cmd, idx) => {
                const info = renderArrowLabel(cmd);
                const isStepActive = activeStep === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm border-2 transition-transform ${
                      isStepActive
                        ? 'bg-amber-100 border-amber-500 text-amber-950 scale-105'
                        : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    <span className="text-xs text-slate-500 tabular-nums">{idx + 1}.</span>
                    {info.icon}
                    <span>{info.label}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Sağ Kontrol Paneli */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div>
          <h4 className="text-base font-bold text-slate-900 mb-1">Yön Oklarını Seç</h4>
          <p className="text-xs text-slate-600">
            Büyük oklara dokunarak sıraya ekle:
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(['RIGHT', 'DOWN', 'LEFT', 'UP'] as Dir[]).map((dir) => {
            const info = renderArrowLabel(dir);
            return (
              <button
                key={dir}
                type="button"
                disabled={isRunning}
                onClick={() => addDir(dir)}
                className="flex flex-col items-center justify-center gap-1.5 py-4 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 active:bg-sky-200 border-2 border-sky-300 text-sky-950 font-bold transition-colors disabled:opacity-50"
              >
                {info.icon}
                <span className="text-sm">{info.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={runCommands}
            disabled={isRunning}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Play className="w-5 h-5 fill-current" />
            Başlat
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-5 h-5" />
            Sıfırla
          </button>
        </div>

        {/* Somut Geri Bildirim Kutusu */}
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
// ETKİNLİK 2: RENK SIRASINI TAMAMLA (Anaokulu 3 Yaş)
// ============================================================================
type PatternItemId = 'red-circle' | 'blue-square' | 'yellow-triangle' | 'green-star';

interface PatternItem {
  id: PatternItemId;
  label: string;
  colorClass: string;
}

const PATTERN_ITEMS: Record<PatternItemId, PatternItem> = {
  'red-circle': {
    id: 'red-circle',
    label: 'Kırmızı Daire',
    colorClass: 'bg-rose-50 border-rose-300 text-rose-900'
  },
  'blue-square': {
    id: 'blue-square',
    label: 'Mavi Kare',
    colorClass: 'bg-sky-50 border-sky-300 text-sky-900'
  },
  'yellow-triangle': {
    id: 'yellow-triangle',
    label: 'Sarı Üçgen',
    colorClass: 'bg-amber-50 border-amber-300 text-amber-900'
  },
  'green-star': {
    id: 'green-star',
    label: 'Yeşil Yıldız',
    colorClass: 'bg-emerald-50 border-emerald-300 text-emerald-900'
  }
};

const PATTERN_TASKS: { sequence: PatternItemId[]; answer: PatternItemId }[] = [
  {
    sequence: ['red-circle', 'blue-square', 'red-circle', 'blue-square', 'red-circle'],
    answer: 'blue-square'
  },
  {
    sequence: ['yellow-triangle', 'green-star', 'yellow-triangle', 'green-star'],
    answer: 'yellow-triangle'
  },
  {
    sequence: ['red-circle', 'red-circle', 'blue-square', 'red-circle', 'red-circle'],
    answer: 'blue-square'
  },
  {
    sequence: ['red-circle', 'blue-square', 'yellow-triangle', 'red-circle', 'blue-square'],
    answer: 'yellow-triangle'
  }
];

const renderShapeSvg = (id: PatternItemId, size = 44) => {
  if (id === 'red-circle') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="18" fill="#E11D48" stroke="#881337" strokeWidth="3" />
      </svg>
    );
  }
  if (id === 'blue-square') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="8" width="32" height="32" rx="6" fill="#0284C7" stroke="#0C4A6E" strokeWidth="3" />
      </svg>
    );
  }
  if (id === 'yellow-triangle') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <polygon points="24,6 42,40 6,40" fill="#F59E0B" stroke="#78350F" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <polygon
        points="24,5 29,18 43,18 32,27 36,41 24,33 12,41 16,27 5,18 19,18"
        fill="#10B981"
        stroke="#064E3B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PatternBuilderEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  const currentTask = PATTERN_TASKS[Math.min(taskIndex, PATTERN_TASKS.length - 1)];
  const [selectedChoice, setSelectedChoice] = useState<PatternItemId | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'retry'>('idle');
  const [freePattern, setFreePattern] = useState<PatternItemId[]>([
    'red-circle',
    'yellow-triangle',
    'red-circle',
    'yellow-triangle'
  ]);

  useEffect(() => {
    setSelectedChoice(null);
    setStatus('idle');
  }, [taskIndex]);

  const checkAnswer = (choice: PatternItemId) => {
    setSelectedChoice(choice);
    if (choice === currentTask.answer) {
      playTone('success', soundEnabled);
      setStatus('correct');
      onTaskComplete(taskIndex);
    } else {
      playTone('warning', soundEnabled);
      setStatus('retry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-slate-900">Örüntü Treni</h4>
          <button
            type="button"
            onClick={() => {
              const names = currentTask.sequence.map((id) => PATTERN_ITEMS[id].label).join(', ');
              speakTurkishText(
                `Sırayı dinle: ${names}. Soru işaretli kutuya hangisi gelmeli?`,
                soundEnabled
              );
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            Sırayı Dinle
          </button>
        </div>

        {/* Örüntü Dizisi */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-6 px-4 bg-slate-50 rounded-xl border border-slate-200">
          {currentTask.sequence.map((itemId, idx) => {
            const item = PATTERN_ITEMS[itemId];
            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center w-24 h-28 rounded-2xl border-2 bg-white border-slate-200 p-2`}
              >
                {renderShapeSvg(itemId, 44)}
                <span className="text-xs font-bold text-slate-800 mt-2 text-center">
                  {item.label}
                </span>
              </div>
            );
          })}

          {/* Soru İşaretli Hedef Kutu */}
          <div
            className={`flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 border-dashed p-2 transition-colors ${
              status === 'correct'
                ? 'bg-emerald-50 border-emerald-500'
                : status === 'retry'
                ? 'bg-amber-50 border-amber-500'
                : 'bg-violet-50 border-violet-400'
            }`}
          >
            {selectedChoice ? (
              <>
                {renderShapeSvg(selectedChoice, 44)}
                <span className="text-xs font-bold text-slate-900 mt-2 text-center">
                  {PATTERN_ITEMS[selectedChoice].label}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-violet-700">?</span>
            )}
          </div>
        </div>

        {/* Seçenek Düğmeleri */}
        <div className="mt-6">
          <div className="text-sm font-bold text-slate-800 mb-3">
            Sıradaki şekli seçmek için dokun:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(PATTERN_ITEMS) as PatternItemId[]).map((itemId) => {
              const item = PATTERN_ITEMS[itemId];
              return (
                <button
                  key={itemId}
                  type="button"
                  onClick={() => checkAnswer(itemId)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-transform hover:scale-[1.02] cursor-pointer ${item.colorClass}`}
                >
                  {renderShapeSvg(itemId, 44)}
                  <span className="text-sm font-bold mt-2">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Geri Bildirim */}
        <div
          className={`mt-5 p-4 rounded-xl border text-sm font-medium ${
            status === 'correct'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : status === 'retry'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {status === 'correct' && 'Harika! Doğru şekli ve rengi bularak örüntüyü tamamladın!'}
          {status === 'retry' &&
            'Bu şekil sıraya uymadı. Baştaki şekilleri sırayla yüksek sesle söyleyip başka bir şekil dene!'}
          {status === 'idle' &&
            'Yukarıdaki şekillerin sırasına bak ve soru işareti yerine gelecek kartı seç.'}
        </div>
      </div>

      {/* Serbest Örüntü Üretim Alanı */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">Serbest Üretim: Kendi Örüntünü Kur</h4>
            <p className="text-xs text-slate-600">
              İstediğin şekillere dokunarak kendi renk-şekil trenini oluştur!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFreePattern([])}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Temizle
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(PATTERN_ITEMS) as PatternItemId[]).map((itemId) => (
            <button
              key={itemId}
              type="button"
              onClick={() => {
                if (freePattern.length < 10) {
                  playTone('click', soundEnabled);
                  setFreePattern((prev) => [...prev, itemId]);
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800"
            >
              {renderShapeSvg(itemId, 20)}
              + {PATTERN_ITEMS[itemId].label}
            </button>
          ))}
        </div>
        <div className="min-h-20 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
          {freePattern.length === 0 ? (
            <span className="text-xs text-slate-500">Kendi desenin için yukarıdan şekil ekle.</span>
          ) : (
            freePattern.map((id, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg border border-slate-200"
              >
                {renderShapeSvg(id, 26)}
                <span className="text-xs font-medium text-slate-700">{PATTERN_ITEMS[id].label}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ETKİNLİK 3: HAYVAN DOSTLARIMA YARDIM EDİYORUM (Anaokulu 4–5 Yaş)
// ============================================================================
const ANIMAL_MAPS = [
  {
    title: 'Tavşana Havuç Götür',
    targetName: 'Tavşan',
    itemEmoji: '🥕',
    animalEmoji: '🐰',
    start: { x: 0, y: 0 },
    goal: { x: 2, y: 2 },
    obstacles: [{ x: 1, y: 0 }, { x: 0, y: 2 }]
  },
  {
    title: 'Kediye Mama Götür',
    targetName: 'Yavru Kedi',
    itemEmoji: '🥣',
    animalEmoji: '🐱',
    start: { x: 0, y: 0 },
    goal: { x: 3, y: 2 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 }
    ]
  },
  {
    title: 'Köpeğe Kemik Ulaştır',
    targetName: 'Sevimli Köpek',
    itemEmoji: '🦴',
    animalEmoji: '🐶',
    start: { x: 0, y: 3 },
    goal: { x: 3, y: 0 },
    obstacles: [
      { x: 1, y: 3 },
      { x: 1, y: 2 },
      { x: 2, y: 0 },
      { x: 3, y: 2 }
    ]
  }
];

export const AnimalHelperGridEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  const map = ANIMAL_MAPS[Math.min(taskIndex, ANIMAL_MAPS.length - 1)];
  const [commands, setCommands] = useState<Dir[]>([]);
  const [robotPos, setRobotPos] = useState<{ x: number; y: number }>(map.start);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [errorStep, setErrorStep] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'retry'; text: string }>({
    type: 'idle',
    text: `${map.targetName} dostumuza ulaşmak için yön oklarını kuyruğa ekle.`
  });
  const timerRef = useRef<number | null>(null);

  const stopRun = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setActiveStep(null);
  };

  useEffect(() => {
    stopRun();
    setCommands([]);
    setRobotPos(map.start);
    setErrorStep(null);
    setFeedback({
      type: 'idle',
      text: `${map.targetName} dostumuza ulaşmak için yön oklarını kuyruğa ekle.`
    });
    return () => stopRun();
  }, [taskIndex]);

  const addCmd = (dir: Dir) => {
    if (isRunning || commands.length >= 10) return;
    playTone('click', soundEnabled);
    setErrorStep(null);
    setCommands((prev) => [...prev, dir]);
    setRobotPos(map.start);
  };

  const removeLastCmd = () => {
    if (isRunning || commands.length === 0) return;
    playTone('click', soundEnabled);
    setErrorStep(null);
    setCommands((prev) => prev.slice(0, -1));
    setRobotPos(map.start);
    setFeedback({ type: 'idle', text: 'Son komut silindi. Yeni bir yön seçebilirsin.' });
  };

  const resetAll = () => {
    stopRun();
    playTone('click', soundEnabled);
    setCommands([]);
    setRobotPos(map.start);
    setErrorStep(null);
    setFeedback({ type: 'idle', text: 'Harita sıfırlandı.' });
  };

  const runQueue = () => {
    stopRun();
    if (commands.length === 0) {
      playTone('warning', soundEnabled);
      setFeedback({ type: 'retry', text: 'Önce kuyruğa en az bir yön komutu eklemelisin.' });
      return;
    }

    setIsRunning(true);
    setErrorStep(null);
    setRobotPos(map.start);
    let cx = map.start.x;
    let cy = map.start.y;
    let step = 0;

    const tick = () => {
      if (step >= commands.length) {
        setIsRunning(false);
        setActiveStep(null);
        if (cx === map.goal.x && cy === map.goal.y) {
          playTone('success', soundEnabled);
          setFeedback({
            type: 'success',
            text: `Harika! ${map.targetName} dostumuza yardımı ulaştırdın!`
          });
          onTaskComplete(taskIndex);
        } else {
          playTone('warning', soundEnabled);
          setFeedback({
            type: 'retry',
            text: `Robot (${cx + 1},${cy + 1}) karesinde durdu ama ${map.targetName} başka karede. Ekstra adım ekleyebilir veya son adımı değiştirebilirsin.`
          });
        }
        return;
      }

      setActiveStep(step);
      const dir = commands[step];
      let nx = cx;
      let ny = cy;
      if (dir === 'RIGHT') nx += 1;
      if (dir === 'LEFT') nx -= 1;
      if (dir === 'DOWN') ny += 1;
      if (dir === 'UP') ny -= 1;

      if (nx < 0 || nx >= 4 || ny < 0 || ny >= 4) {
        playTone('warning', soundEnabled);
        setIsRunning(false);
        setErrorStep(step);
        setFeedback({
          type: 'retry',
          text: `${step + 1}. komutta robot bahçe sınırına çarptı! İşaretli komutu "Son Komutu Sil" ile düzeltmeyi dene.`
        });
        return;
      }

      const hitObstacle = map.obstacles.some((o) => o.x === nx && o.y === ny);
      if (hitObstacle) {
        playTone('warning', soundEnabled);
        setIsRunning(false);
        setErrorStep(step);
        setFeedback({
          type: 'retry',
          text: `${step + 1}. komutta engel var! İşaretli komutu değiştirerek engelin etrafından dolaş.`
        });
        return;
      }

      cx = nx;
      cy = ny;
      setRobotPos({ x: cx, y: cy });
      playTone('step', soundEnabled);
      step += 1;
      timerRef.current = window.setTimeout(tick, 500);
    };

    timerRef.current = window.setTimeout(tick, 250);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* 4x4 Harita */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-slate-800">
            4×4 Yardım Haritası: {map.title}
          </span>
          <span className="text-xs text-slate-500">Engellere dikkat et</span>
        </div>

        <div className="flex justify-center py-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: 16 }).map((_, idx) => {
              const x = idx % 4;
              const y = Math.floor(idx / 4);
              const isRobot = robotPos.x === x && robotPos.y === y;
              const isGoal = map.goal.x === x && map.goal.y === y;
              const isObstacle = map.obstacles.some((o) => o.x === x && o.y === y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-18 h-18 sm:w-22 sm:h-22 rounded-xl border-2 flex flex-col items-center justify-center relative transition-all ${
                    isRobot
                      ? 'bg-sky-100 border-sky-600 shadow-xs'
                      : isGoal
                      ? 'bg-amber-50 border-amber-400'
                      : isObstacle
                      ? 'bg-slate-200 border-slate-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {isObstacle && (
                    <div className="flex flex-col items-center" aria-label="Kaya Engeli">
                      <span className="text-2xl" aria-hidden="true">🪨</span>
                      <span className="text-[10px] font-bold text-slate-700">ENGEL</span>
                    </div>
                  )}
                  {isGoal && !isRobot && (
                    <div className="flex flex-col items-center" aria-label={map.targetName}>
                      <span className="text-2xl" aria-hidden="true">{map.animalEmoji}</span>
                      <span className="text-[10px] font-bold text-amber-900">{map.targetName}</span>
                    </div>
                  )}
                  {isRobot && (
                    <div className="flex flex-col items-center" aria-label="Yardım Robotu">
                      <span className="text-2xl" aria-hidden="true">🤖{map.itemEmoji}</span>
                      <span className="text-[10px] font-bold text-sky-950">ROBOT</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Görünür Komut Kuyruğu */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              Komut Kuyruğu ({commands.length}/10):
            </span>
            <button
              type="button"
              onClick={removeLastCmd}
              disabled={isRunning || commands.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Son Komutu Sil
            </button>
          </div>
          <div className="min-h-16 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
            {commands.length === 0 ? (
              <span className="text-xs text-slate-500">
                Kuyruk boş. Yön düğmelerine tıklayarak rota oluştur.
              </span>
            ) : (
              commands.map((dir, i) => {
                const isCurr = activeStep === i;
                const isErr = errorStep === i;
                const label =
                  dir === 'RIGHT' ? '➡️ Sağ' : dir === 'LEFT' ? '⬅️ Sol' : dir === 'UP' ? '⬆️ Yukarı' : '⬇️ Aşağı';
                return (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${
                      isErr
                        ? 'bg-rose-100 border-rose-600 text-rose-950'
                        : isCurr
                        ? 'bg-amber-100 border-amber-500 text-amber-950 scale-105'
                        : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  >
                    {i + 1}. {label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Kontroller */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-slate-900">Komut Ekle</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isRunning}
            onClick={() => addCmd('UP')}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-950 font-bold text-sm cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" /> Yukarı
          </button>
          <button
            type="button"
            disabled={isRunning}
            onClick={() => addCmd('DOWN')}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-950 font-bold text-sm cursor-pointer"
          >
            <ArrowDown className="w-5 h-5" /> Aşağı
          </button>
          <button
            type="button"
            disabled={isRunning}
            onClick={() => addCmd('LEFT')}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-950 font-bold text-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> Sol
          </button>
          <button
            type="button"
            disabled={isRunning}
            onClick={() => addCmd('RIGHT')}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 text-sky-950 font-bold text-sm cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" /> Sağ
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={runQueue}
            disabled={isRunning}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Çalıştır
          </button>
          <button
            type="button"
            onClick={resetAll}
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
// ETKİNLİK 4: ROBOTUN DANSI (Anaokulu 4–5 Yaş)
// ============================================================================
type DanceMove = 'HANDS_UP' | 'STEP_RIGHT' | 'STEP_LEFT' | 'CLAP';

const DANCE_CARDS: Record<DanceMove, { label: string; badge: string; desc: string }> = {
  HANDS_UP: { label: 'Ellerini Kaldır', badge: '🙌', desc: 'Kollar yukarı!' },
  STEP_RIGHT: { label: 'Sağa Adım', badge: '➡️', desc: 'Sağa kay!' },
  STEP_LEFT: { label: 'Sola Adım', badge: '⬅️', desc: 'Sola kay!' },
  CLAP: { label: 'Alkışla', badge: '👏', desc: 'Şak şak alkış!' }
};

export const RobotDanceEngine: React.FC<EngineProps> = ({
  taskIndex,
  soundEnabled,
  onTaskComplete
}) => {
  const [moves, setMoves] = useState<DanceMove[]>(['HANDS_UP', 'CLAP']);
  const [repeatTwice, setRepeatTwice] = useState(taskIndex === 1);
  const [currentMove, setCurrentMove] = useState<DanceMove | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [activeLoopPass, setActiveLoopPass] = useState<number>(1);
  const [isDancing, setIsDancing] = useState(false);
  const [feedback, setFeedback] = useState<string>(
    'Hareket kartlarını seç, istersen "2 Kez Tekrar Et" kutusunu aç ve Dansı Başlat!'
  );
  const timerRef = useRef<number | null>(null);

  const stopDance = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsDancing(false);
    setCurrentMove(null);
    setActiveIdx(null);
  };

  useEffect(() => {
    stopDance();
    if (taskIndex === 0) {
      setMoves(['HANDS_UP', 'CLAP']);
      setRepeatTwice(false);
    } else if (taskIndex === 1) {
      setMoves(['STEP_RIGHT', 'STEP_LEFT', 'CLAP']);
      setRepeatTwice(true);
    } else {
      setMoves(['HANDS_UP', 'STEP_RIGHT', 'STEP_LEFT', 'CLAP']);
      setRepeatTwice(true);
    }
    return () => stopDance();
  }, [taskIndex]);

  const startDance = () => {
    stopDance();
    if (moves.length === 0) {
      setFeedback('Önce en az bir dans kartı eklemelisin!');
      return;
    }

    setIsDancing(true);
    const fullSequence: { move: DanceMove; originalIdx: number; pass: number }[] = [];
    const passes = repeatTwice ? 2 : 1;
    for (let p = 1; p <= passes; p++) {
      moves.forEach((m, idx) => {
        fullSequence.push({ move: m, originalIdx: idx, pass: p });
      });
    }

    let step = 0;
    const nextMove = () => {
      if (step >= fullSequence.length) {
        setIsDancing(false);
        setCurrentMove(null);
        setActiveIdx(null);
        playTone('success', soundEnabled);
        if (taskIndex === 0 && moves.length >= 3) {
          setFeedback('Harika! Selamlama dansını başarıyla tamamladın!');
          onTaskComplete(0);
        } else if (taskIndex === 1 && repeatTwice && moves.length >= 2) {
          setFeedback('Süper! "2 Kez Tekrar Et" bloğuyla dansı iki tur oynattın!');
          onTaskComplete(1);
        } else if (taskIndex === 2 && moves.length >= 4) {
          setFeedback('Muhteşem koreografi! Robotla birlikte harika dans ettin!');
          onTaskComplete(2);
        } else {
          setFeedback(
            taskIndex === 1 && !repeatTwice
              ? 'Bu görevi tamamlamak için "2 Kez Tekrar Et" düğmesini açıp tekrar çalıştır!'
              : 'Görev koşulunu tamamlamak için biraz daha hareket kartı ekleyip çalıştır!'
          );
        }
        return;
      }

      const item = fullSequence[step];
      setCurrentMove(item.move);
      setActiveIdx(item.originalIdx);
      setActiveLoopPass(item.pass);
      playTone('step', soundEnabled);
      step += 1;
      timerRef.current = window.setTimeout(nextMove, 650);
    };

    nextMove();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Dans Sahnesi */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-900">Robot Dans Sahnesi</span>
          {isDancing && (
            <span className="text-xs font-bold text-violet-700">
              {repeatTwice ? `Tekrar Turu: ${activeLoopPass}/2` : 'Oynatılıyor...'}
            </span>
          )}
        </div>

        <div className="h-64 rounded-2xl bg-gradient-to-b from-violet-50 to-sky-50 border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
          <div
            className={`transition-transform duration-300 ${
              currentMove === 'STEP_RIGHT'
                ? 'translate-x-10'
                : currentMove === 'STEP_LEFT'
                ? '-translate-x-10'
                : currentMove === 'HANDS_UP'
                ? '-translate-y-3 scale-105'
                : currentMove === 'CLAP'
                ? 'scale-110'
                : ''
            }`}
          >
            <svg width="130" height="130" viewBox="0 0 120 120" fill="none" aria-label="Dans Eden Robot">
              <circle cx="60" cy="14" r="6" fill="#F97316" />
              <line x1="60" y1="20" x2="60" y2="30" stroke="#4F46E5" strokeWidth="4" />
              <rect x="35" y="30" width="50" height="42" rx="12" fill="#4F46E5" />
              <circle cx="49" cy="48" r="6" fill="white" />
              <circle cx="71" cy="48" r="6" fill="white" />
              <circle cx="49" cy="48" r="3" fill="#0F172A" />
              <circle cx="71" cy="48" r="3" fill="#0F172A" />
              <path d="M48 61C52 66 68 66 72 61" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              {/* Kollar */}
              {currentMove === 'HANDS_UP' ? (
                <>
                  <line x1="35" y1="45" x2="16" y2="20" stroke="#0284C7" strokeWidth="8" strokeLinecap="round" />
                  <line x1="85" y1="45" x2="104" y2="20" stroke="#0284C7" strokeWidth="8" strokeLinecap="round" />
                </>
              ) : currentMove === 'CLAP' ? (
                <>
                  <line x1="35" y1="50" x2="55" y2="55" stroke="#F97316" strokeWidth="8" strokeLinecap="round" />
                  <line x1="85" y1="50" x2="65" y2="55" stroke="#F97316" strokeWidth="8" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="35" y1="48" x2="18" y2="66" stroke="#0284C7" strokeWidth="8" strokeLinecap="round" />
                  <line x1="85" y1="48" x2="102" y2="66" stroke="#0284C7" strokeWidth="8" strokeLinecap="round" />
                </>
              )}
              {/* Bacaklar */}
              <line x1="48" y1="72" x2="44" y2="102" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
              <line x1="72" y1="72" x2="76" y2="102" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="mt-2 px-4 py-1.5 rounded-lg bg-white/90 border border-slate-200 text-sm font-bold text-slate-900">
            {currentMove ? `${DANCE_CARDS[currentMove].badge} ${DANCE_CARDS[currentMove].label}` : 'Sahne Hazır! Sen de Robota Katıl!'}
          </div>
        </div>

        {/* Seçilen Dans Kartları */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-700 mb-2">
            Dans Sırası ({moves.length}/8):
          </div>
          <div className="min-h-14 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-2">
            {moves.map((m, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold flex items-center gap-1.5 ${
                  activeIdx === idx
                    ? 'bg-amber-100 border-amber-500 text-amber-950 scale-105'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <span>{idx + 1}.</span>
                <span>{DANCE_CARDS[m].badge}</span>
                <span>{DANCE_CARDS[m].label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Kart Seçici */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h4 className="text-base font-bold text-slate-900">Hareket Kartları Ekle</h4>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(DANCE_CARDS) as DanceMove[]).map((moveKey) => {
            const card = DANCE_CARDS[moveKey];
            return (
              <button
                key={moveKey}
                type="button"
                disabled={isDancing || moves.length >= 8}
                onClick={() => {
                  playTone('click', soundEnabled);
                  setMoves((prev) => [...prev, moveKey]);
                }}
                className="flex flex-col items-center p-3.5 rounded-xl bg-violet-50 hover:bg-violet-100 border-2 border-violet-200 text-violet-950 font-bold text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                <span className="text-2xl mb-1">{card.badge}</span>
                <span>{card.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2 Kez Tekrar Et Döngü Seçeneği */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Repeat className="w-5 h-5 text-amber-800 shrink-0" />
            <div>
              <div className="text-sm font-bold text-amber-950">2 Kez Tekrar Et (Döngü)</div>
              <div className="text-xs text-amber-800">Tüm dans sırasını arka arkaya 2 kez oynatır</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playTone('click', soundEnabled);
              setRepeatTwice((prev) => !prev);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              repeatTwice
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-amber-300 text-amber-900'
            }`}
          >
            {repeatTwice ? 'Açık (2×)' : 'Kapalı (1×)'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startDance}
            disabled={isDancing}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Dansı Başlat
          </button>
          <button
            type="button"
            onClick={() => {
              stopDance();
              setMoves((prev) => prev.slice(0, -1));
            }}
            disabled={isDancing || moves.length === 0}
            className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs cursor-pointer disabled:opacity-40"
          >
            <Trash2 className="w-4 h-4" />
            Son Kartı Sil
          </button>
          <button
            type="button"
            onClick={() => {
              stopDance();
              setMoves([]);
            }}
            className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      </div>
    </div>
  );
};
