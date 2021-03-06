const { get_vars } = require('./music_args_handling');
const { MessageEmbed } = require('discord.js');
const client = require('../../main');

module.exports = {
    name: 'pause',
    description: 'pause the music in the channel, use resume to unpause',
    category: 'music',
    usage: 'pause',
    async execute(message, args) {
        const { member, channel, voiceChannel } = get_vars(message);
        const queue = await client.distube.getQueue(voiceChannel);
        if (!queue) return message.channel.send('There is nothing in the queue right now!');
        if (!voiceChannel) {
            return message.reply('must be in a voice channel to use music commands');
        }
        if (args.length > 0) {
            return message.reply('stop should have no arguments');
        }
        await queue.pause(voiceChannel);
        return message.reply({ content: 'Music has been Paused.' });
    },
};