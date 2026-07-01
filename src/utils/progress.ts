import { allStages, worlds } from "../data/curriculum";
import type { QuestProgress, Stage, StageStatus } from "../types";

export const defaultProgress: QuestProgress = {
  currentScore: 0,
  audioEnabled: false,
  volume: 0.45,
  clearedStages: {},
};

export function getStageStatus(stage: Stage, progress: QuestProgress): StageStatus {
  if (progress.clearedStages[stage.id]?.cleared) return "cleared";
  if (!stage.unlockAfter) return "available";
  return progress.clearedStages[stage.unlockAfter]?.cleared ? "available" : "locked";
}

export function getStars(stage: Stage): number {
  const ratio = stage.total === 0 ? 0 : stage.solved / stage.total;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.15) return 2;
  return 1;
}

export function clearStage(progress: QuestProgress, stage: Stage): QuestProgress {
  if (progress.clearedStages[stage.id]?.cleared) return progress;
  const stars = getStars(stage);
  return {
    ...progress,
    currentScore: progress.currentScore + stars * 40,
    selectedStageId: stage.id,
    clearedStages: {
      ...progress.clearedStages,
      [stage.id]: {
        cleared: true,
        clearedAt: new Date().toISOString(),
        stars,
      },
    },
  };
}

export function getOverallProgress(progress: QuestProgress) {
  const total = allStages.length;
  const cleared = allStages.filter((stage) => progress.clearedStages[stage.id]?.cleared).length;
  return {
    total,
    cleared,
    percent: total === 0 ? 0 : Math.round((cleared / total) * 1000) / 10,
  };
}

export function getWorldProgress(worldId: string, progress: QuestProgress) {
  const world = worlds.find((item) => item.id === worldId);
  if (!world) return { total: 0, cleared: 0, percent: 0 };
  const cleared = world.stages.filter((stage) => progress.clearedStages[stage.id]?.cleared).length;
  return {
    total: world.stages.length,
    cleared,
    percent: world.stages.length === 0 ? 0 : Math.round((cleared / world.stages.length) * 100),
  };
}
