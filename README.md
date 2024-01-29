# しりとり
【作成中】しりとりぼっとのリポジトリです。

## インストール
```sh
npm install
```

[kuromoji.js](https://github.com/takuyaa/kuromoji.js) （日本語形態素解析器）を利用します。
npm でインストールした `kuromoji/dict/` 下のファイルを、 `public/` 下にディレクトリごとコピーします。
```sh
cp -r node_modules/kuromoji/dict public/kuromoji-dict
```

## これからやること
- 入力テキストのチェック
    - 辞書にあるか
    - 名詞か
    - 前の単語の最後の文字から始まっているか
- ルールの説明
- 最後の文字を抽出
- システムのターンで次の単語を選択
