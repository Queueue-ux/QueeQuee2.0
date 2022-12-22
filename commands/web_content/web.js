const { MessageEmbed } = require('discord.js');
const client = require('../../main');
const { get_non_bot_users } = require('../../globals/guild_info');
const { get_one } = require('../../globals/database_commands');
const { get_user_name } = require('../../globals/parse_discord_objects');
const { increment } = require('../../globals/database_commands');

function magic_name_finder() {
    const current_users = get_non_bot_users();
}
module.exports = {
  name: 'web',
  category: 'website',
  description: 'generates a unique link for you to queequee website',
  usage: 'web',
  aliases: [],
  async execute(message, args) {
    // first make sure name exists

    // TODO: this needs to be more in depth
    const user = get_user_name(message.member);
    const table = client.tables['user_stats'];

    // ensure sender actually has the funds
    const user_table = await get_one(table, { user:  user });
    const current_balance = user_table.dataValues['quee_coin'];
    return message.author.send(`https://queequeewebsite.github.io?name=${user}`);
  },
};