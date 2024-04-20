import { useState, useEffect } from 'react';

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
        const info = {
            word: null,
            wordReading: null, //仮
            nextStartWith: systemWordStartWith,
            validationResult: null,
            validationInfo: null,
            player: "system",
        };

        // 次の文字が設定されたら、システムの次の言葉を選択
        setTimeout(() => {
            if ( shiritoriDictObj && shiritoriDictObj[systemWordStartWith] ) {
                const randomIndex = Math.floor(Math.random() * shiritoriDictObj[systemWordStartWith].length);
                const randomWord = shiritoriDictObj[systemWordStartWith][randomIndex];
                info.word = randomWord.surface;
                info.wordReading = randomWord.reading;
            } else {
                info.validationInfo = `${systemWordStartWith} で始まる言葉が見つからなかった`;
            };
            console.log(info);
            setSystemTurnInfo(info);
            setSystemWordStartWith(null);
        }, 200);

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
