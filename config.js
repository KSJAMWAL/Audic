
module.exports = {
    prefix: '!', // Default prefix for message commands
    botName: 'Homey',
    botDescription: '**Helping your server stay smooth & efficient!**',
    embedColor: '#7289DA',
    supportServer: process.env.SUPPORT_SERVER || 'https://discord.gg/76W85cu3Uy',
    botLogo: 'https://images-ext-1.discordapp.net/external/C03A2cNehxtq-PM1UFIySYyhr4agUmUG1Hgmb9b2dP8/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1122035138927284255/6c4e043954064fbe547b0386d02d4157.png?format=webp&quality=lossless&width=930&height=930',
    genius: {
        apiKey: process.env.GENIUS_API_KEY,
        clientToken: process.env.GENIUS_CLIENT_TOKEN,
        accessToken: process.env.GENIUS_ACCESS_TOKEN
    },
    emojis: {
        play: '',
        pause: '',
        stop: '',
        skip: '',
        previous: '',
        repeat: '',
        loading: '',
        error: '',
        success: '',
        queue: '',
        music: '',
        volume: '',
        time: '',
        user: '',
        duration: '',
        spotify: '',
        soundcloud: '',
        youtube: '',
        loopTrack: '',
        loopQueue: '',
        loopOff: ''
    },
    lavalink: {
        nodes: [
            {
                name: 'Main',
                url: 'lavalink.jirayu.net:13592',
                auth: 'youshallnotpass',
                secure: false,
                retryAmount: 5,
                retryDelay: 3000
            }
        ]
    }
};
