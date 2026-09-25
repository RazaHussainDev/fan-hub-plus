const fetch = require('node-fetch'); // wait I can't use node-fetch if it's not installed. I will use native http.

const http = require('http');

const reqPOST = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/watchlist',
  method: 'POST'
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('POST:', data));
});
reqPOST.end();

const reqGET = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/watchlist',
  method: 'GET'
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('GET:', data));
});
reqGET.end();
