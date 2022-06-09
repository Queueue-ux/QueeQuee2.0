const { spam_channel, bot_id} = require('../config.json');
module.exports = {
name: 'voiceStateUpdate',
async execute(before, after) {
    // user has left voice channel, send a message saying goodbye to them
    if (!after.channel && after.member.id != bot_id) {
        for (const channel of before.channel.guild.channels.cache.values()) {
            if (channel.name == spam_channel) {
                await channel.send(`See ya ${before.member.nickname}!`);
            }
        }
    }
},
};