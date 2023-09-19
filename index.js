const express = require('express');
const app = express();
const request = require('request');
const url = require('url');

// Create a proxy route
app.get('/proxy', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing target URL parameter');
  }

  // Forward the request to the target URL
  request(targetUrl).pipe(res);
});

// Intercept link clicks within the proxy container and modify URLs
app.get('/link', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing target URL parameter');
  }

  // Check if the target URL is a relative URL (e.g., /topics)
  if (targetUrl.startsWith('/')) {
    // Modify the URL to include the full domain of the original website
    const referringUrl = req.headers.referer;
    if (referringUrl) {
      const parsedReferringUrl = url.parse(referringUrl);
      const fullUrl = `${parsedReferringUrl.protocol}//${parsedReferringUrl.host}${targetUrl}`;
      res.redirect(`/proxy?url=${encodeURIComponent(fullUrl)}`);
    } else {
      return res.status(400).send('Unable to determine base URL');
    }
  } else {
    // If it's an absolute URL, simply redirect to the proxy route
    res.redirect(`/proxy?url=${encodeURIComponent(targetUrl)}`);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
