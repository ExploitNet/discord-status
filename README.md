# Discord Status Bot

This project is a Discord bot that automatically updates its status message in a Discord server based on server statistics, such as total members, online members, and open ticket channels. The bot also provides an Express web endpoint for a simple status response.

## Features
- Updates status message periodically with live server data
- Can post updates to a specified text channel (customize in code)
- Simple web server endpoint for bot status

## Requirements
- Node.js (v16 or newer recommended)
- A Discord bot token ([see Discord Developer Portal](https://discord.com/developers/applications))

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ExploitNet/discord-status.git
   cd discord-status
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file**
   In the project root, create a `.env` file with your Discord bot token:
   ```env
   TOKEN=your_discord_bot_token_here
   ```

4. **(Optional) Edit Bot Configuration**
   - To update the guild/server ID, text channel ID, or watched categories, edit the related IDs in `index.js`.

5. **Run the Bot**
   ```bash
   npm start
   ```
   The bot will output logs in your terminal.

6. **Access the Web Endpoint**
   The server also exposes a basic endpoint at [http://localhost:3000/](http://localhost:3000/).

## Customization
- **Change Status Messages:**  Edit the `statusMessages` array in `index.js`.
- **Target Discord Server/Guild:**  Update the guild and category IDs in `index.js` to match your server's IDs.
- **Send Message to Channel:**  Set a valid channel ID in the `channelId` variable to enable message posting.

## License
This project is licensed under the MIT License.

## Credits
Developed by [ImSoheil](https://t.me/ImSoheilOfficial)
