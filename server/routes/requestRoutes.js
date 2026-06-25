const express = require('express');
const router = express.Router();
const {
  listRequests, myRequests, requestsForSession,
  createRequest, approveRequest, rejectRequest, deleteRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, myRequests);
router.get('/session/:sessionId', requestsForSession);
router.get('/', listRequests);
router.post('/', protect, createRequest);
router.put('/:id/approve', protect, approveRequest);
router.put('/:id/reject', protect, rejectRequest);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
