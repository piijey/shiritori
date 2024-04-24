# SudachiDict から名詞を抽出、単独で読みが形態素解析の結果と一致するようにクリーニング
cat ../dicts/sudachi-dict-20240409/small_lex.csv |grep "名詞,普通名詞,一般" > shiritori_dict/create_from_sudachidict/resource/small_lex_noun.csv
wc -l shiritori_dict/create_from_sudachidict/resource/small_lex_noun.csv
node shiritori_dict/create_from_sudachidict/create_shiritori_dict_sudachi.js > shiritori_dict/create_from_sudachidict/create_shiritori_dict.log
rm -f shiritori_dict/create_from_sudachidict/resource/small_lex_noun.csv
grep "reading" public/shiritori_dict/sudachi-nouns.json |wc -l
