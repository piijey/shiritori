import React, { useState, useEffect, useRef } from 'react';
import WebFont from 'webfontloader';

import { useHeader } from  './components/Header.js';
import { useTokenizerInitializer } from './components/TokenizerInitializer';
import { useWordSubmissionForm } from './components/WordSubmissionForm';
import { useGameStateManager } from './components/GameStateManager';
import { useRuleValidator } from './components/RuleValidator';
import { useSystemWordSelector } from './components/SystemWordSelector';
import { useShiritoriGrid } from './components/ShiritoriGrid';
import { useMessageManager } from './components/MessageManager';

import { RiUser5Line, RiRobot2Line, RiShiningLine } from "react-icons/ri";
import { GiDiamondTrophy } from "react-icons/gi";

import BarLoader from "react-spinners/BarLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


WebFont.load({
  google: {
    families: ['Monomaniac One:400']
  }
});

function App() {
  const { Header, Rules, wordsExample } = useHeader("v0.1.2 かいはつばん");
  const { loading, tokenizer } = useTokenizerInitializer();
  const [ words, setWords ] = useState(wordsExample);

  const { gameState, handleGameStateChange, currentTurnInfo, setCurrentTurnInfo, winner, setWinner } = useGameStateManager(words, setWords, wordsExample);
  const { wordSubmissionForm } = useWordSubmissionForm( currentTurnInfo, tokenizer, setCurrentTurnInfo, setWinner );
  useRuleValidator(currentTurnInfo, setCurrentTurnInfo, words);
  useSystemWordSelector( gameState, currentTurnInfo, setCurrentTurnInfo);
  const { renderGrid } = useShiritoriGrid(words);
  const { message } = useMessageManager( currentTurnInfo );

  const waitingPage = () => {
    return (<>
      <div className='container p-0'>
        <div className='instruction'>
          <h2>ルール</h2>
          <Rules />
          <h2>れい</h2>
          <div className='grid-container'>
            <div className='shiritorigrid'>
              <table>
                  <tbody>{renderGrid()}</tbody>
              </table>
            </div>
          </div>
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
          : <>
            <div className='system-message'>
              準備ができたよ
            </div>
            <button className="btn btn-primary" onClick={handleGameStateChange}>はじめる</button>
          </>
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
        <div className='grid-container grid-scroller' ref={scrollContainerRef}>
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
            { message }
          </div>
          { wordSubmissionForm }
          <button className="btn btn-secondary btn-sm" type="button" onClick={handleGameStateChange}>しりとりをやめる</button>
        </div>
      </div>
    </>)
  };

  const finishedPage = () => {
    return (<>
    <div className='container p-0'>
      <div className='grid-container grid-scroller'>
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
          { winner === 'user' ? <>
              <p>あなたの勝ち <RiUser5Line className='iconLarge' aria-label="ユーザー"/><GiDiamondTrophy className='iconLarge' aria-label="トロフィー"/><RiShiningLine aria-label="きらきら"/></p>
              <p>おめでとう！</p>
            </> : <>
            { winner === 'system' ? <>
              <p>ぼっとの勝ち <RiRobot2Line className='iconLarge' aria-label="ボット"/><GiDiamondTrophy className='iconLarge' aria-label="トロフィー"/><RiShiningLine aria-label="きらきら"/></p>
              <p>やったあ！</p>
            </> : <>
              <p>しりとりはおしまい <RiUser5Line className='iconLarge' aria-label="ユーザー"/><RiRobot2Line className='iconLarge' aria-label="ボット"/></p>
            </> }
          </> }
        </div>
        <div>
          <p>また遊んでね</p>
          <button className="btn btn-primary" type="button" onClick={handleGameStateChange}>はじめに戻る</button>
        </div>
      </div>
    </div>
  </>)
  }

  return (<>
    <div className='app'>
      <Header />
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
