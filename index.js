
const express = require('express');
const axios = require('axios');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const { Spinner } = require('cli-spinner');
const moment = require('moment');

// Bot configuration
const config = {
    port: process.env.PORT || 5000,
    pageAccessToken: process.env.PAGE_ACCESS_TOKEN || 'YOUR_PAGE_ACCESS_TOKEN',
    verifyToken: process.env.VERIFY_TOKEN || 'kaiz_bot_verify_token',
    apiKey: 'b25bd41d-a96c-4df0-aab1-536acd594eb7',
    apiBase: 'https://kaiz-apis.gleeze.com/api'
};

// Initialize Express app
const app = express();
app.use(express.json());

// Aesthetic Logger Class
class AestheticLogger {
    constructor() {
        this.colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
        this.rainbowGradient = gradient(this.colors);
        this.initLogger();
    }

    initLogger() {
        console.clear();
        const title = figlet.textSync('KAIZ BOT', {
            font: 'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });
        console.log(this.rainbowGradient(title));
        console.log(this.rainbowGradient('='.repeat(80)));
        console.log();
    }

    loading(message, duration = 2000) {
        const spinner = new Spinner(chalk.cyan(`${message} %s`));
        spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
        spinner.start();
        
        return new Promise(resolve => {
            setTimeout(() => {
                spinner.stop(true);
                resolve();
            }, duration);
        });
    }

    log(level, message, data = null) {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        const colorMap = {
            info: chalk.cyan,
            success: chalk.green,
            warning: chalk.yellow,
            error: chalk.red,
            debug: chalk.magenta
        };
        
        const color = colorMap[level] || chalk.white;
        const prefix = this.rainbowGradient(`[${timestamp}]`);
        const levelTag = color(`[${level.toUpperCase()}]`);
        
        console.log(`${prefix} ${levelTag} ${message}`);
        if (data) {
            console.log(chalk.gray(JSON.stringify(data, null, 2)));
        }
    }

    info(message, data) { this.log('info', message, data); }
    success(message, data) { this.log('success', message, data); }
    warning(message, data) { this.log('warning', message, data); }
    error(message, data) { this.log('error', message, data); }
    debug(message, data) { this.log('debug', message, data); }
}

const logger = new AestheticLogger();

// API Helper Class
class APIHelper {
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async makeRequest(endpoint, params = {}) {
        try {
            params.apikey = this.apiKey;
            const response = await axios.get(`${this.baseUrl}/${endpoint}`, { params });
            return response.data;
        } catch (error) {
            logger.error(`API Request failed for ${endpoint}`, error.message);
            throw error;
        }
    }

    async kaizAI(message, uid = '1') {
        return await this.makeRequest('kaiz-ai', { ask: message, uid });
    }

    async geminiPro(message, uid = '1') {
        return await this.makeRequest('gemini-pro', { ask: message, uid });
    }

    async gpt3(message) {
        return await this.makeRequest('gpt3', { ask: message });
    }

    async deepseekV3(message) {
        return await this.makeRequest('deepseek-v3', { ask: message });
    }

    async spotifyDownload(url) {
        return await this.makeRequest('spotify-down', { url });
    }
}

const api = new APIHelper(config.apiKey, config.apiBase);

// Facebook Messenger Helper Class
class MessengerBot {
    constructor(pageAccessToken) {
        this.pageAccessToken = pageAccessToken;
        this.graphAPI = 'https://graph.facebook.com/v18.0/me/messages';
    }

    async sendMessage(recipientId, message) {
        try {
            const response = await axios.post(this.graphAPI, {
                recipient: { id: recipientId },
                message: message
            }, {
                params: { access_token: this.pageAccessToken }
            });
            logger.success(`Message sent to ${recipientId}`);
            return response.data;
        } catch (error) {
            logger.error('Failed to send message', error.response?.data || error.message);
            throw error;
        }
    }

    async sendTypingIndicator(recipientId, action = 'typing_on') {
        try {
            await axios.post(this.graphAPI, {
                recipient: { id: recipientId },
                sender_action: action
            }, {
                params: { access_token: this.pageAccessToken }
            });
        } catch (error) {
            logger.error('Failed to send typing indicator', error.message);
        }
    }

    async sendQuickReplies(recipientId, text, quickReplies) {
        const message = {
            text: text,
            quick_replies: quickReplies.map(reply => ({
                content_type: 'text',
                title: reply.title,
                payload: reply.payload
            }))
        };
        return await this.sendMessage(recipientId, message);
    }

    async sendButtonTemplate(recipientId, text, buttons) {
        const message = {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: text,
                    buttons: buttons
                }
            }
        };
        return await this.sendMessage(recipientId, message);
    }

