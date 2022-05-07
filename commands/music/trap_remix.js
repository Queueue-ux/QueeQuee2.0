const { MessageEmbed } = require('discord.js');
const { get_vars } = require('./music_args_handling');
const client = require('../../main');

module.exports = {
    name: 'trapremix',
    category: 'music',
    description: 'same as play but appends trap remix to search does not work with links',
    usage: 'trapremix {query}',
    aliases: ['tr'],
    async execute(message, args) {
        args.push('trap remix');
        const { member, channel, voiceChannel } = get_vars(message);

        if (!voiceChannel) {
            return message.reply('must be in a voice channel to use music commands');
        }
        if (args.length < 1) {
            return message.reply('play requires argument of youtube/soundcloud link or query')
        }
        const search = args.join(' ');
        await client.distube.play(voiceChannel, search, { textChannel: channel, member: member });
        return message.reply({ content: 'Request received' });
    },
};