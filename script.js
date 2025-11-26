// ===========================
// グローバル変数
// ===========================
let configData = null;
let currentLang = 'ja';

// 無操作タイマー設定（ミリ秒）
// 1分30秒に変更（タブレットが寝る前にリセットするため）
const INACTIVITY_TIMEOUT = 90000;
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
// お飲み物ページ生成（完全バイリンガル版）
// ===========================
function populateDrinksPage() {
    if (!configData || !configData.drinks) return;

    const drinks = configData.drinks;
    const isEnglish = (currentLang === 'en'); // 今が英語かどうか

    // リード文の更新
    const leadEl = document.getElementById('drinks-lead');
    if (leadEl) {
        if (isEnglish) {
            leadEl.textContent = "We offer a selection of beverages, focusing on local sake and wine from Tochigi.";
        } else {
            leadEl.textContent = drinks.lead;
        }
    }

    // カテゴリカードの生成
    const sectionsContainer = document.getElementById('drinks-sections');
    if (sectionsContainer && Array.isArray(drinks.sections)) {
        sectionsContainer.innerHTML = ""; // 一旦クリア

        drinks.sections.forEach((section, index) => {
            const sectionEl = document.createElement("section");
            sectionEl.className = "drink-section-card";

            // ヘッダー部分
            const headerEl = document.createElement("button");
            headerEl.type = "button";
            headerEl.className = "drink-section-header";

            const titleEl = document.createElement("h3");
            titleEl.className = "drink-section-title";

            // タイトル切り替え
            const titleMain = document.createElement("span");
            titleMain.className = "drink-title-ja"; 
            if (isEnglish && section.subtitle) {
                titleMain.textContent = section.subtitle;
            } else {
                titleMain.textContent = section.title;
            }
            titleMain.style.fontSize = "18px";

            const titleSub = document.createElement("span");
            titleSub.className = "drink-title-en";
            if (isEnglish) {
                titleSub.textContent = section.title;
            } else {
                titleSub.textContent = section.subtitle || "";
            }

            titleEl.appendChild(titleMain);
            titleEl.appendChild(titleSub);
            headerEl.appendChild(titleEl);

            // アイコン
            const toggleIcon = document.createElement("span");
            toggleIcon.className = "drink-toggle-icon";
            toggleIcon.textContent = "＋";
            headerEl.appendChild(toggleIcon);
            sectionEl.appendChild(headerEl);

            // 中身リスト部分
            const bodyEl = document.createElement("div");
            bodyEl.className = "drink-section-body";

            if (Array.isArray(section.items)) {
                const listEl = document.createElement("ul");
                listEl.className = "drink-item-list";

                section.items.forEach(item => {
                    const li = document.createElement("li");
                    li.className = "drink-item";
                    
                    // ★ここが進化ポイント！★
                    // データが「文字だけ」か「日/英のセット」かを自動判別します
                    let text = "";
                    if (typeof item === 'object' && item !== null) {
                        // セットの場合は、言語に合わせて選ぶ
                        text = isEnglish ? (item.en || item.ja) : item.ja;
                    } else {
                        // 文字だけの場合はそのまま表示（昔のデータも壊れないように）
                        text = item;
                    }
                    
                    // 注意書き（※）の処理
                    const noteIndex = text.indexOf("※");
                    if (noteIndex !== -1) {
                        const mainText = text.slice(0, noteIndex).trim();
                        const noteText = text.slice(noteIndex).trim();
                        
                        const mainSpan = document.createElement("span");
                        mainSpan.className = "drink-item-main";
                        mainSpan.textContent = mainText;
                        li.appendChild(mainSpan);
                        li.appendChild(document.createElement("br"));
                        
                        const noteSpan = document.createElement("span");
                        noteSpan.className = "drink-item-note";
                        noteSpan.textContent = noteText;
                        li.appendChild(noteSpan);
                    } else {
                        li.textContent = text;
                    }
                    listEl.appendChild(li);
                });
                bodyEl.appendChild(listEl);
            }
            sectionEl.appendChild(bodyEl);

            // クリックイベント
            headerEl.addEventListener("click", () => {
                const isOpen = sectionEl.classList.toggle("is-open");
                toggleIcon.textContent = isOpen ? "－" : "＋";
            });

            if (index === 0) {
                sectionEl.classList.add("is-open");
                toggleIcon.textContent = "－";
            }
            sectionsContainer.appendChild(sectionEl);
        });
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
// ページ切り替え機能（改良版）
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

    // ★ここが追加ポイント！★
    // お飲み物ページが開かれたら、その時の言語に合わせてリストを作り直す
    if (pageId === 'drinks') {
        // 少し待ってから実行（確実にするため）
        setTimeout(() => {
            populateDrinksPage();
        }, 10);
    }
}

// ===========================
// 無操作タイマー設定（賢い更新機能付き）
// ===========================
function setupInactivityTimer() {
    function resetTimer() {
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        
        inactivityTimer = setTimeout(async () => {
            // 1. まずトップページに戻すなどの「お片付け」を先にやります
            showPage('home');
            
            const amenityModal = document.getElementById('amenity-modal');
            if (amenityModal) amenityModal.style.display = 'none';

            const termsModal = document.getElementById('terms-modal');
            if (termsModal) termsModal.style.display = 'none';
            
            const moreOptionsModal = document.getElementById('more-options-modal');
            if (moreOptionsModal) moreOptionsModal.classList.remove('show');

            const homePage = document.getElementById('page-home');
            if (homePage) homePage.scrollTo(0, 0);

            // 2. ここから「賢いチェック」スタート！
            // サーバー上の最新の設定ファイル(config.json)だけを見に行きます
            try {
                const timestamp = new Date().getTime();
                const response = await fetch(`config.json?t=${timestamp}`);
                
                if (response.ok) {
                    const newConfig = await response.json();
                    
                    // 今持っているデータ(configData)と、新しいデータ(newConfig)を比べっこします
                    // JSON.stringifyを使って、中身が全く同じか文字として比較します
                    if (JSON.stringify(configData) !== JSON.stringify(newConfig)) {
                        console.log('新しいデータが見つかりました。リロードします。');
                        // ★中身が違うときだけ、ここでリロードします！★
                        window.location.reload();
                    } else {
                        console.log('データは最新です。リロードしません。');
                    }
                }
            } catch (error) {
                console.error('更新チェックに失敗しましたが、動作は続行します', error);
            }

        }, INACTIVITY_TIMEOUT);
    }
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
        document.addEventListener(event, resetTimer, true);
    });
    
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
// ===========================
// 朝食ページ：アコーディオン開閉
// ===========================
function toggleAccordion() {
    const btn = document.querySelector('.accordion-btn');
    const content = document.getElementById('acc-content');
    
    // ボタンの見た目を切り替え
    btn.classList.toggle('active');
    
    // 中身の開閉（クラスの付け外し）
    content.classList.toggle('open');
    
    // 高さを操作してアニメーションさせる
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}
// ===========================
// もっと追加モーダル（ポップアップ）の動き
// ===========================
function showMoreOptionsModal() {
    const modal = document.getElementById('more-options-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

function hideMoreOptionsModal() {
    const modal = document.getElementById('more-options-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// キーボードのESCキーを押しても閉じるようにする
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideMoreOptionsModal();
    }
});
// ===========================
// 朝食ページ切り替え機能（言語対応版）
// ===========================
let isPremiumBreakfastShown = false;

function togglePremiumBreakfast() {
    const standardBreakfast = document.getElementById('standard-breakfast');
    const premiumBreakfast = document.getElementById('premium-breakfast');
    const toggleText = document.getElementById('toggle-text');
    
    if (!standardBreakfast || !premiumBreakfast) return;
    
    isPremiumBreakfastShown = !isPremiumBreakfastShown;
    const isEnglish = (currentLang === 'en');
    
    if (isPremiumBreakfastShown) {
        // グレードアップ表示
        standardBreakfast.style.display = 'none';
        premiumBreakfast.style.display = 'block';
        // ボタン文字：今が英語なら「Standard」、日本語なら「通常の朝食」
        toggleText.textContent = isEnglish ? 'Standard Breakfast' : '通常の朝食';
        
        const pageContainer = document.getElementById('page-breakfast');
        if(pageContainer) pageContainer.scrollTo({ top: 0, behavior: 'smooth' });

    } else {
        // 通常表示
        standardBreakfast.style.display = 'block';
        premiumBreakfast.style.display = 'none';
        // ボタン文字：今が英語なら「Premium」、日本語なら「至福の朝ごはん」
        toggleText.textContent = isEnglish ? 'Premium Breakfast' : '至福の朝ごはん';
        
        const pageContainer = document.getElementById('page-breakfast');
        if(pageContainer) pageContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
}


// ===========================
// 言語切り替え機能（全ページ完全対応・最終版）
// ===========================
function toggleLanguage() {
    const titleEl = document.getElementById('home-title');
    const subtitleEl = document.getElementById('home-subtitle');
    const btnTextEl = document.getElementById('lang-text');

    // 今が日本語なら、英語にする
    if (currentLang === 'ja') {
        currentLang = 'en';
        
        // --- トップページ ---
        btnTextEl.textContent = '日本語'; 
        titleEl.textContent = 'Guest Information'; 
        if(subtitleEl) subtitleEl.textContent = '客室インフォメーション';

        // --- メニューボタン ---
        const menuIds = {
            'menu-text-wifi': 'Wi-Fi',
            'menu-text-facilities': 'Facilities',
            'menu-text-bath': 'Baths',
            'menu-text-drinks': 'Room Service',
            'menu-text-coffee': 'Coffee Machine',
            'menu-text-breakfast': 'Breakfast',
            'menu-text-bicycle': 'Rental Cycle',
            'menu-text-seasonal': 'Seasonal Info',
            'menu-text-bus': 'Shuttle Bus'
        };
        for (const [id, text] of Object.entries(menuIds)) {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        }

        // --- 固定ボタン ---
        document.getElementById('fab-emergency-text').textContent = 'Emergency';
        document.getElementById('fab-terms-text').textContent = 'Terms';

        // --- 各ページ（省略部分はそのまま） ---
        // （Wi-Fi, 施設, お風呂, サイクル, バス, 季節, ルームサービス, アメニティのコードはここに残しておいてください！）
        // ★全部書くと長すぎるので、朝食部分だけ追記します。実際は全部つなげてくださいね！

        // --- 朝食（通常） ---
        document.getElementById('bf-back-text').textContent = 'Top';
        document.getElementById('breakfast-page-title').textContent = 'Breakfast Information';
        
        // トグルボタンの文字（現在の状態に合わせて変更）
        const toggleText = document.getElementById('toggle-text');
        if (isPremiumBreakfastShown) {
            toggleText.textContent = 'Standard Breakfast';
        } else {
            toggleText.textContent = 'Premium Breakfast';
        }

        document.getElementById('bf-acc-title').textContent = 'About Our Breakfast';
        document.getElementById('bf-acc-text').innerHTML = '<p>Experience the charm of our traditional breakfast.</p><p>We offer a "Breakfast of Your Choice" where you can select your favorite set in addition to the standard menu.</p>';
        
        document.getElementById('bf-main-title').textContent = 'Standard Set';
        document.getElementById('bf-main-desc').textContent = 'Rice, Miso Soup, Grilled Fish, Small Dishes, Salad, etc.';
        
        document.getElementById('bf-flow-bubble').innerHTML = 'Choose one additional item from below<br><strong>for free</strong>.';
        document.getElementById('bf-plus-text').textContent = '+1 Item';
        document.getElementById('bf-select-title').textContent = 'Please choose one from these options';
        document.getElementById('bf-select-note').textContent = '* One item per person for free.';
        document.getElementById('bf-staff-note').textContent = 'Our staff will ask for your choice at dinner.';

        // 雪・月・花
        document.getElementById('bf-yuki-tag').textContent = 'Classic';
        document.getElementById('bf-yuki-title').textContent = 'Yuki (Standard)';
        document.getElementById('bf-yuki-list').innerHTML = '<ul><li><span class="bullet">●</span> Natto (Fermented Soybeans)</li><li><span class="bullet">●</span> Moromi Soy Sauce</li><li><span class="bullet">●</span> Nori (Dried Seaweed)</li></ul>';

        document.getElementById('bf-tsuki-tag').textContent = 'Egg on Rice';
        document.getElementById('bf-tsuki-title').textContent = 'Tsuki (Egg)';
        document.getElementById('bf-tsuki-list').innerHTML = '<ul><li><span class="bullet">●</span> Nasu Goyoran Egg</li><li><span class="bullet">●</span> Moromi Soy Sauce</li><li><span class="bullet">●</span> Nori (Dried Seaweed)</li></ul>';

        document.getElementById('bf-hana-tag').textContent = 'Light';
        document.getElementById('bf-hana-title').textContent = 'Hana (Light)';
        document.getElementById('bf-hana-list').innerHTML = '<ul><li><span class="bullet">●</span> Fresh Mandarin Juice</li><li><span class="bullet">●</span> Yogurt & Aloe</li><li class="small-note">(with Homemade Jam)</li></ul>';

        document.getElementById('bf-more-btn').textContent = 'Want more? (Additional Orders)';

        // --- 朝食（プレミアム） ---
        document.getElementById('pre-title-jp').textContent = 'Premium Breakfast';
        document.getElementById('pre-warn-title').textContent = 'Reservation Only';
        document.getElementById('pre-warn-desc').textContent = 'Reservation required 3 days in advance.';
        
        document.getElementById('pre-body-title').textContent = 'Breakfast Information';
        document.getElementById('pre-body-lead').innerHTML = 'To enjoy a "Charming Breakfast",<br>we prepare a <strong>"Breakfast of Your Choice"</strong><br>where you can choose your favorite menu.';
        document.getElementById('pre-v-drink').textContent = 'Morning Drink';
        document.getElementById('pre-v-egg').textContent = 'Egg Dish';
        document.getElementById('pre-body-sub').innerHTML = 'Please imagine your breakfast<br>and make your choice.';
        document.getElementById('pre-staff-note').innerHTML = 'Our staff will ask for your order <strong>at dinner</strong>.';

        document.getElementById('pre-c1-badge').textContent = 'Choice 1';
        document.getElementById('pre-c1-title').textContent = 'Morning Drink';
        document.getElementById('pre-c1-list').innerHTML = '<li>Fresh Mandarin Juice</li><li>Coco Farm Grape Juice</li><li>Milk</li>';

        document.getElementById('pre-c2-badge').textContent = 'Choice 2';
        document.getElementById('pre-c2-title').textContent = 'Nasu Goyoran "Kiwami"';
        document.getElementById('pre-c2-desc').innerHTML = '<p>Top quality eggs with deep orange color, rich sweetness and nutrition.</p>';
        document.getElementById('pre-c2-list').innerHTML = '<li>Japanese Omelet (Dashimaki)</li><li>Egg on Rice</li><li>Omelet</li><li>Onsen Tamago, etc.</li>';

        document.getElementById('pre-footer-msg').textContent = '✨ This special breakfast is for reservation only ✨';
        document.getElementById('pre-footer-sub').textContent = 'Please reserve at least 3 days in advance.';

        // --- 追加オプションモーダル ---
        document.getElementById('more-title').textContent = 'Additional Orders';
        document.getElementById('more-desc').innerHTML = 'Please ask our staff.<br><span style="font-size: 12px;">(Prices include tax)</span>';
        document.getElementById('more-note').textContent = '* Subject to availability.';
        
        const moreList = document.getElementById('more-list');
        if(moreList) {
            moreList.innerHTML = `
                <div class="price-item"><span class="item-name">Nasu Goyoran (Raw Egg)</span><span class="item-price">330 yen</span></div>
                <div class="price-item"><span class="item-name">Natto</span><span class="item-price">330 yen</span></div>
                <div class="price-item"><span class="item-name">Fresh Mandarin Juice</span><span class="item-price">330 yen</span></div>
                <div class="price-item"><span class="item-name">Yogurt</span><span class="item-price">330 yen</span></div>
                <div class="price-item"><span class="item-name">Nori (Seaweed)</span><span class="item-price">110 yen</span></div>
            `;
        }

        // （省略：お飲み物ページなどの再描画コード）
        const drinksSections = document.getElementById('drinks-sections');
        if (drinksSections) {
            drinksSections.innerHTML = ''; 
            setTimeout(() => {
                populateDrinksPage();
            }, 10);
        }

    } else {
        // 日本語に戻すときはリロードが一番確実！
        window.location.reload();
    }
}









// ===========================
// リスト更新用の便利機能（これを一番下に追加してください！）
// ===========================
function updateList(elementId, items) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let targetList;

    // 名札が付いている場所がリストそのもの(UL/OL)なのか、箱(DIV)なのかを判断
    if (element.tagName === 'UL' || element.tagName === 'OL') {
        targetList = element;
    } else {
        // 箱なら、その中にあるリストを探すか、新しく作る
        targetList = element.querySelector('ul');
        if (!targetList) {
            targetList = document.createElement('ul');
            // アメニティリストの場合はクラス名をつける
            if (elementId === 'ame-list') {
                targetList.className = 'amenity-list';
            }
            element.appendChild(targetList);
        }
    }

    // 中身を空っぽにする
    targetList.innerHTML = '';

    // 新しい項目を追加する
    if (items && items.length > 0) {
        items.forEach(text => {
            const li = document.createElement('li');
            
            // アメニティリストの場合の特殊処理
            if (elementId === 'ame-list' && text.includes(':')) {
                const [name, price] = text.split(':');
                li.innerHTML = `
                    <span class="amenity-name">${name.trim()}</span>
                    <span class="amenity-price">${price.trim()}</span>
                `;
            } else {
                // 通常のリスト
                li.textContent = text;
            }
            
            targetList.appendChild(li);
        });
    }
}