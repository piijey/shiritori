import { useEffect, useState } from 'react';

export const useWordSubmissionForm = ( currentTurnInfo, tokenizer, setCurrentTurnInfo, setWinner ) => {
  const [userInput, setUserInput] = useState({ text: null, reading: null, info: null });
  const [wordSubmissionForm, setWordSubmissionForm] = useState(null);

  function handleSubmit(event) {
    event.preventDefault(); // フォームのデフォルトの送信を防止
    const submitter = event.nativeEvent.submitter; // 押されたボタンを識別
    if ( submitter.name === 'submit' ) {
      submitWord(event);
    } else if ( submitter.name === 'resubmit' ) {
      submitWord(event);
    }
  };

  function submitWord(event) {
    const formData = new FormData(event.target);
    const text = formData.get("text");
    setUserInput({ text: text, reading: null });

    // 入力フィールドの値をクリアする
    const inputField = document.querySelector("input[name='text']");
    inputField.value = "";
  };

  useEffect(() => { // userInput の更新を監視
    // 形態素解析で読みを取得
    if (!tokenizer) {
      console.error("トークナイザが利用できません");
      return
    }
    if ( !userInput.text ) { return }
    if ( !userInput.reading ) {
      // reading がまだないとき
      const tokens = tokenizer.tokenize(userInput.text);
      let reading = "";
      let validationInfo = null; //読み・形態素のチェック結果

      for (const token of tokens) {
        if (token.reading === undefined) {
          validationInfo = `読みがわからない`;
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
      // 形態素解析したあと
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
      setUserInput({ text: null, reading: null, info: null });      
    };
    // eslint-disable-next-line
  }, [userInput]);

  function submitSurrender() {
    setWinner('system');
    setCurrentTurnInfo(prevState => {
      return {
        ...prevState,
        validationResult: true,
      }
    })
  };

  function submitWin() {
    setWinner('user');
    setCurrentTurnInfo(prevState => {
      return {
        ...prevState,
        validationResult: true,
      }
    })
  };

  function submitBeFaceful() { // 情けをかける
    setCurrentTurnInfo(prevState => {
      return {
        ...prevState,
        word: null,
        wordReading: null,
        validationInfo: null,
        validationResult: true,
        player: 'user',
      }
    })
  };

  useEffect(() => {
    if ( !currentTurnInfo ) { return }
    if ( currentTurnInfo.validationResult === true ) {
      setWordSubmissionForm(<>
        <form onSubmit={handleSubmit}>
          <div className="input-group p-2">
            <input name='text' type="text" className="form-control" placeholder="次の言葉を入力してね" aria-label="次の言葉を入力"/>
            <button className="btn btn-primary" type="submit" name="submit">言う</button>
          </div>
        </form>
      </>);
    } else if ( currentTurnInfo.validationResult === false ) {
      if ( currentTurnInfo.player === 'user' ) {
        setWordSubmissionForm(<>
          <form onSubmit={handleSubmit}>
            <div className="input-group p-2">
              <input name='text' type="text" className="form-control" placeholder="ほかの言葉を入力してね" aria-label="ほかの言葉を入力"/>
              <button className="btn btn-primary" type="submit" name="resubmit">言う</button>
              <button className="btn btn-danger" type="button" name="surrender" onClick={submitSurrender}>負けを認める</button>
            </div>
          </form>
        </>);
      } else {
        setWordSubmissionForm(<>
          <div className='align-items-center'>
            <div className="input-group p-2">
              <button className="btn btn-warning" type="submit" onClick={submitBeFaceful}>情けをかける</button>
              <button className="btn btn-danger" type="button" onClick={submitWin}>勝ちを宣言する</button>
            </div>
          </div>
        </>);
      };
    };
    // eslint-disable-next-line 
  }, [currentTurnInfo]);

  return { wordSubmissionForm };
};
