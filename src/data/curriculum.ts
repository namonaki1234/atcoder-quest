import type { World } from "../types";

const unionFindCode = `struct DSU {
    vector<int> parent, size;
    DSU(int n) : parent(n), size(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    int leader(int x) {
        if (parent[x] == x) return x;
        return parent[x] = leader(parent[x]);
    }
    bool same(int a, int b) {
        return leader(a) == leader(b);
    }
    bool merge(int a, int b) {
        a = leader(a); b = leader(b);
        if (a == b) return false;
        if (size[a] < size[b]) swap(a, b);
        parent[b] = a;
        size[a] += size[b];
        return true;
    }
};`;

const bfsCode = `vector<int> dist(n, -1);
queue<int> que;
dist[start] = 0;
que.push(start);
while (!que.empty()) {
    int v = que.front();
    que.pop();
    for (int to : graph[v]) {
        if (dist[to] != -1) continue;
        dist[to] = dist[v] + 1;
        que.push(to);
    }
}`;

const fenwickCode = `template<class T>
struct Fenwick {
    int n;
    vector<T> bit;
    Fenwick(int n) : n(n), bit(n + 1, 0) {}
    void add(int index, T value) {
        for (++index; index <= n; index += index & -index) bit[index] += value;
    }
    T sumPrefix(int index) {
        T result = 0;
        for (++index; index > 0; index -= index & -index) result += bit[index];
        return result;
    }
};`;

const genericCode = (title: string) => `// ${title}
// ここに典型コード、注意点、計算量を追記して育てていく想定です。
// AtCoder Problems の問題リンクや自分用メモも stage データへ追加できます。`;

