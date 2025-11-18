document.addEventListener('DOMContentLoaded',()=>{
    // ------------------------------------------------
    // 1. ダークモード切り替え機能の実装 
    // ------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const darkModeClass = 'dark-mode';
    const storageKey = 'themeMode';

    // **A. テーマ切り替え処理の関数**
    function toggleTheme() {
        // body要素に 'dark-mode' クラスを追加/削除する
        body.classList.toggle(darkModeClass);
        
        // 現在の状態を LocalStorage に保存する
        if (body.classList.contains(darkModeClass)) {
            localStorage.setItem(storageKey, 'dark');
            themeToggleBtn.textContent = '🌙 ダークモード';
            themeToggleBtn.setAttribute('aria-pressed', 'true');
        } else {
            localStorage.setItem(storageKey, 'light');
            themeToggleBtn.textContent = '🌞 ライトモード';
            themeToggleBtn.setAttribute('aria-pressed', 'false');
        }
    }

    // **B. ページロード時の初期設定**
    // LocalStorageに保存されたテーマ設定を読み込む
    const storedTheme = localStorage.getItem(storageKey);

    // 1. 保存された設定があればそれを適用する
    if (storedTheme === 'dark') {
        body.classList.add(darkModeClass);
        themeToggleBtn.textContent = '🌙 ダークモード';
        themeToggleBtn.setAttribute('aria-pressed', 'true');
    } else {
        // 2. 設定がない、または'light'の場合はライトモードを初期表示
        themeToggleBtn.textContent = '🌞 ライトモード';
        themeToggleBtn.setAttribute('aria-pressed', 'false');
    }
    
    // **C. ボタンクリックイベント**
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }


    // ------------------------------------------------
    // 2. テキストカウンター機能の実装
    // ------------------------------------------------
    const textInput = document.getElementById('text-input');
    const charCountDisplay = document.getElementById('char-count');

    if (textInput && charCountDisplay) {
        function updateCounter(){
            const text = textInput.value;
            const count = text.length;

            charCountDisplay.textContent = count;
        }
    

        textInput.addEventListener('input',updateCounter);
        // 初期表示を確実にするため実行
        updateCounter();
    }


    // ------------------------------------------------
    // 3. ヘッダー画像連結スライドショー機能 
    // ------------------------------------------------
    
    // index.htmlで使用している全作品の画像URLを直接リスト化
    // (js-works.htmlには .work-item が存在しないため、ここで定義します)
    const allImages = [
        'images/insta1.jpg', 'images/insta2.jpg', 'images/insta3.jpg', 'images/insta4.jpg',
        'images/poster1.jpg', 'images/poster2.jpg', 'images/poster3.jpg', 'images/poster4.jpg',
        'images/tv1.jpg', 'images/tv2.jpg', 'images/tv3.jpg', 'images/tv4.jpg'
    ];
    const slideshowTrack =document.getElementById('slideshow-track');

    if (slideshowTrack && allImages.length > 0) {
        // 1. オリジナルの画像をトラックに追加
        allImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '作品スライド';
            slideshowTrack.appendChild(img);
        });

        // 2. スライドショーを無限ループさせるために、コンテンツを複製して追加
        //    元のコンテンツの幅だけスクロールさせるとループするようにするため、複製が必要です。
        allImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '作品スライド(複製)';
            slideshowTrack.appendChild(img);
        });
    }


    // ------------------------------------------------
    // 5. ローディングアニメーション機能の実装
    // ------------------------------------------------
    const loaderWrapper = document.getElementById('loader-wrapper');

    // すべてのリソース（画像など）の読み込みが完了したときのイベント
    // DOMContentLoaded が発火した後、さらに window.onload を待つことで全ての要素をカバー
    window.onload = () => {
        if (loaderWrapper) {
            // CSSの hidden クラスを付与してフェードアウトさせる
            loaderWrapper.classList.add('hidden');
        }
    };


    // ------------------------------------------------
    // 4. スクロール時の要素フェードイン機能の実装
    // ------------------------------------------------
    const sections = document.querySelectorAll('.js-work-section');
    
    // どの程度画面内に入ったら発火させるかの設定
    // 0.2は「要素の20%が画面内に入ったら」という意味
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    // Intersection Observer
    const observer = new IntersectionObserver((entries, observer) =>{
        entries.forEach(entry => {
        // 要素がビューポート（画面）内に入った場合
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // 一度アニメーションが完了したら、監視を停止してパフォーマンスを維持
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // すべてのセクションを監視対象に追加
    sections.forEach((section, index) => {
        // 最初のセクションは強制的に表示する 
        // (セクション1は画面内にあるはずなので、アニメーションなしで表示)
        if (index === 0){
            section.classList.add('appear');
        } else {
            // 2番目以降のセクションを監視対象に追加
            observer.observe(section);
        }
    });


    // ------------------------------------------------
    // 6. リアルタイム入力フォーム検証機能の実装 (新規追加)
    // ------------------------------------------------
    const emailInput = document.getElementById('email-input');
    const feedbackElement = document.getElementById('validation-feedback');

    // ✅ 正規表現: 厳密ではありませんが、簡単なメールアドレス形式（文字列@文字列.2文字以上）をチェック
    // ^: 行の先頭、$: 行の末尾
    // \S+ : 空白文字以外が1文字以上
    // @ : @マーク
    const emailRegex = /^\S+@\S+\.\S+$/

    function validateEmail() {
        const email = emailInput.value.trim();
        // 1. まず、既存のエラー/成功クラスをすべて削除してリセット
        emailInput.classList.remove('input-success','input-error');
        feedbackElement.classList.remove('success-message','error-message');
        feedbackElement.textContent = '';
    
        // 2. 入力が空の場合は何もしない（または別のメッセージを表示）
        if (email.length === 0) {
            return;
        }
        // 3. 正規表現で検証を実行
        if (emailRegex.test(email)) {
            //成功：形式が正しい場合
            emailInput.classList.add('input-success');
            feedbackElement.classList.add('success-message');
            feedbackElement.textContent = '✅ メールアドレスの形式は正しく認識されました。';
        } else {
            //失敗：形式が正しくない場合
            emailInput.classList.add('input-error');
            feedbackElement.classList.add('error-message');
            feedbackElement.textContent = '❌ 有効なメールアドレスの形式ではありません。';
        }
    }

    if (emailInput) {
        // ユーザーが入力するたびに validateEmail 関数を実行
        emailInput.addEventListener('input',validateEmail);
    }


    // ------------------------------------------------
    // 7. チェックボックスの状態記憶機能の実装 (新規追加)
    // ------------------------------------------------
    const checkbox = document.getElementById('remember-settings-checkbox');
    const checkboxStorageKey = 'rememberCheckboxState';

    if (checkbox) {
        // **A. ページロード時の初期設定**
        // Local Storageから保存された状態を読み込む
        const storedState = localStorage.getItem(checkboxStorageKey);

        if (storedState === 'true') {
            // 保存された値が 'true' ならチェックを入れる
            checkbox.checked = true;
        } else {
            // 保存された値が 'false' または何もなければ、チェックを外す
            checkbox.checked = false;
        }

        // **B. 状態変更時の保存**
        // チェックボックスの状態が変更されたら、Local Storageに保存する
        checkbox.addEventListener('change',() => {
           // チェックされているかどうかを文字列 ('true' or 'false') にして保存
           localStorage.setItem(checkboxStorageKey, checkbox.checked.toString());
        });
    }


    // ------------------------------------------------
    // 8. 個別リセット機能の実装
    // ------------------------------------------------

    // すべてのリセットボタンを一括取得（クラス名で指定）
    const individualResetButtons = document.querySelectorAll('.reset-button');

    function resetIndividualInput(event) {
        // ボタンが持っている data-target-id 属性の値（=リセット対象のID）を取得
        const targetId = event.currentTarget.getAttribute('data-target-id');

        // IDを使って対象の入力フィールドを取得
        const targetInput = document.getElementById(targetId);

        if (targetInput) {
          // 1. 入力内容をクリア
            targetInput.value = ''; 
        }

        // 2. フィードバックと表示のリセット
        // a. 文字数カウンターのリセット (text-input の場合 ) 
        if (targetId === 'text-input' && typeof updateCounter === 'function') {
            updateCounter(); // 入力内容クリア後に再計算（結果は0になる）
        }

        // b. メールアドレス検証のフィードバックリセット (email-input の場合)
        if (targetId === 'email-input') {
            const feedbackElement = document.getElementById('validation-feedback');

            targetInput.classList.remove('input-success', 'input-error');
            if (feedbackElement) {
                feedbackElement.classList.remove('success-message', 'error-message');
                feedbackElement.textContent = ''; // メッセージをクリア
            }
        }       
    }
    // すべてのリセットボタンにイベントを設定
    individualResetButtons.forEach(button => {
        button.addEventListener('click', resetIndividualInput);
    });


    // ------------------------------------------------
    // 9. 外部APIからのデータ取得と表示 (Fetch API)
    // ------------------------------------------------
    const fetchDataBtn = document.getElementById('fetch-data-btn');
    const userListContainer = document.getElementById('user-list-container');

    async function fetchAndDisplayUsers() {
        // ユーザーに処理中であることを伝える
        userListContainer.innerHTML = '<p>データを取得中．．． <span class="loader-small"></span></p>';
        fetchDataBtn.disabled = true;

        try {
            // 1. データの取得 (非同期処理)
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            // エラーハンドリング: HTTPステータスコードが4xx/5xxの場合
            if (!response.ok) {
                throw new Error(`HTTPエラー! ステータス: ${response.status}`);
            }

            // 2. 応答をJSONとして解析 (非同期処理)
            const users = await response.json();

            // 3. データ表示
            displayUsers(users);
        } catch (error) {
            // エラー発生時の処理
            console.error('データ取得エラー:',error);
            userListContainer.innerHTML = '<p class="error-message">データの取得に失敗しました。コンソールを確認してください。</p>';
        } finally {
            // 成功/失敗に関わらずボタンを再度有効化
            fetchDataBtn.disabled = false;
        }
        
    }

    function displayUsers(users) {
        // コンテナを空にする
        userListContainer.innerHTML = '';

        // カードを格納するコンテナを作成（CSS Grid/Flexboxを使うため）
        const cardsGrid =document.createElement('div');
        cardsGrid.classList.add('user-cards-grid');

        users.forEach(user => {
            // 1. ユーザーごとのカード要素を作成
            const card = document.createElement('div'); 
            card.classList.add('user-card'); // カードごとのスタイルクラスを付与

            // 取得したデータ（名前、ユーザー名、メール、会社、都市）を表示
            card.innerHTML = `
                <h3>${user.name}</h3>
                <p><strong>@${user.username}</strong></p>
                <p>📧 ${user.email}</p>
                <p>🏢 ${user.company.name}</p>
                <p>📍 ${user.address.city}</p>
            `;
            cardsGrid.appendChild(card);
        });

        userListContainer.appendChild(cardsGrid);
    }

    // ボタンクリックでデータ取得関数を実行
    if (fetchDataBtn) {
        fetchDataBtn.addEventListener('click',fetchAndDisplayUsers);
    }

    // ------------------------------------------------
    // 10. ランダムな雑学の取得 (Fetch API 応用)
    // ------------------------------------------------
    const fetchFactBtn = document.getElementById('fetch-fact-btn');
    const factDisplay = document.getElementById('cat-fact-display');

    async function fetchCatFact() {
        // 処理中にローディングテキストに切り替える
        factDisplay.innerHTML = '<p>雑学を取得中．．．<span class="loader-small"></span><p>';
        factDisplay.disabled = true;

        try {
            // 1. APIへリクエスト
            const response = await fetch('https://catfact.ninja/fact');
            // エラーハンドリング: HTTPステータスコードが4xx/5xxの場合
            if (!response.ok) {
                throw new Error(`HTTPエラー! ステータス: ${response.status}`);
            }
            // 2. 応答をJSONとして解析 (非同期処理)
            const data = await response.json();
            // 3.データ表示: オブジェクトから 'fact' の値だけを取り出す
            factDisplay.textContent = `💡 ${data.fact}`;

        } catch (error) {
            console.error('雑学取得エラー:',error);
            factDisplay.textContent = '❌ データの取得に失敗しました。';
        } finally {
            // 成功/失敗に関わらずボタンを再度有効化
            fetchFactBtn.disabled = false ;
        }
    }

    if(fetchFactBtn) {
        fetchFactBtn.addEventListener('click',fetchCatFact);
    }

    // ------------------------------------------------
    // 11. ドラッグ＆ドロップ機能 (ToDoリスト)
    // ------------------------------------------------

    // 必要なDOM要素を一括で取得
    const todoAppContainer =document.querySelector('.todo-app-container');
    const allTasks = todoAppContainer ? Array.from(todoAppContainer.querySelectorAll('.todo-task-item')) : [];
    const dropZones = todoAppContainer ? Array.from(todoAppContainer.querySelectorAll('.todo-list-area')) : [];
    
    // A. ドラッグイベント (タスクを掴んだとき)
    allTasks.forEach (task => {
        task.addEventListener('dragstart', (e) => {
            // 1. 掴んだ要素に「dragging」クラスを付けて見た目を変更
            e.currentTarget.classList.add('dragging');
            // 2. 移動させるデータ（タスクのID）を保存
            // 'text/plain' はデータ形式、e.currentTarget.id は移動させるタスクのID
            e.dataTransfer.setData('text/plain',e.currentTarget.id);
        });

        task.addEventListener('dragend', (e) => {
            // 3. ドラッグが終了したら「dragging」クラスを削除
            e.currentTarget.classList.remove('dragging')
        });
    });

    // B. ドロップイベント (ドロップゾーン上での処理)
    dropZones.forEach(zone => {
        // 1. dragover: ドロップを許可するための処理（必須）
        zone.addEventListener('dragover',(e) => {
            e.preventDefault();// これがないとドロップ（dropイベント）が発火しない
        });

        // 2. drop: 要素が離されたときに実行される処理
        zone.addEventListener('drop',(e) => {
            e.preventDefault();

            // 3. 保存されていたタスクIDを取得
            const taskId = e.dataTransfer.getData('text/plain');
            const draggedElement =document.getElementById(taskId);

            if (draggedElement) {
                // 4. ドロップゾーンに要素を追加（移動）
                zone.appendChild(draggedElement);

                // 5. タスクの状態に応じて見た目を更新
                const newStatus = zone.getAttribute('data-status');

                if (newStatus === 'completed') {
                    draggedElement.classList.add('completed');
                    // 完了済みタスクのテキストを更新
                } else {
                    draggedElement.classList.remove('completed');
                }
            }   
        });
    });

    // ------------------------------------------------
    // 12. アニメーション制御 (CSS Animation応用)
    // ------------------------------------------------
    const animatedBox = document.getElementById('animated-box');
    const toggleAnimationBtn = document.getElementById('toggle-animation-btn');
    const resetAnimationBtn = document.getElementById('reset-animation-btn');
    const speedUpBtn = document.getElementById('speed-up-btn');

    if (animatedBox && toggleAnimationBtn) {
        // ⭐️ 1. 停止/再生の切り替え ⭐️
        toggleAnimationBtn.addEventListener('click',() => {
            // クラスではなく、インラインスタイルで再生状態を直接操作
            if (animatedBox.style.animationPlayState === 'paused') {
                // 再開 (running)
                animatedBox.style.animationPlayState = 'running';
                animatedBox.classList.remove('paused'); // 赤枠を消す
                toggleAnimationBtn.textContent = '■ アニメーション停止';
            } else {
                // 停止 (paused)
                animatedBox.style.animationPlayState = 'paused';
                animatedBox.classList.add('paused'); // 赤枠を出す
                toggleAnimationBtn.textContent = '▶ アニメーション再生';
            }
        });
    }

    if (animatedBox && resetAnimationBtn) {
        resetAnimationBtn.addEventListener('click', () => {
            // ⭐️ 2. アニメーションのリセット ⭐️
            animatedBox.style.animation = 'none';

            // 強制的に再描画させるための小技
            void animatedBox.offsetWidth;

            // 元のアニメーションを再適用（速度を初期値の4sに戻す）
            animatedBox.style.animationName = 'rotate-360';
            animatedBox.style.animationDuration = '4s'; // 初期値に戻す
            animatedBox.style.animationTimingFunction = 'linear';
            animatedBox.style.animationIterationCount = 'infinite';

            // 停止クラスを削除して再生状態に戻す
            animatedBox.classList.remove('paused');
            animatedBox.style.animationPlayState = 'running'; // インラインスタイルで再生を確定
            toggleAnimationBtn.textContent = '■ アニメーション停止';
            speedUpBtn.textContent = '↑ 速度アップ';
        });
    }

    if (animatedBox && speedUpBtn) {
        // ⭐️ 3. 速度の変更 ⭐️
        speedUpBtn.addEventListener('click', () => {
            // 1. 現在のCSSスタイルを取得（重要！）
            const style = window.getComputedStyle(animatedBox);

            // 2. 現在のduration（時間）を取得 (例: "4s")
            const currentDurationStr = style.getPropertyValue('animation-duration');

            // 3. 文字列から数字（秒）に変換
            const currentDuration = parseFloat(currentDurationStr);

            // 4. 新しい速度を計算 (時間を25%短縮 = 25%速くなる)
            const newDuration = Math.max(0.5, currentDuration * 0.75);// 最小0.5秒を設定

            // 5. 新しいdurationを適用
            // a. 一度アニメーション名をクリア
            animatedBox.style.animationName = 'none'

            // b. 強制的に再描画させるための小技
            // ※この処理がないと、animationName=noneの解除が反映されないブラウザがあります
            void animatedBox.offsetWidth;

            // c. 新しい duration を適用し、アニメーション名を再適用
            animatedBox.style.animationDuration = `${newDuration}s`;
            animatedBox.style.animationName = 'rotate-360';

            // d. 停止クラスを削除して再生状態に戻す (安全のため)
            animatedBox.style.animationPlayState = 'running';
            animatedBox.classList.remove('paused');

            // 6. ボタンのテキストを更新
            speedUpBtn.textContent = `↑ 速度アップ (${newDuration.toFixed(2)}秒)`;
            toggleAnimationBtn.textContent = '■ アニメーション停止'; // 停止ボタンも再生状態に戻す
        });
    }

});