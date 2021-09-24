
// setup for discord
const { Client, Intents, Message, MessageEmbed, DiscordAPIError, Collection } = require('discord.js');
const client = new Client({intents : [Intents.FLAGS.GUILD_MESSAGES , Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES ]});
const { token } = require('./config.json');

client.once ('ready', () => {
    console.log('Ready');
});

// parameters setup for code
const prefix = '!';

const fs = require('fs');
const { channel } = require('diagnostics_channel');
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


/**
 * respons on message create
 */
client.on('messageCreate', message => {

    // return if not a ! type command
    if (!message.content.startsWith(prefix)){
        return;
    }
    
    // get command and arguments
    const args = message.content.substr(prefix.length).split(/ +/);
    const command = args.shift();

    if (command === 'ping') {
        client.commands.get('ping').execute(message,args);
    }
    else if (command === 'play') {
        client.commands.get('play').execute(message,args);
    }
 
    console.log('message is ' + command);
    console.log('argument is ' + args);

});



// login
client.login(token);