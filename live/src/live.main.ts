import listenMock from "./listenMock";
import createPlotter from "./createPlotter";
// import salome from "./sounds/salome.mp3";

const plotter = createPlotter();
listenMock((port, evt) => {
  plotter.data = evt;
});

// const ac = new AudioContext();
// console.log(ac.state);
// const audio = document.createElement("audio");
// audio.src = salome;
// audio.autoplay = true;
// const source = ac.createMediaElementSource(audio);
// const gain = ac.createGain();
// gain.gain.value = 0.5;
// source.connect(gain);
// gain.connect(ac.destination);
