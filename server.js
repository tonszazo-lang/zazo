// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9000;
const PUBLIC_DIR = __dirname; // مجلد www

const mimeTypes = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.gif':  'image/gif',
};

const server = http.createServer((req, res) => {
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, content) => {
    if(err){
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404 - الملف غير موجود');
    } else {
      res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ واجهة التطبيق تعمل على http://127.0.0.1:${PORT}`);
});
