
// setup for discord
const { Client, Intents, Message, MessageEmbed, DiscordAPIError, Collection } = require('discord.js');
const client = new Client({intents : [Intents.FLAGS.GUILD_MESSAGES , Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS]});
const { token } = require('./config.json');

client.once ('ready', () => {
    console.log('Ready');
});

// parameters setup for code
const prefix = '!';

const fs = require('fs');
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
 
    console.log('messgae is ' + command);

});



// login
client.login(token);