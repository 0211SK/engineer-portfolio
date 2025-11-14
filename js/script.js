// スクロールすると要素がフェードインする機能
const fadeElements = document.querySelectorAll('.fadein');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

fadeElements.forEach(el => observer.observe(el));

// スライドイン要素のみを監視
document.addEventListener('DOMContentLoaded', function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    document.querySelectorAll('.slide-in-left, .slide-in-right').forEach(el => observer.observe(el));
});

// ローディング画面の表示制御
// ローディング画面を取得
const loading = document.querySelector(".loading");

//ページの読み込み完了時に処理を実行
if (loading) {
    window.addEventListener("load", () => {
        setTimeout(() => {
            loading.classList.add("loaded");
        }, 3000);
    });
}

/**
 * #window 要素のコンテンツ高さが CSS の max-height (70% of viewport) を超える場合に
 * class "inner" を付与してスクロール可能にする。
 */
function adjustWindowInner() {
    // '#window' が重複している場合もあるため querySelectorAll で取得
    const windows = document.querySelectorAll('#window');
    const maxPx = window.innerHeight * 0.7;

    windows.forEach(win => {
        // scrollHeight はコンテンツ全体の高さ
        const contentH = win.scrollHeight;
        if (contentH > maxPx) {
            win.classList.add('inner');
        } else {
            win.classList.remove('inner');
        }
    });
}

// DOM読み込み後・リサイズ時に判定
document.addEventListener('DOMContentLoaded', () => {
    adjustWindowInner();
    window.addEventListener('resize', () => {
        // resize の連続発火対策に少し遅延
        clearTimeout(window.__adjustTimer__);
        window.__adjustTimer__ = setTimeout(adjustWindowInner, 100);
    });

    // ポップアップを開閉するチェックボックスが変化したときにも再判定
    document.querySelectorAll('input[id^="popup"]').forEach(cb => {
        cb.addEventListener('change', () => {
            // 表示状態が反映されるまで少し待ってから判定
            setTimeout(adjustWindowInner, 50);
        });
    });
});

// アコーディオンメニューの開閉制御
(function () {
    const summaries = document.querySelectorAll('.js-details-summary');
    const speedMs = 300; // CSS の transition と合わせる

    // 初期表示で open 属性が付いた details を展開
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.js-details').forEach(details => {
            if (details.hasAttribute('open')) {
                const summary = details.querySelector('.js-details-summary');
                const content = details.querySelector('.js-details-content');
                if (summary) summary.classList.add('is-active');
                if (content) {
                    // 中身を展開（アニメーションが不要ならこのまま）
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    summaries.forEach(summary => {
        summary.addEventListener('click', function (event) {
            event.preventDefault();

            const summaryEl = this;
            const details = summaryEl.closest('.js-details') || summaryEl.parentElement;
            const content = summaryEl.nextElementSibling && summaryEl.nextElementSibling.classList.contains('js-details-content')
                ? summaryEl.nextElementSibling
                : summaryEl.parentElement.querySelector('.js-details-content');

            if (!content || !details) return;

            summaryEl.classList.toggle('is-active');

            if (details.hasAttribute('open')) {
                // 閉じる処理
                // 現在の高さを明示してから 0 にすることでアニメーションさせる
                content.style.maxHeight = content.scrollHeight + 'px';
                // 少し遅延してから 0 にする（レンダリング反映のため）
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        content.style.maxHeight = '0';
                    });
                });

                // transition 終了で open 属性を削除
                const onTransitionEnd = function () {
                    details.removeAttribute('open');
                    content.removeEventListener('transitionend', onTransitionEnd);
                    // インラインスタイルをクリアしておく（必要なら残す）
                    content.style.maxHeight = '';
                };
                content.addEventListener('transitionend', onTransitionEnd);
            } else {
                // 開く処理
                details.setAttribute('open', 'true');
                // 最初に maxHeight を 0 にしてから、scrollHeight をセットして展開
                content.style.maxHeight = '0';
                // 計測してセット（次フレームで反映）
                requestAnimationFrame(() => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                });

                // transition 終了
                const onTransitionEnd = function () {
                    content.removeEventListener('transitionend', onTransitionEnd);
                };
                content.addEventListener('transitionend', onTransitionEnd);
            }
        });
    });
})();