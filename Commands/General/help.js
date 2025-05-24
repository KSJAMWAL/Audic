
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),

    async execute(interaction) {
        try {
            const botAvatar = interaction.client.user.displayAvatarURL();
            const serverTitle = interaction.guild.name;
            const serverPic = interaction.guild.iconURL();
            const userPic = interaction.user.displayAvatarURL();

            const embed = new EmbedBuilder()
                .setTitle('Homey – Where comfort feels like home!')
                .setDescription('Here are all available commands:')
                .setColor('#00FFFF')
                .setThumbnail(botAvatar)
                .setAuthor({ name: serverTitle, iconURL: serverPic })
                .addFields(
                    {
                        name: '<:kuchbhi:1374968363641470987> Music Commands',
                        value: '`/play` - Play a song\n' +
                               '`/search` - Search for a song\n' +
                               '`/pause` - Pause playback\n' +
                               '`/resume` - Resume playback\n' +
                               '`/stop` - Stop playback\n' +
                               '`/skip` - Skip to next song\n' +
                               '`/replay` - Replay current song\n' +
                               '`/join` - Join voice channel\n' +
                               '`/leave` - Leave voice channel\n' +
                               '`/volume` - Adjust volume (0-100)\n' +
                               '`/queue` - View current queue\n' +
                               '`/nowplaying` - Show current track\n' +
                               '`/shuffle` - Shuffle the queue\n' +
                               '`/loop` - Set loop mode\n' +
                               '`/remove` - Remove a song\n' +
                               '`/move` - Move track position\n' +
                               '`/lyrics` - Get lyrics',
                        inline: false
                    },
                    {
                        name: '<:filter:1374983289424707625> Filter Commands',
                        value: '`/8d` - Toggle 8D audio\n' +
                               '`/bassboost` - Enhance bass\n' +
                               '`/nightcore` - Apply nightcore\n' +
                               '`/vaporwave` - Apply vaporwave\n' +
                               '`/karaoke` - Apply karaoke\n' +
                               '`/lowpass` - Apply lowpass\n' +
                               '`/timescale` - Adjust speed/pitch\n' +
                               '`/clearfilter` - Clear all filters',
                        inline: false
                    },
                    {
                        name: '<:setting:1374968782619152504> Utility Commands',
                        value: '`/help` - Show this menu\n' +
                               '`/ping` - Check bot latency\n' +
                               '`/invite` - Get bot invite link\n' +
                               '`/stats` - Show bot statistics\n' +
                               '`/support` - Get support server link',
                        inline: false
                    }
                )
                .setFooter({ text: 'Use /help anytime to see this menu again!', iconURL: userPic });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error executing help command:', error);
            await interaction.reply({ content: 'An error occurred while showing the help menu.', ephemeral: true });
        }
    }
};
