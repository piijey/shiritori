# しりとり辞書 （IPADic版）
*v0.1 で使用していたが、v0.2 で SudachiDict に移行したため、廃止*  
*ファイル名を `nouns.json` から `ipa-nouns.json` に変更*

ぼっとのターンでは、単語をしりとり辞書 [`public/shiritori_dict/nouns.json`](../public/shiritori_dict/ipa-nouns.json) から選択します（このファイルはリポジトリに含まれているので、追加の作業は必要ないですが、興味のある方はカスタマイズなどの参考にしてみてください）。

しりとり辞書は、IPA辞書(`mecab-ipadic-2.7.0-20070801`) に収録されている 一般名詞 (`Noun.csv`)、副詞可能名詞(`Noun.adverbal.csv`)、サ変接続名詞(`Noun.verbal.csv`) を元に作成しました。73,418 語が含まれています。

### 作り方
- [MeCab: Yet Another Part-of-Speech and Morphological Analyzer](https://taku910.github.io/mecab/#download) のリンクから、`mecab-ipadic-2.7.0-20070801.tar.gz` をダウンロードして、解凍します
    ```sh
    cd shiritori_dict/resource/
    tar -zxvf mecab-ipadic-2.7.0-20070801.tar.gz
    ```
- `package.json` に次の行を追加
  ```js
  "scripts": {
    "build:dict": "node shiritori_dict/create_shiritori_dict.js && cp shiritori_dict/dict/nouns.json public/shiritori_dict/",
    //...
  },
  ```
- 辞書を作るスクリプト (本体は [`shiritori_dict/create_shiritori_dict.js`](../shiritori_dict/create_shiritori_dict.js)) を実行します
    ```sh
    npm run build:dict
    ```

### 仕様
- 読みの最初の1文字をキーとして、単語の配列が格納されています
- 各単語は、IPA辞書からの surface（表層形）、reading（読み）、cost（コスト）という3つのプロパティを持ちます
```js
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
