const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
module.exports = app;