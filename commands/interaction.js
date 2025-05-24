const { client } = require('../index'); // Ensure correct import
const { EmbedBuilder } = require('discord.js');

// Define label map for button labels
const labelMap = {
    music_commands: '<:filters:1374968363641470987>  Music Commands',
    filter_commands: '<:filter:1374983289424707625>  Filters Commands',
    utility_commands: '<:setting:1374968782619152504>  Utility Commands',
    support_server: '<:Support:1374983689984806923>  Support Server'
};

// Bot logo URL (Replace with your bot’s logo link)
const botLogo = 'https://images-ext-1.discordapp.net/external/C03A2cNehxtq-PM1UFIySYyhr4agUmUG1Hgmb9b2dP8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1122035138927284255/6c4e043954064fbe547b0386d02d4157.png?format=webp&quality=lossless&width=930&height=930';

// Global listener for button interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    // Safely get server details, fallback to bot logo if null (for DMs)
    const serverIcon = interaction.guild?.iconURL({ dynamic: true, size: 1024 }) || botLogo;
    const serverName = interaction.guild?.name || "Direct Message";
    const userIcon = interaction.user.displayAvatarURL({ dynamic: true, size: 1024 });

    const commandCategories = {
        music_commands: [
            '`/play` - Play a song',
            '`/search` - Search for a song and choose one to play',
            '`/pause` - Pause playback',
            '`/resume` - Resume playback',
            '`/stop` - Stop playback',
            '`/skip` - Skip to next song',
            '`/replay` - Replay the current song from the beginning',
            '`/join` - Make the bot join your voice channel',
            '`/leave` - Make the bot leave your voice channel',
            '`/volume` - Adjust volume (0-100)',
            '`/queue` - View current queue',
            '`/nowplaying` - Show current track',
            '`/shuffle` - Shuffle the queue',
            '`/loop` - Set loop mode',
            '`/remove` - Remove a song',
            '`/move` - Move track position',
            '`/lyrics` - Get lyrics for the current or specified song'
        ],
        filter_commands: [
            '`/8d` - Toggle 8D audio effect',
            '`/bassboost` - Enhance bass frequencies',
            '`/nightcore` - Apply nightcore effect (faster with higher pitch)',
            '`/vaporwave` - Apply vaporwave effect (slower with lower pitch)',
            '`/karaoke` - Apply karaoke effect (reduces vocals)',
            '`/lowpass` - Apply lowpass filter (reduces high frequencies)',
            '`/slowmode` - Slow down the music playback',
            '`/timescale` - Adjust playback speed and pitch',
            '`/clearfilter` - Remove all active filters'
        ],
        utility_commands: [
            '`/247` - Toggle 24/7 mode',
            '`/ping` - Check bot latency',
            '`/stats` - View bot statistics',
            '`/invite` - Invite bot to server',
            '`/support` - Join support server',
            '`/vote` - Vote for the bot on listing sites',
            '`/help` - Display this help menu'
        ],
        support_server: [
            '[S U P P O R T](https://discord.gg/mZA3h5H6c5)'
        ]
    };

    if (commandCategories[interaction.customId]) {
        const labelName = labelMap[interaction.customId] || interaction.customId.replace('_commands', '');

        const embed = new EmbedBuilder()
            .setTitle(`${labelName}`)
            .setDescription(`**Helping your server stay smooth & efficient!**`)
            .setColor('#00FFFF')
            .setThumbnail(botLogo)
            .setAuthor({ name: serverName, iconURL: serverIcon }) // Fixed issue with undefined server name
            .addFields({ name: 'Commands', value: commandCategories[interaction.customId].join('\n') }) // Added proper field name
            .setFooter({ text: 'Use /help anytime to see this menu again!', iconURL: userIcon });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
        await interaction.reply({ content: 'Invalid button selection.', ephemeral: true });
    }
});