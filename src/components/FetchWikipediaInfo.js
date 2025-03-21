/* Copyright (C) 2024 PiiJey
 * This file is part of Shiritori/しりとりぼっと and is distributed under the GPL-2.0 license.
 */

export async function fetchWikiInfo(word) {
    // 2つの API を fetch する
    try {
        const timeId = `fetchWikiInfo-${word}-${Date.now()}`;
        console.time(timeId);
        const wikipediaPromise = fetchWikipediaInfo(word);
        const wiktionaryPromise = fetchWiktionaryInfo(word);
        const fetchComplete = Promise.all([
            wikipediaPromise.catch(() => null),
            wiktionaryPromise.catch(() => null),
        ])
        const timeout = new Promise ((_, reject) =>
            setTimeout (() => reject(new Error('Wiki fetch timeout')), 1500)
        );
        const results = await Promise.race([
            // Wiki情報が取得できたらすぐ、またはタイムアウト1.5秒で返す
            fetchComplete,
            timeout
        ]);
        const wikiInfo = results.find(result => result !== null) || null;
        console.timeEnd(timeId);
        return wikiInfo;
    } catch (error) {
        if ( error.message === 'Wikipedia fetch timeout' ) {
            console.log('Wikipedia/Wiktionary取得がタイムアウトしたよ');
        } else if (error.message === 'All promises were rejected' ) {
            console.log('Wikipedia/Wiktionary情報がなかったよ');
        } else {
            console.log('Wikipedia/Wiktionary取得中にエラーが発生したよ:', error);
        }
        // タイムアウトまたはエラーの場合、wikiInfoはnullのまま
        return null
    }    
}


async function fetchWikipediaInfo(word) {
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
                source: 'Wikipedia',
            }
        } else if (data.type === 'disambiguation') {
            // description: "ウィキメディアの曖昧さ回避ページ"
            return {
                word: word,
                title: data.title,
                url: data.content_urls.desktop.page,
                description: data.extract,
                source: 'Wikipedia',
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


async function fetchWiktionaryInfo(word) {
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
            source: 'Wiktionary',
        }
    }
    catch (error) {
        console.error(`Wiktionary API Error (${word}):`, error);
        return null;
    };
}
