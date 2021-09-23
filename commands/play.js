const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { VoiceChannel } = require('discord.js');


module.exports = {
    name: 'play',
    description: 'placeholder',
    async execute(message, args){
        //get memebr voice channel
        console.log("here");
        const voiceChannel = message.member.voice.channel;
        console.log(voiceChannel);

        // checks
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to play");
        if (!args.length) return message.channel.send('Play what?');



        /////////////////////////////THIS WILL NOT WORK IN V13
    
        const connection = await voiceChannel.join();
        
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            return(videoResult.videos.lenth > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(args.join(' '));
       
        if (video) {
            const stream = ytdl(video.url, {filter: 'audioonly'});
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () =>{
                VoiceChannel.leave();

            message.reply(`Now Playing ${video.title}`);
            })
        }
        else {
            message.channel.send("Video not found");
        } 

        

    }
}