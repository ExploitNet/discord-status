const { Client, GatewayIntentBits, ActivityType, TextChannel } = require('discord.js');
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Devil Bot Status Changed');
});
app.listen(port, () => {
  console.log(` Listening to Devil: http://localhost:${port}`);
  console.log(` Developed By DevMrZeRo#0000`);
});

const serverInfo = {};

async function getServerInfo(guild) {
  const totalMembers = guild.memberCount;
  console.log(`Total members: ${totalMembers}`);

  const members = await guild.members.fetch();
  const onlineMembers = members.filter(member => member.presence && member.presence.status === 'online').size;
  console.log(`Online members: ${onlineMembers}`);

  const categoryIds = ['1215219758228709426', '1215219807134162944', '1215219724900634694', '1215219675970142228'];
  let totalChannels = 0;
  for (const categoryId of categoryIds) {
    const category = guild.channels.cache.get(categoryId);
    if (category) {
      totalChannels += category.children.cache.size;
    }
  }
  console.log(`Total channels: ${totalChannels}`);

  serverInfo.totalMembers = totalMembers;
  serverInfo.onlineMembers = onlineMembers;
  serverInfo.totalChannels = totalChannels;
}

let currentIndex = 0;
const channelId = '';

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log(`|    Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

function updateStatusAndSendMessages() {
  const statusMessages = [
    `Listening to 👥 ${serverInfo.totalMembers} Members`,
    `Listening to 🟢 ${serverInfo.onlineMembers} Online Members`,
    `Watching 📩 ${serverInfo.totalChannels} Open Tickets`,
  ];

  const currentStatus = statusMessages[currentIndex];
  const nextStatus = statusMessages[(currentIndex + 1) % statusMessages.length];

  client.user.setPresence({
    activities: [{ name: currentStatus, type: ActivityType.Custom}],
    status: 'dnd',
  });

  const textChannel = client.channels.cache.get(channelId);

  if (textChannel instanceof TextChannel) {
    textChannel.send(`Bot status is: ${currentStatus}`);
  } else {

  }

  currentIndex = (currentIndex + 1) % statusMessages.length;
}

client.once('ready', () => {
  console.log(`|    Bot is ready as ${client.user.tag}`);

  const guild = client.guilds.cache.get('1214943889778020392');
  if (!guild) {
    console.error(`Guild not found: 1214943889778020392`);
    return;
  }

  async function updateServerInfo() {
    await getServerInfo(guild);
  }

  updateServerInfo();
  updateStatusAndSendMessages();

  setInterval(() => {
    updateServerInfo();
    updateStatusAndSendMessages();
  }, 10000);
});

login();
