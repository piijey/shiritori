import { useState, useEffect } from 'react';

var kuromoji = require('kuromoji');

export const useTokenizerInitializer = ( kuromojiDictPath ) => {
    // Kuromojiトークナイザの初期化、完了したら子コンポーネントにトークナイザを渡す

    const [loading, setLoading] = useState(true);
    const [tokenizer, setTokenizer] = useState(null);
    const [ifLoadingFail, setIfLoadingFail ] = useState(false);

    useEffect(() => { //アプリのマウント時にkuromojiトークナイザを初期化
        if ( !loading ) {
            console.log("attempt to reload tokenizer?");
            return
        };
        function initializeTokenizer() {
        return new Promise((resolve, reject) => {
            kuromoji.builder(
            { dicPath: kuromojiDictPath }
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
            console.log("トークナイザをロードしたよ");
            setLoading(false);
        } catch (err) {
            console.error("トークナイザのロードに失敗したよ", err);
            setIfLoadingFail(true);
        }
        }
        loadTokenizer();
    // eslint-disable-next-line
    }, []);

    return { loading, tokenizer, ifLoadingFail };
};
