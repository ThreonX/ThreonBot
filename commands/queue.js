const { queueEmbed } = require("../util/songEmbed");

module.exports = {
    name: 'queue',
    description: 'display the queue',
    execute(message){
       
        // check if member is in a voice channel
        const memberVoiceChannel = message.member.voice.channel;
        if(!memberVoiceChannel) return message.channel.send("You need to be in the voice channel to see the queue");
        
        let embed = new queueEmbed(message);
        message.channel.send({embeds: [embed]});
        // if (!memberVoiceChannel.queue){
        //     message.channel.send('Queue is empty');
        //     return;
        // }

        // try{
        //     message.channel.send(`Currently Playing: **${memberVoiceChannel.currentVideo.title}** -- ${memberVoiceChannel.currentVideo.timestamp}`);
        // } catch (err){
        //     message.channel.send('Queue is empty');
        // }

        // let counter = 2;
        // memberVoiceChannel.queue.forEach(element => {
        //     console.log(element);
        //     message.channel.send(`${counter}. **${element.title}** -- ${element.timestamp}`);
        //     counter ++;
        // });

    }
}