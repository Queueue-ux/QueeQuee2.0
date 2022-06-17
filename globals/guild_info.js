const { guildId } = require('../config.json');

module.exports = {
    async get_non_bot_users(client) {
        const return_members = [];
        const guild = await client.guilds.fetch(guildId);
        const members = await guild.members.fetch({ force: true });
        for (const [id, member] of members) {
            if (!member.user['bot']) {
                return_members.push(member.user['username'] + '#' + member.user['discriminator']);
            }
        }
        return return_members;
    },
}