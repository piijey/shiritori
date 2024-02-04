import React, { useState, useEffect, useRef } from 'react';
import WebFont from 'webfontloader';

import { useTokenizerInitializer } from './TokenizerInitializer';
import { useWordSubmissionForm } from './WordSubmissionForm';
import { useGameStateManager } from './GameStateManager';
import { useRuleValidator } from './RuleValidator';
import { useSystemWordSelector } from './SystemWordSelector';
import { useShiritoriGrid } from './ShiritoriGrid';

import { RiUser5Line, RiRobot2Line } from "react-icons/ri";
import BarLoader from "react-spinners/BarLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


WebFont.load({
  google: {
    families: ['Monomaniac One:400']
  }
});


const Title = () => (
  <>
    <div className="title">
      <h1>しりとりぼっと</h1>
    </div>
  </>
);


function App() {
  const { loading, tokenizer } = useTokenizerInitializer();

  const wordsExample = [ //ルール説明に使う言葉
    { surface: "しりとり", reading: "シリトリ", player: "system" },
    { surface: "履歴書", reading: "リレキショ", player: "user" },
    { surface: "ヨーヨー", reading: "ヨーヨー", player: "system" },
    { surface: "溶岩", reading: "ヨウガン", player: "user" },
  ];
  const [words, setWords] = useState(wordsExample);

  const { gameState, handleGameStateChange, currentTurnInfo, setCurrentTurnInfo } = useGameStateManager(words, setWords, wordsExample);
  const { submitWord } = useWordSubmissionForm(tokenizer, setCurrentTurnInfo);
  useRuleValidator(currentTurnInfo, setCurrentTurnInfo, words);
  useSystemWordSelector( gameState, currentTurnInfo, setCurrentTurnInfo);
  const { renderGrid } = useShiritoriGrid(words);

  const waitingPage = () => {
    return (<>
      <div className='container p-0'>
        <div className='instruction'>
          <h3>ルール</h3>
          <ul>
            <li>プレイヤー（<RiRobot2Line/>ボットと<RiUser5Line/>あなた）が交互に言葉（名詞）を言うよ</li>
            <li>次のプレイヤーは、前のプレイヤーが言った言葉の最後の文字から始まる言葉を言うよ</li>
            <li>「ン」で終わる言葉を言ったら負けだよ</li>
          </ul>
        </div>
        <div className='grid-container'>
          <div className='shiritorigrid'>
            <table>
                <tbody>{renderGrid()}</tbody>
            </table>
          </div>
        </div>
        <div className='instruction'>
          <ul>
            <li>最後の文字が小さい文字のときは大きい文字（「ョ」→「ヨ」）、伸ばす文字のときは前の文字（「プレイヤー」→「ヤ」）を使うよ</li>
            <li>同じ言葉は1回しか使えないよ</li>
            <li><RiUser5Line/>あなたが言った言葉を<RiRobot2Line/>ボットが知らなかったら、ほかの言葉を言ってね</li>
            <li>しりとりを楽しもう！</li>
          </ul>
        </div>
      </div>
      <div className='input-container'>
        <div className='card align-items-center input-card'>
          {loading ? <>
            <div className='system-message'>
              辞書を読み込み中
              <BarLoader color='white' />
            </div>
            <button className="btn btn-outline-primary" disabled aria-label="辞書の読み込みが完了したらボタンが有効になります">はじめる</button>
          </>
          :
            <button className="btn btn-primary" onClick={handleGameStateChange}>はじめる</button>
          }
        </div>
      </div>
    </>)
  };

  const scrollContainerRef = useRef(null);
  useEffect(() => {
    // 最新の単語にスクロールする
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 100);
  }, [words]);

  const progressPage = () => {
    return (<>
      <div className='container p-0'>
        <div className='grid-container' ref={scrollContainerRef}>
          <div className='shiritorigrid'>
            <table>
                <tbody>{renderGrid()}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='input-container'>
        <div className='card align-items-center input-card'>
          <div className='system-message'>
            {currentTurnInfo ? <> {//ここを後でMessageManagerで実装する
              }
              <div>{currentTurnInfo.word}</div>
              <div>{currentTurnInfo.nextStartWith}</div>
              <div className='debug-info'>{JSON.stringify(currentTurnInfo)}</div>
            </>:<></>
            }
          </div>
          <form onSubmit={submitWord}>
            <div className="input-group p-2">
              <input name='text' type="text" className="form-control" placeholder="次の言葉を入力してね" aria-label="次の言葉を入力"/>
              <button className="btn btn-primary" type="submit">言う</button>
            </div>
          </form>
          <button className="btn btn-secondary btn-sm" type="button" onClick={handleGameStateChange}>しりとりをやめる</button>
        </div>
      </div>
    </>)
  };

  const finishedPage = () => {
    return (<>
    <div className='container p-0'>
      <div className='grid-container'>
        <div className='shiritorigrid' ref={scrollContainerRef}>
          <table>
              <tbody>{renderGrid()}</tbody>
          </table>
        </div>
      </div>
    </div>
    <div className='input-container'>
      <div className='card align-items-center input-card'>
        <div className='system-message'>
          おしまい
        </div>
        <button className="btn btn-primary" type="button" onClick={handleGameStateChange}>はじめに戻る</button>
      </div>
    </div>
  </>)
  }

  return (<>
    <div className='app'>
      <Title />
      { gameState === 'inProgress' ? <>
          {progressPage()}
      </> : <>
      { gameState === 'waiting' ? <>
          {waitingPage()}
        </> : <>
          {finishedPage()}
        </> }
      </> }
    </div>
  </>
  );
}

export default App;
