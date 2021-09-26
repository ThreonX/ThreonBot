const { AudioPlayerStatus, PlayerSubscription } = require('@discordjs/voice');

module.exports = {
    name: 'pause',
    description: 'pause the audio player',
    execute(message, args){
        
        // check if member is in a voice channel
        const memberVoiceChannel = message.member.voice.channel;
        if(!memberVoiceChannel) return message.channel.send("You need to be in a voice channel to pause.");
               
        // get the audio player
        const audioPlayer = message.client.audioPlayer;
        

        // toggle pause 
        if(audioPlayer.pause()){
            console.log('paused');
        }
        else {
            audioPlayer.unpause();
            console.log('unpaused');
        }
        
    }
}