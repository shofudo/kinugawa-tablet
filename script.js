// ===========================
// グローバル変数
// ===========================
let configData = null;

// 無操作タイマー設定（ミリ秒）
// 2分 = 100000
const INACTIVITY_TIMEOUT = 120000;
let inactivityTimer = null;

// ===========================
// 初期化
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    setupInactivityTimer();
});

// ===========================
// 設定ファイル読み込み
// ===========================
async function loadConfig() {
    try {
        // キャッシュを回避するためにタイムスタンプをクエリパラメータに追加
        const timestamp = new Date().getTime();
        const response = await fetch(`config.json?t=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        configData = await response.json();
        populateAllPages();
        
        // エラー画面が表示されていれば非表示に
        document.getElementById('error-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        
    } catch (error) {
        console.error('設定ファイル読み込みエラー:', error);
        showErrorScreen();
    }
}

// ===========================
// エラー画面表示
// ===========================
function showErrorScreen() {
    document.getElementById('error-screen').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
}

// ===========================
// 全ページにデータを反映
// ===========================
function populateAllPages() {
    populateWiFiPage();
    populateFacilitiesPage();
    populateBicyclePage();
    populateDrinksPage();
    populateBathPage();
    populateSeasonalPage();
    populateSightseeingPage();
    populateEmergencyPage();
}

// ===========================
// Wi-Fiページ
// ===========================
function populateWiFiPage() {
    if (!configData || !configData.wifi) return;
    
    document.getElementById('wifi-ssid').textContent = configData.wifi.networkName;
    document.getElementById('wifi-password').textContent = configData.wifi.password;
}

// ===========================
// 館内設備ページ
// ===========================
function populateFacilitiesPage() {
    if (!configData || !configData.facilities) return;
        
    
    // ★以前ここにあった「使い方の手順（steps）」のプログラムは削除しました★
}

// ===========================
// レンタサイクルページ
// ===========================
function populateBicyclePage() {
    // レンタサイクルページはHTMLに直接書いたので、何もしなくてOKです！
}

// ===========================
// お飲み物ページ
// ===========================
function populateDrinksPage() {
    if (!configData || !configData.drinks) return;

    const drinks = configData.drinks;

    // リード文
    const leadEl = document.getElementById('drinks-lead');
    if (leadEl && drinks.lead) {
        leadEl.textContent = drinks.lead;
    }

    // カテゴリカード（アコーディオン）
    const sectionsContainer = document.getElementById('drinks-sections');
    if (sectionsContainer && Array.isArray(drinks.sections)) {
        sectionsContainer.innerHTML = "";

        drinks.sections.forEach((section, index) => {
            const sectionEl = document.createElement("section");
            sectionEl.className = "drink-section-card";

            // ── ヘッダー（タイトル＋開閉アイコン） ──
            const headerEl = document.createElement("button");
            headerEl.type = "button";
            headerEl.className = "drink-section-header";

            const titleEl = document.createElement("h3");
            titleEl.className = "drink-section-title";

            // 日本語タイトル
            const titleJa = document.createElement("span");
            titleJa.className = "drink-title-ja";
            titleJa.textContent = section.title;
            titleEl.appendChild(titleJa);

           // 英語サブタイトル（あれば）
if (section.subtitle) {
    const titleEn = document.createElement("span");
    titleEn.className = "drink-title-en";
    titleEn.textContent = section.subtitle;
    titleEl.appendChild(titleEn);
}


            headerEl.appendChild(titleEl);

            // ＋ / − アイコン
            const toggleIcon = document.createElement("span");
            toggleIcon.className = "drink-toggle-icon";
            toggleIcon.textContent = "＋";
            headerEl.appendChild(toggleIcon);

            sectionEl.appendChild(headerEl);

            // ── 中身（説明＋リスト） ──
            const bodyEl = document.createElement("div");
            bodyEl.className = "drink-section-body";

            if (section.description) {
                const descEl = document.createElement("p");
                descEl.className = "drink-section-desc";
                descEl.textContent = section.description;
                bodyEl.appendChild(descEl);
            }

         if (Array.isArray(section.items)) {
    const listEl = document.createElement("ul");
    listEl.className = "drink-item-list";

    section.items.forEach(text => {
        const li = document.createElement("li");
        li.className = "drink-item";

        // 「※」が含まれているかチェック
        const noteIndex = text.indexOf("※");

        if (noteIndex !== -1) {
            // 「※」より前：通常の本文
            const mainText = text.slice(0, noteIndex).trim();
            // 「※」以降：注意書き
            const noteText = text.slice(noteIndex).trim(); // 「※」も含めてOK

            // 本文部分
            const mainSpan = document.createElement("span");
            mainSpan.className = "drink-item-main";
            mainSpan.textContent = mainText;
            li.appendChild(mainSpan);

            // 改行してから注意書き
            li.appendChild(document.createElement("br"));

            const noteSpan = document.createElement("span");
            noteSpan.className = "drink-item-note";   // ← 既にCSSにあるクラス
            noteSpan.textContent = noteText;
            li.appendChild(noteSpan);
        } else {
            // 通常アイテムはそのまま
            li.textContent = text;
        }

        listEl.appendChild(li);
    });

    bodyEl.appendChild(listEl);
}


            sectionEl.appendChild(bodyEl);

            // ── 開閉処理 ──
            headerEl.addEventListener("click", () => {
                const isOpen = sectionEl.classList.toggle("is-open");
                toggleIcon.textContent = isOpen ? "－" : "＋";
            });

            // 最初のカテゴリだけ最初から開いておく（お好みで）
            if (index === 0) {
                sectionEl.classList.add("is-open");
                toggleIcon.textContent = "－";
            }

            sectionsContainer.appendChild(sectionEl);
        });
    }

    const lastOrderEl = document.getElementById('drinks-last-order');
    if (lastOrderEl) {
        lastOrderEl.textContent = drinks.lastOrder || "";
    }
}



// ===========================
// お風呂ページ
// ===========================
function populateBathPage() {
    // お風呂ページはHTMLに直接書いたので、何もしなくてOKです！
}

// ===========================
// 季節のご案内ページ
// ===========================
function populateSeasonalPage() {
    // チラシ画像を直接貼る運用に変えたので、ここは何もしなくてOKです！
}

// ===========================
// 周辺観光ページ
// ===========================
function populateSightseeingPage() {
    if (!configData || !configData.sightseeing) return;
    
    const container = document.getElementById('sightseeing-list');
    container.innerHTML = '';
    
    configData.sightseeing.forEach(spot => {
        const card = document.createElement('div');
        card.className = 'sightseeing-card';
        
        card.innerHTML = `
            <h3 class="sightseeing-name">${spot.name}</h3>
            <p class="sightseeing-distance">${spot.distance}</p>
            <p class="sightseeing-comment">${spot.comment}</p>
        `;
        
        container.appendChild(card);
    });
}

// ===========================
// 緊急時のご案内ページ
// ===========================
function populateEmergencyPage() {
    if (!configData || !configData.emergency) return;
    
    const emergency = configData.emergency;
    
    // 火災
    const fireCard = document.getElementById('emergency-fire');
    if (emergency.fire && emergency.fire.length > 0) {
        const ul = document.createElement('ul');
        emergency.fire.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        fireCard.appendChild(ul);
    }
    
    // 地震
    const earthquakeCard = document.getElementById('emergency-earthquake');
    if (emergency.earthquake && emergency.earthquake.length > 0) {
        const ul = document.createElement('ul');
        emergency.earthquake.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        earthquakeCard.appendChild(ul);
    }
    
    // 急病
    const illnessCard = document.getElementById('emergency-illness');
    if (emergency.illness && emergency.illness.length > 0) {
        const ul = document.createElement('ul');
        emergency.illness.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        illnessCard.appendChild(ul);
    }
}

// ===========================
// ページ切り替え機能
// ===========================
function showPage(pageId) {
    // 全てのページを非表示
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // 指定されたページを表示
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        // ページの一番上にスクロール
        targetPage.scrollTop = 0;
    }
    
    // 緊急時ページ以外では緊急時ボタンを表示
    const emergencyButton = document.getElementById('emergency-button');
    if (pageId === 'emergency') {
        emergencyButton.style.display = 'none';
    } else {
        emergencyButton.style.display = 'flex';
    }
}

// ===========================
// 無操作タイマー設定
// ===========================
function setupInactivityTimer() {
    // タイマーをリセットする関数
    function resetTimer() {
        // 既存のタイマーをクリア
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        
        // 新しいタイマーを設定
        inactivityTimer = setTimeout(() => {
            // ★ここを変えました★
            // 5分間操作がなかったら、ページを「再読み込み」します。
            // これでトップページに戻りつつ、最新の情報に更新されます！
            window.location.reload();
        }, INACTIVITY_TIMEOUT);
    }
    
    // 各種イベントでタイマーをリセット
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
        document.addEventListener(event, resetTimer, true);
    });
    
    // 初回タイマー設定
    resetTimer();
}

// ===========================
// スクリーンセーバー防止（オプション）
// ===========================
// タブレットのスリープを防ぐために、定期的に画面を更新
let wakeLockInterval;

function preventScreenSleep() {
    // Wake Lock API が使える場合
    if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen').catch(err => {
            console.log('Wake Lock エラー:', err);
        });
    }
    
    // フォールバック: 定期的に小さな操作を行う
    wakeLockInterval = setInterval(() => {
        document.body.style.opacity = '0.9999';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 10);
    }, 30000); // 30秒ごと
}

// ページ読み込み時に実行
window.addEventListener('load', () => {
    preventScreenSleep();
});
// ===========================
// アメニティポップアップの制御
// ===========================
function toggleAmenityModal() {
    const modal = document.getElementById('amenity-modal');
    if (modal) {
        if (modal.style.display === 'none' || modal.style.display === '') {
            modal.style.display = 'flex'; // 表示する
        } else {
            modal.style.display = 'none'; // 隠す
        }
    }
}
// ===========================
// 約款・規約モーダルの制御
// ===========================
function toggleTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (modal) {
        if (modal.style.display === 'none' || modal.style.display === '') {
            modal.style.display = 'flex'; // 表示する
        } else {
            modal.style.display = 'none'; // 隠す
        }
    }
}

function switchTermsTab(tabName) {
    // すべてのタブボタンから active を外す
    const tabs = document.querySelectorAll('.terms-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // すべての内容を隠す
    document.getElementById('terms-content-contract').style.display = 'none';
    document.getElementById('terms-content-rules').style.display = 'none';
    
    // 選ばれたタブを active にする
    // クリックされたボタンを特定するのは難しいので、文字列で判断してクラスを付け直す簡易的な方法
    if (tabName === 'contract') {
        tabs[0].classList.add('active');
        document.getElementById('terms-content-contract').style.display = 'block';
    } else {
        tabs[1].classList.add('active');
        document.getElementById('terms-content-rules').style.display = 'block';
    }
}
// ===========================
// レンタサイクル：ルールの開閉
// ===========================
function toggleBicycleRules() {
    const body = document.getElementById('bicycle-rules-body');
    const icon = document.getElementById('rules-icon');
    
    if (body.style.display === 'block') {
        body.style.display = 'none';
        icon.textContent = 'expand_more'; // 下向き矢印に戻す
    } else {
        body.style.display = 'block';
        icon.textContent = 'expand_less'; // 上向き矢印にする
    }
}
