
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, errorEmbed } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle loop mode for the current track')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Loop mode to set')
                .setRequired(true)
                .addChoices(
                    { name: 'Track', value: 'track' },
                    { name: 'Queue', value: 'queue' },
                    { name: 'Off', value: 'off' }
                )),
    async execute(interaction) {
        const player = interaction.client.kazagumo.players.get(interaction.guild.id);
        
        if (!player) {
            return interaction.reply({ embeds: [errorEmbed('No music is currently playing!')] });
        }

        const mode = interaction.options.getString('mode');
        
        switch(mode) {
            case 'track':
                player.setLoop('track');
                return interaction.reply({ embeds: [createEmbed({ description: '🔁 Now looping the current track!' })] });
            case 'queue':
                player.setLoop('queue');
                return interaction.reply({ embeds: [createEmbed({ description: '🔁 Now looping the entire queue!' })] });
            case 'off':
                player.setLoop('none');
                return interaction.reply({ embeds: [createEmbed({ description: '➡️ Loop mode disabled!' })] });
        }
    }
};
