const Discord = require("discord.js");

module.exports = {
    guildOnly: true,
    data: new Discord.SlashCommandBuilder()
        .setName("meme")
        .setDescription("🔥 Get a random meme from the internet!"),
    async execute(interaction) {
        fetch("https://www.reddit.com/r/memes/random/.json")
            .then(async r => {

                let meme = await r.json();

                let title = meme[0].data.children[0].data.title;
                let image = meme[0].data.children[0].data.url;

                const embed = new Discord.EmbedBuilder()
                    .setColor("#2b2d31")
                    .setTitle(`${title}`)
                    .setImage(`${image}`);

                await interaction.reply({ embeds: [embed ]});
            });
    },
};