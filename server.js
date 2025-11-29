// Expressのモジュールを読み込む
const express = require('express');

// インストールしたaxiosモジュールを読み込む
const axios = require('axios');

// corsモジュールを読み込む
const cors = require('cors');

// Expressアプリのインスタンスを作成する
const app = express();

// すべてのオリジンからのアクセスを許可するミドルウェアを追加
// 開発中はこれで十分です。
app.use(cors());

// サーバーが待ち受けるポート番号を定義 (一般的な開発環境では3000を使用)
const PORT = 3001;


// ==========================================================
// ★ 追加する動的なルーティング（APIエンドポイント）
// ==========================================================
// /api/status へのGETリクエスト（アクセス）が来たら実行される
app.get('/api/status', (req,res) => {
    // サーバー側でデータを生成
    const data = {
        status: "OK",
        server_taime: new Date().toISOString(),// 現在の時刻を取得
        message: "Node.js APIが正常に動作しています。"
    };
    // JSON形式でデータをブラウザに返す
    // res.json()を使うと、自動的にJSONに変換し、ヘッダーも適切に設定されます。
    res.json(data);
});


// ==========================================================
// ★ ここに追加する新しい動的なルーティング（/api/greet）
// ==========================================================
app.get('/api/greet',(req, res) => {
    // 1. クエリパラメータ（?name=〇〇）から 'name' の値を取得する
    const userName = req.query.name;
    let greetingMessage = "名前が指定されていません。";

    if(userName) {
        // 2. nameの値に応じて、返すメッセージを動的に変更する
        greetingMessage = `こんにちは、${userName}さん！Node.jsより挨拶を送信します。`
    }

    // 3. JSON形式で応答を返す
    res.json ({
        status: "OK",
        greeting: greetingMessage,
        received_name: userName || "なし"
    });
});


// ==========================================================
// ★ 追加する動的なルーティング（/api/users: 外部API連携）
// ==========================================================
app.get('/api/users', async (req,res) => {
    try{
        // 1. axiosを使って外部APIにGETリクエストを送信
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        // 2. 外部APIから取得したデータを取り出す
        const users = response.data;
        // 3. 取得したデータをブラウザに返す
        res.json({
            status: "success",
            user_count: users.length,
            data: users.map(user => ({ id: user.id, name:user.name, email: user.email }))
        });
    } catch (error) {
        // 外部APIアクセスでエラーが発生した場合の処理
        console.error("外部APIアクセス中にエラーが発生しました:",error.message);
        res.status(500).json({ status: "error", message: "データの取得中にサーバーエラーが発生しました。"});
    }
});


// ==========================================================
// publicフォルダを静的ファイルとして公開する
// ==========================================================
// Expressに対し、「/」へのアクセスが来たら、publicフォルダの中身を見に行くように指示する
app.use(express.static('public'));


// ==========================================================
// サーバーの起動
// ==========================================================
app.listen(PORT, () => {
    // サーバーが起動したらコンソールにメッセージを表示
    console.log(`✅ サーバーが起動しました: http://localhost:${PORT}`);
    console.log(`   静的ファイルは /public フォルダから配信されます。`);
    console.log(`   APIエンドポイント: http://localhost:${PORT}/api/status`);
});