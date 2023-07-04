const Discord = require("discord.js");
const chalk = require("chalk");
const mongoose = require("mongoose");
const fs = require("node:fs");
require("dotenv/config");

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildPresences,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildMessageReactions
    ],

    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.Reaction
    ],

    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: false
    }
});

/* Event Handler */
console.log(chalk.bold.yellowBright("Loading Events ..."));
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args));
};

// Slash Command Handler
console.log(chalk.bold.yellowBright("Loading Commands ..."));
client.commands = new Discord.Collection();
const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commands) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

/* Anti Crash */
process.on("unhandledRejection", (reason, p) => {
    console.log(chalk.bold.redBright("[antiCrash] :: Unhandled Rejection/Catch"));
    console.log(reason?.stack, p);
});

process.on("uncaughtException", (err, origin) => {
    console.log(chalk.bold.redBright("[antiCrash] :: ncaught Exception/Catch"));
    console.log(err?.stack, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(chalk.bold.redBright("[antiCrash] :: Uncaught Exception/Catch (MONITOR)"));
    console.log(err?.stack, origin);
});

/* Connect to MongoDB */
mongoose.connect(process.env.MONGODBURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(chalk.bold.greenBright("Connected to database")))
    .catch(error => console.error(chalk.bold.redBright(error)));

/* Client Login */
client.login(process.env.TOKEN).then(() => {
    console.log(chalk.bold.greenBright(`Logged in as ${client.user.username}`));

    client.user.setActivity("DMs", { type: Discord.ActivityType.Watching });
    client.user.setStatus("dnd");
});