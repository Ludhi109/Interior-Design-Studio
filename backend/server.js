const app = require('./src/app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[AURA API] Server is running on port ${PORT}`);
});
