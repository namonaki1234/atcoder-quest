# AtCoder Quest

AtCoder のアルゴリズム学習をゲーム風ロードマップで進める、サーバーレスな React アプリです。

## Features

- ワールドマップ形式の学習ロードマップ
- ステージのアンロックとクリア状態管理
- LocalStorage による進捗保存
- C++ 参考コードのモーダル表示とコピー
- 簡易ビジュアライザー、音量設定、リセット操作
- GitHub Pages 用の Actions デプロイ

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm test
npm run build
```

## Deploy

`main` ブランチへ push すると `.github/workflows/deploy-pages.yml` が `dist` をビルドして GitHub Pages にデプロイします。
