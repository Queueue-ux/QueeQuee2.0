const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const client = require('../main');
const token = require('../config.json');
const { emit_error } = require('../globals/error_output');
module.exports = {
name: 'shardError',
async execute(error) {
   emit_error(error);
   // hopefully logs back in after disconnect
   client.login(token);
},
};