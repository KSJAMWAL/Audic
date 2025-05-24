
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the bot latency'),
    async execute(context) {
        const ping = Math.round(context.client.ws.ping);
        return context.reply({ embeds: [createEmbed({ description: `🏓 Pong! Latency is ${ping}ms` })] });
    }
};
