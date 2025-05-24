const { REST, Routes } = require('discord.js');
const { join } = require('path');
const { readdirSync } = require('fs');
const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        try {
            // Register slash commands
            const commands = [];

            // Load commands from both music and general directories
            const categories = ['music', 'general'];
            for (const category of categories) {
                const commandsPath = join(__dirname, '..', 'commands', category);
                const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const command = require(join(commandsPath, file));
                    if (command?.data && typeof command.data.toJSON === 'function') {
                        commands.push(command.data.toJSON());
                    } else {
                        logger.error(`Skipping invalid command file: ${file}`);
                    }
                }
            }

            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

            logger.system('Command Registration', 'Started refreshing application (/) commands.');

            // Register commands
            try {
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID),
                    { body: commands },
                );
                
                // Log the registered commands
                console.log('Registered commands:', commands.map(cmd => cmd.name).join(', '));
                
                logger.system('Command Registration', `Successfully registered ${commands.length} commands!`);
            } catch (error) {
                console.error('Error registering commands:', error);
                logger.error('Command Registration Error', error);
            }

            logger.system('Command Registration', 'Successfully registered application commands.');
            logger.system('Bot Status', `Logged in as ${client.user.tag}`);
            
            // Set bot activity
            client.user.setActivity('/help', { type: 2 }); // 2 = Listening to
        } catch (error) {
            logger.error('Error in ready event:', error);
        }
    },
};