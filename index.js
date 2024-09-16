const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,   // اضافه کردن این intent برای دسترسی به اعضای سرور
        GatewayIntentBits.GuildPresences, // این intent برای دسترسی به وضعیت آنلاین اعضا
        GatewayIntentBits.GuildMessages
    ]
});

const TOKEN = process.env.DISCORD_TOKEN; // استفاده از متغیر محیطی
const CHANNEL_ID = process.env.CHANNEL_ID; // استفاده از متغیر محیطی
const CATEGORY_IDS = process.env.CATEGORY_IDS.split(','); // لیست ID های دسته‌بندی‌های مورد نظر

const statusMessages = [
    "Listening to 👥 ${totalMembers} Members",
    "Listening to 🟢 ${onlineMembers} online members",
    "Playing SunSet RP",
    "Watching 📩 ${channelCount} Channels"
];

let currentStatusIndex = 0;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // استفاده از تاخیر ۵ ثانیه‌ای برای اطمینان از دریافت صحیح کانال‌ها
    setTimeout(() => {
        setInterval(updatePresence, 1000); // به‌روزرسانی هر یک ثانیه
        setInterval(toggleStatusMessage, 5000); // تغییر وضعیت هر ۵ ثانیه
    }, 5000);
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (newPresence.guild.id === 'YOUR_GUILD_ID') {
        updatePresence();
    }
});

async function updatePresence() {
    try {
        console.log(`Trying to fetch channel with ID: ${CHANNEL_ID}`); // چاپ کردن CHANNEL_ID
        const channel = await client.channels.fetch(CHANNEL_ID);
        
        // بررسی اینکه آیا کانال پیدا شده است یا خیر
        if (!channel) return console.error('Channel not found!');
        console.log(`Successfully fetched channel: ${channel.name}`); // چاپ نام کانال در صورت موفقیت

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
            const category = await client.channels.fetch(categoryId); // fetch برای دسته‌بندی‌ها
            if (category && category.type === 4) { // 4: GUILD_CATEGORY
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
    updatePresence(); // به‌روزرسانی وضعیت
}

client.login(TOKEN);
