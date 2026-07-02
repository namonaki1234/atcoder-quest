import { useEffect, useMemo, useState } from "react";
import { allStages } from "../data/curriculum";
import { loadProgress, resetProgress, saveProgress } from "../storage/progressStorage";
import type { QuestProgress, Stage } from "../types";
import { clearStage, getStageStatus } from "../utils/progress";

export function useProgress() {
  const [progress, setProgress] = useState<QuestProgress>(() => loadProgress());

  const selectedStage = useMemo(
    () => allStages.find((stage) => stage.id === progress.selectedStageId) ?? allStages[0],
    [progress.selectedStageId],
  );
  const selectedStatus = useMemo(() => getStageStatus(selectedStage, progress), [progress, selectedStage]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function updateProgress(updater: (value: QuestProgress) => QuestProgress) {
    setProgress((current) => updater(current));
  }

  function selectStage(stage: Stage) {
    updateProgress((current) => ({ ...current, selectedStageId: stage.id }));
  }

  function markCleared(stage: Stage) {
    updateProgress((current) => clearStage(current, stage));
  }

  function setAudioEnabled(audioEnabled: boolean) {
    updateProgress((current) => ({ ...current, audioEnabled }));
  }

  function setVolume(volume: number) {
    updateProgress((current) => ({ ...current, volume }));
  }

  function reset() {
    resetProgress();
    setProgress(loadProgress());
  }

  return {
    progress,
    selectedStage,
    selectedStatus,
    selectStage,
    markCleared,
    setAudioEnabled,
    setVolume,
    reset,
  };
}
