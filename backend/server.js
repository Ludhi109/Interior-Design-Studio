// Load environment variables first
require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Start local listener only if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[AURA API] Server is running on port ${PORT}`);
  });
}

module.exports = app;
