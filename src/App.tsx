import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Map, Sparkles } from "lucide-react";
import { CodeModal } from "./components/CodeModal";
import { ProgressPanel } from "./components/ProgressPanel";
import { StageDetail } from "./components/StageDetail";
import { WorldMap } from "./components/WorldMap";
import { allStages, worlds } from "./data/curriculum";
import { loadProgress, resetProgress, saveProgress } from "./storage/progressStorage";
import type { QuestProgress, Stage } from "./types";
import { clearStage, getStageStatus } from "./utils/progress";

function playTone(enabled: boolean, volume: number, frequency: number, duration = 0.12) {
  if (!enabled) return;
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = "triangle";
  gain.gain.value = volume * 0.18;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  oscillator.stop(context.currentTime + duration);
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export default function App() {
  const [progress, setProgress] = useState<QuestProgress>(() => loadProgress());
  const [codeStage, setCodeStage] = useState<Stage | null>(null);
  const selectedStage = useMemo(
    () => allStages.find((stage) => stage.id === progress.selectedStageId) ?? allStages[0],
    [progress.selectedStageId],
  );
  const selectedStatus = getStageStatus(selectedStage, progress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function updateProgress(updater: (value: QuestProgress) => QuestProgress) {
    setProgress((current) => updater(current));
  }

  function handleSelectStage(stage: Stage) {
    const status = getStageStatus(stage, progress);
    playTone(progress.audioEnabled, progress.volume, status === "locked" ? 180 : 520, 0.08);
    setProgress((current) => ({ ...current, selectedStageId: stage.id }));
  }

  function handleClear(stage: Stage) {
    playTone(progress.audioEnabled, progress.volume, 740, 0.18);
    window.setTimeout(() => playTone(progress.audioEnabled, progress.volume, 980, 0.18), 120);
    updateProgress((current) => clearStage(current, stage));
  }

  function handleReset() {
    resetProgress();
    setProgress(loadProgress());
  }

  return (
    <main className="appShell">
      <section className="hero">
        <div className="heroArtwork" aria-hidden="true">
          <img src="./quest-badge.svg" alt="" />
        </div>
        <div className="heroText">
          <p className="eyebrow">Local-first AtCoder Roadmap</p>
          <h1>AtCoder Quest</h1>
          <p>
            アルゴリズムとデータ構造をワールドマップで進める、GitHub Pages 向けの学習ゲームプロトタイプ。
          </p>
        </div>
        <div className="heroStats" aria-label="機能">
          <span><Map size={17} /> World map</span>
          <span><BookOpen size={17} /> C++ notes</span>
          <span><Sparkles size={17} /> LocalStorage</span>
        </div>
      </section>

      <div className="layout">
        <div className="mapColumn">
          <WorldMap worlds={worlds} progress={progress} selectedStageId={selectedStage.id} onSelectStage={handleSelectStage} />
        </div>
        <div className="sideColumn">
          <ProgressPanel
            progress={progress}
            onAudioToggle={() => updateProgress((current) => ({ ...current, audioEnabled: !current.audioEnabled }))}
            onVolumeChange={(volume) => updateProgress((current) => ({ ...current, volume }))}
            onReset={handleReset}
          />
          <StageDetail
            stage={selectedStage}
            status={selectedStatus}
            progress={progress}
            onClear={handleClear}
            onOpenCode={setCodeStage}
          />
        </div>
      </div>

      <AnimatePresence>
        {codeStage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CodeModal stage={codeStage} onClose={() => setCodeStage(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
