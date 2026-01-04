# 距離感診断 - Duo診断アプリケーション

二人の「距離感」を診断するWebアプリケーション。30問の質問に基づいて、距離感スコアと相性スコアを算出し、10段階のペアタイプを表示します。

## デプロイ

### Cloudflare Pages

このプロジェクトはCloudflare Pagesでデプロイされています。

**URL**: https://duoshindan-1.pages.dev/

### ビルドコマンド

```bash
npm run build
```

ビルド出力ディレクトリ: `dist`

### 環境設定

Cloudflare Pagesの設定：
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node version**: 18.x以上を推奨

## 開発

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ローカルサーバーは `http://localhost:3000` で起動します。

## 機能

- 30問の診断質問
- 6段階の回答選択UI
- 距離感スコア・相性スコア計算
- 10段階のペアタイプ表示
- レスポンシブデザイン
- SEO対策（メタタグ、構造化データ、sitemap）

## 技術スタック

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion

## ライセンス

Private

