const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages
    ]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const CATEGORY_IDS = process.env.CATEGORY_IDS.split(',');

const statusMessages = [
    "Listening to 👥 ${totalMembers} Members",
    "Listening to 🟢 ${onlineMembers} online members",
    "Playing SunSet RP",
    "Watching 📩 ${channelCount} Channels"
];

let currentStatusIndex = 0;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(updatePresence, 1000);
    setInterval(toggleStatusMessage, 5000);
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (newPresence.guild.id === 'YOUR_GUILD_ID') {
        updatePresence();
    }
});

async function updatePresence() {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (!channel) return console.error('Channel not found!');

        const onlineMembers = channel.members.filter(member => member.presence?.status === 'online').size;
        const totalMembers = channel.guild.memberCount;
        const channelCount = await getChannelCount();

        // جایگزین کردن مقادیر دینامیک در پیام وضعیت فعلی
        let activityText = statusMessages[currentStatusIndex]
            .replace('${onlineMembers}', onlineMembers)
            .replace('${totalMembers}', totalMembers)
            .replace('${channelCount}', channelCount);

        client.user.setActivity(activityText, { type: 'LISTENING' });
    } catch (error) {
        console.error('Error updating presence:', error);
    }
}

async function getChannelCount() {
    try {
        let count = 0;
        for (const categoryId of CATEGORY_IDS) {
            const category = await client.channels.fetch(categoryId);
            if (category && category.type === 4) {
                const channels = category.children.filter(c => c.type === 0 || c.type === 2); // 0: GUILD_TEXT, 2: GUILD_VOICE
                count += channels.size;
            }
        }
        return count;
    } catch (error) {
        console.error('Error fetching channel count:', error);
        return 'Error';
    }
}

function toggleStatusMessage() {
    currentStatusIndex = (currentStatusIndex + 1) % statusMessages.length;
    updatePresence();
}

client.login(TOKEN);
