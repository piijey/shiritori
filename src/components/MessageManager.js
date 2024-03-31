import { useState, useEffect } from 'react';
import { RiUser5Line, RiRobot2Line } from "react-icons/ri";

export const useMessageManager = ( currentTurnInfo ) => {
    const [ prevTurnWord, setPrevTurnWord ] = useState(null);
    const [ message, setMessage ] = useState(null);

    const renderTurnWord = (info) => {
        const Icon = currentTurnInfo.player === 'user' ? RiUser5Line : RiRobot2Line;
        const player = currentTurnInfo.player === 'user' ? 'ユーザー' : 'ボット';
        const messageClassName = `message-${currentTurnInfo.player}`;
        if ( info.word ) {
            return (<div className={messageClassName}><Icon className="iconLarge" aria-label={player} /> {currentTurnInfo.word}（{currentTurnInfo.wordReading}）</div>);
        } else {
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
                messageContent = (<>
                    {messageContent}
                    <div className='debug-info'>{info.validationInfo}みたいだね</div>
                    <div>ほかの「<b>{info.nextStartWith}</b>」から始まる言葉を選ぶ？</div>
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
