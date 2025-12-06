document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------
    // 外部ユーザーリスト管理機能 (Node.js API連携)
    // ------------------------------------------------
    const API_URL = 'http://localhost:3001/api/users';


    async function fetchUsers() {
        const loading = document.getElementById('loading-message');
        const table = document.getElementById('user-table');
        const tableBody = document.getElementById('user-data');

        try {
            // 1. fetch()を使って自作のNode.js APIにアクセス
            const response = await fetch(API_URL);

            // 2. 応答をJSON形式で受け取る
            const apiResult = await response.json();
            
            // エラーチェック（サーバー側で設定したstatus: "success"をチェック）
            if (apiResult.status !== 'success') {
                tableBody.innerHTML = '<tr><td colspan="3">エラー: データを取得できませんでした。</td></tr>';
                return ;
            }

            // 3. 取得したデータ（apiResult.data）をループ処理
            apiResult.data.forEach(user => {
                const row = tableBody.insertRow();// 新しい行を作成

                // 各セルにデータを挿入
                row.insertCell().textContent = user.id;
                row.insertCell().textContent = user.name;
                row.insertCell().textContent = user.email;
            });

            // 4. ローディングメッセージを消し、テーブルを表示
            loading.style.display = 'none';
            table.style.display = 'table';
        } catch (error) {
            // 通信エラー（サーバーが起動していないなど）が発生した場合
            console.error("API呼び出しエラー:", error);
            loading.textContent = 'API接続エラーが発生しました。サーバーが起動しているか確認してください。';
            loading.style.color = 'red';
        }
    }


    // ------------------------------------------------
    // ToDoリスト管理機能の実装 (Node.js API連携)
    // ------------------------------------------------
    function initTodoList() {
        // サーバーのポート番号に合わせてください
        const API_BASE_URL = 'http://localhost:3001/api/todos';

        const todoListElement = document.getElementById('todo-list');
        const todoInputElement = document.getElementById('todo-input');
        const addTodoBtn = document.getElementById('add-todo-btn');

        // ★★★ ここに要素の取得チェックを追加 ★★★
        console.log("ToDoリストの要素:", todoListElement);
        console.log("入力フィールドの要素:", todoInputElement);
        console.log("追加ボタンの要素:", addTodoBtn);
        // ★★★ ------------------------------ ★★★
        

        // =========================================================
        // R (READ): タスク一覧の取得と表示
        // =========================================================
        async function fetchTodos() {
            try {
                const response = await fetch(API_BASE_URL);
                if (!response.ok) {
                    throw new Error('APIからデータを取得できませんでした');
                }
                const result = await response.json();

                todoListElement.innerHTML = '';

                if (result.status === 'success' && result.data) {
                    result.data.forEach(todo => {
                        renderTodoItem(todo);
                    });
                } else {
                    todoListElement.innerHTML = '<li class="loading-message">現在のタスクはありません。</li>';
                    console.error("ToDoリストのデータ構造が不正です:", result);
                }
            } catch (error) {
                console.error("ToDoリストの取得エラー:", error);
                todoListElement.innerHTML = '<li class="error-message">サーバーとの接続に失敗しました。Node.jsサーバーが起動しているか確認してください。</li>';
            }
        }

        // タスクをリスト要素としてDOMに描画する関数
        function renderTodoItem(todo) {
            const li = document.createElement('li');
            li.dataset.todoId = todo.id;
            li.classList.add('todo-item');
            if (todo.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <div class="todo-controls">
                    <button class="complete-btn todo-btn">${todo.completed ? '↩ 戻す (PATCH)' : '✔ 完了 (PATCH)'}</button>
                    <button class="delete-btn todo-btn delete-btn-style">🗑 削除 (DELETE)</button>
                </div>
            `;

            // 削除ボタンにイベントリスナーを設定 (DELETE)
            li.querySelector('.delete-btn').addEventListener('click', () =>{
                deleteTodo(todo.id);
            });

            // 完了ボタンにイベントリスナーを設定 (PATCH/UPDATE)
            li.querySelector('.complete-btn').addEventListener('click', () => {
                toggleComplete(todo.id, !todo.completed); // 現在のcompletedを反転させて送信
            });

            todoListElement.appendChild(li);
        }


        // =========================================================
        // C (CREATE): 新しいタスクの追加
        // =========================================================
        async function addTodo() {
            const text = todoInputElement.value.trim();
            if (text === "") return;
            
            try {
                const response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({text: text })
                });

                if (!response.ok) {
                    throw new Error('タスクの追加に失敗しました。');
                }

                todoInputElement.value = '';
                fetchTodos(); // リスト再取得で画面を更新
            } catch (error) {
                console.error("タスク追加エラー:", error);
                alert("タスクの追加に失敗しました。サーバー起動を確認してください。")
            }
        }

        // イベントリスナー
        addTodoBtn.addEventListener('click', addTodo);
        todoInputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        // =========================================================
        // U (UPDATE): 完了状態の切り替え
        // =========================================================
        async function toggleComplete(id, completed) {
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'PATCH',// PATCHメソッドを使用
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ completed: completed })// completedの値だけを送信
                });

                if (!response.ok) {
                throw new Error('タスクの更新に失敗しました。');  
                }

                fetchTodos(); // リスト再取得で画面を更新

            } catch (error) {
                console.error("タスク更新エラー:", error);
                alert("タスクの更新に失敗しました。");
            }
        }

        // =========================================================
        // D (DELETE): タスクの削除
        // =========================================================
        async function deleteTodo(id) {
            const confirmed = confirm(`ID ${id} のタスクを削除してもよろしいですか？`);
            if (!confirmed) return;

            try {
                const response = await  fetch(`${API_BASE_URL}/${id}`, {
                    method: 'DELETE'
                });

                if (response.status == 204) {
                    fetchTodos();// リスト再取得で画面を更新
                } else {
                    throw new Error('タスクの削除に失敗しました。');
                }
            } catch (error) {
                console.error("タスク削除エラー:", error);
                alert("タスクの削除に失敗しました。");
            }
        }
        fetchTodos();
    }

    // ページが読み込まれたら関数を実行
    console.log("✅ DOMContentLoadedイベント発生。処理開始。"); // 追加
    fetchUsers(); // ユーザーリスト取得
    console.log("✅ ユーザーリスト取得関数 呼び出し完了。"); // 追加
    initTodoList(); // ToDoリストの初期化
    console.log("✅ ToDoリスト初期化関数 呼び出し完了。"); // 追加
});