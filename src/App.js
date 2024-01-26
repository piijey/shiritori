import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

var kuromoji = require('kuromoji');

function App() {
  const [loading, setLoading] = useState(true); //load kuromoji builder 
  const [userInputText, setUserInputText] = useState("");
  const [tokenizer, setTokenizer] = useState(null);
  const [userWord, setUserWord] = useState({ surface: null, reading: null, player: null });

  useEffect(() => { //アプリのマウント時にkuromojiトークナイザを初期化
    function initializeTokenizer() {
      return new Promise((resolve, reject) => {
        kuromoji.builder(
          { dicPath: process.env.PUBLIC_URL + "/kuromoji-dict/" }
          ).build((err, buildTokenizer) => {
          if (err) {
            reject(err);
          } else {
            resolve(buildTokenizer);
          }
        });
      });
    }

    async function loadTokenizer() {
      try {
        const tokenizer = await initializeTokenizer();
        setTokenizer(tokenizer);
        console.error("トークナイザを初期化しました");
      } catch (err) {
        console.error("トークナイザの初期化に失敗しました", err);
      } finally {
        setLoading(false);
      }
    }
    loadTokenizer();
  // eslint-disable-next-line
  }, []);

  function submitWord(event) {
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
    let reading = "";
    tokens.forEach(token => {
      if (token.reading === undefined) {
        console.log(token.surface_form, "の読みがわかりません");
      } else {
        reading += token.reading
      };
    });
    setUserWord({ surface: userInputText, reading: reading, player: 'user' });
    setWords([...words, { surface: userInputText, reading: reading, player: 'user' }]);
    // eslint-disable-next-line
  }, [userInputText]);


  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([
    { surface: "しりとり", reading: "シリトリ", player: "system" },
    //{ surface: "りんご", reading: "リンゴ", player: "user" },
    //{ surface: "豪雨", reading: "ゴウウ", player: "system" },
    //{ surface: "海", reading: "ウミ", player: "user" },
    //{ surface: "ミンミンゼミ", reading: "ミンミンゼミ", player: "system" }
  ]);

  useEffect(() => {
    updateGrid();
    // eslint-disable-next-line
  }, [words]);

  const updateGrid = () => {
    let newGrid = [];
    let offset = 0;

    words.forEach((wordObj, index) => {
      ['surface', 'reading'].forEach((key) => {
        const word = wordObj[key];
        let row = new Array(offset).fill({ character: null, class: null });
        for (let i = 0; i < word.length; i++) {
          const cellClass = `${wordObj.player}${key}`
          row.push({ character: word[i], class: cellClass})
        }
        newGrid.push(row);
        if (key === 'reading'){
          offset = offset + word.length - 1;
        }
      })
    });
    setGrid(newGrid);
  };

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((cell, cellIndex) => (
          <td key={cellIndex} className={cell.class}>{cell.character || ''}</td>
        ))}
      </tr>
    ));
  };


  return (
    <div className='App'>
      <div className='card p-2 align-items-center'>
        { loading ? (
          <div>Loading...</div>
        ) : (
          <>
          <div className='inputbox'>
            <form onSubmit={submitWord}>
              <input name='text' type='text' placeholder="単語を入力してね" />
              <button type='submit' className='btn btn-primary'>Go</button>
            </form>
          </div>
          <div className='inputword'>
            <p>{userWord.surface}<br/>
            {userWord.reading}</p>
          </div>
          </>
        )}
      </div>
      <div className='container'>
        <table className='shiritorigrid'>
          <tbody>{renderGrid()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
