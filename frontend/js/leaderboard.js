// API base URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const leaderboardContainer = document.getElementById('leaderboardContainer');
const emptyMessage = document.getElementById('emptyMessage');
const loadingMessage = document.getElementById('loadingMessage');

// Initialize leaderboard
async function initLeaderboard() {
    try {
        await loadLeaderboard();
    } catch (error) {
        showError('Failed to load leaderboard. Please refresh the page.');
        console.error('Leaderboard error:', error);
    }
}

// Load leaderboard data
async function loadLeaderboard() {
    try {
        // Show loading state
        loadingMessage.style.display = 'block';
        leaderboardContainer.style.display = 'none';
        emptyMessage.style.display = 'none';

        const response = await fetch(`${API_BASE_URL}/leaderboard`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }

        const leaderboardData = await response.json();

        // Hide loading state
        loadingMessage.style.display = 'none';

        // Check if there are any ranked images
        if (leaderboardData.length === 0) {
            emptyMessage.style.display = 'block';
            leaderboardContainer.style.display = 'none';
            return;
        }

        // Display leaderboard
        leaderboardContainer.style.display = 'grid';
        renderLeaderboard(leaderboardData);

    } catch (error) {
        loadingMessage.style.display = 'none';
        throw error;
    }
}

// Render leaderboard items
function renderLeaderboard(images) {
    // Clear container
    leaderboardContainer.innerHTML = '';

    // Create and append leaderboard cards
    images.forEach(image => {
        const card = createLeaderboardCard(image);
        leaderboardContainer.appendChild(card);
    });
}

// Create a single leaderboard card
function createLeaderboardCard(image) {
    const card = document.createElement('div');
    card.className = 'leaderboard-card fade-in';

    // Create rank badge
    const rankBadge = document.createElement('div');
    rankBadge.className = 'rank-badge';
    
    // Add ordinal suffix to rank
    const rank = image.rank;
    let rankText = rank.toString();
    
    if (rank === 1) rankText = '#1';
    else if (rank === 2) rankText = '#2';
    else if (rank === 3) rankText = '#3';
    else rankText = `#${rank}`;
    
    rankBadge.textContent = rankText;

    // Create image
    const img = document.createElement('img');
    img.className = 'leaderboard-image';
    img.src = getFullImageUrl(image.image_url);
    img.alt = `Rank #${image.rank}`;
    img.loading = 'lazy';

    // Assemble card
    card.appendChild(rankBadge);
    card.appendChild(img);

    return card;
}

// Get full image URL
function getFullImageUrl(imagePath) {
    return `http://localhost:3000${imagePath}`;
}

// Show error message (reuse the same style as voting page)
function showError(message) {
    // Create error element if it doesn't exist
    let errorElement = document.getElementById('errorMessage');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'errorMessage';
        errorElement.className = 'error-message';
        document.querySelector('.container').appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Auto-refresh leaderboard every 30 seconds
let refreshInterval;

function startAutoRefresh() {
    // Clear any existing interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    // Set new interval
    refreshInterval = setInterval(() => {
        loadLeaderboard();
    }, 30000); // 30 seconds
}

// Stop auto-refresh when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
        }
    } else {
        // Page is visible again, restart auto-refresh and reload data
        loadLeaderboard();
        startAutoRefresh();
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLeaderboard();
    startAutoRefresh();
});