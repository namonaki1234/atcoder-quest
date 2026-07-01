import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Stage } from "../types";

type Props = {
  stage: Stage;
};

const steps = [
  "入力を状態として読む",
  "候補をデータ構造へ入れる",
  "条件を満たす遷移だけ採用する",
  "答えへ反映して次へ進む",
];

export function Visualizer({ stage }: Props) {
  const [step, setStep] = useState(0);
  const nodes = useMemo(() => Array.from({ length: 6 }, (_, index) => index), [stage.id]);

  return (
    <section className="visualizer" aria-label="アルゴリズムのビジュアル">
      <div className="visualTop">
        <div>
          <p className="eyebrow">Visualizer</p>
          <h3>{steps[step]}</h3>
        </div>
        <div className="stepControls">
          <button className="iconButton" type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} aria-label="前のステップ">
            <ChevronLeft size={18} />
          </button>
          <span>{step + 1} / {steps.length}</span>
          <button className="iconButton" type="button" onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} aria-label="次のステップ">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="nodeTrack">
        {nodes.map((node) => {
          const active = node <= step + 1;
          return (
            <motion.div
              className={active ? "node active" : "node"}
              key={`${stage.id}-${node}`}
              animate={{ y: active ? [0, -10, 0] : 0, scale: active ? 1.04 : 1 }}
              transition={{ duration: 0.42, delay: node * 0.04 }}
            >
              {node + 1}
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          className="visualCaption"
          key={`${stage.id}-${step}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {stage.summary}
        </motion.p>
      </AnimatePresence>
    </section>
  );
}
