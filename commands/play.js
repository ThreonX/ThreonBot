const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { VoiceChannel } = require('discord.js');
const { generateDependencyReport, AudioResource, createAudioResource, NoSubscriberBehavior, createAudioPlayer, joinVoiceChannel, VoiceConnectionStatus, AudioPlayerStatus } = require ('@discordjs/voice');
const { join } = require('path');


module.exports = {
    name: 'play',
    description: 'placeholder',
    async execute(message, args){   
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to play");
        if (!args.length) return message.channel.send('Play what?');
        // create a connection, joining a voice channel the message sender is in.
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        connection.on('stateChange', (oldState, newState) => {
            console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
        });
        // create an audio player
        const player = createAudioPlayer({
            behavoirs: {
                NoSubscriber: NoSubscriberBehavior.Pause,
            }
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
            
            // playing audio through subscription of an audioplayer
            const subscription = connection.subscribe(player);

            //setup player
            player.play(resource);
            message.reply(`Now Playing ${video.title}`);
            console.log(generateDependencyReport());    
            player.on('stateChange', (oldState, newState) => {
                console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
            });
            player.on('error', () => {
                message.channel.send('Error connection reset');
            })
        }
        else {
            message.channel.send("Video not found");
            return;
        } 


    }
}