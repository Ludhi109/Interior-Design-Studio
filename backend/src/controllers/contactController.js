/**
 * Handles project inquiry / contact form submissions.
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

  // 3. Log submission (simulating database storage)
  console.log('====================================');
  console.log('[NEW PROJECT INQUIRY RECEIVED]');
  console.log(`Name:        ${name}`);
  console.log(`Email:       ${email}`);
  console.log(`Typology:    ${projectType}`);
  console.log(`Description: ${message}`);
  console.log(`Timestamp:   ${new Date().toISOString()}`);
  console.log('====================================');

  // 4. Return success response
  res.status(200).json({
    status: 'success',
    message: 'Thank you! Your inquiry was successfully received. Our studio will connect with you shortly.'
  });
};
