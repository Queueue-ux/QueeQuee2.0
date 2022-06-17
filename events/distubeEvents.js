const client = require('../main');
client.distube
    .on('finishSong', (queue, song) => { // LOOPING EVENT
        if (client.isLooping) {
            client.distube.play(queue.voiceChannel, song, { textChannel: queue.textChannel, unshift: true });
        }
    })
    .on('playSong', (queue, song) =>{
    queue.textChannel.send(
      `Playing \`${song.name}\` - \`${song.formattedDuration}\`\n`
    );
    queue.textChannel.send(song.thumbnail);
    },
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `Added ${song.name} - \`${song.formattedDuration}\` to the queue`
    ))
  .on('error', (channel, e) => {
  channel.send(`An error encountered: ${e.toString().slice(0, 1974)}`);
  console.error(e);
    });