const { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionResponse, StringSelectMenuBuilder } = require('discord.js');
const { createEmbed, errorEmbed, successEmbed } = require('../utils/embeds');
const config = require('../config');
const logger = require('../utils/logger');

// Helper function to create volume bar for volume buttons
function createVolumeBar(volume) {
    const maxBars = 10;
    const filledBars = Math.round((volume / 100) * maxBars);
    const emptyBars = maxBars - filledBars;

    return '▓'.repeat(filledBars) + '░'.repeat(emptyBars);
}

// Helper function to safely respond to interactions
async function safeReply(interaction, options) {
    try {
        // Use flags.ephemeral instead of ephemeral to avoid deprecation warnings
        if (options.ephemeral) {
            options.flags = { ephemeral: true };
            delete options.ephemeral;
        }

        // Only attempt to reply if the interaction hasn't been replied to
        if (interaction.replied || interaction.deferred) {
            return await interaction.followUp(options).catch(() => null);
        } else {
            return await interaction.reply(options).catch(() => null);
        }
    } catch (error) {
        // Silent error handling
        return null;
    }
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Handle slash commands
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                // Silent handling for unknown commands
                return;
            }

            try {
                // Log command usage to webhook
                let commandArgs = '';
                if (interaction.options && interaction.options.data && interaction.options.data.length > 0) {
                    commandArgs = interaction.options.data.map(option => {
                        if (option.name === 'query' || option.name === 'song') {
                            return `${option.name}: "${option.value}"`;
                        }
                        return `${option.name}: ${option.value}`;
                    }).join(', ');
                }
                logger.command(interaction, interaction.commandName, commandArgs);

                // Execute the command
                await command.execute(interaction);
            } catch (error) {
                // Log the error to the webhook
                try {
                    logger.error(
                        `Command /${interaction.commandName}`, 
                        error,
                        [
                            { name: 'User', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
                            { name: 'Guild', value: `${interaction.guild ? interaction.guild.name : 'DM'} (${interaction.guild ? interaction.guild.id : 'N/A'})`, inline: true }
                        ]
                    );
                } catch (logError) {
                    // Silent error handling for logger
                }

                // Only handle the error if the interaction is still valid and hasn't timed out
                try {
                    const errorMessage = 'There was an error while executing this command!';

                    // Try to reply depending on the current interaction state
                    if (interaction.replied) {
                        await interaction.followUp({ 
                            content: errorMessage,
                            ephemeral: true 
                        }).catch(() => {});
                    } else if (interaction.deferred) {
                        await interaction.editReply({ 
                            content: errorMessage,
                            ephemeral: true 
                        }).catch(() => {});
                    } else {
                        await interaction.reply({ 
                            content: errorMessage,
                            ephemeral: true 
                        }).catch(() => {});
                    }
                } catch (followUpError) {
                    // Silent error handling - can't do anything more if this fails
                }
            }
        }

        // Re-enabled button interactions in this file
        // since they're not fully implemented in index.js
        if (interaction.isButton()) {
            const { client, guild } = interaction;
            const player = client.kazagumo.players.get(guild.id);

            // Log button interaction for debugging
            console.log(`Button pressed: ${interaction.customId}`);

            // Handle special case buttons first
            if (['play', 'help', '247toggle', 'leave'].includes(interaction.customId)) {
                // These buttons will be handled in their respective switch cases
                console.log(`Special button ${interaction.customId} pressed`);
            } else if (!player) {
                // Only check for player if it's not a special button
                await safeReply(interaction, { 
                    content: 'No active player found! Start playback with the /play command.',
                    ephemeral: true
                });
                return;
            }

            // Process button interaction
            try {
                switch (interaction.customId) {
                    case 'pauseresume':
                        if (!player) return;
                        const isPaused = player.paused;
                        await player.pause(!isPaused);
                        await safeReply(interaction, {
                            content: `Music ${!isPaused ? 'paused' : 'resumed'}!`,
                            ephemeral: true
                        });
                        break;

                    case 'skip':
                        if (!player) return;
                        await player.skip();
                        await safeReply(interaction, {
                            content: 'Skipped to next track!',
                            ephemeral: true
                        });
                        break;

                    case 'stop':
                        if (!player) return;
                        player.destroy();
                        await safeReply(interaction, {
                            content: 'Stopped playback!',
                            ephemeral: true
                        });
                        break;

                    // Add other button handlers here...

                    default:
                        await safeReply(interaction, {
                            content: 'This button action is not yet implemented.',
                            ephemeral: true
                        });
                        break;
                }
            } catch (error) {
                console.error('Button interaction error:', error);
                await safeReply(interaction, {
                    content: 'An error occurred while processing the button.',
                    ephemeral: true
                });
            }
        } else if (interaction.isStringSelectMenu()) {
            // Log select menu interaction
            try {
                const selectedValues = interaction.values.join(', ');
                logger.command(interaction, `Select Menu: ${interaction.customId}`, `Selected: ${selectedValues}`);
            } catch (error) {
                // Silent error for logger
            }

            // Handle filter select menu
            if (interaction.customId === 'filter_select') {
                const selectedFilter = interaction.values[0];
                const guild = interaction.guild;
                const member = interaction.member;

                // Get the player instance for this server
                const player = interaction.client.kazagumo.players.get(guild.id);

                if (!player) {
                    await safeReply(interaction, { 
                        content: 'There is no active player in this server!', 
                        ephemeral: true 
                    });
                    return;
                }

                // Make sure player is playing music
                if (!player.playing) {
                    await safeReply(interaction, { 
                        content: 'There is no music currently playing!', 
                        ephemeral: true 
                    });
                    return;
                }

                // Check if user is in the same voice channel
                if (!member.voice.channel || member.voice.channel.id !== player.voiceId) {
                    await safeReply(interaction, { 
                        content: 'You must be in the same voice channel as the bot to use this!', 
                        ephemeral: true 
                    });
                    return;
                }

                try {
                    // Import filter utilities
                    const { applyFilter, clearFilters, getFilterDisplayName } = require('../utils/filters');

                    // Handle 'none' selection (clear filters)
                    if (selectedFilter === 'none') {
                        // Store the current playback state
                        const wasPlaying = player.playing;
                        const currentPosition = player.position;
                        const currentTrack = player.queue.current;

                        // Clear all filters
                        const success = await clearFilters(player);

                        if (success) {
                            // Ensure music is still playing
                            if (wasPlaying && !player.playing && currentTrack) {
                                await player.pause(false);
                            }

                            await safeReply(interaction, {
                                content: 'All filters have been cleared! Music will continue playing.',
                                ephemeral: true
                            });
                        } else {
                            await safeReply(interaction, {
                                content: 'Failed to clear filters, but music will continue playing.',
                                ephemeral: true
                            });
                        }
                    } else {
                        // Store the current playback state
                        const wasPlaying = player.playing;
                        const currentPosition = player.position;
                        const currentTrack = player.queue.current;

                        // Apply the selected filter
                        const success = await applyFilter(player, selectedFilter);

                        if (success) {
                            // Ensure music is still playing
                            if (wasPlaying && !player.playing && currentTrack) {
                                await player.pause(false);
                            }

                            await safeReply(interaction, {
                                content: `Applied the ${getFilterDisplayName(selectedFilter)} filter! Music will continue playing.`,
                                ephemeral: true
                            });
                        } else {
                            await safeReply(interaction, {
                                content: `Failed to apply the filter. Music will continue playing normally.`,
                                ephemeral: true
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error in filter application:", error);
                    await safeReply(interaction, {
                        content: 'An error occurred while applying the filter, but music should continue playing.',
                        ephemeral: true
                    });
                }
            }
        }
    }
};