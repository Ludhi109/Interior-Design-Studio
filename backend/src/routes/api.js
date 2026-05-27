const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const newsletterController = require('../controllers/newsletterController');

// Route configurations
router.post('/contact', contactController.handleSubmission);
router.post('/newsletter', newsletterController.handleSubscription);

module.exports = router;
