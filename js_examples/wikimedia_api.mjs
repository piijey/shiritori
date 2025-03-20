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


// src/components/FetchWikipediaInfo.js
export async function fetchWikipediaInfo(word) {
    try {
        const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`;
        const headers = {
            'accept': 'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/Summary/1.4.2"',
            'Api-User-Agent': 'Shiritori/0 (https://piijey.github.io/shiritori/)'
        };
        const response = await fetch(url, {headers});
        if (!response.ok) {
            if ( response.status === 404 ) {
                return null;
            }
            throw new Error(`fetchWikipediaInfo: HTTP error, status ${response.status}`);
        }
        const data = await response.json();
        console.log("fetchWikipediaInfo: data", data);

        if (data.type === 'standard') {
            return {
                word: word,
                title: data.title,
                url: data.content_urls.desktop.page,
                description: data.description || data.extract,
            }
        } else if (data.type === 'disambiguation') {
            // description: "ウィキメディアの曖昧さ回避ページ"
            return {
                word: word,
                title: data.title,
                url: data.content_urls.desktop.page,
                description: data.extract,
            }
        } else {
            return null;
        };
    }
    catch (error) {
        console.error(`Wikipedia API Error (${word}):`, error);
        return null;
    };
};


export async function fetchWiktionaryInfo(word) {
    try {
        const url = `https://ja.wiktionary.org/w/api.php?action=query&titles=${word}&prop=extracts&explaintext&format=json&origin=*`;
        const headers = {};
        const response = await fetch(url, {headers});
        if (!response.ok) {
            if ( response.status === 404 ) {
                return null;
            }
            throw new Error(`fetchWiktionaryInfo: HTTP error, status ${response.status}`);
        }
        const data = await response.json();
        const pageId = Object.keys(data.query.pages)[0];
        if (pageId === "-1") {
            console.log(`fetchWiktionaryInfo: no Wiktionary page for ${word}`);
            return null;
        }
        console.log("fetchWiktionaryInfo:", data.query.pages[pageId]);
        
        const extract = data.query.pages[pageId].extract;
        const match = extract.match(/=== 名詞.*?===\n[\s\S]*?\n\n([\s\S]*?)(?=\n\n\n==|$)/);
        // section header `=== 名詞.*?===\n`
        // takes everything until we see two consecutive newlines `[\s\S]*?\n\n`
        // captures everything after that `([\s\S]*?)`
        // until we hit either three newlines followed by a new section or the end of the string `(?=\n\n\n==|$)`

        let description = null;
        if (match && match[1]) {
            description = match[1].trim();
        } else {
            return null;
        }
        
        return {
            word: word,
            title: data.query.pages[pageId].title,
            url: `https://ja.wiktionary.org/wiki/${word}`,
            description: description,
            source: "Wiktionary",
        }
    }
    catch (error) {
        console.error(`Wiktionary API Error (${word}):`, error);
        return null;
    };
}


const words = ["Claude", "LLM", "しりとり", "樫だる", "コンピューター", "郷社", "髑髏", "治理", "かた"];
for (const word of words) {
    // const wikp = await fetchWikipediaInfo(word);
    // console.log(wikp);
    const wikt = await fetchWiktionaryInfo(word);
    console.log(wikt);
    console.log("\n\n");
}

