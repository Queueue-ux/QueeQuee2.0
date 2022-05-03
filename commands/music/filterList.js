const { MessageEmbed } = require('discord.js');
const { get_vars } = require('./music_args_handling');
const client = require('../../main');

module.exports = {
  name: 'listfilters',
  aliases: ['filters', 'listf', 'lf'],
  async execute(message, args) {
    message.channel.send(`: \`${Object.keys(client.distube.filters)}\``);
  },
};