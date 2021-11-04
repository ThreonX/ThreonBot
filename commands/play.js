const ytSearch = require('yt-search');
const { NoSubscriberBehavior, createAudioPlayer, AudioPlayerStatus } = require ('@discordjs/voice');
const { joinVoiceChannel } = require ('@discordjs/voice');
const queueUtil = require('../util/queueUtil');
const { addSongEmbed } = require('../util/songEmbed');
module.exports = {
    name: 'p',
    description: 'type !p followed by a Youtube link or the keywords to search on Youtube ',
    async execute(message, args) {   


        const memberVoiceChannel = message.member.voice.channel;
        if(!memberVoiceChannel) return message.channel.send("You need to be in a voice channel to play");
        if (!args.length) return message.channel.send('Play what?');
        
        // check if there is a playlist already
        if (!memberVoiceChannel.queue) { // if there is not a list
            console.log('created a new queue');
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
            // added listener
            memberVoiceChannel.connection.on('stateChange', (oldState, newState) => {
                console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
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
            // Listeners for state changes
            memberVoiceChannel.player.on('stateChange', (oldState, newState) => {
                console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
            });
            memberVoiceChannel.player.on('error', (error) => {
                console.log(error);
                message.channel.send('Error connection reset');
            })  
            memberVoiceChannel.player.on(AudioPlayerStatus.Idle, () => {
                queueUtil.playNextInQueue(memberVoiceChannel, message);
            })
        }

        
        
        // ytdl create an audio resource from Youtube
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return(videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
        const video = await videoFinder(args.join(' '));  

        if (video) {
            memberVoiceChannel.queue.push(video);
            let embed = new addSongEmbed(video);
            message.channel.send({embeds:[embed]});
            // message.channel.send(`Adding **${video.title}** -- ${video.timestamp} to the queue`);
            if(memberVoiceChannel.player.state.status === 'idle'){
                queueUtil.playNextInQueue(memberVoiceChannel, message);
            }
            // console.log(generateDependencyReport());    //// display version information    
        }
        else {
            message.channel.send("Video not found");
            return;
        } 
        
        
    }
}