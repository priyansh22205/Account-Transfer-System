const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const transferRoutes = require('./routes/transferRoutes');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/', transferRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
