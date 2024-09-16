const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages] });

const TOKEN = process.env.DISCORD_TOKEN; // استفاده از متغیر محیطی
const CHANNEL_ID = process.env.CHANNEL_ID; // استفاده از متغیر محیطی

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(updatePresence, 1000); // به‌روزرسانی هر یک ثانیه
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (newPresence.guild.id === 'YOUR_GUILD_ID') {
        updatePresence();
    }
});

async function updatePresence() {
    try {
        const channel = client.channels.cache.get(CHANNEL_ID);
        if (!channel) return console.error('Channel not found!');

        const members = channel.members.filter(member => member.presence?.status === 'online').size;
        client.user.setActivity(`Online members: ${members}`, { type: 'LISTENING' });
    } catch (error) {
        console.error('Error updating presence:', error);
    }
}

client.login(TOKEN);
