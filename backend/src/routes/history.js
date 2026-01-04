const express = require('express');
const { getHistory, getResultById, deleteResult, clearHistory } = require('../controllers/historyController');

const router = express.Router();

// Get all history results (paginated)
router.get('/', getHistory);

// Get specific result by ID
router.get('/:id', getResultById);

// Delete specific result
router.delete('/:id', deleteResult);

// Clear all history
router.delete('/', clearHistory);

module.exports = router;
