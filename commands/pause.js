
module.exports = {
    name: 'pause',
    description: 'toggle pause',
    execute(message){
        
        // check if member is in a voice channel
        const memberVoiceChannel = message.member.voice.channel;
        if(!memberVoiceChannel) return message.channel.send("You need to be in a voice channel to pause.");
               
        // get the audio player
        if(!memberVoiceChannel.audioPlayer) return message.channel.send('Playing something first!')
        const audioPlayer = memberVoiceChannel.audioPlayer;
        

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