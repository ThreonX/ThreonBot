// require stuff
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');


// create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

client.once ('ready', () => {
    console.log('Ready');
});


client.login(token);