# ランキングサイト開発プロジェクト

3つの独立したランキングサイトを開発するプロジェクトです。

## 開発対象サイト

1. **FANZAランキングサイト** (ポート8081) - ✅ 完成
2. **Amazonランキングサイト** (ポート8082) - 🚧 開発中
3. **観光地ランキングサイト** (ポート8083) - 🚧 開発中

## 起動方法

### FANZAランキングサイト
```bash
npm run start-fanza
# または
node fanza_ranking.js
```
アクセス: http://localhost:8081

## 技術仕様

- **フレームワーク**: Express.js
- **テンプレートエンジン**: EJS
- **データ保存**: メモリ内配列

## ファイル構成

```
kadai/
├── package.json
├── fanza_ranking.js
├── views/
│   ├── fanza_list.ejs
│   ├── fanza_detail.ejs
│   └── fanza_new.html
├── spec.md
├── task.md
└── README.md
```

## 進捗状況

詳細な進捗は `task.md` を参照してください。