const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    guildOnly: true,
    data: new SlashCommandBuilder()
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
        const attachment = new AttachmentBuilder(`https://api.alexflipnote.dev/achievement?text=${name}`)
            .setName(`${name}.png`);

        await interaction.reply({ files: [attachment] });
    },
};