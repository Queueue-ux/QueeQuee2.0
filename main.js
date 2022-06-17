const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { db_initialize } = require('./database_structure/db_initializer');
const { get_all_user_objects } = require('./globals/stat_updates');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS],
	fetchAllMembers: true,
	autoReconnect: true,
	});

client.commands = new Collection();

module.exports = client;

// for looping song
client.isLooping = false;

client.distube = new DisTube(client, {
	youtubeDL : false,
	plugins: [new SpotifyPlugin(), new YtDlpPlugin()],
});

// recursive search for command files
const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    }
    else {
      filelist.push(dir + file);
    }
  });
  return filelist;
};

// get all command files
const commandFiles = walkSync('./commands/').filter(file => file.endsWith('.js'));

// read through files and add to client.commands
for (const file of commandFiles) {
	// const command = require(`./commands/${file}`);
	const command = require(file);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// get all events
const eventFiles = walkSync('./events/').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(file);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('connected!');
});

// Interactions with slash commands, these are for more server-oriented commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// anything that needs to be initialized after the login should go here, and has to be awaited after the login
// example: anything that requires database, or lists of members in the server for example
async function init() {
	await client.login(token);
	await db_initialize(client);
	client.user_objects = await get_all_user_objects(client);
	console.log('actually ready now!');
}

// Login to Discord with your client's token
init();