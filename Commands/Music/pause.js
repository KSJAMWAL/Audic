const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, errorEmbed } = require('../../utils/embeds');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause or resume current playback'),

    async execute(context) {
        try {
            const { client } = context;
            const guildId = context.guildId;
            const member = context.member;
            const voiceChannel = member.voice?.channel;

            if (!voiceChannel) {
                return context.reply({ 
                    embeds: [errorEmbed('❌ You need to be in a voice channel to use this command!')], 
                    ephemeral: true 
                }).catch(console.error);
            }

            const player = client.kazagumo.players.get(guildId);

            if (!player) {
                return context.reply({ 
                    embeds: [errorEmbed('❌ There is no active player in this server!')], 
                    ephemeral: true 
                }).catch(console.error);
            }

            if (player.voiceId !== voiceChannel.id) {
                return context.reply({ 
                    embeds: [errorEmbed('❌ You must be in the same voice channel as the bot!')], 
                    ephemeral: true 
                }).catch(console.error);
            }

            const pausedState = player.paused;

            await player.pause(!pausedState);

            const statusEmbed = createEmbed({
                title: pausedState ? '▶ Playback Resumed' : '⏸️ Playback Paused',
                description: pausedState
                    ? 'The current playback has been resumed.'
                    : 'The current playback has been paused. Use `/pause` again to resume.',
                footer: { text: `Requested by ${context.user.tag}` },
                timestamp: new Date()
            });

            await context.reply({ embeds: [statusEmbed] }).catch(console.error);
        } catch (error) {
            logger.error("Error in /pause command:", error);
            await context.reply({ 
                embeds: [errorEmbed('❌ An unexpected error occurred while pausing/resuming playback.')], 
                ephemeral: true 
            }).catch(() => {});
        }
    },
};