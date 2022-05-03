const client = require('../main');

client.distube
    .on('finishSong', (queue, song) => { // LOOPING EVENT
        if (client.isLooping) {
            client.distube.play(queue.voiceChannel, song, { textChannel: queue.textChannel, unshift: true });
        }
    })
    .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `Playing \`${song.name}\` - \`${song.formattedDuration}\``
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `Added ${song.name} - \`${song.formattedDuration}\` to the queue`
    ));