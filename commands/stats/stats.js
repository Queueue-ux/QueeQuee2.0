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

// get rid of stats people don't need to see, and do any necessary conversions
function parse_stats(stat_obj) {
  const return_obj = stat_obj;
    delete return_obj.updatedAt;
    delete return_obj.createdAt;
    delete return_obj.id;
    delete return_obj.user;
    const temp = return_obj.seconds_spent_in_channel;
    delete return_obj.seconds_spent_in_channel;
    return_obj.hours_spent_in_voice = (temp / 3600).toFixed(2);
    return return_obj;
}

module.exports = {
    name: 'stats',
    description: 'displays all of your statistics collected',
    category: 'stats',
    usage: 'stats',
    aliases: ['s'],
    async execute(message, args) {
        const raw_stats = await get_user_stats(client, get_user_name(message.member));
        const trimmed_stats = parse_stats(raw_stats);
        let stat_message = '';
        for (const stat in trimmed_stats) {
            stat_message += stat + ': ' + trimmed_stats[stat] + '\n';
        }

        return message.author.send(stat_message);
    },
};