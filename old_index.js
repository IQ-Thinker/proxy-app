const express = require('express');
const app = express();
const request = require('request');

// Create a proxy route
app.get('/proxy', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing target URL parameter');
  }

  // Forward the request to the target URL
  request(targetUrl).pipe(res);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
