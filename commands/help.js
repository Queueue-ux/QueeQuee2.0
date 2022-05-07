const { MessageEmbed } = require('discord.js');
const client = require('../main');
module.exports = {
	name: 'help',
    category : null,
	description: 'displays all commands',
	aliases: ['h'],
	usage: 'help {specific command}',
	async execute(message, args) {
        // separate commands by their category
        const categories = new Map();
        for (const value of client.commands.values()) {
            const test = categories.has(value.category);
            if (value.category == null ) {
                continue;
            }
            if (!categories.has(value.category)) {
                categories.set(value.category, []);
            }
            categories.get(value.category).push(value);
        }

        // print out based on categories
        let printString = '';
        for (const [key, value] of categories) {
            printString += `---------\n**${key}**\n---------\n`;
            for (const command of value) {
                printString += `᲼᲼**${command.name} (${command.aliases})**: ${command.description}\n`
            }
        }
        return message.channel.send({ embeds: [
            new MessageEmbed()
            .setColor("GREEN")
            .setDescription(printString),
        ] });
	},
};