const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client();

client.on("ready", async () => {
  console.log(`${client.user.username} logged in`);

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false
  });

  console.log("Joined voice channel");
});

client.login(process.env.TOKEN);
