# やること

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
- [x] ドキュメンテーション
- [ ] ルール違反時のターン処理
- [x] メッセージの内容と表示
- [ ] システムのターンでの単語選択方法の改善
    - [ ] 「ん」で終わる単語を選択する頻度を下げる
    - [ ] コストの高い単語を選択しない