const fs = require('fs');
const csv = require('csv-parser');

const inputFilePaths = [
    'shiritori_dict/resource/small_lex_noun.csv'
];
const outputFilePath = 'public/shiritori_dict/sudachi-nouns.json';
const dicPath = 'public/kuromoji-dict-sudachi'

// tokenizer をビルドする
var kuromoji = require("kuromoji");
var tokenizer;

kuromoji.builder({ dicPath: dicPath }).build(function (err, builtTokenizer) {
    if (err) throw err;
    tokenizer = builtTokenizer;
});

function isAllKatakana(str) {
    // カタカナ以外の文字がなければ true
    const nonKatakanaRegex = /[^\u30A0-\u30FF]/;
    return !nonKatakanaRegex.test(str);
}

function analyzeReading(text) {
    // 名詞かどうかチェックし、読みを取得
    if (!tokenizer) {
        console.log("Tokenizer is not yet initialized.");
        return;
    };

    const tokens = tokenizer.tokenize(text);
    let result = "";

    for (const token of tokens) {
        if (token.pos !== '名詞') {
            // 解析結果が名詞以外
            result = `${token.surface_form} (${token.pos})`;
            return result;
        } else {
            result += token.reading;
        };
    };
    if ( isAllKatakana(result) ) {
        return result;
    } else {
        // 読みに非カタカナが含まれる
        return `non-katakana (${result})`;
    }
};

function checkWord(data) {
    const surface = data[0];
    const reading = data[11];
    const analyzed = analyzeReading(surface);
    if ( analyzed !== reading ){
        // 読みが解析結果の読みと不一致
        console.log(`${surface}\treading: ${reading}\tanalyzed: ${analyzed}`);
        return false;
    } else if ( reading.length === 1) {
        // 読みが1文字
        console.log(`${surface}\treading: ${reading}\tanalyzed: length = 1`);
        return false;
    }
    return true;
};


// CSVファイルを処理する
function processCSV(filePath) {
    return new Promise((resolve, reject) => {
        const result = {};
        const inputStream = fs.createReadStream(filePath);
    
    inputStream
        .pipe(csv({ headers: false }))
        .on('data', (data) => {
            if ( checkWord(data) ) {
                const firstChar = data[11][0]; //読みの1文字目
                if (!result[firstChar]) {
                    result[firstChar] = [];
                };
                const obj = {
                    surface: data[0],
                    reading: data[11],
                }
                // 既に同じ surface と reading をもつ要素があるか
                const isDuplicate = result[firstChar].some(item => item.surface === obj.surface && item.reading === obj.reading);
                if (!isDuplicate) {
                    result[firstChar].push(obj);
                } else {
                    console.log(`duplicate: surface ${data[0]}, reading ${data[11]}`);
                }
            }; 
        })
        .on('end', () => {
            resolve(result);
        })
        .on('error', reject);
    });
}

// すべてのファイルを処理して結果を結合
setTimeout(() => {
    Promise.all(inputFilePaths.map(filePath => processCSV(filePath)))
    .then(results => {
        const combinedResult = results.reduce((acc, curr) => {
            Object.keys(curr).forEach(key => {
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key] = acc[key].concat(curr[key]);
            });
            return acc;
        }, {});

        // キーをあいうえお順にソート
        const sortedKeys = Object.keys(combinedResult).sort();

        // 各キーの配列を`reading`プロパティでソート
        const sortedObj = sortedKeys.reduce((acc, key) => {
            acc[key] = combinedResult[key].sort((a, b) => a.reading.localeCompare(b.reading));
            return acc;
        }, {});

        //結合した結果をファイルに書き出す
        fs.writeFile(outputFilePath, JSON.stringify(sortedObj, null, 2), 'utf-8', (err) => {
            if (err) throw err;
            console.log('しりとり辞書を書き出したよ', outputFilePath)
        });
    })
    .catch(error => {
        console.error('なんかうまくいかなかったよ', error);
    });
}, 1000); // tokenizer の準備に時間がかかるので少し待ってから実行
