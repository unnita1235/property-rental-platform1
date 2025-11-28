const express = require('express');
const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['Owner']), createProperty);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.put('/:id', authMiddleware, roleMiddleware(['Owner']), updateProperty);
router.delete('/:id', authMiddleware, roleMiddleware(['Owner']), deleteProperty);

module.exports = router;