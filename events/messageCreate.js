const Discord = require("discord.js");
const config = require("../config.json");
require("dotenv/config");

const modmailSchema = require("../utils/schemas/modmail");

const { createTranscript } = require("discord-html-transcripts");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        const guild = await message.client.guilds.cache.get(process.env.GUILDID);

        /* Direct Messages */
        if (message.channel.type === Discord.ChannelType.DM) {
            if (message.author.bot) return;

            const member = message.author;

            let data = await modmailSchema.findOne({ guild: guild.id, user: member });

            if (!data) {
                await modmailSchema.create({ guild: guild.id, user: member.id });
            } else {
                await modmailSchema.create({ guild: guild.id, user: member.id });
            };

            if (message.attachments.size > 0) {
                await message.react(config.Emojis.Cross);
                return message.reply("Failed to send this message!");
            };

            const channel = await guild.channels.cache.find(c => c.topic === `UserID: ${message.author.id}`);

            if (channel) {
                await message.react(config.Emojis.Tick);

                const embed = new Discord.EmbedBuilder()
                    .setColor(config.Colors.Gray)
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setDescription(message.content);

                await channel.send({ embeds: [embed] });
                return;
            };

            const category = await guild.channels.cache.get(config.Channels.ModmailCategory);

            const newChannel = await guild.channels.create({
                name: `${message.author.username}`,
                type: Discord.ChannelType.GuildText,
                parent: category,
                topic: `UserID: ${message.author.id}`
            });

            const initialEmbed = new Discord.EmbedBuilder()
                .setColor(config.Colors.Success)
                .setDescription(config.Strings.ModmailTicketOpenMessage.replace("[guild]", guild.name));

            await member.send({ embeds: [initialEmbed] }).catch(err => { return; });

            const embed = new Discord.EmbedBuilder()
                .setColor(config.Colors.Gray)
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription(message.content);

            const row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("close-ticket")
                    .setLabel("Close Ticket")
                    .setStyle(Discord.ButtonStyle.Danger)
            );

            const msg = await newChannel.send({ embeds: [embed], components: [row] });

            const collector = msg.createMessageComponentCollector();

            collector.on("collect", async interaction => {
                if (interaction.customId === "close-ticket") {
                    const transcript = await createTranscript(newChannel, {
                        limit: -1,
                        filename: `${message.author.username}.html`,
                        footerText: "‎",
                        poweredBy: false,
                        saveImages: false,
                        returnType: "attachment"
                    });

                    await newChannel.delete();
                    const transcriptsChannel = await guild.channels.cache.find(c => c.id === config.Channels.Transcripts);

                    const logTranscript = await transcriptsChannel.send({ files: [transcript] });

                    const transcriptEmbed = new Discord.EmbedBuilder()
                        .setAuthor({ name: `${message.author.username}.html` })
                        .addFields(
                            { name: "Opened by", value: `${message.author}`, inline: true },
                            { name: "Closed by", value: `${interaction.user}`, inline: true }
                        )
                        .setThumbnail(message.author.displayAvatarURL())
                        .setColor(config.Colors.Gray);

                    const transcriptRow = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setLabel("View Transcript")
                            .setURL(`https://mahto.id/chat-exporter?url=${logTranscript.attachments.first()?.url}`)
                    );

                    await transcriptsChannel.send({ embeds: [transcriptEmbed], components: [transcriptRow] });
                    await logTranscript.delete();

                    const closeEmbed = new Discord.EmbedBuilder()
                        .setColor(config.Colors.Error)
                        .setDescription(config.Strings.ModmailTicketCloseMessage);

                    const row = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setLabel("View Transcript")
                            .setURL(`https://mahto.id/chat-exporter?url=${logTranscript.attachments.first()?.url}`)
                    );

                    await member.send({ embeds: [closeEmbed], components: [row] });
                };
            });

            await msg.pin();
            await message.react(config.Emojis.Tick);
        };

        /* Guild Channels */
        if (message.channel.type === Discord.ChannelType.GuildText) {        
            if (message.channel.name.startsWith(config.Emojis.Lock)) {
                if (message.author.bot) return;

                const data = await modmailSchema.findOne({ guild: guild.id, user: message.channel.topic.slice(8) });

                if (!data) return;

                const channel = await guild.channels.cache.find(c => c.topic === `UserID: ${data.user}`);

                if (message.channel === channel) {
                    const member = await message.client.users.fetch(data.user);

                    if (message.attachments.size > 0) {
                        await message.react(config.Emojis.Cross);
                        return message.reply({ content: "Failed to send this message!" });
                    };

                    await message.react(config.Emojis.Tick);

                    const embed = new Discord.EmbedBuilder()
                        .setColor(config.Colors.Gray)
                        .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                        .setDescription(`${message.content}`);

                    await member.send({ embeds: [embed] });
                };
            };
        };
    },
};