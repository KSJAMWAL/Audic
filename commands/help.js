const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const labelMap = {
    music_commands: '🎵 Music',
    filter_commands: '🎛️ Filters',
    utility_commands: '⚙️ Utility',
    support_server: '👀 Support'
};

const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('**Helping your server stay smooth & efficient!**'),

    async execute(interaction) {
        // Create buttons for each category
        const musicButton = new ButtonBuilder()
            .setCustomId('music_commands')
            .setLabel('🎵 Music')
            .setStyle(ButtonStyle.Primary);

        const filtersButton = new ButtonBuilder()
            .setCustomId('filter_commands')
            .setLabel('🎛️ Filters')
            .setStyle(ButtonStyle.Secondary);

        const utilityButton = new ButtonBuilder()
            .setCustomId('utility_commands')
            .setLabel('⚙️ Utility')
            .setStyle(ButtonStyle.Success);

        const supportButton = new ButtonBuilder()
            .setCustomId('support_server')
            .setLabel('👀 Support')
            .setStyle(ButtonStyle.Success);

        // Create an action row with the buttons
        const row = new ActionRowBuilder()
            .addComponents(musicButton, filtersButton, utilityButton, supportButton);

        await interaction.reply({
            content: '**From Ideas To Impact**',
            components: [row]
        });
    }
};
