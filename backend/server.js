// Load environment variables first
require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[AURA API] Server is running on port ${PORT}`);
});
