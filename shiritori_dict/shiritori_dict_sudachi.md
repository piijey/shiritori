# しりとり辞書 （SudachiDict版）

ぼっとのターンでの単語選択に使用する辞書 [`public/shiritori_dict/sudachi-nouns.json`](../public/shiritori_dict/sudachi-nouns.json)。このファイルはリポジトリに含まれているので、追加の作業は必要ないですが、興味のある方はカスタマイズなどの参考にしてみてください。

しりとり辞書 （SudachiDict版）は、[WorksApplications/SudachiDict: A lexicon for Sudachi](https://github.com/WorksApplications/SudachiDict) を元に作成しました。

## 詳細
SudachiDict 20240409 small_lex.csv で品詞が `名詞,普通名詞,一般` である形態素の中から、次に該当するものを除いた約1万4千件を「しりとり辞書（SudachiDict版）」に格納した。

- カラムに記載された読みと、解析結果の読みが不一致
- 解析結果に名詞以外が含まれる
- 解析結果の読みがカタカナ以外の文字を含むか、未知語になる
- 読みが1文字
- 表層形と読みの配列にした時に、他と重複する


## 作り方
- SudachiDict をダウンロードし、適当なパス（`../dicts/sudachi-dict-20240409/small_lex.csv`）に保存
- kuromoji.js 用にビルド済みの SudachiDict を `public/kuromoji-dict-sudachi` に格納
    - ビルド [piijey/kuromoji.js-react-app](https://github.com/piijey/kuromoji.js-react-app) 
    - または [piijey.github.io resources/kuromoji-dict-sudachi](https://github.com/piijey/piijey.github.io) からダウンロード
- しりとり辞書作成スクリプトを実行
    ```sh
    npm run build:dict
    ```
    - 本体は [`shiritori_dict/create_shiritori_dict_sudachi.js`](../shiritori_dict/create_shiritori_dict_sudachi.js)


### しりとり辞書の仕様
- 読みの最初の1文字をキーとして、単語の配列が格納されている
- 各単語は、SudachiDict からの surface（表層形）、reading（読み）という2つのプロパティを持つ

```js
{
  "ア": [
    {
      "surface": "ア・ラ・モード",
      "reading": "ア・ラ・モード"
    },
    //...
    {
      "surface": "藍",
      "reading": "アイ"
    },
    //...
  ]
}
```
