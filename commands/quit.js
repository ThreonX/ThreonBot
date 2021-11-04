
module.exports = {
    name: 'quit',
    description: 'make the bot leave the channel',
    execute(message){
        const memberVoiceChannel = message.member.voice.channel;

        // if member is not in a channel, they cannot quit the bot
        if (!memberVoiceChannel) return message.channel.send("You need to be in voice channel to disconnect the bot.");


        memberVoiceChannel.queue = undefined;
        memberVoiceChannel.player = undefined;
        try{
            memberVoiceChannel.connection.destroy();
            console.log(`connection is destoried, its value is ${memberVoiceChannel.connection.state.status}`);
        } catch {
            message.channel.send('Bot is not in the channel');
        }
        console.log(`queue is ${memberVoiceChannel.queue}`);
        console.log(`player is ${memberVoiceChannel.player}`);

    }
}