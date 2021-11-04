
module.exports = {
    name: 'quit',
    description: 'leave the channel',
    execute(message, args){
        const memberVoiceChannel = message.member.voice.channel;

        // if member is not in a channel, they cannot quit the bot
        if (!memberVoiceChannel) return message.channel.send("You need to be in voice channel to disconnect the bot.");


        memberVoiceChannel.queue = undefined;
        memberVoiceChannel.connection.destroy();
        memberVoiceChannel.player = undefined;
        console.log(`connection is destoried, its value is ${memberVoiceChannel.connection.state.status}`);
        console.log(`queue is ${memberVoiceChannel.queue}`);
        console.log(`player is ${memberVoiceChannel.player}`);

    }
}