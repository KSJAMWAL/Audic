
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, errorEmbed } = require('../../utils/embeds');
const { applyFilter, getActiveFilter } = require('../../utils/filters');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lowpass')
        .setDescription('Applies a lowpass filter to the audio'),
    async execute(interaction) {
        const player = interaction.client.kazagumo.players.get(interaction.guild.id);
        
        if (!player) {
            return interaction.reply({ embeds: [errorEmbed('No music is currently playing!')] });
        }

        try {
            await applyFilter(player, 'lowpass');
            return interaction.reply({ embeds: [createEmbed({ description: 'Applied lowpass filter!' })] });
        } catch (error) {
            return interaction.reply({ embeds: [errorEmbed('Failed to apply lowpass filter.')] });
        }
    }
};
