/**
 * Vercel Serverless Function for Anthropic API Proxy
 *
 * This function proxies requests to the Anthropic API to bypass CORS restrictions
 * when hosting the app on GitHub Pages or other static hosting platforms.
 *
 * Deploy this to Vercel and configure the PROXY_URL in index.html
 */

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: { message: 'Method not allowed' } });
        return;
    }

    try {
        const { model, max_tokens, messages } = req.body;
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            res.status(400).json({ error: { message: 'Missing x-api-key header' } });
            return;
        }

        // Forward request to Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model,
                max_tokens,
                messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            res.status(response.status).json(data);
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: {
                message: 'Proxy error: ' + error.message
            }
        });
    }
}
