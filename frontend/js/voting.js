// API base URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:3000/api';

// Current images state
let currentImageA = null;
let currentImageB = null;
let isLoading = false;

// DOM Elements
const imageAElement = document.getElementById('imageA');
const imageBElement = document.getElementById('imageB');
const imageACard = document.getElementById('imageACard');
const imageBCard = document.getElementById('imageBCard');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');

// Initialize the voting page
async function initVoting() {
    try {
        showLoading();
        await loadNewPair();
        hideLoading();
    } catch (error) {
        showError('Failed to load images. Please refresh the page.');
        console.error('Initialization error:', error);
    }
}

// Load a new random pair of images
async function loadNewPair() {
    try {
        const response = await fetch(`${API_BASE_URL}/random-pair`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }

        const data = await response.json();
        
        // Update current images
        currentImageA = data.imageA;
        currentImageB = data.imageB;

        // Update the DOM with fade animation
        updateImageWithAnimation(imageAElement, getFullImageUrl(currentImageA.image_url));
        updateImageWithAnimation(imageBElement, getFullImageUrl(currentImageB.image_url));
        
    } catch (error) {
        console.error('Error loading pair:', error);
        throw error;
    }
}

// Get full image URL
function getFullImageUrl(imagePath) {
    return `http://localhost:3000${imagePath}`;
}

// Update image with fade animation
function updateImageWithAnimation(imgElement, newSrc) {
    imgElement.style.opacity = '0';
    
    setTimeout(() => {
        imgElement.src = newSrc;
        imgElement.style.opacity = '1';
    }, 150);
}

// Handle vote
async function handleVote(winnerId, loserId) {
    if (isLoading) return;
    
    try {
        isLoading = true;
        showLoading('Processing vote...');
        
        const response = await fetch(`${API_BASE_URL}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                winnerId: winnerId,
                loserId: loserId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to record vote');
        }

        const data = await response.json();

        // Update the loser image with a new one
        if (data.newImage) {
            // Determine which image was the loser and update it
            if (loserId === currentImageA.id) {
                currentImageA = data.newImage;
                updateImageWithAnimation(imageAElement, getFullImageUrl(data.newImage.image_url));
            } else {
                currentImageB = data.newImage;
                updateImageWithAnimation(imageBElement, getFullImageUrl(data.newImage.image_url));
            }
        }

        hideLoading();
        
    } catch (error) {
        showError('Failed to process vote. Please try again.');
        console.error('Vote error:', error);
        isLoading = false;
    }
}

// Event listeners for image clicks
imageACard.addEventListener('click', () => {
    if (currentImageA && currentImageB && !isLoading) {
        handleVote(currentImageA.id, currentImageB.id);
    }
});

imageBCard.addEventListener('click', () => {
    if (currentImageA && currentImageB && !isLoading) {
        handleVote(currentImageB.id, currentImageA.id);
    }
});

// Helper functions for UI states
function showLoading(message = 'Loading...') {
    loadingMessage.textContent = message;
    loadingMessage.style.display = 'block';
}

function hideLoading() {
    loadingMessage.style.display = 'none';
    isLoading = false;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Start the application
document.addEventListener('DOMContentLoaded', initVoting);