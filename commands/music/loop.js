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
    async execute(context) {
        const player = context.client.kazagumo.players.get(context.guild.id);

        if (!player) {
            return context.reply({ embeds: [errorEmbed('No music is currently playing!')] });
        }

        const mode = context.options.getString('mode');

        switch(mode) {
            case 'track':
                player.setLoop('track');
                return context.reply({ embeds: [createEmbed({ description: '🔁 Now looping the current track!' })] });
            case 'queue':
                player.setLoop('queue');
                return context.reply({ embeds: [createEmbed({ description: '🔁 Now looping the entire queue!' })] });
            case 'off':
                player.setLoop('none');
                return context.reply({ embeds: [createEmbed({ description: '➡️ Loop mode disabled!' })] });
        }
    }
};