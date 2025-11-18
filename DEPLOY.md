# サーバーへのアップロード手順書

このサイトを実際にタブレットで見られるようにするための手順です。

---

## 🅰️ 方法A: GitHub Pages を使う（おすすめ）

### 初回セットアップ

#### 1. GitHubアカウントにログイン
https://github.com にアクセスしてログイン

#### 2. 新しいリポジトリを作成
- 右上の「+」→「New repository」をクリック
- Repository name: `kinugawa-tablet` （任意の名前でOK）
- Public を選択
- 「Create repository」をクリック

#### 3. VS Codeでターミナルを開く
`表示` → `ターミナル` をクリック

#### 4. 以下のコマンドを順番に実行

```bash
cd /作業フォルダのパス/kinugawa-tablet
git init
git add .
git commit -m "初回アップロード"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/kinugawa-tablet.git
git push -u origin main
```

※ `あなたのユーザー名` は実際のGitHubユーザー名に置き換えてください

#### 5. GitHub Pagesを有効化
1. GitHubのリポジトリページを開く
2. 「Settings」→「Pages」をクリック
3. Source: 「main」ブランチを選択
4. 「Save」をクリック
5. 数分後、URL が表示されます（例: `https://あなたのユーザー名.github.io/kinugawa-tablet/`）

---

### 2回目以降の更新方法

`config.json` や画像を変更したら、以下を実行:

```bash
git add .
git commit -m "情報を更新しました"
git push
```

数分後に自動で反映されます。

---

## 🅱️ 方法B: Firebase Hosting を使う

### 初回セットアップ

#### 1. Firebaseプロジェクトを作成
1. https://console.firebase.google.com/ にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: kinugawa-tablet）
4. Google アナリティクスは「今は設定しない」でOK
5. 「プロジェクトを作成」をクリック

#### 2. Firebase CLIをインストール
VS Codeのターミナルで以下を実行:

```bash
npm install -g firebase-tools
```

#### 3. Firebaseにログイン

```bash
firebase login
```

ブラウザが開くので、Googleアカウントでログインします。

#### 4. Firebaseプロジェクトを初期化

```bash
cd /作業フォルダのパス/kinugawa-tablet
firebase init hosting
```

質問には以下のように答えます:
- 「Use an existing project」を選択
- 作成したプロジェクトを選択
- 「What do you want to use as your public directory?」→ `.` (ドット)を入力
- 「Configure as a single-page app?」→ `N` (No)
- 「Set up automatic builds?」→ `N` (No)

#### 5. デプロイ（アップロード）

```bash
firebase deploy
```

完了すると、URL が表示されます（例: `https://kinugawa-tablet.web.app`）

---

### 2回目以降の更新方法

`config.json` や画像を変更したら、以下を実行:

```bash
firebase deploy
```

数分後に反映されます。

---

## 📱 タブレットでの設定

### 1. SafariまたはChromeでURLを開く

GitHub PagesまたはFirebaseのURLをタブレットで開きます。

### 2. ホーム画面に追加

**iPadの場合（Safari）:**
1. 画面下部の「共有」ボタン（□に↑）をタップ
2. 「ホーム画面に追加」をタップ
3. 名前を入力（例: 客室インフォメーション）
4. 「追加」をタップ

### 3. ガイドアクセスを設定（オプション）

タブレットを特定のアプリに固定したい場合:

1. 「設定」→「アクセシビリティ」→「ガイドアクセス」
2. ガイドアクセスをオンにする
3. パスコードを設定
4. ホーム画面のアイコンから開いたら、ホームボタンを3回押す
5. 「開始」をタップ

これで、他のアプリに切り替えられなくなります。

---

## 🔧 トラブルシューティング

### サイトが表示されない

**GitHub Pagesの場合:**
- 数分待ってから再度アクセス
- Settings → Pages でURLが表示されているか確認

**Firebaseの場合:**
- `firebase deploy` が成功したか確認
- Firebase Console でHostingが有効になっているか確認

### 画像が表示されない

- 画像ファイルが `images/` フォルダにあるか確認
- ファイル名が `config.json` と一致しているか確認
- 大文字・小文字を区別するので注意

### JSONエラーが出る

- https://jsonlint.com/ で `config.json` をチェック
- カンマやクォーテーションの抜けがないか確認

---

## 📞 困ったときは

わからないことがあれば、いつでもご連絡ください!

---

作成日: 2025年11月18日
