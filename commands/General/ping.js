const Discord = require("discord.js");

module.exports = {
    guildOnly: true,
    data: new Discord.SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓 Replies with pong!"),
    async execute(interaction) {
        await interaction.reply({ content: "Pong!", ephemeral: true });
    },
};