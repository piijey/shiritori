import React, { useState, useEffect } from 'react';
import './App.css';
var kuromoji = require('kuromoji');

function App() {
  const [userInputText, setUserInputText] = useState("");
  const [tokenizer, setTokenizer] = useState(null);
  const [userYomi, setUserYomi] = useState("");

  useEffect(() => { //アプリのマウント時にkuromojiトークナイザを初期化
    kuromoji.builder({ dicPath: process.env.PUBLIC_URL + "/kuromoji-dict/" }).build(function (err, buildTokenizer) { //dicPathで辞書のディレクトリを指定
      if (err) {
        console.log(err);
      } else {
        setTokenizer(buildTokenizer);
      }
    });
  });

  function analyze(event) {
    event.preventDefault();  // デフォルトのフォーム送信を阻止
    const formData = new FormData(event.target);
    const text = formData.get("text");
    setUserInputText(text); // 入力されたテキストをステートにセット
  }

  useEffect(() => {
    if (!tokenizer) {
      console.error("トークナイザが利用できません");
      return
    }
    const tokens = tokenizer.tokenize(userInputText);
    let yomi = "";
    tokens.forEach(token => {
      if (token.reading === undefined) {
        console.log(token.surface_form, "の読みがわかりません");
      } else {
        yomi += token.reading
      };
    });
    setUserYomi(yomi);
  }, [userInputText]);

  return (
    <div className='App'>
      <div className='card p-2 align-items-center'>
        <div className='inputbox'>
          <form onSubmit={analyze}>
            <input name='text' type='text' placeholder="単語を入力してね" />
            <button type='submit' className='btn btn-primary'>Go</button>
          </form>
        </div>
        <div className='game'>
          <p>{userInputText}</p>
          <p>{userYomi}</p>
        </div>
      </div>

    </div>
  );
}

export default App;
