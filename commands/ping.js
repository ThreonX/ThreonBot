module.exports = {
    name: 'ping',
    description: 'ping the bot',
    execute(message, args){
        message.channel.send('pong!');
    }
}