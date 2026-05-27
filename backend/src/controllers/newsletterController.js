/**
 * Handles newsletter subscription requests.
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

  // 3. Log subscription (simulating database storage)
  console.log('====================================');
  console.log('[NEW JOURNAL SUBSCRIPTION]');
  console.log(`Email:     ${email}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('====================================');

  // 4. Return success response
  res.status(200).json({
    status: 'success',
    message: 'Successfully Subscribed to Journal.'
  });
};
