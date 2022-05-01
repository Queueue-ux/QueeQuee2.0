const client = require('../main');

client.distube
    .on('finishSong', (queue, song) => { // LOOPING EVENT
        if (client.isLooping) {
            client.distube.play(queue.voiceChannel, song, { textChannel: queue.textChannel, unshift: true });
        }
    });