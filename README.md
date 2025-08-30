
# 🤖 KAIZ Bot - Advanced Facebook Messenger Bot

A fully-featured Facebook Messenger bot with multiple AI integrations, music downloading, image analysis, and aesthetic rainbow logging.

## ✨ Features

### 🧠 Multi-AI Chat
- **KAIZ AI** - Primary AI for conversations and image analysis
- **Gemini Pro** - Google's advanced language model
- **GPT-3** - OpenAI's powerful text generation
- **DeepSeek V3** - Advanced reasoning capabilities

### 🎵 Music Features
- **Spotify Downloader** - Download tracks with direct links
- **Interactive Buttons** - Easy download and preview options
- **URL Detection** - Automatic Spotify link processing

### 🖼️ Image Analysis
- Send any image for AI-powered analysis
- Detailed descriptions and insights
- Powered by KAIZ AI vision capabilities

### 🎨 Aesthetic Features
- **Rainbow Gradient Logging** - Beautiful colored console output
- **Loading Animations** - Spinning indicators for operations
- **Figlet ASCII Art** - Stunning startup banner
- **Timestamp Logging** - Precise operation tracking

### 🚀 Bot Features
- **Typing Indicators** - Shows when bot is processing
- **Welcome Messages** - Onboarding for new users
- **Interactive Buttons** - Easy navigation menus
- **Quick Replies** - Fast action selection
- **Command System** - Prefix-based commands
- **Auto-uptime** - 24/7 operation with health checks

## 🛠️ Setup Instructions

### 1. Facebook Page Setup
1. Create a Facebook Page
2. Go to Facebook Developers
3. Create a new app
4. Add Messenger product
5. Generate Page Access Token
6. Set up webhook URL: `https://your-repl.replit.app/webhook`
7. Verify token: `kaiz_bot_verify_token`

### 2. Environment Variables
Set these in Replit Secrets:
```
PAGE_ACCESS_TOKEN=your_facebook_page_access_token
VERIFY_TOKEN=kaiz_bot_verify_token
```

### 3. Deploy
- Click the Deploy button in Replit
- Choose Autoscale Deployment for 24/7 operation
- Bot will automatically handle uptime management

## 🎮 Commands

### AI Commands
- `/ai [message]` - Chat with KAIZ AI
- `/gemini [message]` - Chat with Gemini Pro
- `/gpt [message]` - Chat with GPT-3
- `/deepseek [message]` - Chat with DeepSeek V3

### Music Commands
- `/spotify [URL]` - Download Spotify track
- Send any Spotify link for automatic processing

### Quick Actions
- `menu` - Show main menu
- `help` - Show all commands
- `start` - Welcome message

### Image Analysis
- Send any image to get AI analysis

## 📱 Interactive Features

### Quick Replies
- 🤖 AI Chat
- 🎵 Music
- 📋 Menu
- ❓ Help

### Button Templates
- Main menu navigation
- AI model selection
- Download options
- Help sections

## 🌈 Logging Features

The bot includes a beautiful aesthetic logging system:
- **Rainbow gradients** for titles and timestamps
- **Colored log levels** (info, success, warning, error, debug)
- **Loading spinners** for operations
- **ASCII art banner** on startup
- **Uptime tracking** with health checks

## 🔧 Technical Features

### Auto-Uptime Management
- Health checks every 25 minutes
- Self-ping to prevent sleeping
- Uptime tracking and display
- Graceful shutdown handling

### Error Handling
- Comprehensive try-catch blocks
- User-friendly error messages
- Detailed logging for debugging
- Fallback responses

### API Integration
- Modular API helper class
- Error handling and retries
- Response validation
- Multiple endpoint support

## 📊 API Endpoints

The bot uses these KAIZ APIs:
- **KAIZ AI**: `/api/kaiz-ai` - Main chat and image analysis
- **Gemini Pro**: `/api/gemini-pro` - Google's language model
- **GPT-3**: `/api/gpt3` - OpenAI text generation
- **DeepSeek V3**: `/api/deepseek-v3` - Advanced reasoning
- **Spotify Downloader**: `/api/spotify-down` - Music downloads

## 🌍 Deployment

This bot is optimized for Replit deployment:
- **Port 5000** for web accessibility
- **Auto-uptime** for 24/7 operation
- **Health endpoints** for monitoring
- **Environment variable** support
- **Webhook verification** for Facebook

## 📝 Usage Examples

### Text Chat
```
User: Hello, how are you?
Bot: 🤖 KAIZ AI Response:
Hello! I'm doing great, thank you for asking...
```

### AI Commands
```
User: /gemini What's the weather like?
Bot: 🔮 Gemini Pro Response:
I'd be happy to help with weather information...
```

### Spotify Download
```
User: https://open.spotify.com/track/example
Bot: 🎵 Song Title by Artist Name
Ready to download!
[Download Button] [Preview Button]
```

### Image Analysis
```
User: [sends image]
Bot: 🔍 Analyzing your image with KAIZ AI...
🖼️ Image Analysis Results:
This image shows...
```

## 🎨 Color Scheme

The bot uses a beautiful rainbow gradient color scheme:
- Red → Orange → Yellow → Green → Blue → Indigo → Violet
- Cyan for info messages
- Green for success
- Yellow for warnings
- Red for errors
- Magenta for debug

## 🚀 Performance

- **Fast response times** with async/await
- **Efficient API calls** with error handling
- **Memory optimized** logging system
- **Auto-cleanup** for long-running processes
- **Health monitoring** for reliability

## 📞 Support

For support or questions about this bot, check the logs in the console for detailed information about all operations and any errors that might occur.

## 🏆 Features Summary

✅ Multi-AI chat integration
✅ Spotify music downloader
✅ Image analysis capabilities
✅ Interactive buttons and menus
✅ Aesthetic rainbow logging
✅ Auto-uptime management
✅ Typing indicators
✅ Welcome messages
✅ Command system
✅ Quick replies
✅ Error handling
✅ Health monitoring
✅ 24/7 deployment ready
✅ Webhook verification
✅ Environment variable support

The bot is now ready for deployment and 24/7 operation! 🎉
