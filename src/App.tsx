import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Map, Sparkles } from "lucide-react";
import { CodeModal } from "./components/CodeModal";
import { ProgressPanel } from "./components/ProgressPanel";
import { StageDetail } from "./components/StageDetail";
import { VisualizerModal } from "./components/VisualizerModal";
import { WorldMap } from "./components/WorldMap";
import { worlds } from "./data/curriculum";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useProgress } from "./hooks/useProgress";
import type { Stage } from "./types";
import { getStageStatus } from "./utils/progress";

export default function App() {
  const [codeStage, setCodeStage] = useState<Stage | null>(null);
  const [visualStage, setVisualStage] = useState<Stage | null>(null);
  const {
    progress,
    selectedStage,
    selectedStatus,
    selectStage,
    markCleared,
    setAudioEnabled,
    setVolume,
    reset,
  } = useProgress();
  const audio = useAudioEngine({ enabled: progress.audioEnabled, volume: progress.volume });

  function handleSelectStage(stage: Stage) {
    const status = getStageStatus(stage, progress);
    if (status === "locked") audio.playLocked();
    else audio.playSelect();
    selectStage(stage);
  }

  function handleClear(stage: Stage) {
    audio.playClear();
    markCleared(stage);
  }

  function handleAudioToggle() {
    const nextEnabled = !progress.audioEnabled;
    setAudioEnabled(nextEnabled);
    if (nextEnabled) audio.startBgm(true);
    else audio.stopBgm();
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
            onAudioToggle={handleAudioToggle}
            onVolumeChange={setVolume}
            onReset={reset}
          />
          <StageDetail
            stage={selectedStage}
            status={selectedStatus}
            progress={progress}
            onClear={handleClear}
            onOpenCode={setCodeStage}
            onOpenVisualizer={setVisualStage}
          />
        </div>
      </div>

      <AnimatePresence>
        {codeStage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CodeModal stage={codeStage} onClose={() => setCodeStage(null)} />
          </motion.div>
        )}
        {visualStage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VisualizerModal stage={visualStage} onClose={() => setVisualStage(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
