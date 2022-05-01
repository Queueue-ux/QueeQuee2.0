const { get_vars } = require('./music_args_handling');
const { MessageEmbed } = require('discord.js');
const client = require('../../main');

module.exports = {
    name: 'pause',
    async execute(message, args) {
        const { member, channel, voiceChannel } = get_vars(message);
        const queue = await client.distube.getQueue(voiceChannel);

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