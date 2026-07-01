export type StageStatus = "locked" | "available" | "cleared";

export type Stage = {
  id: string;
  title: string;
  solved: number;
  total: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  summary: string;
  unlockAfter?: string;
  code: string;
};

export type World = {
  id: string;
  title: string;
  theme: string;
  description: string;
  stages: Stage[];
};

export type ClearedStage = {
  cleared: boolean;
  clearedAt?: string;
  stars: number;
};

export type QuestProgress = {
  currentScore: number;
  audioEnabled: boolean;
  volume: number;
  selectedStageId?: string;
  clearedStages: Record<string, ClearedStage>;
};
