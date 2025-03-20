/* Copyright (C) 2024 PiiJey
 * This file is part of Shiritori/しりとりぼっと and is distributed under the GPL-2.0 license.
 */

import { useState, useEffect } from 'react';
import { fetchWikiInfo } from './FetchWikipediaInfo';

export const useSystemWordSelector = ( gameState, currentTurnInfo, setCurrentTurnInfo, shiritoriDictPath ) => {
    const [shiritoriDictObj, setShiritoriDictObj] = useState(null);
    const [systemWordStartWith, setSystemWordStartWith] = useState(null);
    const [systemTurnInfo, setSystemTurnInfo] = useState(null);

    useEffect(() => {
        fetch(shiritoriDictPath)
        .then(response => response.json())
        .then((data) => {
            setShiritoriDictObj(data);
            console.log('しりとり辞書を読み込んだよ');
        })
        .catch (error => {
            console.error('しりとり辞書が読み込めなかったよ:', error);
        });
        // eslint-disable-next-line
    }, []); //アプリのマウント時のみ実行


    useEffect(() => {
        // システムのターン、次の文字を設定
        if ( currentTurnInfo && gameState === 'inProgress' 
            && currentTurnInfo.player === "user" && currentTurnInfo.validationResult === true ) {
                setSystemWordStartWith(currentTurnInfo.nextStartWith);
            };
        // eslint-disable-next-line
    }, [currentTurnInfo]);


    useEffect(() => {
        if ( !systemWordStartWith ) { return };
        // 次の文字が設定されたら、システムの次の言葉を選択
        const info = {
            word: null,
            wordReading: null,
            nextStartWith: systemWordStartWith,
            validationResult: null,
            validationInfo: null,
            wikiInfo: null,
            player: "system",
        };

        const selectWord = async () => {
            if ( shiritoriDictObj && shiritoriDictObj[systemWordStartWith] ) {
                const randomIndex = Math.floor(Math.random() * shiritoriDictObj[systemWordStartWith].length);
                const randomWord = shiritoriDictObj[systemWordStartWith][randomIndex];
                info.word = randomWord.surface;
                info.wordReading = randomWord.reading;
                info.wikiInfo = await fetchWikiInfo(info.word);
            
            } else {
                info.validationInfo = `${systemWordStartWith} で始まる言葉が見つからなかった`;
            };
            console.log("systemWord:", info);
            setSystemTurnInfo(info);
            setSystemWordStartWith(null);
        }

        selectWord();

        // eslint-disable-next-line
    }, [systemWordStartWith]);


    useEffect(() => {
        // 選択した次の言葉を、現在のターン情報に反映する
        if ( !systemTurnInfo ) { return };
        setCurrentTurnInfo(systemTurnInfo);
        setSystemTurnInfo(null);
        // eslint-disable-next-line
    }, [systemTurnInfo]);

    return {};
};
