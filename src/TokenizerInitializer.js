import { useState, useEffect } from 'react';

var kuromoji = require('kuromoji');

export const useTokenizerInitializer = () => {
    // Kuromojiトークナイザの初期化、完了したら子コンポーネントにトークナイザを渡す

    const [loading, setLoading] = useState(true);
    const [tokenizer, setTokenizer] = useState(null);

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
    
    return { loading, tokenizer };
};
