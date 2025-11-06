const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const {
  registerVisitor,
  getVisitorById,
  getVisitorsByDate,
  verifyVisitor,
} = require('../controllers/visitor.controller');

// POST /api/visitors
router.post('/', upload.single('image'), registerVisitor);

// POST /api/visitors/verify
router.post('/verify', upload.single('image'), verifyVisitor);

// GET /api/visitors?date=YYYY-MM-DD
router.get('/', getVisitorsByDate);

// GET /api/visitors/:id
router.get('/:id', getVisitorById);

module.exports = router;
