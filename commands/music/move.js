
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move a song to a different position in the queue')
        .addIntegerOption(option => 
            option.setName('from')
            .setDescription('Current position of the song')
            .setRequired(true))
        .addIntegerOption(option => 
            option.setName('to')
            .setDescription('New position for the song')
            .setRequired(true)),
    async execute(interaction) {
        const player = interaction.client.kazagumo.players.get(interaction.guild.id);
        
        if (!player) {
            return interaction.reply({ embeds: [errorEmbed('No music is currently playing!')] });
        }

        const from = interaction.options.getInteger('from');
        const to = interaction.options.getInteger('to');

        if (from < 1 || to < 1 || from > player.queue.length || to > player.queue.length) {
            return interaction.reply({ embeds: [errorEmbed('Invalid position numbers!')] });
        }

        const track = player.queue.remove(from - 1)[0];
        player.queue.add(track, to - 1);

        return interaction.reply({ embeds: [createEmbed({ description: `Moved **${track.title}** to position ${to}!` })] });
    }
};
