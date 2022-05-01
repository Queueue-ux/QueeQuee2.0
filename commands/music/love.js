const { MessageEmbed } = require('discord.js');
const { get_vars } = require('./music_args_handling');
const { Song } = require('distube');
const client = require('../../main');

module.exports = {
    name: 'love',
    async execute(message, args) {

        const { member, channel, voiceChannel } = get_vars(message);

        if (!voiceChannel) {
            return message.reply('must be in a voice channel to use music commands');
        }
        if (args.length > 0) {
            return message.reply('love requires no arguments');
        }
        const love_song = new Song('sing');
        love_song.streamURL = './love.mp3';
        client.distube.play(voiceChannel, love_song, { textChannel: channel, member: member });
        return message.reply({ content: 'Request received' });
    },
};