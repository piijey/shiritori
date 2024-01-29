import React, {useEffect} from 'react';
import { useTokenizerInitializer } from './TokenizerInitializer';
import { useWordSubmissionForm } from './WordSubmissionForm';
import { useShiritoriGrid } from './ShiritoriGrid';
import BarLoader from "react-spinners/BarLoader";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  useEffect(() => {
    const titleHeight = document.querySelector('.title').offsetHeight;
    const panelHeight = document.querySelector('.inputpanel').offsetHeight;
    const appHeight = `calc(100vh - ${titleHeight}px - ${panelHeight}px)`;
    const appElement = document.querySelector('.App');
    document.querySelector('.App').style.height = appHeight;
    appElement.style.height = titleHeight;
    appElement.style.marginTop = `${titleHeight}px`;
    appElement.style.marginBottom = `${panelHeight}px`;
  }, []);
  
  const { loading, tokenizer } = useTokenizerInitializer();
  const { submitWord, userInputWord, words } = useWordSubmissionForm(tokenizer);
  const { renderGrid } = useShiritoriGrid(words);

  return (
    <div className='App'>
      <div className='container'>
        <table className='shiritorigrid'>
          <tbody>{renderGrid()}</tbody>
        </table>
      </div>
      <div className='inputpanel'>
      <div className='card p-2 align-items-center'>
        { loading ? (
          <>
            <div>辞書を準備中</div>
            <BarLoader color='gray' />
            <div>ちょっと待ってね</div>
          </>
        ) : (
          <>
          <div className='inputbox'>
            <form onSubmit={submitWord}>
              <input name='text' type='text' placeholder="単語を入力してね" />
              <button type='submit' className='btn btn-primary'>Go</button>
            </form>
          </div>
          </>
      )}
      <div className='inputword'>
        <p>{userInputWord.surface}<br/>
        {userInputWord.reading}</p>
      </div>
      </div>
    </div>
    </div>
  );
}

export default App;
