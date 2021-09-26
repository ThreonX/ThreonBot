const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'quit',
    description: 'leave the channel',
    execute(message, args){
        const memberVoiceChannel = message.member.voice.channel;

        // if member is not in a channel, they cannot quit the bot
        if (!memberVoiceChannel) return message.channel.send("You need to be in voice channel to disconnect the bot.");

        // access the voice connection
        const botVoiceConnection = getVoiceConnection(memberVoiceChannel.guild.id);

        // you don't need to be in the same channel to quit the bot.
        // quit
        botVoiceConnection.destroy();
    
    }
}