    async sendWelcomeMessage(recipientId) {
        const welcomeText = `🎉 Welcome to KAIZ Bot! 🤖

I'm your intelligent assistant powered by multiple AI models. Here's what I can do:

🧠 AI Chat - Ask me anything!
🎵 Spotify Downloader - Download your favorite tracks
🖼️ Image Analysis - Send me images to analyze
⚡ Multiple AI Models - Choose from GPT-3, Gemini Pro, DeepSeek V3, and KAIZ AI

Type 'help' or 'menu' to see all available commands!`;

        const quickReplies = [
            { title: '🤖 AI Chat', payload: 'ai_chat' },
            { title: '🎵 Music', payload: 'music' },
            { title: '📋 Menu', payload: 'menu' },
            { title: '❓ Help', payload: 'help' }
        ];

        await this.sendQuickReplies(recipientId, welcomeText, quickReplies);
    }

    async sendHelpMenu(recipientId) {
        const helpText = `📋 KAIZ Bot Commands:

🤖 AI Commands:
• /ai [message] - KAIZ AI response
• /gemini [message] - Gemini Pro response
• /gpt [message] - GPT-3 response
• /deepseek [message] - DeepSeek V3 response

🎵 Music Commands:
• /spotify [URL] - Download Spotify track
• Send Spotify link for quick download

🖼️ Image Analysis:
• Send any image for AI analysis

⚡ Quick Actions:
• Type 'menu' for quick options
• Type 'help' for this menu`;

        await this.sendMessage(recipientId, { text: helpText });
    }

    async sendMainMenu(recipientId) {
        const buttons = [
            {
                type: 'postback',
                title: '🤖 AI Chat',
                payload: 'AI_CHAT_MENU'
            },
            {
                type: 'postback',
                title: '🎵 Music Downloader',
                payload: 'MUSIC_MENU'
            },
            {
                type: 'postback',
                title: '❓ Help & Info',
                payload: 'HELP_MENU'
            }
        ];

        await this.sendButtonTemplate(recipientId, '🎯 Choose an option:', buttons);
    }

    async sendAIMenu(recipientId) {
        const quickReplies = [
            { title: '🤖 KAIZ AI', payload: 'kaiz_ai' },
            { title: '🔮 Gemini Pro', payload: 'gemini_pro' },
            { title: '💡 GPT-3', payload: 'gpt3' },
            { title: '🚀 DeepSeek V3', payload: 'deepseek_v3' }
        ];

        await this.sendQuickReplies(recipientId, '🧠 Choose your AI model:', quickReplies);
    }
}

const bot = new MessengerBot(config.pageAccessToken);

// Message Handler Class
class MessageHandler {
    async handleTextMessage(senderId, messageText) {
        const text = messageText.toLowerCase().trim();
        
        logger.info(`Processing message from ${senderId}`, { message: text });

        // Show typing indicator
        await bot.sendTypingIndicator(senderId);

        // Command handling
        if (text.startsWith('/')) {
            await this.handleCommand(senderId, text);
        } else if (text === 'menu' || text === 'start') {
            await bot.sendMainMenu(senderId);
        } else if (text === 'help') {
            await bot.sendHelpMenu(senderId);
        } else if (text.includes('spotify.com') || text.includes('open.spotify.com')) {
            await this.handleSpotifyDownload(senderId, text);
        } else {
            // Default to KAIZ AI for regular conversation
            await this.handleAIResponse(senderId, messageText, 'kaiz');
        }

        // Turn off typing indicator
        await bot.sendTypingIndicator(senderId, 'typing_off');
    }

    async handleCommand(senderId, command) {
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const message = parts.slice(1).join(' ');

        if (!message && !cmd.includes('menu')) {
            await bot.sendMessage(senderId, { 
                text: '❗ Please provide a message after the command.\nExample: /ai Hello, how are you?' 
            });
            return;
        }

        switch (cmd) {
            case '/ai':
            case '/kaiz':
                await this.handleAIResponse(senderId, message, 'kaiz');
                break;
            case '/gemini':
                await this.handleAIResponse(senderId, message, 'gemini');
                break;
            case '/gpt':
                await this.handleAIResponse(senderId, message, 'gpt');
                break;
            case '/deepseek':
                await this.handleAIResponse(senderId, message, 'deepseek');
                break;
            case '/spotify':
                await this.handleSpotifyDownload(senderId, message);
                break;
            default:
                await bot.sendMessage(senderId, { 
                    text: '❓ Unknown command. Type "help" to see available commands.' 
                });
        }
    }

