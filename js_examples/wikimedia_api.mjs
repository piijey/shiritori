// Wikimedia REST API を使ってみる例
// 参考: https://ja.wikipedia.org/api/rest_v1/
// npm install --save-dev node-fetch
// node js_examples/wikimedia_api.mjs

import fetch from 'node-fetch';

async function getWikipediaSummary(word) {
    const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${word}`;
    const headers = {
        'accept': 'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/Summary/1.4.2"',
        'User-Agent': 'Shiritori/0.2 (https://piijey.github.io/shiritori/)'
    };

    fetch(url, {headers})
        .then(response => response.json())
        .then(data => {
            console.log("\n")
            console.log(data)
            if (data.type === 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found') {
                console.log(`${word} ${data.title}`);
            } else {
                console.log(`word: ${word}\ntitle: ${data.title}\nURL: ${data.content_urls.desktop.page}\ndescription: ${data.description}\nextract: ${data.extract}`);
            };
        })
        .catch(error => {
            console.error(`Error ${word}`, error);
        });
};

const words = ["Claude", "LLM", "しりとり", "樫だる", "コンピューター", "郷社"];
for (const word of words) {
    getWikipediaSummary(word);
}

