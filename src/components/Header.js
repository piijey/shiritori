import { RiUser5Line, RiRobot2Line, RiInformationLine } from "react-icons/ri";
import { BsGithub } from "react-icons/bs";
import { useState } from 'react';

export const useHeader = ( version ) => {
    const Header = () => (
        <>
        <div className='header-container row align-items-center'>
            <div className='col'/>
            <div className='col text-md-start'>
                <h1>しりとりぼっと</h1>
                <h4> {version} - by PiiJey</h4>
            </div>
            <div className='col text-end'>
                <button className='btn btn-outline-light border-0 p-2' area-label='ルールを表示' onClick={handleOpenModal}>
                <RiInformationLine className='iconLarge' aria-label='情報マーク'/>
                </button>
            </div>
        </div>
        {isModalOpen && <GameRulesModal onClose={handleCloseModal} />}
        </>
    );

    const Rules = () => (
        <>
        <ul>
        <li>プレイヤー（<span className='message-system'><RiRobot2Line className='iconMedium' aria-label="ボット"/>ぼっと</span> と <span className='message-user'><RiUser5Line className='iconMedium' aria-label="あなた"/>あなた</span>）が交互に言葉（名詞）を言うよ</li>
        <li>次のプレイヤーは、前のプレイヤーが言った言葉の最後の文字から始まる言葉を言うよ</li>
        <li>「ン」で終わる言葉を言ったら負けだよ</li>
        <li>同じ言葉は1回しか使えないよ</li>
        <li>最後の文字が小さい文字のときは大きい文字（「ョ」→「ヨ」）、伸ばす文字のときは前の文字（「プレイヤー」→「ヤ」）を使うよ</li>
        <li><span className='message-user'><RiUser5Line className='iconMedium' aria-label="あなた"/>あなた</span> が言った言葉を <span className='message-system'><RiRobot2Line className='iconMedium' aria-label="ボット"/>ぼっと</span> が知らなかったら、ほかの言葉か、ほかの表記（漢字・カタカナ・ひらがな）を試してみてね</li>
        </ul>
        </>
    )

    //ルール説明のモーダル
    const [isModalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const GameRulesModal = ({ onClose }) => (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content modal-rules">
                    <div class="modal-header py-2">
                        <h2 class="modal-title">しりとりぼっとについて</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="閉じる" onClick={onClose}></button>
                    </div>
                    <div class="modal-body p-2">
                        <h2>ルール</h2>
                        <Rules/>
                        <h2><RiRobot2Line aria-label="ボット"/></h2>
                        <ul>
                        <li>単語の読みの取得とぼっとの単語選択には、<a href="https://github.com/takuyaa/kuromoji.js" rel="noreferrer" target="_blank">形態素解析器 kuromoji.js</a> と <a href="https://taku910.github.io/mecab/#download" rel="noreferrer" target="_blank">IPA辞書</a> を利用しています</li>
                        <li>さらに詳しくは、<a href="https://github.com/piijey/shiritori" rel="noreferrer" target="_blank">しりとりぼっとの GitHub リポジトリ <BsGithub/></a> をご参照ください</li>
                        </ul>
                    </div>
                    <div class="modal-footer py-2">
                        <button type="button" class="btn btn-primary" aria-label="閉じる" onClick={onClose}>とじる</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const wordsExample = [ //ルール説明に使う言葉
        { surface: "しりとり", reading: "シリトリ", player: "system" },
        { surface: "履歴書", reading: "リレキショ", player: "user" },
        { surface: "ヨーヨー", reading: "ヨーヨー", player: "system" },
        { surface: "溶岩", reading: "ヨウガン", player: "user" },
    ];

    return { Header, Rules, wordsExample };
};
