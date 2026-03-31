const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');
require('dotenv').config();

// --- WEB SERVER SETUP (For cron-job.org and Render) ---
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is active and running!');
});

app.listen(port, () => {
    console.log(`Dummy web server listening on port ${port}`);
});

// --- DISCORD BOT SETUP ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const guildId = process.env.GUILD_ID;
    const channelId = process.env.VOICE_CHANNEL_ID;

    try {
        const guild = await client.guilds.fetch(guildId);
        const channel = await guild.channels.fetch(channelId);

        if (!channel || !channel.isVoiceBased()) {
            console.error('Voice channel not found or is not a voice channel.');
            return;
        }

        // Join the voice channel and stay muted/deafened to save bandwidth
        joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true
        });

        console.log('Successfully connected to the voice channel!');
    } catch (error) {
        console.error('Error connecting to the channel:', error);
    }
});

// Log in using the token from Render's Environment Variables
client.login(process.env.DISCORD_TOKEN);
