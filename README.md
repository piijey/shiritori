# しりとり


## インストール
```sh
npm install
```

[kuromoji.js](https://github.com/takuyaa/kuromoji.js) （日本語形態素解析器）を利用します。
npm でインストールした `kuromoji/dict/` 下のファイルを、ブラウザがアクセスできる `public/` 下に配置します。次のようにディレクトリごとコピーします。
```sh
cp -r node_modules/kuromoji/dict public/kuromoji-dict
```
