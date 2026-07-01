import { Check, Clipboard, X } from "lucide-react";
import { useState } from "react";
import type { Stage } from "../types";

type Props = {
  stage: Stage;
  onClose: () => void;
};

export function CodeModal({ stage, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(stage.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="modalBackdrop" role="presentation" onMouseDown={onClose}>
      <section className="codeModal" role="dialog" aria-modal="true" aria-label={`${stage.title} の C++ コード`} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modalHeader">
          <div>
            <p className="eyebrow">C++ Reference</p>
            <h2>{stage.title}</h2>
          </div>
          <button className="iconButton" type="button" onClick={onClose} aria-label="閉じる">
            <X size={20} />
          </button>
        </header>
        <pre className="codeBlock">
          <code>{stage.code}</code>
        </pre>
        <footer className="modalActions">
          <button className="primaryButton" type="button" onClick={handleCopy}>
            {copied ? <Check size={18} /> : <Clipboard size={18} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </footer>
      </section>
    </div>
  );
}
