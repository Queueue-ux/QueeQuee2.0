const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
name: 'messageCreate',
async execute(message) {
  // const message = client.content;
  // Ignore all bots
  const client = message.client;
  if (message.author.bot) return;

  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(prefix) !== 0) return;

  // Our standard argument/command name definition.
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command));

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  try {
    cmd.execute(message, args);
  }
  catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${e}`);
            return message.reply({ embeds: [errorEmbed] });
        }
},
};