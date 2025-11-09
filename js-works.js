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
});