export const worlds: World[] = [
  {
    id: "data_structure",
    title: "データ構造",
    theme: "Forest Circuit",
    description: "集合、列、区間、優先順位を扱うための道具箱を集めるワールド。",
    stages: [
      { id: "set", title: "集合（set）", solved: 0, total: 65, difficulty: "beginner", summary: "重複除去、存在判定、集合演算を安定して扱う。", code: genericCode("集合（set）") },
      { id: "map", title: "連想配列（map・dict）", solved: 0, total: 45, difficulty: "beginner", summary: "頻度表、座標圧縮、状態管理の基本になるキーと値の管理。", unlockAfter: "set", code: genericCode("連想配列（map・dict）") },
      { id: "sorted_set", title: "順序付き集合（set・SortedSet）", solved: 0, total: 44, difficulty: "intermediate", summary: "大小関係を保ったまま、近傍探索や順位を扱う。", unlockAfter: "map", code: genericCode("順序付き集合") },
      { id: "union_find", title: "Union-Find", solved: 2, total: 58, difficulty: "beginner", summary: "グループの併合と同一判定をほぼ定数時間で処理する。", unlockAfter: "sorted_set", code: unionFindCode },
      { id: "weighted_union_find", title: "ポテンシャル付き Union-Find", solved: 0, total: 7, difficulty: "advanced", summary: "差分制約を持つ集合を管理し、矛盾検出にも使う。", unlockAfter: "union_find", code: genericCode("ポテンシャル付き Union-Find") },
      { id: "stack", title: "スタック（stack）", solved: 1, total: 37, difficulty: "beginner", summary: "直前の状態へ戻る処理、単調性、括弧列の土台。", unlockAfter: "union_find", code: genericCode("スタック") },
      { id: "queue", title: "キュー（queue）", solved: 0, total: 10, difficulty: "beginner", summary: "先入れ先出しで探索やシミュレーションを自然に書く。", unlockAfter: "stack", code: genericCode("キュー") },
      { id: "priority_queue", title: "優先度付きキュー", solved: 0, total: 45, difficulty: "intermediate", summary: "常に最大・最小の候補を取り出す貪欲法の主役。", unlockAfter: "queue", code: genericCode("優先度付きキュー") },
      { id: "segment_tree", title: "セグメント木", solved: 0, total: 66, difficulty: "advanced", summary: "区間クエリと一点更新を高速にさばく王道データ構造。", unlockAfter: "priority_queue", code: genericCode("セグメント木") },
      { id: "fenwick", title: "BIT / Fenwick 木", solved: 0, total: 39, difficulty: "intermediate", summary: "累積和の更新と取得を短い実装で高速化する。", unlockAfter: "segment_tree", code: fenwickCode },
      { id: "interval_set", title: "区間を set で管理するテク", solved: 0, total: 13, difficulty: "advanced", summary: "塗り替えや連続区間の分割・結合を管理する。", unlockAfter: "fenwick", code: genericCode("interval set") },
      { id: "doubling", title: "ダブリング", solved: 0, total: 18, difficulty: "intermediate", summary: "2 の冪ジャンプで遷移や祖先探索を高速化する。", unlockAfter: "interval_set", code: genericCode("ダブリング") },
    ],
  },
  {
    id: "search",
    title: "探索・シミュレーション",
    theme: "Clockwork Plains",
    description: "全探索、再帰、実装力を鍛えて、解法候補を漏れなく調べる。",
    stages: [
      { id: "recursion", title: "再帰関数", solved: 0, total: 35, difficulty: "beginner", summary: "問題を小さく分け、終了条件と再帰ステップで表す。", code: genericCode("再帰関数") },
      { id: "bit_search", title: "ビット全探索", solved: 0, total: 37, difficulty: "beginner", summary: "選ぶ・選ばないの 2 択を整数のビットで走査する。", unlockAfter: "recursion", code: genericCode("ビット全探索") },
      { id: "permutation", title: "順列全探索", solved: 0, total: 23, difficulty: "beginner", summary: "並び順の候補を列挙し、制約内で最良を選ぶ。", unlockAfter: "bit_search", code: genericCode("順列全探索") },
      { id: "recursive_search", title: "再帰全探索", solved: 0, total: 35, difficulty: "intermediate", summary: "枝刈りや状態復元を含む探索の基本フォーム。", unlockAfter: "permutation", code: genericCode("再帰全探索") },
    ],
  },
  {
    id: "dynamic_programming",
    title: "動的計画法",
    theme: "Crystal Library",
    description: "状態を定義し、再利用できる小問題へ分解するワールド。",
    stages: [
      { id: "digit_dp", title: "桁 DP", solved: 0, total: 17, difficulty: "advanced", summary: "上限以下の数を桁ごとの状態として数え上げる。", code: genericCode("桁 DP") },
      { id: "lis", title: "LIS", solved: 0, total: 10, difficulty: "intermediate", summary: "最長増加部分列を DP と二分探索で高速に求める。", unlockAfter: "digit_dp", code: genericCode("LIS") },
    ],
  },
  {
    id: "graph",
    title: "グラフ",
    theme: "Skyline Rails",
    description: "頂点と辺で世界を表現し、到達性、距離、流れを攻略する。",
    stages: [
      { id: "graph_basic", title: "グラフの基礎", solved: 0, total: 11, difficulty: "beginner", summary: "隣接リスト、次数、連結性など表現の基本を固める。", code: genericCode("グラフの基礎") },
      { id: "dfs", title: "深さ優先探索（DFS）", solved: 2, total: 60, difficulty: "beginner", summary: "奥へ進む探索で連結成分、木 DP、トポロジカル順序へつなげる。", unlockAfter: "graph_basic", code: genericCode("DFS") },
      { id: "bfs", title: "幅優先探索（BFS）", solved: 2, total: 78, difficulty: "beginner", summary: "辺重み 1 の最短距離や状態遷移を層ごとに探索する。", unlockAfter: "dfs", code: bfsCode },
      { id: "max_flow", title: "フロー：最大流・最小カット", solved: 0, total: 76, difficulty: "expert", summary: "容量制約つきネットワークの最大輸送量とカットを扱う。", unlockAfter: "bfs", code: genericCode("最大流・最小カット") },
      { id: "min_cost_flow", title: "フロー：最小費用流", solved: 0, total: 30, difficulty: "expert", summary: "流量に加えてコスト最小化を考える発展テーマ。", unlockAfter: "max_flow", code: genericCode("最小費用流") },
      { id: "bipartite_matching", title: "フロー：二部マッチング", solved: 0, total: 29, difficulty: "advanced", summary: "左右の集合を最適に対応付ける典型問題群。", unlockAfter: "max_flow", code: genericCode("二部マッチング") },
    ],
  },
  {
    id: "math",
    title: "数学・数え上げ",
    theme: "Number Citadel",
    description: "整数論、包除、期待値を武器に、数式の形へ落とし込む。",
    stages: [
      { id: "integer_search", title: "整数系探索問題", solved: 0, total: 40, difficulty: "intermediate", summary: "制約と単調性を読み、探索範囲を絞る。", code: genericCode("整数系探索問題") },
      { id: "factorization", title: "素数判定・約数列挙・素因数分解", solved: 0, total: 30, difficulty: "beginner", summary: "約数と素因数の基本操作を O(sqrt N) から理解する。", unlockAfter: "integer_search", code: genericCode("素因数分解") },
      { id: "sieve", title: "エラトステネスの篩", solved: 0, total: 14, difficulty: "beginner", summary: "多数の素数判定を前処理で高速化する。", unlockAfter: "factorization", code: genericCode("エラトステネスの篩") },
      { id: "inclusion_exclusion", title: "包除原理", solved: 0, total: 33, difficulty: "advanced", summary: "重複を足し引きして条件を満たす個数を数える。", unlockAfter: "sieve", code: genericCode("包除原理") },
    ],
  },
  {
    id: "optimization",
    title: "最適化",
    theme: "Greedy Harbor",
    description: "評価関数、交換 argument、辞書順など、最善手の理由を鍛える。",
    stages: [
      { id: "greedy", title: "貪欲法", solved: 1, total: 145, difficulty: "intermediate", summary: "局所的な選択が全体最適になる条件を見抜く。", code: genericCode("貪欲法") },
      { id: "greedy_score", title: "貪欲法：評価関数", solved: 0, total: 23, difficulty: "advanced", summary: "何を比べればよいかを定式化する。", unlockAfter: "greedy", code: genericCode("評価関数") },
      { id: "greedy_exchange", title: "貪欲法：交換しても悪化しない", solved: 0, total: 41, difficulty: "advanced", summary: "交換しても損しないことから最適性を示す。", unlockAfter: "greedy_score", code: genericCode("交換 argument") },
      { id: "greedy_future", title: "貪欲法：後によいものを残す", solved: 1, total: 35, difficulty: "advanced", summary: "未来の選択肢を広く保つ戦略を選ぶ。", unlockAfter: "greedy_exchange", code: genericCode("後によいものを残す") },
      { id: "lexicographic", title: "貪欲法：辞書順最小", solved: 0, total: 19, difficulty: "intermediate", summary: "先頭から固定し、可能性を壊さず最小を選ぶ。", unlockAfter: "greedy_future", code: genericCode("辞書順最小") },
    ],
  },
];

export const allStages = worlds.flatMap((world) => world.stages);
