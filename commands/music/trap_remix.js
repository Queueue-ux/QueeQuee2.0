const { MessageEmbed } = require('discord.js');
const { get_vars } = require('./music_args_handling');
const client = require('../../main');
const play = require('./play');

module.exports = {
    name: 'trapremix',
    category: 'music',
    description: 'same as play but appends trap remix to search does not work with links',
    usage: 'trapremix {query}',
    aliases: ['tr'],
    async execute(message, args) {
        args.push('trap remix');
        play.execute(message, args);
    },
};