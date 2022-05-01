let { value } = require('./shared');
module.exports = {
	name: 's1',
	async execute(message, args) {
		await message.channel.send(`${value.x}`);
        value.x += 1;
	},
};