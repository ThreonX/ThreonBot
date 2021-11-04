const { MessageEmbed } = require('discord.js');


class addSongEmbed {
    constructor (video) {
        console.log(video);
        return new MessageEmbed()
        .setColor(Math.floor(Math.random()*16777215).toString(16))
        .setTitle(video.title)
        .setURL(video.url)
        .setAuthor('Song Added')
        .setImage(video.image)
        .setTimestamp()
        .addFields(
            {name: 'Length', value: video.timestamp, inline: true},
            {name: 'Author', value: video.author.name, inline: true},               
        )
    }
}

class queueEmbed {
    constructor(message) {
        let memberVoiceChannel = message.member.voice.channel;
        let result = new MessageEmbed()
        .setColor(Math.floor(Math.random()*16777215).toString(16));
        console.log('membervoicechannel.queue length is ' + memberVoiceChannel.queue.length);
        if(!memberVoiceChannel.queue){
            result
            .setTitle('Queue is empty')
        } else {
            let index = 1;
            memberVoiceChannel.queue.forEach( video => {
                result.addFields(
                    {name: 'Position', value: `${index}`, inline: true},
                    {name: 'Length', value: video.timestamp, inline: true},
                    {name: 'Title', value: video.title, inline: true},
                    {name: '\u200B', value: '\u200B', inline: false}
                    
                );
                index ++;
            });
        }   
        return result;
    }
}

module.exports.addSongEmbed = addSongEmbed;
module.exports.queueEmbed = queueEmbed;
