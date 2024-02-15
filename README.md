# しりとり
しりとりぼっとのリポジトリです。
https://piijey.github.io/shiritori で v0.0 (かいはつばん) を公開中。

## インストール
```sh
npm install
```

### 形態素解析器のセットアップ
[kuromoji.js](https://github.com/takuyaa/kuromoji.js) （日本語形態素解析器）を利用します。
npm でインストールした `kuromoji/dict/` 下のファイルを、 `public/` 下にディレクトリごとコピーします。
```sh
cp -r node_modules/kuromoji/dict public/kuromoji-dict
```


## しりとり辞書
ボットのターンで出す単語は、しりとり辞書 [`public/shiritori_dict/nouns.json`](./public/shiritori_dict/nouns.json) から選択します。しりとり辞書は、IPA辞書(`mecab-ipadic-2.7.0-20070801`) に収録されている 一般名詞 (`Noun.csv`)、副詞可能名詞(`Noun.adverbal.csv`)、サ変接続名詞(`Noun.verbal.csv`) を元に作成しました。73,418 語が含まれています。

### 作り方
- [MeCab: Yet Another Part-of-Speech and Morphological Analyzer](https://taku910.github.io/mecab/#download) のリンクから、`mecab-ipadic-2.7.0-20070801.tar.gz` をダウンロードして、解凍します
    ```sh
    cd shiritori_dict/resource/
    tar -zxvf mecab-ipadic-2.7.0-20070801.tar.gz
    ```
- 辞書を作るスクリプトを実行します
    ```sh
    npm run build:dict
    ```

### しりとり辞書の仕様
- 読みの最初の1文字をキーとして、単語の配列が格納されています
- 各単語は、IPA辞書からの surface（表層形）、reading（読み）、cost（コスト）という3つのプロパティを持ちます
```json
{
  "ア": [
    {
      "surface": "アーカイブ",
      "reading": "アーカイブ",
      "cost": "3657"
    },
    //...
    {
      "surface": "藍",
      "reading": "アイ",
      "cost": "5700"
    },
    //...
  ],
//...
}
```


## やること

- [x] テキスト入力、形態素解析器で読みを取得
- [x] 形態素解析器の辞書を読み込んでいる間の画面表示
- [x] しりとりグリッドボードの配置
- [x] ルールの説明
- [x] ゲームの進行状態管理
- [x] プレイヤーのターン・現在の単語の管理
- [x] 入力テキストがルールに沿っているかをチェック
    - [x] 辞書にある名詞か
    - [x] 前の単語の最後の文字から始まっているか
    - [x] まだゲームの中で使われていないか
- [x] 最後の文字を抽出
- [x] ビルド、 https://piijey.github.io/shiritori で公開
- [x] システムのターンで次の単語を選択
    - [x] しりとり辞書の作成
    - [x] しりとり辞書の読み込み、単語選択
- [ ] ルール違反時のターン処理
- [ ] メッセージの内容と表示
- [ ] システムのターンでの単語選択方法の改善
    - [ ] 「ん」で終わる単語を選択する頻度を下げる
    - [ ] コストの高い単語を選択しない
