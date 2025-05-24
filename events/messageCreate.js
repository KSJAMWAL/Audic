
const { createEmbed, errorEmbed } = require('../utils/embeds');
const config = require('../config');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        const { client } = message;
        if (message.author.bot) return;
        
        const prefix = config.prefix;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);
        if (!command) return;

        try {
            // Create a hybrid context that mimics interaction properties
            const hybridContext = {
                client: message.client,
                guild: message.guild,
                channel: message.channel,
                member: message.member,
                user: message.author,
                options: {
                    getString: (name) => args[0],
                    getNumber: (name) => Number(args[0]),
                    getInteger: (name) => parseInt(args[0]),
                    getBoolean: (name) => args[0]?.toLowerCase() === 'true',
                },
                reply: async (content) => {
                    if (content.ephemeral) {
                        return message.author.send(content);
                    }
                    return message.channel.send(content);
                },
                deferReply: async () => Promise.resolve(),
                editReply: async (content) => message.channel.send(content),
                isCommand: () => false,
                isMessageCommand: () => true
            };

            await command.execute(hybridContext);
        } catch (error) {
            console.error(error);
            message.reply({ 
                embeds: [errorEmbed('There was an error executing that command!')] 
            }).catch(console.error);
        }
    },
};