    async handleAIResponse(senderId, message, model) {
        try {
            logger.info(`Getting ${model.toUpperCase()} response for user ${senderId}`);
            
            let response;
            let modelName;

            switch (model) {
                case 'kaiz':
                    response = await api.kaizAI(message, senderId);
                    modelName = '🤖 KAIZ AI';
                    break;
                case 'gemini':
                    response = await api.geminiPro(message, senderId);
                    modelName = '🔮 Gemini Pro';
                    break;
                case 'gpt':
                    response = await api.gpt3(message);
                    modelName = '💡 GPT-3';
                    break;
                case 'deepseek':
                    response = await api.deepseekV3(message);
                    modelName = '🚀 DeepSeek V3';
                    break;
            }

            if (response && response.response) {
                const aiMessage = `${modelName} Response:\n\n${response.response}`;
                await bot.sendMessage(senderId, { text: aiMessage });
                logger.success(`${model.toUpperCase()} response sent successfully`);
            } else {
                await bot.sendMessage(senderId, { 
                    text: '❗ Sorry, I couldn\'t process your request. Please try again.' 
                });
            }
        } catch (error) {
            logger.error(`Failed to get ${model} response`, error.message);
            await bot.sendMessage(senderId, { 
                text: '🔧 Technical error occurred. Please try again later.' 
            });
        }
    }

    async handleSpotifyDownload(senderId, url) {
        try {
            logger.info(`Processing Spotify download for user ${senderId}`);
            
            // Extract Spotify URL if it's embedded in text
            const spotifyUrlMatch = url.match(/(https?:\/\/(?:open\.)?spotify\.com\/[^\s]+)/);
            const spotifyUrl = spotifyUrlMatch ? spotifyUrlMatch[1] : url;

            if (!spotifyUrl.includes('spotify.com')) {
                await bot.sendMessage(senderId, { 
                    text: '❗ Please provide a valid Spotify URL.' 
                });
                return;
            }

            const response = await api.spotifyDownload(spotifyUrl);
            
            if (response && response.download_url) {
                const downloadButton = {
                    type: 'web_url',
                    title: '⬇️ Download Music',
                    url: response.download_url
                };

                const buttons = [downloadButton];
                
                if (response.preview_url) {
                    buttons.push({
                        type: 'web_url',
                        title: '🎵 Preview',
                        url: response.preview_url
                    });
                }

                const messageText = `🎵 ${response.title || 'Track'} by ${response.artist || 'Unknown Artist'}\n\nReady to download!`;
                
                await bot.sendButtonTemplate(senderId, messageText, buttons);
                logger.success('Spotify download link sent successfully');
            } else {
                await bot.sendMessage(senderId, { 
                    text: '❗ Could not process the Spotify link. Please check the URL and try again.' 
                });
            }
        } catch (error) {
            logger.error('Failed to process Spotify download', error.message);
            await bot.sendMessage(senderId, { 
                text: '🔧 Error processing Spotify link. Please try again later.' 
            });
        }
    }

    async handlePostback(senderId, payload) {
        logger.info(`Processing postback from ${senderId}`, { payload });

        switch (payload) {
            case 'GET_STARTED':
                await bot.sendWelcomeMessage(senderId);
                break;
            case 'AI_CHAT_MENU':
                await bot.sendAIMenu(senderId);
                break;
            case 'MUSIC_MENU':
                await bot.sendMessage(senderId, { 
                    text: '🎵 Send me a Spotify link to download music!' 
                });
                break;
            case 'HELP_MENU':
                await bot.sendHelpMenu(senderId);
                break;
            default:
                await bot.sendMainMenu(senderId);
        }
    }

    async handleQuickReply(senderId, payload) {
        logger.info(`Processing quick reply from ${senderId}`, { payload });

        switch (payload) {
            case 'ai_chat':
            case 'kaiz_ai':
                await bot.sendMessage(senderId, { 
                    text: '🤖 KAIZ AI activated! Send me any message or use /ai [your message]' 
                });
                break;
            case 'gemini_pro':
                await bot.sendMessage(senderId, { 
                    text: '🔮 Gemini Pro ready! Use /gemini [your message]' 
                });
                break;
            case 'gpt3':
                await bot.sendMessage(senderId, { 
                    text: '💡 GPT-3 activated! Use /gpt [your message]' 
                });
                break;
            case 'deepseek_v3':
                await bot.sendMessage(senderId, { 
                    text: '🚀 DeepSeek V3 ready! Use /deepseek [your message]' 
                });
                break;
            case 'music':
                await bot.sendMessage(senderId, { 
                    text: '🎵 Send me a Spotify link to download music!' 
                });
                break;
            case 'menu':
                await bot.sendMainMenu(senderId);
                break;
            case 'help':
                await bot.sendHelpMenu(senderId);
                break;
            default:
                await bot.sendMainMenu(senderId);
        }
    }

    async handleAttachment(senderId, attachments) {
        for (const attachment of attachments) {
            if (attachment.type === 'image') {
                await this.handleImageAnalysis(senderId, attachment.payload.url);
            } else {
                await bot.sendMessage(senderId, { 
                    text: '📎 I received your attachment. Currently, I can only analyze images.' 
                });
            }
        }
    }

