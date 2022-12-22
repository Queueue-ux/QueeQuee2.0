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
  name: 'send',
  category: 'money',
  description: 'send QueeCoin to a specified user',
  usage: 'send {userName (not nickname)} {amount}',
  aliases: [],
  async execute(message, args) {
    // first make sure name exists

    // TODO: this needs to be more in depth
    const sendee_name = args[0];
    const sender_name = get_user_name(message.member);
    // make sure args[2] is a float value
    const given_amount = args[1];
    if (typeof given_amount === 'number' && !Number.isNaN(given_amount) && !Number.isInteger(given_amount)) {
        message.channel.send('arg 2 must be a number');
        return;
    }
    const amount = parseFloat(given_amount);
    if (amount <= 0) {
        message.channel.send('idiot');
        return;
    }

    const table = client.tables['user_stats'];

    // ensure sender actually has the funds
    const sender_data = await get_one(table, { user:  sender_name });
    const sender_current_balance = sender_data.dataValues['quee_coin'];
    if (sender_current_balance < amount) {
        message.channel.send('Sorry broke-ass, not enough funds');
        return;
    }

    // remove the funds from sender
    increment(table, { quee_coin: -(amount) }, { user: sender_name });
    // add funds to sendee
    increment(table, { quee_coin: amount }, { user: sendee_name });
  },
};