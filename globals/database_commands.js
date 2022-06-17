const Sequelize = require('sequelize');
const { emit_error } = require('../globals/error_output');

/*
    connects us to our sqlite3 database
*/

module.exports = {

    /*
    @param {string} name - name of table
    @param {list[string]} row_titles - fields of the table
    @param {list[Sequelize descriptors]} row_types - examples are: Sequelize.STRING, Sequelize.TEXT, 
    {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},

    creates a new table inside of our database
    */
    async create_table(name, row_titles, row_types, client) {
        // get database connection
        // ensure that it actually worked
        try {
            const db = client.db;
            const table_builder = {};
            for (let i = 0; i < row_titles.length;i++) {
                table_builder[row_titles[i]] = row_types[i];
            }
            const new_table = db.define(name, table_builder);
            return new_table;
        }
        catch (error) {
            emit_error(`could not connect to db: ${error}`);
        }
    },

    async add_entry(table, attributes) {
        try {
            const entry = await table.create(attributes);
            await table.sync();
            return entry;
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                // do nothing, repeats are ok here
            }
            else {
                console.log(error);
            }
        }
    },

    async increment(table, amount, identifier) {
        try {
            await table.increment(amount, { where: identifier });
            await table.sync();
        }
        catch (error) {
            emit_error(error);
        }
    },

    async get_one(table, where_claus) {
        try{
            return await table.findOne({ where: where_claus });
        }
        catch (error) {
            emit_error(error);
        }
    },
};