/* Copyright (C) 2024 PiiJey
 * This file is part of Shiritori/しりとりぼっと and is distributed under the GPL-2.0 license.
 */

import { useState, useEffect } from 'react';
import { RiUser5Line, RiRobot2Line } from "react-icons/ri";

export const useMessageManager = ( currentTurnInfo ) => {
    const [ prevTurnWord, setPrevTurnWord ] = useState(null);
    const [ message, setMessage ] = useState(null);

    const renderTurnWord = (info) => {
        if ( info.word ) {
            const Icon = currentTurnInfo.player === 'user' ? RiUser5Line : RiRobot2Line;
            const player = currentTurnInfo.player === 'user' ? 'ユーザー' : 'ボット';
            const messageClassName = `message-${currentTurnInfo.player}`;
            const wordContent = currentTurnInfo.wikiInfo ? (
                <>
                    {info.word}（{info.wordReading}）
                    <div className='system-message debug-info'>
                        <a href={currentTurnInfo.wikiInfo.url} target="_blank" rel="noopener noreferrer">
                            {currentTurnInfo.wikiInfo.title}：{currentTurnInfo.wikiInfo.description}
                        </a>
                    </div>
                </>
            ) : (
                `${info.word}（${info.wordReading}）`
            );
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
            messageContent = (<>
                {messageContent}
                <div>次は、「<b>{info.nextStartWith}</b>」から始まる言葉を選んでね</div>
            </>)
        } else {
            if ( info.player === 'user' ) {
                let question = "選ぶ？";
                if (info.wordReading === '？') { question = "選んでね"; }
                messageContent = (<>
                    {messageContent}
                    <div className='debug-info'>{info.validationInfo}みたいだね</div>
                    <div>ほかの「<b>{info.nextStartWith}</b>」から始まる言葉を{question}</div>
                </>)
            } else {
                messageContent = (<>
                    {messageContent}
                    <div className='debug-info'>{info.validationInfo}みたいだね</div>
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
