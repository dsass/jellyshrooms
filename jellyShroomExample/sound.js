let _ctx, _gain, _song;
let SRC = '/aws_aqua.mp3';
let _waveform;
function audioSetup(src) {
  _ctx = new (window.AudioContext || window.webkitAudioContext);
  _gain = _ctx.createGain();
  _gain.connect(_ctx.destination);
  window._top = 24.1
  window._down = 5.4074

  _song = new Audio(src);
  let songSource = _ctx.createMediaElementSource(_song);
  //- _song.currentTime = 21;
  _song.addEventListener('timeupdate', function () {
    //- console.log(this.currentTime);
    if (this.currentTime > _top) {
      console.log(this.currentTime);
      this.currentTime -= _down;
    }

  })

  //- songSource.loop = true;
  //- songSource.loopEnd = 10;
  //- songSource.loopStart = 0;

  songSource.connect(_gain);
  //- _song.currentTime = 0;
  setTimeout(() => {
    _song.volume = 0;
    //- _song.play();
    _song.volume = 0.3;
  }, 500);

}

function drawOscilloscope() {
  const analyser = _ctx.createAnalyser();
  _gain.connect(analyser);
  _waveform = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatTimeDomainData(_waveform);

  function updateWaveform() {
    //- console.log(analyser.frequencyBinCount);
    requestAnimationFrame(updateWaveform);
    analyser.getFloatTimeDomainData(_waveform);
    const foo = Math.max.apply(null, _waveform);
    //- // const wat = `scale(${foo},${foo})`;
    //- console.log(wat);
    //- $onButton.style.width = foo*10 + 'px';
    const color = Math.round(foo*125+100);
    $onButton.style.backgroundColor = `rgb(${color}, ${color}, ${color})`;
  }
  updateWaveform();
}

