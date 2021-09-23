
// setup
const { Client, Intents, Message, MessageEmbed } = require('discord.js');
const client = new Client({intents : [Intents.FLAGS.GUILD_MESSAGES , Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS]});
const { token } = require('./config.json');

client.once ('ready', () => {
    console.log('Ready');
});




const prefix = '!';

/**
 * respons on message create
 */
client.on('messageCreate', message => {

    // return if not a ! type command
    if (!message.content.startsWith(prefix)){
        return;
    }
    // messgae is asdf,asdf
    const command = message.content.substr(prefix.length).split(/ +/);

 
    console.log('messgae is ' + command);

});



// login
client.login(token);