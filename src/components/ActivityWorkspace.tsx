import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  Bot,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Volume2
} from 'lucide-react';
import { BADGES } from '../config/siteConfig';
import { useProgress } from '../context/ProgressContext';
import { ActivityDefinition } from '../types/platform';
import { playTone, speakTurkishText } from '../utils/soundAndSpeech';
import {
  AnimalHelperGridEngine,
  PatternBuilderEngine,
  PreschoolGridEngine,
  RobotDanceEngine
} from './engines/EarlyChildhoodEngines';
import {
  AlgorithmLabEngine,
  DigitalSolutionEngine
} from './engines/HighSchoolEngines';
import {
  AiClassifierEngine,
  GameWorkshopEngine,
  SmartSchoolEngine,
  WaterChannelEngine
} from './engines/MiddleSchoolEngines';
import {
  BugDetectiveEngine,
  LoopPatternEngine,
  StoryEditorEngine,
  TreasureRobotEngine
} from './engines/PrimarySchoolEngines';

interface ActivityWorkspaceProps {
  activity: ActivityDefinition;
  onBack: () => void;
  onSelectActivity: (activityId: string) => void;
}

export const ActivityWorkspace: React.FC<ActivityWorkspaceProps> = ({
  activity,
  onBack,
  onSelectActivity
}) => {
  const {
    state,
    getActivityStatus,
    markTaskCompleted,
    markActivityCompleted,
    saveReflection,
    nextRecommendedActivity
  } = useProgress();

  const progress = getActivityStatus(activity.id);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
  const [reflectionText, setReflectionText] = useState<string>(
    progress.reflectionAnswer || ''
  );
  const [reflectionSaved, setReflectionSaved] = useState<boolean>(false);

  const currentTask = activity.tasks[activeTaskIndex] || activity.tasks[0];
  const badgeInfo = BADGES.find((b) => b.id === activity.badge);

  const isEarlyOrPrimary = [
    'anaokulu-3',
    'anaokulu-4-5',
    'sinif-1-2',
    'sinif-3-4'
  ].includes(activity.grade);

  const handleTaskComplete = (idx: number) => {
    const taskObj = activity.tasks[idx];
    if (!taskObj) return;
    markTaskCompleted(activity.id, taskObj.id);
  };

  const renderEngine = () => {
    const commonProps = {
      taskIndex: activeTaskIndex,
      soundEnabled: state.soundEnabled,
      reducedMotion: state.reducedMotion,
      onTaskComplete: handleTaskComplete
    };

    switch (activity.engineType) {
      case 'preschool-grid':
        return <PreschoolGridEngine {...commonProps} />;
      case 'pattern-builder':
        return <PatternBuilderEngine {...commonProps} />;
      case 'animal-helper-grid':
        return <AnimalHelperGridEngine {...commonProps} />;
      case 'robot-dance':
        return <RobotDanceEngine {...commonProps} />;
      case 'treasure-robot':
        return <TreasureRobotEngine {...commonProps} />;
      case 'loop-pattern':
        return <LoopPatternEngine {...commonProps} />;
      case 'story-editor':
        return <StoryEditorEngine {...commonProps} />;
      case 'bug-detective':
        return <BugDetectiveEngine {...commonProps} />;
      case 'water-channel':
        return <WaterChannelEngine {...commonProps} />;
      case 'game-workshop':
        return <GameWorkshopEngine {...commonProps} />;
      case 'smart-school':
        return <SmartSchoolEngine {...commonProps} />;
      case 'ai-classifier':
        return <AiClassifierEngine {...commonProps} />;
      case 'algorithm-lab':
        return <AlgorithmLabEngine {...commonProps} />;
      case 'digital-solution':
        return <DigitalSolutionEngine {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Üst Gezinme ve Etkinlik Kimliği */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-950 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Etkinlik Listesine Dön
        </button>

        {/* Statik üst veri (Zero-Pill disiplini: kutusuz, nokta ayraçlı metin) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">{activity.gradeLabel}</span>
          <span aria-hidden="true">·</span>
          <span>Düzey: {activity.level}</span>
          <span aria-hidden="true">·</span>
          <span>Süre: {activity.duration}</span>
          <span aria-hidden="true">·</span>
          <span>Kavramlar: {activity.concepts.join(', ')}</span>
        </div>
      </div>

      {/* Anaokulu Yetişkin Eşliği Mesajı */}
      {activity.preschoolNote && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-950 flex items-center justify-between">
          <span>👨‍👩‍👧 {activity.preschoolNote}</span>
          <span>Okuma zorunlu değildir; sesli yönerge düğmesini kullanabilirsiniz.</span>
        </div>
      )}

      {/* Başlık, Kavram Özeti ve Görev Seçici */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{activity.title}</h1>
            <p className="text-sm text-slate-600 mt-1">{activity.conceptSummary}</p>
          </div>

          {isEarlyOrPrimary && (
            <button
              type="button"
              onClick={() =>
                speakTurkishText(
                  `${activity.title}. ${currentTask.title}. ${currentTask.instruction}`,
                  state.soundEnabled
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              Yönergeyi Dinle
            </button>
          )}
        </div>

        {/* Görev Sekmeleri (Etkileşimli Düğmeler) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {activity.tasks.map((t, idx) => {
            const isDone = progress.completedTaskIds.includes(t.id);
            const isActive = activeTaskIndex === idx;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  playTone('click', state.soundEnabled);
                  setActiveTaskIndex(idx);
                  setHintLevel(0);
                }}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Bugünkü Görev & 2. Kısa Örnek */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-violet-700">BUGÜNKÜ GÖREV</div>
            <div className="text-sm font-bold text-slate-900">{currentTask.instruction}</div>
            {currentTask.exampleText && (
              <div className="text-xs text-slate-600">
                <strong>Kısa Örnek:</strong> {currentTask.exampleText}
              </div>
            )}
          </div>

          {/* 6. Aşamalı İpucu ve Rehber Robot Robi */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                playTone('click', state.soundEnabled);
                setHintLevel((prev) => (prev === 0 ? 1 : prev === 1 ? 2 : 0));
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-4 h-4" />
              {hintLevel === 0
                ? 'İpucu İste (1/2)'
                : hintLevel === 1
                ? 'Daha Açık İpucu (2/2)'
                : 'İpucunu Gizle'}
            </button>
          </div>
        </div>

        {/* Rehber Robot İpucu Kutusu (Çalışma alanını kapatmaz) */}
        {hintLevel > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="text-xs text-amber-950 space-y-1">
              <div className="font-bold">
                Rehber Robot Robi — {hintLevel === 1 ? '1. Aşama Yönlendirme İpucu' : '2. Aşama Çözüm İpucu'}
              </div>
              <p>{activity.hints[hintLevel - 1]}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Etkileşimli Çalışma Alanı */}
      {renderEngine()}

      {/* 8. Sonuç, Rozet ve Yansıtma Sorusu */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-700" />
            <h3 className="text-base font-bold text-slate-900">Düşün ve Paylaş (Yansıtma Sorusu)</h3>
          </div>
          <p className="text-sm font-semibold text-slate-800">{activity.reflectionQuestion}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={reflectionText}
              maxLength={220}
              onChange={(e) => {
                setReflectionSaved(false);
                setReflectionText(e.target.value.replace(/[<>]/g, ''));
              }}
              placeholder="Düşünceni kısaca buraya yazabilirsin (isteğe bağlı)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
            />
            <button
              type="button"
              onClick={() => {
                playTone('success', state.soundEnabled);
                saveReflection(activity.id, reflectionText);
                setReflectionSaved(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              Yansıtmayı Kaydet
            </button>
          </div>
          {reflectionSaved && (
            <p className="text-xs font-bold text-emerald-700">
              Cevabın bu cihazdaki Kodlama Pasaportuna kaydedildi!
            </p>
          )}
        </div>

        {/* Kazanılan Rozet ve Sonraki Etkinlik */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">ETKİNLİK DURUMU VE ROZET</span>
              <span className="text-xs font-bold text-emerald-700">
                {progress.completedTaskIds.length} / {activity.tasks.length} Görev Tamamlandı
              </span>
            </div>

            {progress.status === 'completed' ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Tebrikler! "{badgeInfo?.title}" Rozetini Kazandın!</span>
                </div>
                <p className="text-xs text-emerald-900">{badgeInfo?.description}</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Hedef Rozet: {badgeInfo?.title}
                </div>
                <p className="text-xs text-slate-600">{activity.completionCriteria}</p>
                {progress.completedTaskIds.length >= 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      playTone('success', state.soundEnabled);
                      markActivityCompleted(activity.id, reflectionText);
                    }}
                    className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Etkinliği Tamamlandı Olarak İşaretle
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              Sonraki Öneri: <strong className="text-slate-900">{nextRecommendedActivity.title}</strong>
            </div>
            <button
              type="button"
              onClick={() => onSelectActivity(nextRecommendedActivity.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-900 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sonraki Etkinliğe Geç
            </button>
          </div>
        </div>
      </div>

      {/* Veli Bilgilendirme Kutusu */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-sky-800">VELİ REHBERİ: ÇOCUĞUM BU ETKİNLİKTE NE ÖĞRENİYOR?</div>
          <p className="text-xs text-slate-700">{activity.parentExplanation}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 md:max-w-md">
          <strong>Birlikte Konuşma Sorusu:</strong> “{activity.parentConversationPrompt}”
        </div>
      </div>
    </div>
  );
};
