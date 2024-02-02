import { useEffect } from 'react';

export const useRuleValidator = ( currentTurnInfo, setCurrentTurnInfo ) => {
    useEffect(() => {
        // validation of currentTurnInfo
        if ( !currentTurnInfo || currentTurnInfo.validationResult !== null ) { return }
        else if ( currentTurnInfo.validationInfo ) {
            // 形態素解析でNGだった場合
            console.log(currentTurnInfo.validationInfo)
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

        //ここに言葉が未使用かのチェックをいれる

        //前の単語の最後の文字から始まっているか
        const firstChar = reading.slice( 0, 1 ) ;
        if ( currentTurnInfo.nextStartWith !== firstChar ){
            validationInfo = `${reading} は「${currentTurnInfo.nextStartWith}」から始まらない`
            console.log(validationInfo)
            setCurrentTurnInfo(prevState => {
                return {
                  ...prevState,
                  validationInfo: validationInfo,
                  validationResult: false,
                };
              });
            return
        }
        const lastChar = currentTurnInfo.wordReading.slice( -1 ) ;
        console.log('the last char is', lastChar);

        //ここに拗音と長音、「ん」の処理を入れる
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
