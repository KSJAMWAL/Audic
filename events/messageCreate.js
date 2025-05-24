const { createEmbed, errorEmbed } = require('../utils/embeds');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        const { client } = message;

        // Ignore messages from bots
        if (message.author.bot) return;

        // Get prefix from config
        const prefix = config.prefix;

        // Check if message starts with prefix or is a bot mention
        if (message.content.trim() === `<@${client.user.id}>` || message.content.trim() === `<@!${client.user.id}>`) {
            const embed = createEmbed({
                title: `${config.botName} - Music Bot`,
                description: config.botDescription,
                fields: [
                    {
                        name: 'Prefix',
                        value: `\`${config.prefix}\` or </help:0>`,
                        inline: true
                    },
                    {
                        name: 'Commands',
                        value: 'Use `/help` to see all commands',
                        inline: true
                    }
                ],
                thumbnail: config.botLogo
            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Invite Me')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`),
                    new ButtonBuilder()
                        .setLabel('Support Server')
                        .setStyle(ButtonStyle.Link)
                        .setURL(config.supportServer)
                );

            return message.reply({ embeds: [embed], components: [row] });
        }

        // Handle prefix commands
        const prefix = config.prefix;
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = client.commands.get(commandName);
            if (!command) return;

            try {
                // Create a hybrid context that mimics interaction properties
                const hybridContext = {
                    client: message.client,
                    guild: message.guild,
                    channel: message.channel,
                    member: message.member,
                    user: message.author,
                    options: {
                        getString: (name) => args[0],
                        getNumber: (name) => Number(args[0]),
                        getInteger: (name) => parseInt(args[0]),
                        getBoolean: (name) => args[0]?.toLowerCase() === 'true',
                    },
                    reply: async (content) => {
                        if (content.ephemeral) {
                            return message.author.send(content);
                        }
                        return message.channel.send(content);
                    },
                    deferReply: async () => Promise.resolve(),
                    editReply: async (content) => message.channel.send(content),
                    isCommand: () => false,
                    isMessageCommand: () => true
                };

                await command.execute(hybridContext);
            } catch (error) {
                console.error(error);
                message.reply({ 
                    embeds: [errorEmbed('There was an error executing that command!')] 
                }).catch(console.error);
            }
            return;
        }
    },
};