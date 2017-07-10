addEvent(window, "resize", LetItSnow);
(function LetItSnow() {
  var snowCanvasId = "snowCanvas",
    framerate = 30,
    flakeNumberModifier = 0.1,
    fallSpeedModifier = 0.4;
  var canvas = document.getElementById(snowCanvasId);
  if(canvas) {
    canvas.outerHTML = "";
    return LetItSnow();
  }
  canvas = document.createElement("CANVAS");
  canvas.id = snowCanvasId;
  document.body.appendChild(canvas);
  var context = canvas.getContext("2d"),
    width = window.innerWidth,
    height = window.innerHeight,
    numFlakes = Math.min(width, 300) * height / 400 * flakeNumberModifier,
    flakes = [],
    TWO_PI = Math.PI * 2,
    radHeight = 40;
  canvas.width = width;
  canvas.height = height;
  console.log(width + "x" + height);
  flake = document.createElement("CANVAS"),
    flakeContext = flake.getContext("2d");
  // create flake grafic
  flake.width = 8;
  flake.height = 8;
  flakeContext.fillStyle = "#fff";
  flakeContext.beginPath();
  flakeContext.arc(4, 4, 4, 0, TWO_PI);
  flakeContext.fill();
  // init snowflakes
  for(var x = 0; x < numFlakes; x++) {
    flakes[x] = getRandomFlake(true);
  }
  // start tick at specified fps
  if(window.snowCanvasInterval) {
    clearInterval(window.snowCanvasInterval);
  }
  window.snowCanvasInterval = setInterval(tick, Math.floor(1000 / framerate));
  // main routine
  function tick() {
    var posX = 0,
      imageData;
    // reset canvas for next frame
    context.clearRect(0, 0, width, height);
    for(var x = 0; x < numFlakes; x++) {
      // calculate changes to snowflake
      posX = flakes[x].x + Math.sin(flakes[x].yMod + flakes[x].y / radHeight * (5 - flakes[x].size)) * flakes[x].waveSize * (1 - flakes[x].size);
      flakes[x].y += flakes[x].size * fallSpeedModifier; // bigger flakes are nearer to screen, thus they fall faster to create 3d effect
      // if snowflake is out of bounds, reset
      if(flakes[x].y > height + 5) {
        flakes[x] = getRandomFlake();
      }
      // draw snowflake
      context.globalAlpha = (flakes[x].size - 1) / 3;
      context.drawImage(flake, posX, flakes[x].y, flakes[x].size, flakes[x].size);
    }
    // repeat 300px wide strip with snowflakes to fill whole canvas
    if(width > 300) {
      context.globalAlpha = 1;
      context.drawImage(canvas, 300, 0);
      if(width > 600) context.drawImage(canvas, 600, 0);
      if(width > 1200) context.drawImage(canvas, 1200, 0);
      if(width > 2400) context.drawImage(canvas, 2400, 0);
    }
  }
  // randomize flake data
  function getRandomFlake(init) {
    return {
      x: range(10, 310),
      y: init ? range(-5, height + 5) : -5,
      size: (Math.max(range(1, 4), 2)),
      yMod: range(0, 150),
      waveSize: range(1, 4)
    };
  }
  // get a random number inside a range
  function range(start, end) {
    return Math.random() * (end - start) + start;
  }
})();
