const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Invite bot to server'),

    async execute(interaction) {
        try {
            // Ensure interaction hasn't already been replied to before deferring
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ ephemeral: false }).catch(err => {
                    console.error('Failed to defer reply in invite command:', err);
                    return;
                });
            }

            // Get client ID from environment or use fallback
            let clientId = process.env.CLIENT_ID || interaction.client.user?.id || '1095642714854182912';

            // Retrieve server details safely
            const serverName = interaction.guild?.name || "Homey Bot";
            const serverIcon = interaction.guild?.iconURL() || interaction.client.user.displayAvatarURL();
            const botLogo = interaction.client.user.displayAvatarURL();
            const userIcon = interaction.user.displayAvatarURL();

            // Define bot permissions
            const permissions = 277083450432;
            const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot%20applications.commands`;
            const supportServer = config?.supportServer || 'https://discord.gg/76W85cu3Uy';

            // Create invite embed
            const inviteEmbed = new EmbedBuilder()
                .setDescription(`**Homey – Where comfort feels like home!**\n\nTap a button to invite or get support!\n\n`)
                .setColor('#00FFFF')
                .setThumbnail(botLogo)
                .setAuthor({ name: serverName, iconURL: serverIcon })
                .addFields(
                    { name: '**<a:invite:1375482876866461786>   -   Invite Bot**', value: `[I N V I T E](${inviteLink})`, inline: false },
                    { name: '**<:Support:1374983689984806923>   -   Support Server**', value: `[S U P P O R T](${supportServer})`, inline: false }
                )
                .setFooter({ text: 'Your support keeps us running—thank you!', iconURL: userIcon });

            // Create buttons for invite & support server (Ensure emojis are valid)
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setEmoji('<a:invite:1375482876866461786>') // Use a Unicode emoji or check the emoji ID validity
                        .setURL(inviteLink),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setEmoji('<:Support:1374983689984806923>') // Use Unicode emoji or a verified custom emoji ID
                        .setURL(supportServer)
                );

            // Edit the deferred reply safely
            await interaction.editReply({ embeds: [inviteEmbed], components: [row] }).catch(err => {
                console.error('Failed to edit reply in invite command:', err);
            });

        } catch (error) {
            console.error('Error in invite command:', error);

            try {
                // Ensure proper error response without duplicate interactions
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'Sorry, an error occurred while processing your invite request.', ephemeral: true });
                } else {
                    await interaction.editReply({ content: 'Sorry, there was an error processing your invite request.', embeds: [], components: [] });
                }
            } catch (responseError) {
                console.error('Failed to send error response:', responseError);
            }
        }
    }
};