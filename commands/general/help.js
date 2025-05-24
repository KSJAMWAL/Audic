
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),
    async execute(context) {
        const embed = createEmbed({
            title: 'Available Commands',
            description: 'Here are all the available commands:',
            fields: [
                {
                    name: '🎵 Music',
                    value: '`/play`, `/pause`, `/resume`, `/skip`, `/stop`, `/queue`'
                },
                {
                    name: '🎚️ Filters',
                    value: '`/bassboost`, `/8d`, `/nightcore`, `/vaporwave`, `/karaoke`'
                },
                {
                    name: '⚙️ Utility',
                    value: '`/help`, `/ping`, `/invite`'
                }
            ]
        });

        return interaction.reply({ embeds: [embed] });
    }
};
