import { useEffect, useState } from 'react';

export const useWordSubmissionForm = ( tokenizer, setCurrentTurnInfo ) => {
  const [userInput, setUserInput] = useState({ text: null, reading: null, info: null });
  
    function submitWord(event) {
      // ユーザーテキスト入力を取得（form onSubmit）
      event.preventDefault();  // デフォルトのフォーム送信を阻止

      const formData = new FormData(event.target);
      const text = formData.get("text");
      setUserInput({ text: text, reading: null });

      // 入力フィールドの値をクリアする
      const inputField = document.querySelector("input[name='text']");
      inputField.value = "";
    }
  
    useEffect(() => {
      // 形態素解析で読みを取得
      if (!tokenizer) {
        console.error("トークナイザが利用できません");
        return
      }
      if ( !userInput.text ) { return }
      else if ( !userInput.reading ) {
      // reading がまだないとき
      const tokens = tokenizer.tokenize(userInput.text);
      let reading = "";
      let validationInfo = null; //読み・形態素のチェック結果

      for (const token of tokens) {
        if (token.reading === undefined) {
          validationInfo = `読みがわからない（${token.surface_form}）`;
          reading = "？";
          break;
        } else if (token.pos !== '名詞') {
          validationInfo = `名詞以外（${token.surface_form}: ${token.pos}）`;
          reading = "？";
          break;
        } else {
          reading += token.reading;
        };
      };
      setUserInput(prevState => { return {...prevState, reading: reading, info: validationInfo} });
    } else {
      setCurrentTurnInfo(prevState => {
        return {
          ...prevState,
          word: userInput.text,
          wordReading: userInput.reading,
          validationInfo: userInput.info,
          validationResult: null,
          player: 'user',
        };
      });
    }
      // eslint-disable-next-line
    }, [userInput]);

    return { submitWord };
};
