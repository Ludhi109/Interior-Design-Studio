const db = require('../config/db');
const emailService = require('../services/emailService');

/**
 * Handles newsletter subscription requests by saving them to SQLite and sending email notifications.
 */
exports.handleSubscription = (req, res) => {
  const { email } = req.body;

  // 1. Basic validation
  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email address is required.'
    });
  }

  // 2. Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a valid email address.'
    });
  }

  // 3. Insert record into database
  const sql = `INSERT INTO subscribers (email) VALUES (?)`;

  db.run(sql, [email], function (err) {
    if (err) {
      // Handle email duplicates gracefully due to UNIQUE constraint
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({
          status: 'error',
          message: 'This email is already subscribed to our journal.'
        });
      }

      console.error('[DATABASE ERROR] Failed to subscribe email:', err.message);
      return res.status(500).json({
        status: 'error',
        message: 'An internal error occurred. Please try again.'
      });
    }

    // Log subscription locally
    console.log('====================================');
    console.log(`[DATABASE INSERTED] Subscriber ID: ${this.lastID}`);
    console.log(`Email:     ${email}`);
    console.log('====================================');

    // Send email notification to admin
    emailService.sendNewsletterNotification(email);

    // 4. Return success response
    res.status(200).json({
      status: 'success',
      message: 'Successfully Subscribed to Journal.'
    });
  });
};

/**
 * Administrative endpoint to fetch all subscribers.
 */
exports.getAllSubscribers = (req, res) => {
  const sql = `SELECT * FROM subscribers ORDER BY created_at DESC`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('[DATABASE ERROR] Failed to fetch subscribers:', err.message);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve subscribers database records.'
      });
    }

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  });
};
