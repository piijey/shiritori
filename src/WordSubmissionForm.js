import { useState, useEffect } from 'react';

export const useWordSubmissionForm = ( tokenizer ) => {
    const [userInputWord, setUserInputWord] = useState({ surface: null, reading: null });

    const [words, setWords] = useState([
        { surface: "しりとり", reading: "シリトリ", player: "system" },
        { surface: "りんご", reading: "リンゴ", player: "user" },
        { surface: "豪雨", reading: "ゴウウ", player: "system" },
        { surface: "海", reading: "ウミ", player: "user" },
        { surface: "ミンミンゼミ", reading: "ミンミンゼミ", player: "system" }
      ]);

    function submitWord(event) {
      event.preventDefault();  // デフォルトのフォーム送信を阻止
      const formData = new FormData(event.target);
      const text = formData.get("text");
      setUserInputWord({ surface: text, reading: null }); // 入力されたテキストをステートにセット
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
      setWords([...words, { surface: userInputWord.surface, reading: reading, player: 'user' }]);
      // eslint-disable-next-line
    }, [userInputWord]);

    return { submitWord, userInputWord, words };
};
