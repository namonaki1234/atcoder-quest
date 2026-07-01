import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { QuestProgress } from "../types";
import { getOverallProgress } from "../utils/progress";

type Props = {
  progress: QuestProgress;
  onAudioToggle: () => void;
  onVolumeChange: (volume: number) => void;
  onReset: () => void;
};

export function ProgressPanel({ progress, onAudioToggle, onVolumeChange, onReset }: Props) {
  const overall = getOverallProgress(progress);

  return (
    <aside className="progressPanel" aria-label="進捗">
      <div className="scoreRow">
        <div>
          <p className="eyebrow">Quest Score</p>
          <strong>{progress.currentScore}</strong>
        </div>
        <button className="iconButton" type="button" onClick={onReset} aria-label="進捗をリセット">
          <RotateCcw size={19} />
        </button>
      </div>
      <div>
        <div className="progressMeta">
          <span>{overall.cleared} / {overall.total}</span>
          <span>{overall.percent}%</span>
        </div>
        <div className="meter" aria-label="全体進捗">
          <span style={{ width: `${overall.percent}%` }} />
        </div>
      </div>
      <div className="audioControls">
        <button className="iconButton" type="button" onClick={onAudioToggle} aria-label="サウンド切り替え">
          {progress.audioEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={progress.volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          aria-label="音量"
        />
      </div>
    </aside>
  );
}
