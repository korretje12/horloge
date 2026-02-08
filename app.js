// Application State
let state = {
    collection: [],
    wishlist: [],
    wornLog: {},
    currentWristImage: null,
    currentWatch: null,
    watchPosition: {
        x: 400,
        y: 300,
        scale: 100,
        rotation: 0
    }
};

// Load state from localStorage
function loadState() {
    const saved = localStorage.getItem('watchavenState');
    if (saved) {
        state = JSON.parse(saved);
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('watchavenState', JSON.stringify(state));
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadState();
    initNavigation();
    renderDatabase();
    renderWatchbox();
    initWristcheck();
    setupModal();
});

// Navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabName).classList.add('active');
            
            if (tabName === 'watchbox') {
                renderWatchbox();
            }
        });
    });
}

// Database Functions
function renderDatabase() {
    const container = document.getElementById('watch-list');
    container.innerHTML = '';
    
    watchDatabase.forEach(watch => {
        const card = createWatchCard(watch, 'database');
        container.appendChild(card);
    });
}

function createWatchCard(watch, context) {
    const div = document.createElement('div');
    div.className = 'watch-card';
    
    const isInCollection = state.collection.includes(watch.id);
    const isInWishlist = state.wishlist.includes(watch.id);
    
    div.innerHTML = `
        <img src="${watch.image}" alt="${watch.brand} ${watch.model}">
        <div class="brand">${watch.brand}</div>
        <h4>${watch.model}</h4>
        <div class="price">€${watch.price.toLocaleString()}</div>
        <div class="watch-card-actions">
            ${context === 'database' ? `
                <button class="btn btn-collection" onclick="addToCollection(${watch.id})" ${isInCollection ? 'disabled' : ''}>
                    ${isInCollection ? '✓ In Collectie' : '+ Collectie'}
                </button>
                <button class="btn btn-wishlist" onclick="addToWishlist(${watch.id})" ${isInWishlist ? 'disabled' : ''}>
                    ${isInWishlist ? '✓ In Wishlist' : '+ Wishlist'}
                </button>
            ` : ''}
            ${context === 'collection' ? `
                <button class="btn btn-log" onclick="logWear(${watch.id})">Log Dragen</button>
                <button class="btn btn-remove" onclick="removeFromCollection(${watch.id})">Verwijder</button>
            ` : ''}
            ${context === 'wishlist' ? `
                <button class="btn btn-collection" onclick="moveToCollection(${watch.id})">→ Collectie</button>
                <button class="btn btn-remove" onclick="removeFromWishlist(${watch.id})">Verwijder</button>
            ` : ''}
        </div>
    `;
    
    div.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn')) {
            showWatchDetails(watch);
        }
    });
    
    return div;
}

function addToCollection(watchId) {
    if (!state.collection.includes(watchId)) {
        state.collection.push(watchId);
        if (!state.wornLog[watchId]) {
            state.wornLog[watchId] = 0;
        }
        saveState();
        renderDatabase();
    }
}

function addToWishlist(watchId) {
    if (!state.wishlist.includes(watchId)) {
        state.wishlist.push(watchId);
        saveState();
        renderDatabase();
    }
}

function removeFromCollection(watchId) {
    state.collection = state.collection.filter(id => id !== watchId);
    saveState();
    renderWatchbox();
}

function removeFromWishlist(watchId) {
    state.wishlist = state.wishlist.filter(id => id !== watchId);
    saveState();
    renderWatchbox();
}

function moveToCollection(watchId) {
    removeFromWishlist(watchId);
    addToCollection(watchId);
    renderWatchbox();
}

function logWear(watchId) {
    if (!state.wornLog[watchId]) {
        state.wornLog[watchId] = 0;
    }
    state.wornLog[watchId]++;
    saveState();
    renderWatchbox();
    alert('Dragen gelogd!');
}

// Watchbox Functions
function renderWatchbox() {
    updateStats();
    renderBrandDistribution();
    renderMostWorn();
    renderCollectionList();
    renderWishlistList();
}

function updateStats() {
    const collectionWatches = watchDatabase.filter(w => state.collection.includes(w.id));
    const totalValue = collectionWatches.reduce((sum, w) => sum + w.price, 0);
    
    document.getElementById('collection-count').textContent = state.collection.length;
    document.getElementById('total-value').textContent = '€' + totalValue.toLocaleString();
    document.getElementById('wishlist-count').textContent = state.wishlist.length;
}

function renderBrandDistribution() {
    const container = document.getElementById('brand-chart');
    const collectionWatches = watchDatabase.filter(w => state.collection.includes(w.id));
    
    if (collectionWatches.length === 0) {
        container.innerHTML = '<p>Geen horloges in collectie</p>';
        return;
    }
    
    const brandCounts = {};
    collectionWatches.forEach(watch => {
        brandCounts[watch.brand] = (brandCounts[watch.brand] || 0) + 1;
    });
    
    const maxCount = Math.max(...Object.values(brandCounts));
    
    container.innerHTML = '';
    Object.entries(brandCounts).forEach(([brand, count]) => {
        const percentage = (count / collectionWatches.length) * 100;
        const barWidth = (count / maxCount) * 100;
        
        const barDiv = document.createElement('div');
        barDiv.className = 'brand-bar';
        barDiv.innerHTML = `
            <div class="brand-bar-label">
                <span>${brand}</span>
                <span>${count} (${percentage.toFixed(0)}%)</span>
            </div>
            <div class="brand-bar-fill" style="width: ${barWidth}%"></div>
        `;
        container.appendChild(barDiv);
    });
}

