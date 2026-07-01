import { describe, expect, it } from "vitest";
import { allStages } from "../data/curriculum";
import { clearStage, defaultProgress, getOverallProgress, getStageStatus } from "./progress";

describe("quest progress", () => {
  it("starts with root stages available", () => {
    expect(getStageStatus(allStages[0], defaultProgress)).toBe("available");
  });

  it("locks stages until their prerequisite is cleared", () => {
    const lockedStage = allStages.find((stage) => stage.unlockAfter)!;
    expect(getStageStatus(lockedStage, defaultProgress)).toBe("locked");
  });

  it("clears a stage and updates aggregate progress", () => {
    const next = clearStage(defaultProgress, allStages[0]);
    expect(next.clearedStages[allStages[0].id].cleared).toBe(true);
    expect(getOverallProgress(next).cleared).toBe(1);
  });
});
