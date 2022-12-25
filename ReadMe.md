http://johnriselvato.com/ffmpeg-how-to-normalize-audio/
under node_modules/distube/dist/core/DistubeStream.
	in class distube stream add:
	"-af",
    "loudnorm=I=-16:LRA=11:TP=-1.5",

	to the options

Helpful guides for setting things up:

- how to set up https:
https://adamtheautomator.com/https-nodejs/

- ssl certificate bot:
https://certbot.eff.org/instructions?ws=other&os=windows

- adding CORS
https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/

