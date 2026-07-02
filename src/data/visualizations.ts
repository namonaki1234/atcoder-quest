import type { Stage } from "../types";

export type VisualKind = "graph" | "union-find" | "stack" | "array" | "tree";

export type VisualizationStep = {
  label: string;
  detail: string;
  activeNodes?: number[];
  activeEdges?: string[];
  queue?: string[];
  stack?: string[];
  bars?: number[];
  pointer?: number;
  groups?: number[][];
};

export type VisualizationScenario = {
  kind: VisualKind;
  title: string;
  nodes: { id: number; x: number; y: number; label: string }[];
  edges: { id: string; from: number; to: number }[];
  steps: VisualizationStep[];
};

const graphNodes = [
  { id: 0, x: 12, y: 50, label: "S" },
  { id: 1, x: 30, y: 24, label: "1" },
  { id: 2, x: 34, y: 74, label: "2" },
  { id: 3, x: 55, y: 36, label: "3" },
  { id: 4, x: 64, y: 72, label: "4" },
  { id: 5, x: 84, y: 50, label: "G" },
];

const graphEdges = [
  { id: "0-1", from: 0, to: 1 },
  { id: "0-2", from: 0, to: 2 },
  { id: "1-3", from: 1, to: 3 },
  { id: "2-4", from: 2, to: 4 },
  { id: "3-5", from: 3, to: 5 },
  { id: "4-5", from: 4, to: 5 },
];

const scenarios: Record<string, VisualizationScenario> = {
  bfs: {
    kind: "graph",
    title: "BFS shortest path wave",
    nodes: graphNodes,
    edges: graphEdges,
    steps: [
      { label: "start", detail: "始点 S を距離 0 としてキューへ入れる。", activeNodes: [0], queue: ["S"] },
      { label: "expand S", detail: "S から 1 と 2 へ同じ距離で波を広げる。", activeNodes: [0, 1, 2], activeEdges: ["0-1", "0-2"], queue: ["1", "2"] },
      { label: "next layer", detail: "キューの先頭から取り出し、未訪問の頂点だけ追加する。", activeNodes: [1, 2, 3, 4], activeEdges: ["1-3", "2-4"], queue: ["3", "4"] },
      { label: "goal", detail: "最初に G へ到達した距離が最短距離になる。", activeNodes: [3, 4, 5], activeEdges: ["3-5", "4-5"], queue: ["G"] },
    ],
  },
  dfs: {
    kind: "graph",
    title: "DFS depth trace",
    nodes: graphNodes,
    edges: graphEdges,
    steps: [
      { label: "enter S", detail: "始点から再帰で深く潜る。", activeNodes: [0], stack: ["S"] },
      { label: "go deep", detail: "未訪問の隣接頂点 1、3 へ進む。", activeNodes: [0, 1, 3], activeEdges: ["0-1", "1-3"], stack: ["S", "1", "3"] },
      { label: "reach G", detail: "G に到達したら戻りがけに情報を集約する。", activeNodes: [1, 3, 5], activeEdges: ["3-5"], stack: ["S", "1", "3", "G"] },
      { label: "backtrack", detail: "戻って別の枝 2、4 も探索する。", activeNodes: [0, 2, 4], activeEdges: ["0-2", "2-4"], stack: ["S", "2", "4"] },
    ],
  },
  union_find: {
    kind: "union-find",
    title: "Union-Find merge",
    nodes: [],
    edges: [],
    steps: [
      { label: "init", detail: "各頂点が自分だけの集合として始まる。", groups: [[0], [1], [2], [3], [4], [5]] },
      { label: "merge 0 1", detail: "leader を見て、違う集合なら片方を親にする。", groups: [[0, 1], [2], [3], [4], [5]] },
      { label: "merge 2 3 4", detail: "サイズが大きい集合へぶら下げると木が浅くなる。", groups: [[0, 1], [2, 3, 4], [5]] },
      { label: "same?", detail: "leader を圧縮しながら同じ集合かを判定する。", groups: [[0, 1, 2, 3, 4], [5]] },
    ],
  },
  stack: {
    kind: "stack",
    title: "Stack push / pop",
    nodes: [],
    edges: [],
    steps: [
      { label: "read", detail: "左から順に見て、未処理の値を stack に積む。", stack: ["3"], bars: [3, 1, 4, 2, 5], pointer: 0 },
      { label: "push", detail: "単調性が壊れない間は候補として保持する。", stack: ["3", "1"], bars: [3, 1, 4, 2, 5], pointer: 1 },
      { label: "pop", detail: "条件を満たさない要素を取り除き、答えに反映する。", stack: ["4"], bars: [3, 1, 4, 2, 5], pointer: 2 },
      { label: "finish", detail: "最後まで走査し、残った候補を処理する。", stack: ["5"], bars: [3, 1, 4, 2, 5], pointer: 4 },
    ],
  },
  segment_tree: {
    kind: "tree",
    title: "Segment tree query",
    nodes: [],
    edges: [],
    steps: [
      { label: "leaves", detail: "配列の値を葉に置き、親へ集約する。", activeNodes: [7, 8, 9, 10, 11, 12, 13, 14] },
      { label: "build", detail: "各内部ノードは担当区間の集約値を持つ。", activeNodes: [3, 4, 5, 6] },
      { label: "query", detail: "必要な区間だけを拾い、O(log N) 個のノードで答える。", activeNodes: [4, 5] },
      { label: "update", detail: "一点更新後、根まで再計算する。", activeNodes: [10, 5, 2, 1] },
    ],
  },
  fenwick: {
    kind: "array",
    title: "Fenwick prefix sum",
    nodes: [],
    edges: [],
    steps: [
      { label: "index", detail: "1-indexed にして、末尾の 1 bit を見る。", bars: [2, 5, 1, 9, 3, 7, 4, 6], pointer: 2 },
      { label: "add", detail: "i += i & -i で担当区間を上へ更新する。", bars: [2, 7, 1, 11, 3, 7, 4, 17], pointer: 3 },
      { label: "sum", detail: "i -= i & -i で必要な塊を足していく。", bars: [2, 7, 1, 11, 3, 7, 4, 17], pointer: 7 },
      { label: "answer", detail: "累積和の差で区間和も高速に求まる。", bars: [2, 7, 1, 11, 3, 7, 4, 17], pointer: 5 },
    ],
  },
};

const fallback: VisualizationScenario = {
  kind: "array",
  title: "Algorithm state transition",
  nodes: [],
  edges: [],
  steps: [
    { label: "input", detail: "入力を読み、状態として保持する。", bars: [4, 2, 7, 1, 6, 3], pointer: 0 },
    { label: "scan", detail: "条件を満たす候補を調べる。", bars: [4, 2, 7, 1, 6, 3], pointer: 2 },
    { label: "update", detail: "最良値や DP テーブルを更新する。", bars: [4, 5, 7, 3, 6, 4], pointer: 3 },
    { label: "answer", detail: "集約した値を答えに変換する。", bars: [4, 5, 7, 3, 8, 4], pointer: 4 },
  ],
};

export function getVisualizationScenario(stage: Stage): VisualizationScenario {
  if (scenarios[stage.id]) return scenarios[stage.id];
  if (stage.id.includes("stack")) return scenarios.stack;
  if (stage.id.includes("queue") || stage.id.includes("graph")) return scenarios.bfs;
  if (stage.id.includes("segment")) return scenarios.segment_tree;
  if (stage.id.includes("fenwick")) return scenarios.fenwick;
  return fallback;
}
