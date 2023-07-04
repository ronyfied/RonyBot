const Discord = require("discord.js");
const chalk = require("chalk");

module.exports = {
    name: "interactionCreate",
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
            
        };

        /* Select Menu */
        if (interaction.isStringSelectMenu()) {

        };

        /* Modal Submitted */
        if (interaction.isModalSubmit()) {

        };
    },
};