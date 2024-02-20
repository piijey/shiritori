import { useState, useEffect } from 'react';
import { RiUser5Line, RiRobot2Line } from "react-icons/ri";

export const useMessageManager = ( currentTurnInfo ) => {
    const [ currentTurnWord, setCurrentTurnWord ] = useState(null);
    const [ prevTurnWord, setPrevTurnWord ] = useState(null);
    const [ message, setMessage ] = useState(null);

    useEffect(() => {
        if ( currentTurnInfo ) {
            const Icon = currentTurnInfo.player === 'user' ? RiUser5Line : RiRobot2Line;
            const player = currentTurnInfo.player === 'user' ? 'ユーザー' : 'ボット';
            setPrevTurnWord(currentTurnWord);
            setCurrentTurnWord(<><Icon className="iconLarge" aria-label={player} /> {currentTurnInfo.word}（{currentTurnInfo.wordReading}）</>);

            if ( currentTurnInfo.validationResult === true ) {
                setMessage(<>
                    <div>{prevTurnWord}</div>
                    <div>{currentTurnWord}</div>
                    <div>次は、「{currentTurnInfo.nextStartWith}」から始まる言葉を選んでね</div>
                </>)
            } else if (currentTurnInfo.validationResult === false) {
                setMessage(<>
                    <div>{prevTurnWord}</div>
                    <div>{currentTurnWord}</div>
                    <div className='debug-info'>{currentTurnInfo.validationInfo}みたいだね</div>
                    <div>{
                        //ターンテイキング機構を入れたらメッセージを変更する予定
                        currentTurnInfo.player === 'user' ? 'ほかの' : 'ぼっとはパス！'
                    }
                        「{currentTurnInfo.nextStartWith}」から始まる言葉を選んでね</div>
                </>)
            };
        };
    // eslint-disable-next-line
    }, [currentTurnInfo]);
    
    return { message };
};
