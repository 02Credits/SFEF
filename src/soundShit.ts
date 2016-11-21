var ctx = new AudioContext();
var audio = document.createElement('audio');
audio.src = "song/song.mp3";
var audioSrc = ctx.createMediaElementSource(audio);
var analyser = ctx.createAnalyser();
audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
audio.autoplay = true;
audio.play();

export default analyser;
