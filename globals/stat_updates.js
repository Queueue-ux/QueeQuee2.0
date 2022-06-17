// this file is meant to be imported by events that want to update stats in the
// explicitly uses the user_stats table
const { increment, get_one } = require('./database_commands');
const { get_non_bot_users } = require('./guild_info');
const { elapsed_time_in_seconds, get_current_time } = require('./time_calculations');
// user_stats database
// const client = require('../main');

class User {
    constructor(userName, QC=0.0) {
        this.userName = userName;
        this.join_time = 0;
        this.leave_time = 0;
        this.QC = 0.0;
    }
}

function new_user_object(member) {
    return new User(member);
}


// const users = []; // list of user Objects for convenience
module.exports = {
    update_total_time(client, userObject) {
        const userName = userObject.userName;
        const join_time = userObject.join_time;
        const leave_time = userObject.leave_time;
        const table = client.tables['user_stats'];
        const time = elapsed_time_in_seconds(leave_time, join_time);
        increment(table, { seconds_spent_in_channel: time }, { user: userName });
    },

    update_total_messages(client, userObject) {
        const userName = userObject.userName;
        const table = client.tables['user_stats'];
        increment(table, { messages_sent : 1 }, { user: userName });
    },

    async get_all_user_objects(client) {
        const object_list = {};
        const list_of_users = await get_non_bot_users(client);
        for (const user in list_of_users) {
            const obj_to_add = new_user_object(list_of_users[user]);
            const time = get_current_time();
            obj_to_add.join_time = time;
            obj_to_add.leave_time = time;
            object_list[list_of_users[user]] = obj_to_add;
        }
        return object_list;
    },

    async get_user_stats(client, userName) {
        const table = client.tables['user_stats'];
        const user = await get_one(table, { user: userName });
        const stats = user.dataValues;
        return stats;
    },

};