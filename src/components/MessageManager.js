/* Copyright (C) 2024 PiiJey
 * This file is part of Shiritori/しりとりぼっと and is distributed under the GPL-2.0 license.
 */

import { useState, useEffect } from 'react';
import { fetchWikiInfo } from './FetchWikipediaInfo';
import { RiUser5Line, RiRobot2Line } from "react-icons/ri";
import { BsWikipedia } from "react-icons/bs";
import { FcWikipedia } from "react-icons/fc";

export const useMessageManager = ( currentTurnInfo ) => {
    const [ currentTurn, setCurrentTurn ] = useState(null);
    const [ prevTurn, setPrevTurn ] = useState(null);
    const [ message, setMessage ] = useState(null);
    const [ wikiInfoMap, setWikiInfoMap ] = useState({});

    useEffect(() => {
        if ( !currentTurnInfo ) { //ゲーム開始時
            setCurrentTurn(null);
            setPrevTurn(null);
            setWikiInfoMap({
                'しりとり': {
                    word: 'しりとり',
                    title: 'しりとり',
                    url: 'https://ja.wiktionary.org/wiki/しりとり',
                    description: '前の人が言った単語の最後の文字から始まる言葉を順番に言っていく言葉遊び。通常「ん」で終わる単語を言った者は負けとなる。',
                    source: 'Wiktionary'
                }
            })
            setMessage(null);
            return;
        }
        
        // 新しいターンになったら、現在のターンはひとつ前のターン prevTurn になる
        if ( currentTurn 
            && ( currentTurn.word !== currentTurnInfo.word )){
            setPrevTurn(currentTurn);
        }
        setCurrentTurn(currentTurnInfo);

        // eslint-disable-next-line
    }, [currentTurnInfo]);


    useEffect(() => {
        if (!currentTurn) return;
        const currentWordElement = renderTurnWord(currentTurn);
        const prevWordElement = prevTurn ? renderTurnWord(prevTurn) : null;
        let messageContent = (<>
            {prevWordElement && <div>{prevWordElement}</div>}
            <div>{currentWordElement}</div>
        </>);

        if ( currentTurn.validationResult ) {
            if ( currentTurn.player === 'user' ) {
                messageContent = (<>
                    {messageContent}
                    <div>考え中 ...</div>
                </>)
            } else {
                messageContent = (<>
                    {messageContent}
                    <div>次は、「<b>{currentTurn.nextStartWith}</b>」から始まる言葉を選んでね</div>
                </>)
            }
        } else {
            if ( currentTurn.player === 'user' ) {
                let question = "選ぶ？";
                if (currentTurn.wordReading === '？') { question = "選んでね"; }
                messageContent = (<>
                    {messageContent}
                    <div className='word-info'>{currentTurn.validationInfo}みたいだね</div>
                    <div>ほかの「<b>{currentTurn.nextStartWith}</b>」から始まる言葉を{question}</div>
                </>)
            } else {
                messageContent = (<>
                    {messageContent}
                    <div className='word-info'>{currentTurn.validationInfo}みたいだね</div>
                    <div>どうしよう！</div>
                </>)
            };
        };        
        setMessage(messageContent);

    // eslint-disable-next-line
    }, [currentTurn, prevTurn, wikiInfoMap]);


    const renderTurnWord = (info) => {
        if ( info.word ) {
            const Icon = info.player === 'user' ? RiUser5Line : RiRobot2Line;
            const player = info.player === 'user' ? 'ユーザー' : 'ボット';
            const messageClassName = `message-${info.player}`;

            const createWikiLink = () => {
                const cachedWikiInfo = wikiInfoMap[info.word];

                if ( cachedWikiInfo ) {
                    const IconWiki = cachedWikiInfo.source === 'Wikipedia' ? BsWikipedia : FcWikipedia;
                    const description = cachedWikiInfo.description.slice(0, 40) + '...';
                    return <>
                        <div className='system-message word-info'>
                            <a href={cachedWikiInfo.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                area-label={`${cachedWikiInfo.title}についての${cachedWikiInfo.source}ページを開く`}>
                                <IconWiki /> {cachedWikiInfo.title}: {description}
                            </a>
                        </div>
                    </>
                } else {
                    return null;
                }
            };

            const wordContent = <>
                    {info.word}（{info.wordReading}）
                    {createWikiLink()}
                </>

            return (<div className={messageClassName}><Icon className="iconLarge" aria-label={player} /> {wordContent} </div>);
        } else {
            const Icon = RiUser5Line;
            const player = 'ユーザー';
            const messageClassName = 'message-user';
            return (<div className={messageClassName}><Icon className="iconLarge" aria-label={player} /> 情けをかける </div>);
        };
    };

    const fetchAndStoreWikiInfo = async (word) => {
        if (wikiInfoMap[word] || !word ) return;
        try {
            const wikiInfo = await fetchWikiInfo(word);
            setWikiInfoMap( prev => ({
                ...prev,
                [word]: wikiInfo
            }));
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        if ( currentTurnInfo?.validationResult === true ) {
            fetchAndStoreWikiInfo(currentTurnInfo.word);
        }
    // eslint-disable-next-line
    }, [currentTurnInfo]);

    return { message };
};
