/* Copyright (C) 2024 PiiJey
 * This file is part of Shiritori/しりとりぼっと and is distributed under the GPL-2.0 license.
 */

import { useState, useEffect } from 'react';
import { RiUser5Line, RiRobot2Line } from "react-icons/ri";
import { BsWikipedia } from "react-icons/bs";

export const useMessageManager = ( currentTurnInfo ) => {
    const [ prevTurnWord, setPrevTurnWord ] = useState(null);
    const [ message, setMessage ] = useState(null);

    const renderTurnWord = (info) => {
        if ( info.word ) {
            const Icon = currentTurnInfo.player === 'user' ? RiUser5Line : RiRobot2Line;
            const player = currentTurnInfo.player === 'user' ? 'ユーザー' : 'ボット';
            const messageClassName = `message-${currentTurnInfo.player}`;

            const createWikiLink = () => {
                if (currentTurnInfo.wikiInfo) {
                    const description = currentTurnInfo.wikiInfo.description.slice(0, 40) + '...';
                    return <>
                        <div className='system-message word-info'>
                            <a href={currentTurnInfo.wikiInfo.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                area-label={`${currentTurnInfo.wikiInfo.title}についてのWikipediaページを開く`}>
                                <BsWikipedia />{currentTurnInfo.wikiInfo.title}: {description}
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

    const updateMessage = (info, turnWord) => {
        let messageContent = (<>
            <div>{prevTurnWord}</div>
            <div>{turnWord}</div>
        </>);

        if ( info.validationResult ) {
            if ( info.player === 'user' ) {
                messageContent = (<>
                    {messageContent}
                    <div>考え中 ...</div>
                </>)
            } else {
                messageContent = (<>
                    {messageContent}
                    <div>次は、「<b>{info.nextStartWith}</b>」から始まる言葉を選んでね</div>
                </>)
            }
        } else {
            if ( info.player === 'user' ) {
                let question = "選ぶ？";
                if (info.wordReading === '？') { question = "選んでね"; }
                messageContent = (<>
                    {messageContent}
                    <div className='word-info'>{info.validationInfo}みたいだね</div>
                    <div>ほかの「<b>{info.nextStartWith}</b>」から始まる言葉を{question}</div>
                </>)
            } else {
                messageContent = (<>
                    {messageContent}
                    <div className='word-info'>{info.validationInfo}みたいだね</div>
                    <div>どうしよう！</div>
                </>)
            };
        };
        setMessage(messageContent);
        setPrevTurnWord(turnWord);
    };

    useEffect(() => {
        if ( !currentTurnInfo ) { //ゲーム開始時
            setPrevTurnWord(null);
            setMessage(null);
            return
        } else if (currentTurnInfo.validationResult === true || currentTurnInfo.validationResult === false){
            const currentTurnWord = renderTurnWord(currentTurnInfo);
            updateMessage(currentTurnInfo, currentTurnWord);
        };
    // eslint-disable-next-line
    }, [currentTurnInfo]);

    return { message };
};
