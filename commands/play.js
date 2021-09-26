const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { NoSubscriberBehavior, createAudioPlayer } = require ('@discordjs/voice');
const {  createAudioResource, joinVoiceChannel } = require ('@discordjs/voice');


module.exports = {
    name: 'play',
    description: 'placeholder',
    async execute(message, args) {   
        const memberVoiceChannel = message.member.voice.channel;
        if(!memberVoiceChannel) return message.channel.send("You need to be in a voice channel to play");
        if (!args.length) return message.channel.send('Play what?');
        // create a connection, joining a voice channel the message sender is in.
        const connection = joinVoiceChannel({
            channelId: memberVoiceChannel.id,
            guildId: memberVoiceChannel.guild.id,
            adapterCreator: memberVoiceChannel.guild.voiceAdapterCreator,
        });
        connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        });

        // create an audio resource from Youtube
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return(videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
        const video = await videoFinder(args.join(' '));  
        if (video) {
            // get a readable stream
            const stream = ytdl(video.url, {filter: 'audioonly'}); 
            const resource = createAudioResource(stream);
            
            // create an audio player
            const audioPlayer = createAudioPlayer({
                behavoirs: {
                    NoSubscriber: NoSubscriberBehavior.Pause,
                }
            });
            // define the player as client.player to easily access it 
            message.client.audioPlayer = audioPlayer;

            // playing audio through subscription of an audioplayer
            connection.subscribe(audioPlayer);

            //setup player
            audioPlayer.play(resource);
            message.channel.send(`Now Playing ${video.title}`);
            // console.log(generateDependencyReport());    //// display version information
            audioPlayer.on('stateChange', (oldState, newState) => {
                console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
            });
            audioPlayer.on('error', (error) => {
                console.log(error);
                message.channel.send('Error connection reset');
            })
        }
        else {
            message.channel.send("Video not found");
            return;
        } 


    }
}