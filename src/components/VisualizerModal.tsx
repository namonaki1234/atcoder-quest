import { X } from "lucide-react";
import type { Stage } from "../types";
import { Visualizer } from "./Visualizer";

type Props = {
  stage: Stage;
  onClose: () => void;
};

export function VisualizerModal({ stage, onClose }: Props) {
  return (
    <div className="modalBackdrop" role="presentation" onMouseDown={onClose}>
      <section className="visualModal" role="dialog" aria-modal="true" aria-label={`${stage.title} の大型ビジュアライザー`} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modalHeader">
          <div>
            <p className="eyebrow">Big Visualizer</p>
            <h2>{stage.title}</h2>
          </div>
          <button className="iconButton" type="button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </header>
        <Visualizer stage={stage} size="large" />
      </section>
    </div>
  );
}
