const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("achievement")
        .setDescription("🏆 Create a minecraft achievement!")
        .addStringOption(option => option
            .setName("name")
            .setDescription("Name text")
            .setRequired(true)
            .setMaxLength(32)    
        ),
    async execute(interaction) {
        const name = interaction.options.getString("name");
        const attachment = new Discord.AttachmentBuilder(`https://api.alexflipnote.dev/achievement?text=${name}`)
            .setName(`${name}.png`);

        await interaction.reply({ files: [attachment] });
    },
};