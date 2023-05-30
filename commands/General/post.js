const Discord = require("discord.js");

module.exports = {
    guildOnly: true,
    data: new Discord.SlashCommandBuilder()
        .setName("post")
        .setDescription("💬 Post a message to a channel!")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)

        .addStringOption(option => option
            .setName("message")
            .setDescription("What do you want to post?")
            .setRequired(true)    
        )
        
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Where do you want to post the message?")
            .addChannelTypes(Discord.ChannelType.GuildText)
            .setRequired(false)
        ),
    async execute(interaction) {
        
        const message = interaction.options.getString("message");
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        await channel.send({ content: message });
        await interaction.reply({ content: `Posted message in ${channel}!`, ephemeral: true });

        setTimeout(() => {
            interaction.deleteReply();
        }, 3000);
    },
};