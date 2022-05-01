module.exports = {
	name: 'flip',
	description: 'flip a coin',
	aliases: ['f'],
	usage: 'flip {}',
	async execute(message, args) {
		if (args.length <= 1) {
			if (args.length == 1 && isNaN(args[0])) {
				await message.reply('flip requires a number as argument');
			}
			const flips = args[0];
			if (flips <= 0 || flips > 1000000) {
				await message.reply('idiot');
				return;
			}
			const results = { 	'Heads':0,
								'Tails':0 };
			const choices = ['Heads', 'Tails'];
			for (let i = 0; i < flips; i++) {
				results[choices[Math.floor(Math.random() * 2)]] += 1;
			}
			if (flips > 1) {
				await message.channel.send(`total heads = ${results['Heads']} (${(results['Heads'] / flips).toPrecision(2)}%)\ntotal tails = ${results['Tails']} (${(results['Tails'] / flips).toPrecision(2)}%)`);
			}
			else {
				await message.channel.send(results['Heads'] > 0 ? 'Heads' : 'Tails');
			}
		}
		else {
			await message.reply('flip requires one arg as an integer, or no args');
		}
	},
};