/* Copyright (C) 2024 PiiJey
 * This file is part of Shiritori/しりとりぼっと and is distributed under the GPL-2.0 license.
 */

export async function fetchWikipediaInfo(word) {
    try {
        const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`;
        const headers = {
            'accept': 'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/Summary/1.4.2"',
            'User-Agent': 'Shiritori/0.2 (https://piijey.github.io/shiritori/)'
        };
        const response = await fetch(url, {headers});
        if (!response.ok) {
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
        } else {
            return null;
        };
    }
    catch (error) {
        console.error(`Wikipedia API Error (${word}):`, error);
        return null;
    };
};
