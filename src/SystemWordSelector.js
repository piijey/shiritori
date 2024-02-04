import { useState, useEffect } from 'react';

export const useSystemWordSelector = ( gameState, currentTurnInfo, setCurrentTurnInfo ) => {
    const [systemWordStartWith, setSystemWordStartWith] = useState(null);
    const [systemTurnInfo, setSystemTurnInfo] = useState(null);


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
        setTimeout(() => {
            const selectedWord = systemWordStartWith; //仮
            const selectedWordReading = systemWordStartWith;  //仮
            const nextStartWith = systemWordStartWith; //仮
            console.log('selected word by 仮 system:', selectedWord);

            setSystemTurnInfo({
                word: selectedWord,
                wordReading: selectedWordReading,
                nextStartWith: nextStartWith,
                validationResult: true,
                validationInfo: null,
                player: "system",
            });

            setSystemWordStartWith(null);
        }, 200);
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
