const queueUtil = require('../util/queueUtil');



module.exports = {
    name: 'skip',
    description: 'skip the current song',
    execute(message){
        try{
            const memberVoiceChannel = message.member.voice.channel;
            if(!memberVoiceChannel) return message.channel.send("You need to be in a voice channel to skip");
            queueUtil.playNextInQueue(memberVoiceChannel, message);
        } catch (err) {
            console.log(err);
            message.channel.send('Play something first!');
        }
    }
}