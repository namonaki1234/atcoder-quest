import { Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { QuestProgress, Stage, World } from "../types";
import { getStageStatus, getWorldProgress } from "../utils/progress";

type Props = {
  worlds: World[];
  progress: QuestProgress;
  selectedStageId: string;
  onSelectStage: (stage: Stage) => void;
};

export function WorldMap({ worlds, progress, selectedStageId, onSelectStage }: Props) {
  return (
    <div className="worldStack">
      {worlds.map((world, worldIndex) => {
        const worldProgress = getWorldProgress(world.id, progress);
        return (
          <section className="worldBand" key={world.id}>
            <header className="worldHeader">
              <div>
                <p className="eyebrow">World {worldIndex + 1} / {world.theme}</p>
                <h2>{world.title}</h2>
                <p>{world.description}</p>
              </div>
              <div className="worldProgress">
                <span>{worldProgress.cleared} / {worldProgress.total}</span>
                <div className="miniMeter"><span style={{ width: `${worldProgress.percent}%` }} /></div>
              </div>
            </header>

            <div className="stagePath">
              {world.stages.map((stage, index) => {
                const status = getStageStatus(stage, progress);
                const selected = selectedStageId === stage.id;
                const cleared = progress.clearedStages[stage.id];
                return (
                  <motion.button
                    className={`stageNode ${status} ${selected ? "selected" : ""}`}
                    key={stage.id}
                    type="button"
                    style={{ marginTop: index % 2 === 0 ? 0 : 34 }}
                    whileHover={status === "locked" ? undefined : { y: -5 }}
                    whileTap={status === "locked" ? undefined : { scale: 0.96 }}
                    onClick={() => onSelectStage(stage)}
                    aria-label={`${stage.title}: ${status}`}
                  >
                    <span className="stageIcon">
                      {status === "locked" ? <Lock size={20} /> : <Star size={21} fill={status === "cleared" ? "currentColor" : "none"} />}
                    </span>
                    <span className="stageTitle">{stage.title}</span>
                    <span className="stageSolved">{stage.solved}/{stage.total}</span>
                    {cleared?.clearedAt && <span className="clearedDot" aria-hidden="true" />}
                  </motion.button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
