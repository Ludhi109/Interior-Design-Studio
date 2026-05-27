const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const newsletterController = require('../controllers/newsletterController');

// Client endpoints
router.post('/contact', contactController.handleSubmission);
router.post('/newsletter', newsletterController.handleSubscription);

// Admin endpoints for database verification
router.get('/admin/inquiries', contactController.getAllInquiries);
router.get('/admin/subscribers', newsletterController.getAllSubscribers);

// Diagnostic endpoints
router.get('/diag/email', contactController.diagEmail);

module.exports = router;
