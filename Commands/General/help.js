const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const labelMap = {
    music_commands: '🎵 Music',
    filter_commands: '🎛️ Audio Filters',
    utility_commands: '⚙️ Utility',
    support_server: '👀 Support'
};

// Define necessary variables (replace placeholders with actual values)
const botLogo = 'YOUR_BOT_LOGO_URL';
const serverName = 'YOUR_SERVER_NAME';
const serverIcon = 'YOUR_SERVER_ICON_URL';
const userIcon = 'YOUR_USER_ICON_URL';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Helping your server stay smooth & efficient!'),

    async execute(interaction) {
        try {
            // Fetch real values dynamically if needed
            const botAvatar = interaction.client.user.displayAvatarURL();
            const serverTitle = interaction.guild.name;
            const serverPic = interaction.guild.iconURL();
            const userPic = interaction.user.displayAvatarURL();

            // Create buttons for each category
            const musicButton = new ButtonBuilder()
                .setCustomId('music_commands')
                .setEmoji('<:kuchbhi:1374968363641470987>')
                .setStyle(ButtonStyle.Primary);

            const filtersButton = new ButtonBuilder()
                .setCustomId('filter_commands')
                .setEmoji('<:filter:1374983289424707625>')
                .setStyle(ButtonStyle.Secondary);

            const utilityButton = new ButtonBuilder()
                .setCustomId('utility_commands')
                .setEmoji('<:setting:1374968782619152504>')
                .setStyle(ButtonStyle.Success);

            const supportButton = new ButtonBuilder()
                .setCustomId('support_server')
                .setEmoji('<:Support:1374983689984806923>')
                .setStyle(ButtonStyle.Success);

            // Create an action row with the buttons
            const row = new ActionRowBuilder()
                .addComponents(musicButton, filtersButton, utilityButton, supportButton);

            // Create an embed for a polished response
            const embed = new EmbedBuilder()
                .setTitle('Homey – Where comfort feels like home!')
                .setDescription('Tap a button below to explore various commands or get support!')
                .setColor('#00FFFF')
                .setThumbnail(botAvatar) // Using bot's avatar dynamically
                .setAuthor({ name: serverTitle, iconURL: serverPic }) // Using server's name/icon dynamically
                .addFields(
                    { name: '\n\n<:kuchbhi:1374968363641470987> - Music Commands', value: 'Music at your fingertips—just a command away!', inline: false },
                    { name: '<:filter:1374983289424707625> - Filters Commands', value: 'Fine-tune your sound, perfect your vibe!', inline: false },
                    { name: '<:setting:1374968782619152504> - Utility Commands', value: 'Smart solutions for smarter servers!', inline: false },
                    { name: '<:Support:1374983689984806923> - Support', value: 'Support made simple, solutions made easy!', inline: false }
                )
                .setFooter({ text: 'Use /help anytime to see this menu again!', iconURL: userPic }); // Using user's avatar dynamically

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {
            console.error('Error executing the command:', error);
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
        }
    }
};