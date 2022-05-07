const { MessageEmbed } = require('discord.js');
const { get_vars } = require('./music_args_handling');
const client = require('../../main');

module.exports = {
  name: 'listfilters',
  category: 'music',
  description: 'list of all available filters',
  usage: 'listFilters',
  aliases: ['filters', 'listf', 'lf'],
  async execute(message, args) {
    message.channel.send(`: \`${Object.keys(client.distube.filters)}\``);
  },
};