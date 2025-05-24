
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, errorEmbed } = require('../../utils/embeds');
const { applyFilter } = require('../../utils/filters');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nightcore')
        .setDescription('Applies a nightcore filter to the music'),
    async execute(interaction) {
        const player = interaction.client.kazagumo.players.get(interaction.guild.id);
        
        if (!player) {
            return interaction.reply({ embeds: [errorEmbed('No music is currently playing!')] });
        }

        try {
            await applyFilter(player, 'nightcore');
            return interaction.reply({ embeds: [createEmbed({ description: 'Applied nightcore filter!' })] });
        } catch (error) {
            return interaction.reply({ embeds: [errorEmbed('Failed to apply nightcore filter.')] });
        }
    }
};
