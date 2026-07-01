const express = require('express');
const db = require('../config/database');
const router = express.Router();

// ELO rating constants
const DEFAULT_RATING = 1200;
const K_FACTOR = 32;

/**
 * Calculate expected score
 * @param {number} ratingA - Rating of player A
 * @param {number} ratingB - Rating of player B
 * @returns {number} Expected score for player A
 */
function calculateExpectedScore(ratingA, ratingB) {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculate new ELO rating
 * @param {number} oldRating - Current rating
 * @param {number} expectedScore - Expected score
 * @param {number} actualScore - Actual score (1 for win, 0 for loss)
 * @returns {number} New rating
 */
function calculateNewRating(oldRating, expectedScore, actualScore) {
    return Math.round(oldRating + K_FACTOR * (actualScore - expectedScore));
}

// GET /api/random-pair - Get two random different images
router.get('/random-pair', async (req, res) => {
    try {
        // Get two random images that are different
        const [images] = await db.query(`
            SELECT id, image_url 
            FROM images 
            ORDER BY RAND() 
            LIMIT 2
        `);

        if (images.length < 2) {
            return res.status(404).json({ 
                error: 'Not enough images. Please upload at least 2 images.' 
            });
        }

        res.json({
            imageA: images[0],
            imageB: images[1]
        });
    } catch (error) {
        console.error('Random pair error:', error);
        res.status(500).json({ error: 'Failed to get random images' });
    }
});

// POST /api/vote - Process a vote and update ratings
router.post('/vote', async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        const { winnerId, loserId } = req.body;

        // Validate input
        if (!winnerId || !loserId) {
            return res.status(400).json({ error: 'Winner and loser IDs are required' });
        }

        if (winnerId === loserId) {
            return res.status(400).json({ error: 'Winner and loser must be different' });
        }

        // Start transaction
        await connection.beginTransaction();

        // Get current ratings for both images
        const [images] = await connection.query(
            'SELECT id, rating, matches_played, wins, losses FROM images WHERE id IN (?, ?)',
            [winnerId, loserId]
        );

        if (images.length !== 2) {
            await connection.rollback();
            return res.status(404).json({ error: 'One or both images not found' });
        }

        // Find winner and loser data
        const winner = images.find(img => img.id === parseInt(winnerId));
        const loser = images.find(img => img.id === parseInt(loserId));

        // Calculate ELO ratings
        const expectedWinner = calculateExpectedScore(winner.rating, loser.rating);
        const expectedLoser = calculateExpectedScore(loser.rating, winner.rating);

        const newWinnerRating = calculateNewRating(winner.rating, expectedWinner, 1);
        const newLoserRating = calculateNewRating(loser.rating, expectedLoser, 0);

        // Update winner stats
        await connection.query(
            `UPDATE images 
             SET rating = ?, 
                 matches_played = matches_played + 1,
                 wins = wins + 1 
             WHERE id = ?`,
            [newWinnerRating, winnerId]
        );

        // Update loser stats
        await connection.query(
            `UPDATE images 
             SET rating = ?, 
                 matches_played = matches_played + 1,
                 losses = losses + 1 
             WHERE id = ?`,
            [newLoserRating, loserId]
        );

        // Record the match
        await connection.query(
            'INSERT INTO matches (image_a_id, image_b_id, winner_id) VALUES (?, ?, ?)',
            [winnerId, loserId, winnerId]
        );

        // Commit transaction
        await connection.commit();

        // Get a new random image to replace the loser
        const [newImage] = await connection.query(`
            SELECT id, image_url 
            FROM images 
            WHERE id != ? AND id != ?
            ORDER BY RAND() 
            LIMIT 1
        `, [winnerId, loserId]);

        res.json({
            success: true,
            message: 'Vote recorded successfully',
            winner: {
                id: winner.id,
                newRating: newWinnerRating
            },
            loser: {
                id: loser.id,
                newRating: newLoserRating
            },
            newImage: newImage.length > 0 ? newImage[0] : null
        });

    } catch (error) {
        await connection.rollback();
        console.error('Vote processing error:', error);
        res.status(500).json({ error: 'Failed to process vote' });
    } finally {
        connection.release();
    }
});

// GET /api/leaderboard - Get ranked images
router.get('/leaderboard', async (req, res) => {
    try {
        const [images] = await db.query(`
            SELECT id, image_url, rating
            FROM images
            WHERE matches_played > 0
            ORDER BY rating DESC
        `);

        // Format response to only include rank and image
        const leaderboard = images.map((image, index) => ({
            rank: index + 1,
            id: image.id,
            image_url: image.image_url
        }));

        res.json(leaderboard);
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ error: 'Failed to get leaderboard' });
    }
});

// GET /api/image/:id/stats - Get stats for a specific image (for internal use)
router.get('/image/:id/stats', async (req, res) => {
    try {
        const [images] = await db.query(
            'SELECT rating, matches_played, wins, losses FROM images WHERE id = ?',
            [req.params.id]
        );

        if (images.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json(images[0]);
    } catch (error) {
        console.error('Fetch stats error:', error);
        res.status(500).json({ error: 'Failed to fetch image stats' });
    }
});

module.exports = router;