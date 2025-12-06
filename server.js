// Expressのモジュールを読み込む
const express = require('express');

// ToDoリストを保存するための配列（サーバーのメモリ上に保持される）
let todos = [
    { id: 1, text: "Node.js作品をポートフォリオに統合する", completed: false },
    { id: 2, text: "フィルタとソートのバグを修正する", completed: true }
];
// 新しいIDを生成するためのカウンター
let nextId = 3;

// インストールしたaxiosモジュールを読み込む
const axios = require('axios');

// corsモジュールを読み込む
const cors = require('cors');

// Expressアプリのインスタンスを作成する
const app = express();

// すべてのオリジンからのアクセスを許可するミドルウェアを追加
// 開発中はこれで十分です。
app.use(cors());

// ★★★ JSONボディパーサーもここで設定しておきましょう (POST/PATCH/DELETEで必須)
app.use(express.json());

// サーバーが待ち受けるポート番号を定義 (一般的な開発環境では3000を使用)
const PORT = 3001;

// ==========================================================
// ★ 追加する動的なルーティング（Read（読み取り）APIの作成）
// ==========================================================
// GET /api/todos: 全てのToDoリストを取得
app.get('/api/todos', (req, res) => {
    // 定義した todos 配列をそのままJSONとして返す
    res.json({
        status: "success",
        count: todos.length,
        data: todos
    });
});

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


//
// POST /api/todos: 新しいToDoタスクを作成
//
app.post('/api/todos', (req,res) => {
    const newText = req.body.text;// ユーザーが送ってきたタスクのテキストを取得

    if (!newText) {
        // textが送られてこなかったらエラーを返す（400 Bad Request）
        return res.status(400).json({ status: "error", message: "タスクのテキストが必要です。" });
    }

    // 新しいタスクオブジェクトを作成
    const newTodo = {
        id: nextId++, // IDを付与し、次のためにカウンターをインクリメント
        text: newText,
        completed: false // 初期状態は未完了
    };
    // リストに新しいタスクを追加
    todos.push(newTodo);
    // 作成されたタスクオブジェクトをクライアントに返す（201 Created）
    res.status(201).json({ status: "success", data: newTodo });
}); 

//
// PATCH /api/todos/:id: 特定のToDoタスクの完了状態を更新
//
app.patch('/api/todos/:id', (req,res) => {
    // 1. URLパラメータからIDを取得（文字列なので数値に変換）
    const todoId = parseInt(req.params.id);
    // 2. リクエストボディから更新データ（completed）を取得
    const newCompletedStatus = req.body.completed;
    // 3. 該当IDのタスクを探す
    // find()メソッドで条件に合う最初の要素を見つける
    const todo = todos.find(t => t.id === todoId);

    // 4. タスクが見つからない場合の処理
    if (!todo) {
        // 404 Not Foundを返す
        return res.status(404).json({ status: "error", message: "指定されたタスクIDが見つかりません。" });
    }
    // 5. タスクを更新
    // newCompletedStatusが真偽値（boolean）であることを確認
    if (typeof newCompletedStatus === 'boolean') {
        todo.completed = newCompletedStatus;
        // 6. 更新成功（200 OK）と更新されたタスクを返す
        res.json({ status: "success", data: todo });
    } else {
        // データの形式が不正な場合（400 Bad Request）
        res.status(400).json({ status: "error", message: "更新する完了ステータス (completed) が不正です。" });
    }
});

//
// DELETE /api/todos/:id: 特定のToDoタスクを削除
//
app.delete('/api/todos/:id', (req, res) => {
    // 1. URLパラメータからIDを取得（文字列なので数値に変換）
    const todoId = parseInt(req.params.id);

    // 2. 該当IDのタスクを探す
    const initialLength = todos.length;

    // 該当ID以外のタスクだけを残す
    todos = todos.filter(todo => todo.id !== todoId);

    // 3. 処理結果の確認と返信
    if (todos.length < initialLength) {
        // リストの要素数が減っていれば削除成功（204 No Content を返すのが一般的）
        res.status(204).send();
    } else {
        // 削除対象が見つからなかった場合（404 Not Found）
        res.status(404).json({ status: "error", message: "指定されたタスクIDが見つかりません。" });
    }
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