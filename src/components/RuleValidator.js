import { useEffect } from 'react';

export const useRuleValidator = ( currentTurnInfo, setCurrentTurnInfo, words ) => {
    const charReplaceMap = {'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ'};

    useEffect(() => {
        // validation of currentTurnInfo
        if ( !currentTurnInfo || currentTurnInfo.validationResult !== null ) { return }
        else if ( currentTurnInfo.validationInfo ) {
            // 形態素解析でNGだった場合
            setCurrentTurnInfo(prevState => {
                return {
                  ...prevState,
                  validationResult: false,
                };
              });
            return 
        }

        let validationInfo = null;
        const reading = currentTurnInfo.wordReading;

        //前の単語の最後の文字から始まっているか
        const firstChar = reading.slice( 0, 1 ) ;
        if ( currentTurnInfo.nextStartWith !== firstChar ){
            validationInfo = `${reading} は「${currentTurnInfo.nextStartWith}」から始まらない`;
            setCurrentTurnInfo(prevState => {
                return {
                  ...prevState,
                  validationInfo: validationInfo,
                  validationResult: false,
                };
              });
            return
        }


        // 言葉がこのゲームですでに使用されたか
        const foundItem = words.find(item => item.surface === currentTurnInfo.word);
        if (foundItem) {
          validationInfo = `「${foundItem.surface}」は使用済み`;
          setCurrentTurnInfo(prevState => {
              return {
                ...prevState,
                validationInfo: validationInfo,
                validationResult: false,
              };
            });
          return
        };


        let lastChar = currentTurnInfo.wordReading.slice( -1 ) ;
        if (lastChar === 'ン') {
          validationInfo = `${reading} は「ン」で終わる`;
            setCurrentTurnInfo(prevState => {
                return {
                  ...prevState,
                  validationInfo: validationInfo,
                  validationResult: false,
                };
              });
            return
        }
        else if (lastChar === 'ー') {
          lastChar = currentTurnInfo.wordReading.slice( -2, -1 );
        }
        //拗音の処理
        if (charReplaceMap[lastChar]) {
          lastChar = charReplaceMap[lastChar];
        }
        
        setCurrentTurnInfo(prevState => {
          return {
            ...prevState,
            nextStartWith: lastChar,
            validationResult: true,
          };
        });
        // eslint-disable-next-line
      }, [currentTurnInfo]);
  
    return {};
};
