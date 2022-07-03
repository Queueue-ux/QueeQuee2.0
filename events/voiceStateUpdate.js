const { spam_channel } = require('../config.json');
const { get_user_name } = require('../globals/parse_discord_objects');
const { update_total_time } = require('../globals/stat_updates');
const { get_current_time } = require('../globals/time_calculations');
const client = require('../main');

module.exports = {
name: 'voiceStateUpdate',
async execute(before, after) {
    // user has left voice channel, send a message saying goodbye to them
    if (!before.channel && !before.member.user.bot) {
        const userName = get_user_name(before.member);
        const user_obj = client.user_objects[userName];
        user_obj.join_time = get_current_time();
    }
    if (!after.channel && !after.member.user.bot) {
        const userName = get_user_name(before.member);
        const user_obj = client.user_objects[userName];
        user_obj.leave_time = get_current_time();
        update_total_time(client, user_obj);
        for (const channel of before.channel.guild.channels.cache.values()) {
            if (channel.name == spam_channel) {
                await channel.send(`See ya ${before.member.displayName}!`);
            }
        }
    }
},
};