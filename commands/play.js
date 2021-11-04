const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { NoSubscriberBehavior, createAudioPlayer, AudioPlayerStatus } = require ('@discordjs/voice');
const {  createAudioResource, joinVoiceChannel } = require ('@discordjs/voice');

module.exports = {
    name: 'p',
    description: 'placeholder',
    async execute(message, args) {   

        function playNextInQueue(queue) {
            console.log('next in queue function started');
            console.log(queue.length);
            if(queue.length != 0) {
                console.log('playing next one in queue');
                memberVoiceChannel.player.play(queue.shift());
            } else {
                console.log('queue is empty');
            }
        }

        const memberVoiceChannel = message.member.voice.channel;
        if(!memberVoiceChannel) return message.channel.send("You need to be in a voice channel to play");
        if (!args.length) return message.channel.send('Play what?');
        
        // check if there is a playlist already
        if (!memberVoiceChannel.queue) { // if there is not a list
            memberVoiceChannel.queue = []; // create a list
        }
        // create a connection, joining a voice channel the message sender is in.
        if(!memberVoiceChannel.connection || memberVoiceChannel.connection.state.status === 'destroyed'){
            console.log('creating a new connection');
            memberVoiceChannel.connection = joinVoiceChannel({
                channelId: memberVoiceChannel.id,
                guildId: memberVoiceChannel.guild.id,
                adapterCreator: memberVoiceChannel.guild.voiceAdapterCreator,
            });
        }
        
        // create an audio player
        if(!memberVoiceChannel.player) {
            console.log('creating a new audio player')
            memberVoiceChannel.player = createAudioPlayer({
               behavoirs: {
                   NoSubscriber: NoSubscriberBehavior.Pause,
               }
           });
           // playing audio through subscription of an audioplayer
           memberVoiceChannel.connection.subscribe(memberVoiceChannel.player);
        }

           // Listeners for state changes
        memberVoiceChannel.player.on('stateChange', (oldState, newState) => {
            console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
        });
        memberVoiceChannel.player.on('error', (error) => {
            console.log(error);
            message.channel.send('Error connection reset');
        })  
        memberVoiceChannel.player.on(AudioPlayerStatus.Idle, () => {
            playNextInQueue(memberVoiceChannel.queue);
        })
        memberVoiceChannel.connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        });
        
        
        // ytdl create an audio resource from Youtube
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return(videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
        const video = await videoFinder(args.join(' '));  

        if (video) {
            // get a readable stream
            const stream = ytdl(video.url, {filter: 'audioonly',highWaterMark: 1 << 25 }); 
            console.log('The value of highWaterMark is ' + stream.readableHighWaterMark);
            const resource = createAudioResource(stream);
            memberVoiceChannel.queue.push(resource);
            message.channel.send(`Adding ${video.title} to the queue`);
            console.log(memberVoiceChannel.player.state.status);
            if(memberVoiceChannel.player.state.status === 'idle'){
                console.log('after adding a new video the audio status is in IDLE');
                playNextInQueue(memberVoiceChannel.queue);
            }
            // console.log(generateDependencyReport());    //// display version information    
        }
        else {
            message.channel.send("Video not found");
            return;
        } 
        
        
    }
}