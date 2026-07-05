const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.DISCORD_TOKEN;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("?ask ")) {
    const vraag = message.content.replace("?ask ", "");

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: vraag }]
      })
    });

    const data = await res.json();
    message.reply(data.choices[0].message.content);
  }
});

client.login(process.env.DISCORD_TOKEN);
