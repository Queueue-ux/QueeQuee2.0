const { spam_channel } = require('../config.json');
module.exports = {
name: 'voiceStateUpdate',
async execute(before, after) {
    // user has left voice channel, send a message saying goodbye to them
    if (!after.channel) {
        for (const channel of before.channel.guild.channels.cache.values()) {
            if (channel.name == spam_channel) {
                await channel.send(`See ya ${before.member.nickname}!`);
            }
        }
    }
    // TODO: let bot leave from here
    if (before.channel != after.channel) {
    }
},
};