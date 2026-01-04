const ScoreResult = require('../models/ScoreResult');

// Get history results with pagination
exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const results = await ScoreResult.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ScoreResult.countDocuments();

    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve history',
      message: error.message
    });
  }
};

// Get specific result by ID
exports.getResultById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ScoreResult.findById(id);

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Result retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve result',
      message: error.message
    });
  }
};

// Delete specific result
exports.deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ScoreResult.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Failed to delete result',
      message: error.message
    });
  }
};

// Clear all history
exports.clearHistory = async (req, res) => {
  try {
    const result = await ScoreResult.deleteMany({});

    res.json({
      success: true,
      message: 'All history cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      error: 'Failed to clear history',
      message: error.message
    });
  }
};
