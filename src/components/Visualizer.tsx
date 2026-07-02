import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getVisualizationScenario } from "../data/visualizations";
import { useStepper } from "../hooks/useStepper";
import type { Stage } from "../types";

type Props = {
  stage: Stage;
  size?: "compact" | "large";
  onExpand?: () => void;
};

export function Visualizer({ stage, size = "compact", onExpand }: Props) {
  const scenario = useMemo(() => getVisualizationScenario(stage), [stage]);
  const [autoPlay, setAutoPlay] = useState(size === "large");
  const { step, setStep, next, previous } = useStepper(scenario.steps.length, autoPlay, size === "large" ? 1250 : 1500);
  const current = scenario.steps[step];

  useEffect(() => {
    setStep(0);
  }, [stage.id, setStep]);

  return (
    <section className={`visualizer ${size}`} aria-label={`${stage.title} のビジュアル`}>
      <div className="visualTop">
        <div>
          <p className="eyebrow">Visualizer</p>
          <h3>{scenario.title}</h3>
        </div>
        <div className="stepControls">
          <button className="iconButton" type="button" onClick={previous} aria-label="前のステップ">
            <ChevronLeft size={18} />
          </button>
          <span>{step + 1} / {scenario.steps.length}</span>
          <button className="iconButton" type="button" onClick={next} aria-label="次のステップ">
            <ChevronRight size={18} />
          </button>
          <button className="iconButton" type="button" onClick={() => setAutoPlay((value) => !value)} aria-label="自動再生">
            {autoPlay ? <Pause size={18} /> : <Play size={18} />}
          </button>
          {onExpand && (
            <button className="iconButton" type="button" onClick={onExpand} aria-label="大きく表示">
              <Maximize2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className={`visualCanvas ${scenario.kind}`}>
        {scenario.kind === "graph" && <GraphScene scenario={scenario} step={step} />}
        {scenario.kind === "union-find" && <UnionFindScene groups={current.groups ?? []} />}
        {scenario.kind === "stack" && <StackScene values={current.stack ?? []} bars={current.bars ?? []} pointer={current.pointer ?? 0} />}
        {scenario.kind === "array" && <ArrayScene bars={current.bars ?? []} pointer={current.pointer ?? 0} />}
        {scenario.kind === "tree" && <TreeScene activeNodes={current.activeNodes ?? []} />}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          className="visualNarration"
          key={`${stage.id}-${step}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <strong>{current.label}</strong>
          <p>{current.detail}</p>
          {(current.queue || current.stack) && (
            <div className="stateChips" aria-label="状態">
              {(current.queue ?? current.stack ?? []).map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

type ScenarioViewProps = {
  scenario: ReturnType<typeof getVisualizationScenario>;
  step: number;
};

function GraphScene({ scenario, step }: ScenarioViewProps) {
  const current = scenario.steps[step];
  const activeNodes = new Set(current.activeNodes ?? []);
  const activeEdges = new Set(current.activeEdges ?? []);

  return (
    <svg className="graphScene" viewBox="0 0 100 100" role="img" aria-label="グラフ探索">
      {scenario.edges.map((edge) => {
        const from = scenario.nodes.find((node) => node.id === edge.from)!;
        const to = scenario.nodes.find((node) => node.id === edge.to)!;
        const active = activeEdges.has(edge.id);
        return (
          <motion.line
            key={edge.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className={active ? "graphEdge active" : "graphEdge"}
            initial={false}
            animate={{ pathLength: active ? 1 : 0.55, opacity: active ? 1 : 0.42 }}
          />
        );
      })}
      {scenario.nodes.map((node) => {
        const active = activeNodes.has(node.id);
        return (
          <motion.g key={node.id} animate={{ scale: active ? 1.15 : 1 }} style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
            <circle className={active ? "graphNode active" : "graphNode"} cx={node.x} cy={node.y} r="6.8" />
            <text x={node.x} y={node.y + 1.6} textAnchor="middle">{node.label}</text>
          </motion.g>
        );
      })}
    </svg>
  );
}

function UnionFindScene({ groups }: { groups: number[][] }) {
  return (
    <div className="unionScene">
      {groups.map((group, groupIndex) => (
        <motion.div className="ufGroup" key={group.join("-")} layout>
          <span className="leader">leader {group[0]}</span>
          <div>
            {group.map((item) => (
              <motion.span className="ufNode" key={item} layout initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
                {item}
              </motion.span>
            ))}
          </div>
          {groupIndex < groups.length - 1 && <span className="ufLink" />}
        </motion.div>
      ))}
    </div>
  );
}

function StackScene({ values, bars, pointer }: { values: string[]; bars: number[]; pointer: number }) {
  return (
    <div className="stackScene">
      <ArrayScene bars={bars} pointer={pointer} />
      <div className="stackTower">
        {values.map((value, index) => (
          <motion.span key={`${value}-${index}`} initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            {value}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function ArrayScene({ bars, pointer }: { bars: number[]; pointer: number }) {
  const max = Math.max(...bars, 1);
  return (
    <div className="arrayScene">
      {bars.map((value, index) => (
        <motion.div className={index === pointer ? "arrayBar active" : "arrayBar"} key={`${index}-${value}`} layout>
          <motion.span animate={{ height: `${22 + (value / max) * 70}%` }} />
          <strong>{value}</strong>
          <small>{index}</small>
        </motion.div>
      ))}
    </div>
  );
}

function TreeScene({ activeNodes }: { activeNodes: number[] }) {
  const active = new Set(activeNodes);
  return (
    <div className="treeScene">
      {Array.from({ length: 15 }, (_, index) => index + 1).map((node) => (
        <motion.div
          className={active.has(node) ? "treeNode active" : "treeNode"}
          key={node}
          animate={{ scale: active.has(node) ? 1.12 : 1 }}
        >
          {node}
        </motion.div>
      ))}
    </div>
  );
}
