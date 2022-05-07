const { get_vars } = require('./music_args_handling');
const { MessageEmbed } = require('discord.js');
const client = require('../../main');

module.exports = {
    name: 'skip',
    description: 'skips currently playing song',
    usage: 'skip',
    category: 'music',
    async execute(message, args) {
        const { member, channel, voiceChannel } = get_vars(message);
        const queue = await client.distube.getQueue(voiceChannel);
        if (!queue) return message.channel.send('There is nothing in the queue right now!');
        if (queue.songs.length == 1) { // this fixes error where the queue didn't have anything up next to skip to
            await queue.stop();
            return;
        }

        if (!voiceChannel) {
            return message.reply('must be in a voice channel to use music commands');
        }
        if (args.length > 0) {
            return message.reply('skip should have no arguments');
        }
        await queue.skip(voiceChannel);
        return message.reply({ content: 'Song has been skipped.' });
    },
};