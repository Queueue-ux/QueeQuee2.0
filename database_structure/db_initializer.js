/*
    this file is meant to load a database based on a json file
    if the json file is edited with the same name then then the table will get the new entry

    in addition this file also loads the client with the db object
*/
const Sequelize = require('sequelize');
const fs = require('fs');
const { emit_error } = require('../globals/error_output');
const { create_table, add_entry } = require('../globals/database_commands');
const { guildId } = require('../config.json');

function connect() {
    return new Sequelize('database', 'user', 'password', {
        host: 'localhost',
        dialect: 'sqlite',
        logging: false,
        storage: __dirname + '/../data/player_stats.sqlite',
    });
}

// NOTE: tables that have users must have a user column
async function fill_table_with_users(client, table) {
    // first get list of all users
    const guild = await client.guilds.fetch(guildId);
    //const guild = await client.fetchGuildPreview(guildId);
    const members = await guild.members.fetch({ force: true });
    for (const [id, member] of members) {
        if (!member.user['bot']) {
            add_entry(table, { user: member.user['username'] + '#' + member.user['discriminator'] });
        }
    }
    const t= 1;
}

module.exports = {
    async db_initialize(client) {
        client.db = connect();
        client.tables = {};
        try {
            await client.db.authenticate();
        }
        catch (error) {
            emit_error(`could not connect to db: ${error}`);
        }
        // first grab all of the tables/columns from the json file
        const rawdata = fs.readFileSync(__dirname + '/structure.json');
        const structure_tables = JSON.parse(rawdata);

        const current_tables = {};

        const column_grabber = await client.db.getQueryInterface();
        const tables = await client.db.getQueryInterface().showAllTables();

        const non_column_entries = ['createdAt', 'id', 'updatedAt'];
        for (const table_index in tables) {
            const columns = await column_grabber.describeTable(tables[table_index]);

            Object.keys(columns).forEach((item) => {
                if (non_column_entries.includes(item)) {
                    delete columns[item];
                }
            });
            current_tables[tables[table_index]] = columns;
        }
        // const t2 = await t.describeTable(test[0]);

        // TODO: 2 things:
            // first need to be able to add new columns to existing tables
            // next need to notify if something is trying to be deleted

        // FOR NOW
            // just read through the structure and build the database

        // later this will be built by the TODO steps
        const final_table = structure_tables;
        const type_dict = { 'INTEGER' : {   type: Sequelize.INTEGER,
                                            defaultValue: 0 },
                            'STRING' : {    type: Sequelize.STRING,
                                            defaultValue: ""},
                            'FLOAT' : {     type: Sequelize.FLOAT,
                                            defaultValue: 0.0},
                            'UNIQUESTRING' : {
                                            type: Sequelize.STRING,
                                            defaultValue : "",
                                            unique : true,
                            },
                          };

        for (const table in final_table) {
            const attributes = final_table[table];
            const column_list = [];
            const type_list = [];
            let should_fill_with_users = false;
            if (attributes['fill_with_users'] == true) {
                should_fill_with_users = true;
            }
            delete attributes['fill_with_users'];
            for (const column in attributes) {
                column_list.push(column);
                type_list.push(type_dict[attributes[column]]);
            }
            const new_table = await create_table(table, column_list, type_list, client);
            await new_table.sync();
            if (should_fill_with_users) {
                fill_table_with_users(client, new_table);
            }
            client.tables[table] = new_table;
        }
    },

    // use this if the table you added is supposed to be filled with all users in the channel

};