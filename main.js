
// setup for discord
const { Client, Intents, Collection } = require('discord.js');
const client = new Client({intents : [Intents.FLAGS.GUILD_MESSAGES , Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES ]});
const { token } = require('./config.json');

client.once ('ready', () => {
    console.log('Ready');
    initialize();
});

function initialize() {
    
}

// setting command prefix
const prefix = '!';

// getting commands js from file system
const fs = require('fs');
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

let allCommands = 'Here are all the commands: \n'
    
client.commands.forEach((value, key) => {
    allCommands += `**!${key}** -- ${value.description} \n`
});




// response on a message
client.on('messageCreate', message => {
    // return if not a ! type command
    if (!message.content.startsWith(prefix)){
        return;
    }
    // get command and arguments
    const args = message.content.substr(prefix.length).split(/ +/);
    const command = args.shift();        
    console.log('\n\ncommand is ' + command);
    console.log('argument is ' + args);
    try {
        client.commands.get(`${command}`).execute(message, args); 
    } catch (err) {
        console.log(err);
        message.channel.send(`Your command **${command}** is invalid`);
        message.channel.send(allCommands);
    }
});


// login
client.login(token);