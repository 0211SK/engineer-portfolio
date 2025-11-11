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

// ページの読み込み完了時に処理を実行
window.addEventListener("load", () => {
    // 3秒後にローディング画面を非表示にする
    setTimeout(() => {
        loading.classList.add("loaded");
    }, 3000);
});