    async handleImageAnalysis(senderId, imageUrl) {
        try {
            logger.info(`Analyzing image for user ${senderId}`);
            
            await bot.sendMessage(senderId, { 
                text: '🔍 Analyzing your image with KAIZ AI...' 
            });

            // Use KAIZ AI for image analysis
            const analysisPrompt = `Analyze this image: ${imageUrl}`;
            const response = await api.kaizAI(analysisPrompt, senderId);

            if (response && response.response) {
                const analysisMessage = `🖼️ Image Analysis Results:\n\n${response.response}`;
                await bot.sendMessage(senderId, { text: analysisMessage });
                logger.success('Image analysis completed successfully');
            } else {
                await bot.sendMessage(senderId, { 
                    text: '❗ Could not analyze the image. Please try again.' 
                });
            }
        } catch (error) {
            logger.error('Failed to analyze image', error.message);
            await bot.sendMessage(senderId, { 
                text: '🔧 Error analyzing image. Please try again later.' 
            });
        }
    }
}

const messageHandler = new MessageHandler();

// Auto-uptime and Health Check
class UptimeManager {
    constructor() {
        this.startTime = Date.now();
        this.healthCheckInterval = null;
    }

    start() {
        logger.info('Starting uptime manager');
        
        // Self-ping every 25 minutes to prevent sleeping
        this.healthCheckInterval = setInterval(async () => {
            try {
                const uptime = this.getUptime();
                logger.info(`Health check - Uptime: ${uptime}`);
                
                // Self-ping to keep alive
                if (process.env.REPLIT_DEPLOYMENT) {
                    await axios.get(`http://localhost:${config.port}/health`);
                }
            } catch (error) {
                logger.warning('Health check failed', error.message);
            }
        }, 25 * 60 * 1000); // 25 minutes
    }

    getUptime() {
        const uptimeMs = Date.now() - this.startTime;
        const uptimeSeconds = Math.floor(uptimeMs / 1000);
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    stop() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
    }
}

const uptimeManager = new UptimeManager();

// Routes
app.get('/', (req, res) => {
    const uptime = uptimeManager.getUptime();
    res.json({
        status: 'KAIZ Bot is running! 🤖',
        uptime: uptime,
        timestamp: new Date().toISOString(),
        features: [
            'Multi-AI Chat (KAIZ AI, Gemini Pro, GPT-3, DeepSeek V3)',
            'Spotify Music Downloader',
            'Image Analysis',
            'Interactive Buttons & Quick Replies',
            'Auto-uptime Management',
            'Aesthetic Rainbow Logging'
        ]
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        uptime: uptimeManager.getUptime(),
        timestamp: new Date().toISOString()
    });
});

// Webhook verification
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === config.verifyToken) {
            logger.success('Webhook verified successfully');
            res.status(200).send(challenge);
        } else {
            logger.error('Webhook verification failed');
            res.sendStatus(403);
        }
    }
});

// Webhook event handler
app.post('/webhook', async (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        for (const entry of body.entry) {
            for (const webhookEvent of entry.messaging) {
                const senderId = webhookEvent.sender.id;

                if (webhookEvent.message) {
                    if (webhookEvent.message.quick_reply) {
                        await messageHandler.handleQuickReply(senderId, webhookEvent.message.quick_reply.payload);
                    } else if (webhookEvent.message.attachments) {
                        await messageHandler.handleAttachment(senderId, webhookEvent.message.attachments);
                    } else if (webhookEvent.message.text) {
                        await messageHandler.handleTextMessage(senderId, webhookEvent.message.text);
                    }
                } else if (webhookEvent.postback) {
                    await messageHandler.handlePostback(senderId, webhookEvent.postback.payload);
                }
            }
        }
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Initialize bot
async function initializeBot() {
    await logger.loading('🚀 Initializing KAIZ Bot', 2000);
    
    logger.info('Bot configuration loaded');
    logger.info('API endpoints configured');
    logger.info('Webhook handlers registered');
    
    uptimeManager.start();
    
    app.listen(config.port, '0.0.0.0', () => {
        logger.success(`🌟 KAIZ Bot is running on port ${config.port}`);
        logger.info('Bot is ready to receive messages!');
        logger.info(`Health check endpoint: http://localhost:${config.port}/health`);
        
        if (process.env.REPLIT_DEPLOYMENT) {
            logger.success('🌍 Bot is deployed and accessible online!');
        }
    });
}

// Graceful shutdown
process.on('SIGINT', () => {
    logger.warning('Shutting down KAIZ Bot...');
    uptimeManager.stop();
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.warning('Shutting down KAIZ Bot...');
    uptimeManager.stop();
    process.exit(0);
});

// Start the bot
initializeBot().catch(error => {
    logger.error('Failed to initialize bot', error);
    process.exit(1);
});
