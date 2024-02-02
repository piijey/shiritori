import { useState, useEffect } from 'react';

export const useWordSubmissionForm = ( tokenizer ) => {
    const [userInputWord, setUserInputWord] = useState({ surface: null, reading: null });

    function submitWord(event) {
      event.preventDefault();  // デフォルトのフォーム送信を阻止

      const formData = new FormData(event.target);
      const text = formData.get("text");
      setUserInputWord({ surface: text, reading: null }); // 入力されたテキストをステートにセット

      // 入力フィールドの値をクリアする
      const inputField = document.querySelector("input[name='text']");
      inputField.value = "";
    }
  
    useEffect(() => {
      if (!tokenizer) {
        console.error("トークナイザが利用できません");
        return
      }
      if ( !userInputWord.surface || userInputWord.reading ) { return }
      const tokens = tokenizer.tokenize(userInputWord.surface);
      let reading = "";
      tokens.forEach(token => {
        if (token.reading === undefined) {
          console.log(token.surface_form, "の読みがわかりません");
          reading = "？";
        } else {
          console.log(token.surface_form, token.pos);
          reading += token.reading;
        };
      });
      setUserInputWord({ surface: userInputWord.surface, reading: reading, player: 'user' });
      // eslint-disable-next-line
    }, [userInputWord]);

    useEffect(() => {
      if ( !userInputWord.surface || !userInputWord.reading ) { return }
      console.log(userInputWord);
      var lastChar = userInputWord.reading.slice( -1 ) ;
      console.log('the last char is', lastChar);

    }, [userInputWord]);

    return { submitWord, userInputWord };
};
