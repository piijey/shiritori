const fs = require('fs');
const csv = require('csv-parser');
const iconv = require('iconv-lite');

const inputFilePaths = [
    'shiritori_dict/resource/mecab-ipadic-2.7.0-20070801/Noun.adverbal.csv',
    'shiritori_dict/resource/mecab-ipadic-2.7.0-20070801/Noun.csv',
    'shiritori_dict/resource/mecab-ipadic-2.7.0-20070801/Noun.verbal.csv'
];
const outputFilePath = 'shiritori_dict/dict/nouns.json';

// CSVファイルを処理する関数
function processCSV(filePath) {
    return new Promise((resolve, reject) => {
        const result = {};
        const inputStream = fs.createReadStream(filePath).pipe(iconv.decodeStream('EUC-JP'));
    
    inputStream
        .pipe(csv({ headers: false }))
        .on('data', (data) => {
            const firstChar = data[11][0]; //読みの1文字目

            if (!result[firstChar]) {
                result[firstChar] = [];
            };

            //必要な情報を結果オブジェクトに追加
            result[firstChar].push({
                surface: data[0],
                reading: data[11],
                cost: data[3],
            });
        })
        .on('end', () => {
            resolve(result);
        })
        .on('error', reject);
    });
}

// すべてのファイルを処理して結果を結合
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
