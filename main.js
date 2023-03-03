const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { db_initialize } = require('./database_structure/db_initializer');
const { get_all_user_objects } = require('./globals/stat_updates');
const { get_one, increment } = require('./globals/database_commands');
const { start } = require('node:repl');

const client = new Client({
	intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers],
	fetchAllMembers: true,
	autoReconnect: true,
	});

client.commands = new Collection();

module.exports = client;

// for looping song
client.isLooping = false;

client.distube = new DisTube(client, {
	plugins: [new SpotifyPlugin(), new YtDlpPlugin()],
	nsfw: true,
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
// //////////////////////
// WEB SERVER SECTION
// //////////////////////

// //////////////////////
// functions for server responses
// //////////////////////
async function get_balance(name, res) {
    const table = client.tables['user_stats'];
    const sender_data = await get_one(table, { user:  name });
    res.send(`${sender_data.dataValues['quee_coin']}`);
}
async function change_funds(name, amount, res) {
	const table = client.tables['user_stats'];
	console.log(amount);
	increment(table, { quee_coin: (amount) }, { user: name });
}
/*
// //////////////////////
// initialize server
// //////////////////////
const express = require('express');
const bodyParser = require('body-parser');
// Instantiate an Express application
const app = express();
//const cors = require('cors');
//app.use(cors({ origin: 'https://queequeewebsite.github.io' }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.raw());

// Create a NodeJS HTTPS listener on port 4000 that points to the Express app
// Use a callback function to tell when the server is created.
/* https
.createServer({
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
	}, app)
.listen(80, ()=>{
	console.log('server is runing at port 4000');
}); should be a multi-line comment break here

// Create an try point route for the Express app listening on port 4000.
// This code tells the service to listed to any request coming to the / route.
// Once the request is received, it will display a message 'Hello from express server.'
app.get('/', (req, res)=>{
	const query = req.query;
	const name = query.name + '#' + query.num;
	const request = query.request;
	if (request == 'balance') {
		const balance = get_balance(name, res);
	}
	//res.send('Hello from express server.');
});

app.post('/',(request,response) => {
	//code to perform particular action.
	//To access POST variable use req.body()methods.
	let body = request.body;
	let test = 1;
	let name = body.name + "#" + body.discriminator;
	if (body.request == "add_funds") {
		change_funds(name, body.amount, response);
	}
});


//app.listen(80);
let server = app.listen(80, function() {
	const test = server.address();
  console.log("... port %s in %s mode", server.address().address, app.settings.env);
});
console.log('API Online');
*/
