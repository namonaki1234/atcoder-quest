import { CheckCircle2, Code2, Lock, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import type { QuestProgress, Stage, StageStatus } from "../types";
import { getStars } from "../utils/progress";
import { Visualizer } from "./Visualizer";

type Props = {
  stage: Stage;
  status: StageStatus;
  progress: QuestProgress;
  onClear: (stage: Stage) => void;
  onOpenCode: (stage: Stage) => void;
};

export function StageDetail({ stage, status, progress, onClear, onOpenCode }: Props) {
  const stars = progress.clearedStages[stage.id]?.stars ?? getStars(stage);
  const solvedPercent = stage.total === 0 ? 0 : Math.round((stage.solved / stage.total) * 1000) / 10;

  return (
    <motion.section className="stageDetail" layout>
      <div className="stageDetailHeader">
        <div>
          <p className="eyebrow">{stage.difficulty}</p>
          <h2>{stage.title}</h2>
          <p>{stage.summary}</p>
        </div>
        <div className={`statusBadge ${status}`}>
          {status === "locked" ? <Lock size={17} /> : status === "cleared" ? <Trophy size={17} /> : <CheckCircle2 size={17} />}
          {status}
        </div>
      </div>

      <div className="statGrid">
        <div>
          <span>回答状況</span>
          <strong>{stage.solved} / {stage.total}</strong>
        </div>
        <div>
          <span>演習率</span>
          <strong>{solvedPercent}%</strong>
        </div>
        <div>
          <span>星</span>
          <strong>{"*".repeat(stars)}</strong>
        </div>
      </div>

      <Visualizer stage={stage} />

      <div className="detailActions">
        <button className="secondaryButton" type="button" onClick={() => onOpenCode(stage)}>
          <Code2 size={18} />
          Code
        </button>
        <button className="primaryButton" type="button" disabled={status === "locked" || status === "cleared"} onClick={() => onClear(stage)}>
          <CheckCircle2 size={18} />
          {status === "cleared" ? "Cleared" : "理解した"}
        </button>
      </div>
    </motion.section>
  );
}
