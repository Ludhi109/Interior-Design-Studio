const db = require('../config/db');
const emailService = require('../services/emailService');

/**
 * Handles project inquiry / contact form submissions by saving them to SQLite and sending email notifications.
 */
exports.handleSubmission = (req, res) => {
  const { name, email, projectType, message } = req.body;

  // 1. Basic validation
  if (!name || !email || !projectType || !message) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields (name, email, projectType, message) are required.'
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
  const sql = `INSERT INTO inquiries (name, email, project_type, message) VALUES (?, ?, ?, ?)`;
  
  db.run(sql, [name, email, projectType, message], function (err) {
    if (err) {
      console.error('[DATABASE ERROR] Failed to insert inquiry:', err.message);
      return res.status(500).json({
        status: 'error',
        message: 'An internal error occurred while saving your inquiry. Please try again.'
      });
    }

    // Log insertion locally
    console.log('====================================');
    console.log(`[DATABASE INSERTED] Inquiry ID: ${this.lastID}`);
    console.log(`Name:        ${name}`);
    console.log(`Email:       ${email}`);
    console.log(`Typology:    ${projectType}`);
    console.log('====================================');

    // Send email notification to admin
    emailService.sendContactNotification({ name, email, projectType, message });

    // 4. Return success response
    res.status(200).json({
      status: 'success',
      message: 'Thank you! Your inquiry was successfully received. Our studio will connect with you shortly.'
    });
  });
};

/**
 * Administrative endpoint to fetch all inquiry submissions.
 */
exports.getAllInquiries = (req, res) => {
  const sql = `SELECT * FROM inquiries ORDER BY created_at DESC`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('[DATABASE ERROR] Failed to fetch inquiries:', err.message);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve inquiries database records.'
      });
    }

    res.status(200).json({
      status: 'success',
      count: rows.length,
      data: rows
    });
  });
};
