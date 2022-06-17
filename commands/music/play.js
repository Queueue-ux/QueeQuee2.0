const { MessageEmbed } = require('discord.js');
const { get_vars } = require('./music_args_handling');
const client = require('../../main');

function add_filters(vc) {
    const queue = client.distube.getQueue(vc);
    const test = 1;
}

module.exports = {
    name: 'play',
    description: 'plays song in the voice channel, takes queries or links to youtube/soundcloud',
    category: 'music',
    usage: 'play {link/query}',
    aliases: ['p'],
    async execute(message, args) {
        const { member, channel, voiceChannel } = get_vars(message);
        if (!voiceChannel) {
            return message.reply('must be in a voice channel to use music commands');
        }
        if (args.length < 1) {
            return message.reply('play requires argument of youtube/soundcloud link or query')
        }
        const search = args.join(' ');
        await client.distube.play(voiceChannel, search, { textChannel: channel, member: member });
        add_filters(voiceChannel);
        return;
    },
};