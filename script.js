// ===========================
// グローバル変数
// ===========================
let configData = null;

// ===========================
// 初期化
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
});

// ===========================
// 設定ファイル読み込み
// ===========================
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error('設定ファイルの読み込みに失敗しました');
        }
        configData = await response.json();
        populateAllPages();
    } catch (error) {
        console.error('設定ファイル読み込みエラー:', error);
        alert('設定ファイルの読み込みに失敗しました。ページをリロードしてください。');
    }
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
    
    // 製氷機
    document.getElementById('ice-machine-location').textContent = 
        `製氷機は、${configData.facilities.iceMachine} にございます。`;
    
    // コーヒーメーカー
    const coffeeMaker = configData.facilities.coffeeMaker;
    document.getElementById('coffee-maker-location').textContent = 
        `設置場所: ${coffeeMaker.location}`;
    
    // 使い方の手順
    const stepsList = document.getElementById('coffee-maker-steps');
    stepsList.innerHTML = '';
    coffeeMaker.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
    });
}

// ===========================
// レンタサイクルページ
// ===========================
function populateBicyclePage() {
    if (!configData || !configData.bicycle) return;
    
    document.getElementById('bicycle-location').textContent = configData.bicycle.location;
    document.getElementById('bicycle-hours').textContent = configData.bicycle.hours;
    document.getElementById('bicycle-price').textContent = configData.bicycle.price;
}

// ===========================
// お飲み物ページ
// ===========================
function populateDrinksPage() {
    if (!configData || !configData.drinks) return;
    
    document.getElementById('drinks-intro').textContent = configData.drinks.description;
    document.getElementById('drinks-last-order').textContent = configData.drinks.lastOrder;
}

// ===========================
// お風呂ページ
// ===========================
function populateBathPage() {
    if (!configData || !configData.bath) return;
    
    const bath = configData.bath;
    
    document.getElementById('bath-name').textContent = bath.name;
    document.getElementById('bath-evening').textContent = bath.hours.evening;
    document.getElementById('bath-morning').textContent = bath.hours.morning;
    
    // 注意事項
    const notesContainer = document.getElementById('bath-notes');
    if (bath.notes && bath.notes.length > 0) {
        const ul = document.createElement('ul');
        bath.notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note;
            ul.appendChild(li);
        });
        notesContainer.appendChild(ul);
    }
    
    // 貸切風呂
    if (bath.privateBath && bath.privateBath.available) {
        document.getElementById('private-bath-section').style.display = 'block';
        document.getElementById('private-bath-info').textContent = bath.privateBath.info;
    }
}

// ===========================
// 季節のご案内ページ
// ===========================
function populateSeasonalPage() {
    if (!configData || !configData.seasonal) return;
    
    const container = document.getElementById('seasonal-events');
    container.innerHTML = '';
    
    if (configData.seasonal.length === 0) {
        container.innerHTML = '<p class="loading-text">現在、季節のイベントはございません。</p>';
        return;
    }
    
    configData.seasonal.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'seasonal-event';
        
        eventDiv.innerHTML = `
            <div class="seasonal-image">
                <img src="${event.image}" alt="${event.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 400%22%3E%3Crect fill=%22%23E8E6E1%22 width=%22300%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2220%22%3E画像なし%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="seasonal-content">
                <h3 class="seasonal-title">${event.title}</h3>
                <p class="seasonal-period">${event.period}</p>
                <p class="seasonal-description">${event.description}</p>
            </div>
        `;
        
        container.appendChild(eventDiv);
    });
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
