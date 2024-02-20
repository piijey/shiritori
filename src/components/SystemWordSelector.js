import { useState, useEffect } from 'react';

export const useSystemWordSelector = ( gameState, currentTurnInfo, setCurrentTurnInfo ) => {
    const [shiritoriDictObj, setShiritoriDictObj] = useState(null);
    const [systemWordStartWith, setSystemWordStartWith] = useState(null);
    const [systemTurnInfo, setSystemTurnInfo] = useState(null);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + "/shiritori_dict/nouns.json")
        .then(response => response.json())
        .then((data) => {
            setShiritoriDictObj(data);
        })
        .catch (error => {
            console.error('しりとり辞書が読めなかったよ:', error);
        });
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
        let selectedWord = systemWordStartWith; //仮
        let selectedWordReading = systemWordStartWith;  //仮

        // 次の文字が設定されたら、システムの次の言葉を選択
        setTimeout(() => {
            if (shiritoriDictObj[systemWordStartWith]) {
                const randomIndex = Math.floor(Math.random() * shiritoriDictObj[systemWordStartWith].length);
                const randomWord = shiritoriDictObj[systemWordStartWith][randomIndex];
                console.log(randomWord);
                selectedWord = randomWord.surface;
                selectedWordReading = randomWord.reading;
            } else {
                console.log(`${systemWordStartWith} で始まる単語が見つからなかったよ`);
            }

            setSystemTurnInfo({
                word: selectedWord,
                wordReading: selectedWordReading,
                nextStartWith: systemWordStartWith,
                validationResult: null,
                validationInfo: null,
                player: "system",
            });

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
