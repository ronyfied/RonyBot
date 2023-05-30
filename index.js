const Discord = require("discord.js");
const chalk = require("chalk");
const fs = require("node:fs");
const config = require("./config.json");

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

/* Event Handler */
console.log(chalk.bold.yellowBright("Loading Events ..."));
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args));
};

/* Command Handler */
console.log(chalk.bold.yellowBright("Loading Commands ..."));
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    };
};

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

/* Client Login */
client.login(config.token).then(() => {
    console.log(chalk.bold.greenBright(`Logged in as ${client.user.tag}`));
});