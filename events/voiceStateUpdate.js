const { spam_channel } = require('../config.json');
const BOT_ID = '946542952946216960';
module.exports = {
name: 'voiceStateUpdate',
async execute(before, after) {
    // user has left voice channel, send a message saying goodbye to them
    if (!after.channel && after.member.id != BOT_ID) {
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