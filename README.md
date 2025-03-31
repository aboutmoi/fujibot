# Discord Bot Fujifilm X100VI

This Discord bot monitors the availability of the Fujifilm X100VI on the official Fujifilm website and sends notifications to a specific Discord channel.

## Features

- Automatic checking every 5 minutes
- Startup message with @everyone
- Regular product status updates
- Special notification with @everyone when product becomes available
- Logs in console and Discord channel
- HTTP and network error handling
- Automatic restart on crash (with PM2)

## Prerequisites

- Node.js (v16 or higher)
- A Discord server
- A Discord bot with necessary permissions
- A VPS (optional, for 24/7 operation)

## Local Installation

1. Clone this repository or download the files
2. Install dependencies:
```bash
npm install
```

## Configuration

1. Create a Discord bot on the [Discord Developer Portal](https://discord.com/developers/applications)
2. Copy your bot token
3. Modify the `bot.js` file and replace:
   - `VOTRE_TOKEN_DISCORD_ICI` with your bot token
   - `VOTRE_CHANNEL_ID_ICI` with the Discord channel ID where you want to receive notifications

## VPS Installation (Ubuntu/Debian)

1. Connect to your VPS:
```bash
ssh root@VOTRE_IP
```

2. Update the system:
```bash
apt update && apt upgrade -y
```

3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

4. Verify installation:
```bash
node --version
npm --version
```

5. Create project directory:
```bash
mkdir /root/botfuji
cd /root/botfuji
```

6. Create `package.json`:
```bash
npm init -y
```

7. Install dependencies:
```bash
npm install discord.js axios cheerio
```

8. Create `bot.js` file and copy the provided code

9. Install PM2 for process management:
```bash
npm install -g pm2
```

10. Start the bot with PM2:
```bash
pm2 start bot.js --name botfuji
```

11. Configure automatic startup:
```bash
pm2 startup
pm2 save
```

## Useful PM2 Commands

- Check bot status: `pm2 status`
- View logs: `pm2 logs botfuji`
- Restart bot: `pm2 restart botfuji`
- Stop bot: `pm2 stop botfuji`

## Usage

The bot will send:
- A startup message with @everyone
- Regular updates every 5 minutes
- A special notification with @everyone when the product becomes available

## Troubleshooting

If the bot is not responding:
1. Check logs with `pm2 logs botfuji`
2. Ensure your Discord token is correct
3. Verify the channel ID is correct
4. Restart the bot with `pm2 restart botfuji`

## Security

- Never share your Discord token
- Keep your system updated
- Use strong passwords
- Limit bot permissions to minimum necessary 
