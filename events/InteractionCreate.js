const Discord = require("discord.js");
const chalk = require("chalk");

module.exports = {
    name: Discord.Events.InteractionCreate,
    async execute(interaction) {

        /* Command Executed */
        if (interaction.isChatInputCommand()) {
            try {
                await interaction.client.commands.get(interaction.commandName).execute(interaction);
            } catch (error) {
                console.error(chalk.bold.redBright(error));
            };
        };

        /* Button Clicked */
        if (interaction.isButton()) {
            if (interaction.customId === "contact") {
                const check = interaction.channel.threads.cache.find(x => x.name === interaction.user.tag);

                if (check) {
                    await interaction.reply({ content: `You already have a ticket opened in ${check}!`, ephemeral: true });
                } else {
                    const row = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("create-ticket")
                            .setLabel("Continue")
                            .setStyle(Discord.ButtonStyle.Success)
                    );

                    await interaction.reply({ content: "## You're about to create a ticket!\n- **Hit 'continue' to proceed.**", components: [row], ephemeral: true });
                }
            };

            if (interaction.customId === "create-ticket") {
                await interaction.deferReply({ ephemeral: true });

                const thread = await interaction.channel.threads.create({
                    name: interaction.user.tag,
                    autoArchiveDuration: 60,
                    type: Discord.ChannelType.PrivateThread
                });

                const row = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("close-ticket")
                        .setLabel("Close Ticket")
                        .setStyle(Discord.ButtonStyle.Danger)
                );

                const msg = await thread.send({ components: [row] });
                await msg.pin();

                await thread.members.add(interaction.user);
                await thread.members.add("791222882499690519");

                await interaction.editReply({ content: `A new ticket has been opened for you in ${thread}!` });
            };

            if (interaction.customId === "close-ticket") await interaction.channel.delete();
        };

    },
};