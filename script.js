document.addEventListener('DOMContentLoaded', () => {
    // ... 既存のタブ切り替え機能、モーダル機能、ダークモード機能、テキストカウンター機能のコード ...

    // ------------------------------------------------
    // 1. タブ切り替え機能の実装
    // ------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-button');
    const gallerySections = document.querySelectorAll('.gallery-section');

    // タブボタンにクリックイベントを設定
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target'); // 表示したいセクションのIDを取得

            // すべてのボタンからactiveクラスを削除し、クリックされたボタンに付与
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // すべてのギャラリーセクションを非表示にし、対象のセクションのみ表示
            gallerySections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // ページロード時に最初のタブ（Instagram）を表示
    // HTMLで最初の要素にactiveクラスを付けているため、ここでは特に処理は不要です。

    // ------------------------------------------------
    // 2. モーダルウィンドウ機能の実装
    // ------------------------------------------------
    
    // 必要な要素の取得
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const workItems = document.querySelectorAll('.work-item'); // すべての.work-item
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalConcept = document.getElementById('modal-concept');

    // サムネイルクリック時の処理
    workItems.forEach(item => {
        item.addEventListener('click', () => {
            // HTMLのdata属性から情報を取得
            const imageSrc = item.getAttribute('data-image');
            const title = item.getAttribute('data-title');
            const concept = item.getAttribute('data-concept');

            // モーダルに情報をセット
            modalImage.src = imageSrc;
            modalTitle.textContent = title;
            modalConcept.textContent = concept;

            // モーダルを表示
           modal.classList.add('is-active'); // <-- 追加
        });
    });

    // モーダルを閉じる処理
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('is-active'); // <-- 追加
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('is-active'); // <-- 追加
        }
    });


    // ------------------------------------------------
    // 3. ダークモード切り替え機能の実装
    // ------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
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
            themeToggle.textContent = '🌙 ダークモード';
            themeToggle.setAttribute('aria-pressed', 'true');
        } else {
            localStorage.setItem(storageKey, 'light');
            themeToggle.textContent = '🌞 ライトモード';
            themeToggle.setAttribute('aria-pressed', 'false');
        }
    }

    // **B. ページロード時の初期設定**
    // LocalStorageに保存されたテーマ設定を読み込む
    const storedTheme = localStorage.getItem(storageKey);

    // 1. 保存された設定があればそれを適用する
    if (storedTheme === 'dark') {
        body.classList.add(darkModeClass);
        themeToggle.textContent = '🌙 ダークモード';
        themeToggle.setAttribute('aria-pressed', 'true');
    } else {
        // 2. 設定がない、または'light'の場合はライトモードを初期表示
        themeToggle.textContent = '🌞 ライトモード';
        themeToggle.setAttribute('aria-pressed', 'false');
    }
    
    // **C. ボタンクリックイベント**
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }


    // ------------------------------------------------
    // 4 ヘッダー画像連結スライドショー機能 
    // ------------------------------------------------
    const workItemsForSlideshow = document.querySelectorAll('.work-item');
    const allImages = Array.from(workItemsForSlideshow).map(item => 
    item.getAttribute('data-image')
    );
    const headerSlideshowTrack =document.getElementById('header-slideshow-track');

   
    if (headerSlideshowTrack && allImages.length > 0){
        // 1. オリジナルの画像をトラックに追加
        allImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '作品スライド';
            headerSlideshowTrack.appendChild(img);
        });

        // 2. スライドショーを無限ループさせるために、コンテンツを複製して追加
        //    元のコンテンツの幅だけスクロールさせるとループするようにするため、
        //    少なくとも2倍のコンテンツが必要。今回はすべてをもう一度複製。
        
        allImages.forEach(src => {
            const img =document.createElement('img');
            img.src = src;
            img.alt = '作品スライド(複製)';
            headerSlideshowTrack.appendChild(img);
        });

    }
});