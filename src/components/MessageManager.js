import { useState, useEffect } from 'react';
import { RiUser5Line, RiRobot2Line } from "react-icons/ri";

export const useMessageManager = ( currentTurnInfo ) => {
    const [ currentTurnWord, setCurrentTurnWord ] = useState(null);
    const [ prevTurnWord, setPrevTurnWord ] = useState(null);
    const [ message, setMessage ] = useState(null);

    useEffect(() => {
        if ( !currentTurnInfo ) { //ゲーム開始時
            setCurrentTurnWord(null);
            setPrevTurnWord(null);
            setMessage(null);
            return
        }
        const Icon = currentTurnInfo.player === 'user' ? RiUser5Line : RiRobot2Line;
        const player = currentTurnInfo.player === 'user' ? 'ユーザー' : 'ボット';
        setPrevTurnWord(currentTurnWord);
        if ( currentTurnInfo.word ) {
            setCurrentTurnWord(<><Icon className="iconLarge" aria-label={player} /> {currentTurnInfo.word}（{currentTurnInfo.wordReading}）</>);
        } else {
            setCurrentTurnWord(<><Icon className="iconLarge" aria-label={player} /> がんばって </>);
        }

        if ( currentTurnInfo.validationResult === true ) {
            setMessage(<>
                <div>{prevTurnWord}</div>
                <div>{currentTurnWord}</div>
                <div>次は、「{currentTurnInfo.nextStartWith}」から始まる言葉を選んでね</div>
            </>)
        } else if (currentTurnInfo.validationResult === false) {
            if ( currentTurnInfo.player === 'user' ) {
                setMessage(<>
                    <div>{prevTurnWord}</div>
                    <div>{currentTurnWord}</div>
                    <div className='debug-info'>{currentTurnInfo.validationInfo}みたいだね</div>
                    <div>ほかの「{currentTurnInfo.nextStartWith}」から始まる言葉を選ぶ？</div>
                </>)
            } else {
                setMessage(<>
                    <div>{prevTurnWord}</div>
                    <div>{currentTurnWord}</div>
                    <div className='debug-info'>{currentTurnInfo.validationInfo}みたいだね</div>
                    <div>どうしよう！</div>
                </>)
            }
        };
    // eslint-disable-next-line
    }, [currentTurnInfo]);

    return { message };
};
