const { createAudioResource } = require("@discordjs/voice");
const  ytdl  = require ('ytdl-core');



function playNextInQueue(voiceChannel, message){
    let queue = voiceChannel.queue;
    if(queue.length != 0) {
        console.log('playing next in queue');
        let video = queue.shift();
        voiceChannel.currentVideo = video;
        message.channel.send(`Now playing: **${video.title}** -- ${video.timestamp}`);
        console.log('currentVideo is ' + voiceChannel.currentVideo.title);
        let stream = ytdl(video.url, {filter: 'audioonly',highWaterMark: 1 << 25 }); 
        let resource = createAudioResource(stream);
        voiceChannel.player.play(resource);
    } else {
        voiceChannel.currentVideo = undefined;
        voiceChannel.player.stop();
        message.channel.send('end of queue');
    }
}

module.exports.playNextInQueue = playNextInQueue;

