const Discord = require("discord.js");

module.exports = {
    guildOnly: true,
    data: new Discord.SlashCommandBuilder()
        .setName("8ball")
        .setDescription("🎱 Ask the magical 8ball anything!")

        .addStringOption(option => option
            .setName("question")
            .setDescription("Enter a question to ask!")
            .setRequired(true)    
        ),
    async execute(interaction) {

        await interaction.deferReply();
        const question = interaction.options.getString("question");

        fetch(`https://www.eightballapi.com/api/biased?question=${question}&lucky=true`)
            .then(response => response.json())
            .then(data => {
                const embed = new Discord.EmbedBuilder()
                    .setAuthor({ name: question, iconURL: interaction.user.displayAvatarURL() })
                    .setDescription(`${data.reading}`)
                    .setColor("#2B2D31");
                
                interaction.editReply({ embeds: [embed] });
            });
    },
};