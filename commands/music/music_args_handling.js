module.exports = {
    get_vars(message) {
        const { member, channel } = message;
        const voiceChannel = member.voice.channel;
        return { member, channel, voiceChannel };
    },
};