const { get_vars } = require('./music_args_handling');
const { MessageEmbed } = require('discord.js');
const client = require('../../main');

module.exports = {
    name: 'queue',
    description: 'lists songs currently in the queue',
    category: 'music',
    usage: 'queue',
    aliases: ['q'],
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

        return message.reply({ embeds: [
                                new MessageEmbed()
                                .setColor("PURPLE")
                                .setDescription(`${queue.songs.map(
                                    (song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``)}`
                                )] });
    },
};