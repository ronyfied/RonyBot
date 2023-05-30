const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
    guildOnly: true,
    data: new SlashCommandBuilder()
        .setName("recaptcha")
        .setDescription("🤖 Are you a robot?")
        .addStringOption(option => option
            .setName("text")
            .setDescription("Enter text")
            .setRequired(true)
            .setMaxLength(64)    
        ),
    async execute(interaction) {
        const text = interaction.options.getString("text");
        const attachment = new AttachmentBuilder(`https://api.alexflipnote.dev/captcha?text=${text}`)
            .setName(`${text}.png`);

        await interaction.reply({ files: [attachment] });
    },
};