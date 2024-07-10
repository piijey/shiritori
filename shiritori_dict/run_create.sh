mkdir -p shiritori_dict/from_sudachidict/resource
cat ../dicts/sudachi-dict-20240409/small_lex.csv |grep "名詞,普通名詞,一般" > shiritori_dict/from_sudachidict/resource/small_lex_noun.csv
wc -l shiritori_dict/from_sudachidict/resource/small_lex_noun.csv
node shiritori_dict/create_shiritori_dict_sudachi.js > shiritori_dict/from_sudachidict/create_shiritori_dict.log
rm -f shiritori_dict/from_sudachidict/resource/small_lex_noun.csv
grep "reading" public/shiritori_dict/sudachi-nouns.json |wc -l
