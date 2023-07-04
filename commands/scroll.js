const Discord = require("discord.js");

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("scroll")
        .setDescription("📜 The scroll of truth...")
        
        .addStringOption(option => option
            .setName("text")
            .setDescription("Enter text")
            .setRequired(true)
            .setMaxLength(52)    
        ),
    async execute(interaction) {
        const text = interaction.options.getString("text");
        const attachment = new Discord.AttachmentBuilder(`https://api.alexflipnote.dev/scroll?text=${text}`)
            .setName(`${text}.png`);

        await interaction.reply({ files: [attachment] });
    },
};