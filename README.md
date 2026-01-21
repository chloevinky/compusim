# 🖥️ Retro Computer Store Ad Generator

Generate period-accurate computer store advertisements from any year (1960-2025) using AI!

## Features

- 📅 **Time-accurate content**: Advertisements match the marketing style and language of each era
- 🤖 **AI-powered**: Uses Claude Opus 4.5 for content generation
- 🎨 **Image generation**: DALL-E 3 creates retro computer product images
- 🎭 **Era-specific styling**: Visual design changes based on the selected decade (60s, 70s, 80s, 90s, 2000s, 2010s, 2020s)
- 💰 **Inflation-adjusted pricing**: Shows both original and 2025-equivalent prices

## Why a Proxy Server?

**Important**: This app requires a proxy server to work correctly.

### The Problem
Anthropic's API (`api.anthropic.com`) blocks direct browser requests due to CORS (Cross-Origin Resource Sharing) policy. This is a security feature that prevents API keys from being exposed in client-side code.

When you try to call the Anthropic API directly from the browser, you get:
```
Error: Failed to fetch
```

### The Solution
We use a Node.js proxy server that:
1. Receives requests from the browser
2. Forwards them to Anthropic's API (server-to-server, no CORS)
3. Returns the response back to the browser

OpenAI's API happens to allow CORS requests, so DALL-E image generation works directly from the browser.

## Setup & Installation

### Prerequisites
- Node.js installed (for the proxy server)
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone or download this repository**
```bash
git clone https://github.com/chloevinky/compusim.git
cd compusim
```

2. **No npm install needed!** This uses only Node.js built-in modules.

## Usage

### Step 1: Start the Proxy Server

```bash
node proxy-server.js
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║  🖥️  Retro Computer Store Ad Generator - Proxy Server     ║
╠════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:3000                  ║
╚════════════════════════════════════════════════════════════╝
```

### Step 2: Open the App

Open your browser and navigate to:
```
http://localhost:3000
```

**⚠️ Important**: Do NOT open `index.html` directly (file://) - you must use the proxy server!

### Step 3: Enter API Keys

1. Enter your Anthropic API key
2. Enter your OpenAI API key
3. Select a year (1960-2025)
4. Click "Generate Ad"

### Step 4: Watch the Magic

The app will:
1. Generate period-accurate ad content with Claude
2. Display the ad with placeholder images
3. Generate retro computer images with DALL-E (one at a time)
4. Update the ad as each image completes

## Troubleshooting

### Error: "Failed to fetch"

**Cause**: You're either:
- Opening `index.html` directly (file://)
- Not running the proxy server
- Accessing at the wrong URL

**Solution**:
1. Make sure `proxy-server.js` is running
2. Access the app at `http://localhost:3000` (NOT file://)

### Error: "Invalid Anthropic API key"

**Cause**: Your API key is incorrect or expired

**Solution**:
1. Check your API key at [Anthropic Console](https://console.anthropic.com/)
2. Make sure you copied the full key (starts with `sk-ant-`)
3. Check for extra spaces

### Error: "Invalid OpenAI API key"

**Cause**: Your OpenAI key is incorrect or you don't have credits

**Solution**:
1. Check your API key at [OpenAI Platform](https://platform.openai.com/api-keys)
2. Verify you have available credits
3. Make sure you copied the full key (starts with `sk-`)

### Error: "Rate limit exceeded"

**Cause**: You've made too many requests

**Solution**: Wait a few moments and try again

### Images fail but text works

**Cause**: OpenAI API key issue or DALL-E rate limit

**Solution**: Check your OpenAI API key and account credits

## Diagnostic Tool

If you're experiencing issues, use the diagnostic tool:

```
http://localhost:3000/test-fetch.html
```

This will test:
- Basic fetch capability
- CORS functionality
- Anthropic API connectivity
- OpenAI API connectivity

## Project Structure

```
compusim/
├── index.html          # Main application (single-page app)
├── proxy-server.js     # Node.js proxy server for Anthropic API
├── test-fetch.html     # Diagnostic tool for troubleshooting
└── README.md          # This file
```

## Technical Details

### Architecture

```
Browser (index.html)
    │
    ├─→ /api/anthropic ──→ proxy-server.js ──→ api.anthropic.com
    │                            ↓
    │                      (bypasses CORS)
    │
    └─→ DALL-E API (direct, CORS allowed)
```

### APIs Used

1. **Claude Opus 4.5** (via Anthropic API)
   - Generates period-accurate ad content
   - Creates computer specs, prices, and marketing copy
   - Called via proxy to bypass CORS

2. **DALL-E 3** (via OpenAI API)
   - Generates retro computer product images
   - Called directly from browser (CORS allowed)

### Era-Specific Styling

The app applies different visual styles based on the selected decade:

- **1960s-70s**: Classic black & white, Times New Roman, formal layouts
- **1980s**: Bold colors, gradients, neon text effects
- **1990s**: Comic Sans, rainbow gradients, playful borders
- **2000s**: Glossy blue gradients, modern sans-serif
- **2010s-2020s**: Clean, minimal, contemporary design

## Security Notes

⚠️ **Never deploy this to production with client-side API keys!**

This app is designed for:
- Local development
- Personal use
- Learning purposes

For production:
- Use server-side API key management
- Implement proper authentication
- Use environment variables
- Add rate limiting

## License

MIT License - Feel free to modify and use!

## Credits

Built with:
- [Claude API](https://www.anthropic.com/api) by Anthropic
- [OpenAI API](https://platform.openai.com/) by OpenAI
- Vanilla JavaScript (no frameworks!)
- Node.js built-in modules only

## Contributing

Found a bug? Have a suggestion? Open an issue or pull request!
