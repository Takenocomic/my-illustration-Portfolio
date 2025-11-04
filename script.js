document.addEventListener('DOMContentLoaded', () => {
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
    // 2. モーダルウィンドウ機能の実装 (前回の内容)
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
});