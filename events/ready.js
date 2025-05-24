
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const commands = [];
        
        // Load commands from Commands directory only
        const categoriesPath = path.join(__dirname, '..', 'Commands');
        if (fs.existsSync(categoriesPath)) {

            const categories = fs.readdirSync(categoriesPath).filter(file => 
                fs.statSync(path.join(categoriesPath, file)).isDirectory()
            );

            for (const category of categories) {
                const commandsPath = path.join(categoriesPath, category);
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    const command = require(filePath);
                    if ('data' in command && 'execute' in command) {
                        commands.push(command.data.toJSON());
                    }
                }
            }
        }

        const rest = new REST().setToken(process.env.DISCORD_TOKEN);

        try {
            logger.system('Command Registration', 'Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );

            logger.system('Command Registration', `Successfully registered ${commands.length} commands!`);
            logger.system('Bot Status', `Logged in as ${client.user.tag}`);

            // Set bot activity
            client.user.setActivity('/help', { type: 2 });
        } catch (error) {
            logger.error('Command Registration', error);
        }
    },
};
