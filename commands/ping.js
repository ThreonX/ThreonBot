module.exports = {
    name: 'ping',
    description: 'ping the bot, what is going to happen?',
    execute(message){
        message.channel.send('pong!');
    }
}