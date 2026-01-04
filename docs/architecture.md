# システムアーキテクチャ

## 概要

距離感診断は、React.js + Viteで構築されたクライアントサイドアプリケーションです。ブラウザのlocalStorageを使用してデータを保存し、URLパラメータによる結果共有を実現しています。

## 技術スタック

- **フレームワーク**: React.js 18+
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **ルーティング**: React Router DOM
- **UIコンポーネント**: Radix UI
- **データストレージ**: localStorage（ブラウザ）

## ディレクトリ構造

```
/Users/tsukuikiichi/Documents/Duo診断/
├── docs/                          # ドキュメント
│   ├── README.md
│   ├── requirements.md
│   ├── progress.md
│   ├── scoring_system.md
│   ├── question_design_guidelines.md
│   ├── questions_and_calculation.md
│   └── architecture.md
├── public/                        # 静的ファイル
├── src/
│   ├── components/               # 再利用可能なコンポーネント
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── QuestionBlock.jsx    # 質問表示コンポーネント
│   │   ├── QuestionCard.jsx
│   │   ├── QuestionPreview.jsx
│   │   └── ui/                  # UIコンポーネント（Radix UI）
│   ├── data/                    # データファイル
│   │   ├── questions.js         # 30問の質問データ
│   │   └── pairTypes.js         # 10段階のペアタイプ
│   ├── pages/                   # ページコンポーネント
│   │   ├── TopPage.jsx          # トップページ（Q1-5プレビュー）
│   │   ├── DiagnosisPage.jsx    # 診断ページ（Q6-30）
│   │   ├── ResultPage.jsx       # 結果ページ
│   │   ├── NotePage.jsx         # タイプ別解説ページ
│   │   └── FAQPage.jsx          # FAQページ
│   ├── utils/                   # ユーティリティ関数
│   │   └── scoreCalculator.js   # スコア計算ロジック
│   ├── App.jsx                  # メインアプリケーション
│   └── main.jsx                 # エントリーポイント
├── package.json
└── vite.config.js
```

## データフロー

### 1. 質問回答フロー

```
ユーザー
  ↓
QuestionBlock (回答入力)
  ↓
DiagnosisPage (状態管理)
  ↓
localStorage (自動保存)
  ↓
scoreCalculator (計算)
  ↓
ResultPage (結果表示)
```

### 2. スコア計算フロー

```
answersA, answersB (localStorage)
  ↓
calculateResults()
  ↓
各質問のポイント計算 (+3〜-3点)
  ↓
scoreA, scoreB (個人スコア)
  ↓
distanceScorePercent (距離感スコア %)
  ↓
compatibilityScorePercent (相性スコア %)
  ↓
pairType (10段階分類)
```

## 主要コンポーネント

### QuestionBlock

**役割**: 個別の質問を表示し、6段階の回答を受け付ける

**Props**:
- `question`: 質問オブジェクト
- `index`: 質問番号
- `answer`: 現在の回答値（0-5）
- `onAnswer`: 回答変更時のコールバック
- `onAnswerChange`: 新規回答時のコールバック（自動スクロール用）

**機能**:
- 6段階の円形選択UI
- 回答の視覚的フィードバック
- 自動スクロールトリガー

### DiagnosisPage

**役割**: 診断の進行を管理

**状態管理**:
- `currentPage`: 現在のページ（0-5）
- `answers`: 回答データ（{questionId: answerValue}）
- `isCompleted`: 診断完了フラグ

**機能**:
- ページネーション（5問/ページ）
- 回答の自動保存
- 進捗表示
- A/B役割の管理

### scoreCalculator

**役割**: スコア計算のロジックを提供

**関数**:
- `calculateResults(answersA, answersB)`: メイン計算関数
- `encodeAnswers(answers)`: URL用エンコード
- `decodeAnswers(encoded)`: URL用デコード

**出力**:
```javascript
{
  scoreA: number,              // -90〜+90
  scoreB: number,              // -90〜+90
  distanceScorePercent: number, // 0-100%
  compatibilityScorePercent: number // 0-100%
}
```

### ResultPage

**役割**: 診断結果の表示

**機能**:
- 距離感スコアの%表示
- 相性スコアの%表示
- ペアタイプの表示
- 共有機能

## データ構造

### Question

```javascript
{
  id: number,              // 1-30
  text: string,            // 質問文
  closer_side: 'left' | 'right'  // 距離感が近い方向
}
```

### Answer

```javascript
{
  [questionId]: number  // 0-5
}
```

### PairType

```javascript
{
  id: number,
  name: string,
  scoreRange: [number, number],  // [0, 10], [11, 20], ...
  description: string,
  note_title: string,
  note_content: string,
  characteristics: string[],
  advice: string[]
}
```

## 状態管理

### localStorage キー

- `diagnosis_answers_a`: Aさんの回答データ
- `diagnosis_answers_b`: Bさんの回答データ

### データの永続化

- ページ遷移時にも回答が保持される
- ブラウザを閉じても回答が残る
- 結果ページで両方の回答を読み込んで計算

## ルーティング

```
/ → TopPage
/diagnosis/a → DiagnosisPage (Aさん)
/diagnosis/b → DiagnosisPage (Bさん)
/result → ResultPage
/note → NotePage
/faq → FAQPage
```

## パフォーマンス最適化

1. **コード分割**: ページごとにコード分割（Viteが自動実装）
2. **自動保存**: localStorageへの書き込みはdebounce不要（軽量）
3. **画像最適化**: 必要に応じて画像の遅延読み込み
4. **CSS最適化**: Tailwind CSSのJITコンパイル

## セキュリティ

- クライアントサイドのみの実装
- localStorageは同一オリジンのみアクセス可能
- URLパラメータはBase64エンコード（軽量な難読化）

## 今後の拡張

- **バックエンド連携**: 診断結果のサーバー保存
- **認証機能**: ユーザーアカウント管理
- **履歴機能**: 過去の診断結果の閲覧
- **分析機能**: 診断結果の統計・分析

