#!/usr/bin/env node

/**
 * Simple proxy server for Anthropic API to handle CORS restrictions
 *
 * Usage: node proxy-server.js
 * Then access the app at: http://localhost:3000
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME types for serving static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function proxyToAnthropic(req, res) {
    console.log('[PROXY] Forwarding request to Anthropic API...');

    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const requestData = JSON.parse(body);
            const apiKey = req.headers['x-api-key'];

            if (!apiKey) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { message: 'Missing x-api-key header' } }));
                return;
            }

            const postData = JSON.stringify({
                model: requestData.model,
                max_tokens: requestData.max_tokens,
                messages: requestData.messages
            });

            const options = {
                hostname: 'api.anthropic.com',
                port: 443,
                path: '/v1/messages',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const proxyReq = https.request(options, (proxyRes) => {
                console.log(`[PROXY] Anthropic API responded with status: ${proxyRes.statusCode}`);

                // Forward headers (with CORS)
                res.writeHead(proxyRes.statusCode, {
                    'Content-Type': proxyRes.headers['content-type'] || 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version'
                });

                proxyRes.pipe(res);
            });

            // Set timeout for detailed content generation (65 seconds)
            proxyReq.setTimeout(65000, () => {
                proxyReq.destroy();
                console.error('[PROXY] Request timeout');
                res.writeHead(504, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ error: { message: 'Request to Anthropic API timed out. Please try again.' } }));
            });

            proxyReq.on('error', (error) => {
                console.error('[PROXY] Error:', error);
                res.writeHead(500, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ error: { message: 'Proxy error: ' + error.message } }));
            });

            proxyReq.write(postData);
            proxyReq.end();

        } catch (error) {
            console.error('[PROXY] Parse error:', error);
            res.writeHead(400, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: { message: 'Invalid request body' } }));
        }
    });
}

function serveStaticFile(filePath, res) {
    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version, Authorization'
        });
        res.end();
        return;
    }

    // Proxy endpoint for Anthropic API
    if (req.url === '/api/anthropic' && req.method === 'POST') {
        proxyToAnthropic(req, res);
        return;
    }

    // Serve static files
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    serveStaticFile(filePath, res);
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  🖥️  Retro Computer Store Ad Generator - Proxy Server     ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Server running at: http://localhost:${PORT}                  ║
║                                                            ║
║  Features:                                                 ║
║  ✅ Serves static files (HTML, CSS, JS)                    ║
║  ✅ Proxies Anthropic API requests (bypasses CORS)         ║
║  ✅ OpenAI API works directly from browser                 ║
║                                                            ║
║  Open in your browser: http://localhost:${PORT}               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);
});
