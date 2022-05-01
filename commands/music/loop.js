const { get_vars } = require('./music_args_handling');
const { MessageEmbed } = require('discord.js');
const client = require('../../main');

module.exports = {
    name: 'loop',
    async execute(message, args) {
        const { member, channel, voiceChannel } = get_vars(message);

        if (!voiceChannel) {
            return message.reply('must be in a voice channel to use music commands');
        }
        client.isLooping = !client.isLooping;
        return message.reply({ content: client.isLooping ? 'looping.' : 'done looping.' });
    },
};