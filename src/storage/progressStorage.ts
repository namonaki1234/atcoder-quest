import type { QuestProgress } from "../types";
import { defaultProgress } from "../utils/progress";

const STORAGE_KEY = "atcoder_quest_progress";

export function loadProgress(): QuestProgress {
  if (typeof window === "undefined") return defaultProgress;

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return defaultProgress;

  try {
    const parsed = JSON.parse(rawValue) as Partial<QuestProgress>;
    return {
      ...defaultProgress,
      ...parsed,
      clearedStages: parsed.clearedStages ?? {},
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: QuestProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress, null, 2));
}

export function resetProgress() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export { STORAGE_KEY };
