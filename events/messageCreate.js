const { prefix, web_data_channel, web_data_bot_username } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const { emit_error } = require('../globals/error_output');
const { get_user_name } = require('../globals/parse_discord_objects');
const { update_total_messages } = require('../globals/stat_updates');
const { increment } = require('../globals/database_commands');
const client_obj = require('../main');
module.exports = {
name: 'messageCreate',
async execute(message) {
  const client = message.client;

  // ////////////////////////////////
  // Stat updates are all done here
  // ///////////////////////////////

  // sub-section for updates specifically from the queequee-web-data channel
  const channel_name = message.channel.name;

  // NOTE: we only want bots here
  if (channel_name == web_data_channel && message.author.bot && message.author.username == web_data_bot_username) {
    // name scheme: {user_name}-{table}-{option}-{option-args}...
    // options: coin - args: amount_to_increase
    const arg_split = message.content.trim().split('-');

    const table_user_name = arg_split[0];
    const table = client.tables[arg_split[1]];

    if (arg_split[2] == 'coin') {
      increment(table, { quee_coin: parseFloat(arg_split[3]) }, { user: table_user_name });
    }

  }

  // NOTE: everything below here cannot have bots
  if (message.author.bot) return;

  // regular stat update, just shows total messages
  const name = get_user_name(message.member);
  update_total_messages(client_obj, client_obj.user_objects[name]);

  // ////////////////////////

  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(prefix) !== 0) {
    return;
  }

  // Our standard argument/command name definition.
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command));

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  try {
    await cmd.execute(message, args);
  }
  catch (err) {
            const errorEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`${err}`);
            emit_error(err);
            return message.reply({ embeds: [errorEmbed] });
        }
},
};