
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the bot latency'),
    async execute(interaction) {
        const ping = Math.round(interaction.client.ws.ping);
        return interaction.reply({ embeds: [createEmbed({ description: `🏓 Pong! Latency is ${ping}ms` })] });
    }
};
