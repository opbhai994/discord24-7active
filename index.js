const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const http = require("http");

const client = new Client();

// HTTP server to keep Render service alive (port forwarding)
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is running!\n");
});

server.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

client.on("ready", async () => {
  console.log(`${client.user.username} logged in`);

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false,
  });

  console.log("Joined voice channel");
});

// Auto-reconnect on disconnect
client.on("disconnect", () => {
  console.log("Bot disconnected. Reconnecting...");
  client.login(process.env.TOKEN);
});

client.on("error", (err) => {
  console.error("Client error:", err);
});

client.login(process.env.TOKEN);
