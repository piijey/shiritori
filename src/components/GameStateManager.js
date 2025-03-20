/* Copyright (C) 2024 PiiJey
 * This file is part of Shiritori/しりとりぼっと and is distributed under the GPL-2.0 license.
 */

import { useState, useEffect } from 'react';

export const useGameStateManager = ( words, setWords, wordsExample ) => {
    //ゲームの状態
    const [ gameState, setGameState ] = useState('waiting'); //waiting (開始前), inProgress (ゲーム中), finished (終了)

    //現在のターンや最新の単語
    const [ currentTurnInfo, setCurrentTurnInfo ] = useState(null);
    const [ winner, setWinner ] = useState(null);

    function handleGameStateChange() {
      if ( gameState === 'waiting' ) {//ゲームを開始
        setGameState('inProgress');
        setWords([]);
        setWinner(null);
      } else if ( gameState === 'inProgress') { //ゲームを終了
        setGameState('finished');
      } else if ( gameState === 'finished' ) { //最初に戻る
        setGameState('waiting');
        setCurrentTurnInfo(null);
        setWords(wordsExample);
      }
    };
    
    useEffect(() => {
        // ルールに沿っていればグリッドに追加
        if ( currentTurnInfo && gameState === 'inProgress' && currentTurnInfo.validationResult === true ) {
            console.log('add board currentTurnInfo:', currentTurnInfo);
            if ( words.length === 0 
                || words.slice(-1)[0].surface !== currentTurnInfo.word) { //同じ言葉が続けて追加されるのを防ぐ
            setWords(prevWords => [...prevWords, {
                surface: currentTurnInfo.word,
                reading: currentTurnInfo.wordReading,
                player: currentTurnInfo.player
                }]);
            }
        }

        //　ゲーム開始時
        else if ( !currentTurnInfo && gameState === 'inProgress' ) {
            const initialTurnInfo = {
              // 各プロパティの役割は、documents/details.md を参照
                word: 'しりとり',
                wordReading: 'シリトリ',
                nextStartWith: 'シ',
                validationResult: null,
                validationInfo: null,
                player: 'system',
                wikiInfo: {
                  word: 'しりとり',
                  title: 'しりとり',
                  url: 'https://ja.wiktionary.org/wiki/しりとり',
                  description: '前の人が言った単語の最後の文字から始まる言葉を順番に言っていく言葉遊び。通常「ん」で終わる単語を言った者は負けとなる。',
                  source: 'Wiktionary'
                },
              };
            setCurrentTurnInfo(initialTurnInfo);
            setWords([]);
        }
        // eslint-disable-next-line
    }, [gameState, currentTurnInfo]);

    useEffect(() => {
      // 勝者が決まったらゲーム終了
      if (winner) {
        setGameState('finished');
      }
    }, [winner]);

    return { gameState, handleGameStateChange, currentTurnInfo, setCurrentTurnInfo, winner, setWinner };
};
