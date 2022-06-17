// npm install sequelize sqlite3
/*
Overview of module
    - use of a database in my project
    - store any type of data I want people to be able to see
        - examples: time spent in channel, time spent afk lol, time spent actually speaking, messages sent in channel
*/

const { get_user_stats } = require('../../globals/stat_updates');
const client = require('../../main');
const { get_user_name } = require('../../globals/parse_discord_objects');


module.exports = {
    name: 'stats',
    description: 'displays all of your statistics collected',
    category: 'stats',
    usage: 'stats',
    aliases: ['s'],
    async execute(message, args) {
        const stats = await get_user_stats(client, get_user_name(message.member));
        let stat_message = '';
        for (const stat in stats) {
            stat_message += stat + ': ' + stats[stat] + '\n';
        }

        return message.author.send(stat_message);
    },
};