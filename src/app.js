const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to my Netlify Node.js project!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