function renderMostWorn() {
    const container = document.getElementById('most-worn-list');
    
    const wornEntries = Object.entries(state.wornLog)
        .filter(([id, count]) => count > 0 && state.collection.includes(parseInt(id)))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    if (wornEntries.length === 0) {
        container.innerHTML = '<p>Nog geen gedragen horloges gelogd</p>';
        return;
    }
    
    container.innerHTML = '';
    wornEntries.forEach(([watchId, count]) => {
        const watch = watchDatabase.find(w => w.id === parseInt(watchId));
        if (watch) {
            const div = document.createElement('div');
            div.className = 'worn-item';
            div.innerHTML = `
                <img src="${watch.image}" alt="${watch.brand} ${watch.model}">
                <div class="worn-item-info">
                    <strong>${watch.brand} ${watch.model}</strong>
                    <div class="worn-count">${count}x gedragen</div>
                </div>
            `;
            container.appendChild(div);
        }
    });
}

function renderCollectionList() {
    const container = document.getElementById('collection-list');
    container.innerHTML = '';
    
    if (state.collection.length === 0) {
        container.innerHTML = '<p>Geen horloges in collectie</p>';
        return;
    }
    
    state.collection.forEach(watchId => {
        const watch = watchDatabase.find(w => w.id === watchId);
        if (watch) {
            const card = createWatchCard(watch, 'collection');
            container.appendChild(card);
        }
    });
}

function renderWishlistList() {
    const container = document.getElementById('wishlist-list');
    container.innerHTML = '';
    
    if (state.wishlist.length === 0) {
        container.innerHTML = '<p>Geen horloges in wishlist</p>';
        return;
    }
    
    state.wishlist.forEach(watchId => {
        const watch = watchDatabase.find(w => w.id === watchId);
        if (watch) {
            const card = createWatchCard(watch, 'wishlist');
            container.appendChild(card);
        }
    });
}

// Modal Functions
function setupModal() {
    const modal = document.getElementById('watch-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function showWatchDetails(watch) {
    const modal = document.getElementById('watch-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <img src="${watch.image}" alt="${watch.brand} ${watch.model}" style="width: 100%; max-width: 300px; margin: 0 auto; display: block;">
        <h2>${watch.brand} ${watch.model}</h2>
        <p><strong>Referentie:</strong> ${watch.reference}</p>
        <p><strong>Jaar:</strong> ${watch.year}</p>
        <p><strong>Prijs:</strong> €${watch.price.toLocaleString()}</p>
        <p>${watch.description}</p>
    `;
    
    modal.style.display = 'block';
}

// Wristcheck Functions
let canvas, ctx;

function initWristcheck() {
    canvas = document.getElementById('wristcheck-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Populate watch selector
    const select = document.getElementById('watch-select');
    watchDatabase.forEach(watch => {
        const option = document.createElement('option');
        option.value = watch.id;
        option.textContent = `${watch.brand} ${watch.model}`;
        select.appendChild(option);
    });
    
    drawCanvas();
}

function selectPreset(presetNumber) {
    const img = new Image();
    img.onload = function() {
        state.currentWristImage = img;
        drawCanvas();
    };
    img.src = presetWrists[presetNumber];
}

function uploadWristPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                state.currentWristImage = img;
                drawCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function selectWatch() {
    const select = document.getElementById('watch-select');
    const watchId = parseInt(select.value);
    
    if (watchId) {
        const watch = watchDatabase.find(w => w.id === watchId);
        if (watch) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function() {
                state.currentWatch = img;
                drawCanvas();
            };
            img.src = watch.image;
        }
    } else {
        state.currentWatch = null;
        drawCanvas();
    }
}

function updateWatchPosition() {
    state.watchPosition.scale = document.getElementById('watch-scale').value;
    state.watchPosition.x = document.getElementById('watch-x').value;
    state.watchPosition.y = document.getElementById('watch-y').value;
    state.watchPosition.rotation = document.getElementById('watch-rotation').value;
    drawCanvas();
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw wrist image
    if (state.currentWristImage) {
        ctx.drawImage(state.currentWristImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Selecteer een pols foto of upload eigen foto', canvas.width/2, canvas.height/2);
    }
    
    // Draw watch
    if (state.currentWatch) {
        ctx.save();
        const scale = state.watchPosition.scale / 100;
        const x = parseFloat(state.watchPosition.x);
        const y = parseFloat(state.watchPosition.y);
        const rotation = (state.watchPosition.rotation * Math.PI) / 180;
        
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.drawImage(state.currentWatch, -100, -100, 200, 200);
        ctx.restore();
    }
}

function saveWristcheck() {
    if (!state.currentWristImage || !state.currentWatch) {
        alert('Selecteer eerst een pols foto en horloge!');
        return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'wristcheck.png';
    link.href = canvas.toDataURL();
    link.click();
    
    alert('Wristcheck opgeslagen!');
}
