const { createEmbed, errorEmbed } = require('../utils/embeds');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');
const fs = require('fs');
const path = require('path');

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
        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            // Look for the command in the Commands directory
            let command;
            const commandsPath = path.join(__dirname, '..', 'Commands');
            const categories = fs.readdirSync(commandsPath).filter(file => 
                fs.statSync(path.join(commandsPath, file)).isDirectory()
            );

            // Search for the command file in each category
            for (const category of categories) {
                const categoryPath = path.join(commandsPath, category);
                const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
                
                for (const file of commandFiles) {
                    if (file.toLowerCase() === `${commandName}.js`) {
                        command = require(path.join(categoryPath, file));
                        break;
                    }
                }
                if (command) break;
            }

            if (!command) {
                return message.reply({ 
                    embeds: [errorEmbed(`Command \`${commandName}\` not found!`)]
                });
            }

            try {
                await command.execute(message, args);
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