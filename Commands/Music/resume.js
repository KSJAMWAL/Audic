const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, errorEmbed } = require('../../utils/embeds');
const config = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume playback'),

    async execute(context) {
        try {
            const { client } = interaction;
            const guildId = interaction.guildId;
            const member = interaction.member;
            const voiceChannel = member.voice?.channel;

            if (!voiceChannel) {
                return interaction.reply({ 
                    embeds: [errorEmbed('❌ You need to be in a voice channel to use this command!')], 
                    ephemeral: true 
                }).catch(console.error);
            }

            const player = client.kazagumo.players.get(guildId);

            if (!player) {
                return interaction.reply({ 
                    embeds: [errorEmbed('❌ There is no active player in this server!')], 
                    ephemeral: true 
                }).catch(console.error);
            }

            if (player.voiceId !== voiceChannel.id) {
                return interaction.reply({ 
                    embeds: [errorEmbed('❌ You must be in the same voice channel as the bot!')], 
                    ephemeral: true 
                }).catch(console.error);
            }

            if (!player.paused) {
                return interaction.reply({ 
                    embeds: [errorEmbed('❌ The player is already playing!')], 
                    ephemeral: true 
                }).catch(console.error);
            }

            await player.pause(false);

            const resumeEmbed = createEmbed({
                title: '▶ Playback Resumed',
                description: 'The current playback has been resumed.',
                footer: { text: `Requested by ${interaction.user.tag}` },
                timestamp: new Date()
            });

            await interaction.reply({ embeds: [resumeEmbed] }).catch(console.error);
        } catch (error) {
            logger.error("Error in /resume command:", error);
            await interaction.reply({ 
                embeds: [errorEmbed('❌ An unexpected error occurred while resuming playback.')], 
                ephemeral: true 
            }).catch(() => {});
        }
    },
};