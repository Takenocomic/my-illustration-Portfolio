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
});