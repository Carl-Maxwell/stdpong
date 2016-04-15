window.addEventListener("resize", sizeCanvas);

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
scene = new PIXI.Container();

WIDTH  = 400;
HEIGHT = 240;

TILE     = 16;
HALFTILE = 8;

GRAVITY = 3;

function sizeCanvas() {
  document.body.style.width  = window.innerWidth;
  document.body.style.height = window.innerHeight;

  var w = Math.floor(window.innerWidth  / WIDTH);
  var h = Math.floor(window.innerHeight / HEIGHT);

  var ratio = Math.max(Math.min(w, h), 1);

  if (typeof renderer == "undefined") {
    renderer = new PIXI.WebGLRenderer(WIDTH * ratio, HEIGHT * ratio);
    document.body.appendChild(renderer.view);
  } else {
    renderer.resize(WIDTH * ratio, HEIGHT * ratio);
  }

  renderer.view.style.marginLeft = (window.innerWidth  - ratio*WIDTH) /2;
  renderer.view.style.marginTop  = (window.innerHeight - ratio*HEIGHT)/2;

  renderer.view.style.border = '1px solid #111';

  scene.scale.x = ratio;
  scene.scale.y = ratio;
}

document.addEventListener("DOMContentLoaded", function(event) {
  sizeCanvas();

  Keyboard.initialize();
  Camera.initialize();
  Tiles.initialize();

  //
  // setup the map
  //

  bunny = new Bunny({position: [WIDTH/2, HEIGHT/2]});

  for (var i = 0; i < WIDTH/16*2; i++) {
    new Brick({tileposition: [i*16, HEIGHT - 16]});
  }

  new Brick({tileposition: [WIDTH/2, HEIGHT - 16*4]});
  new Brick({tileposition: [0, HEIGHT - 16*2]});
  new Brick({tileposition: [WIDTH-16*3, HEIGHT - 16*2]});

  new Brick({tileposition: [WIDTH-16*3, HEIGHT - 16*7]});

  for (var i2 = 0; i2 < (WIDTH/16/2 - 1); i2++) {
    new Brick({tileposition: [i2*16, HEIGHT/3*2]});
  }

  new WalkingFoe({position: [16, 16]});

  //
  // main loop
  //

  var lastTime = (new Date()).getTime();
  animate(lastTime);

  function animate(time) {
    var delta = (time - lastTime) / 1000.0;
    lastTime = time;

    requestAnimationFrame(animate);

    TickManager.tick(delta);
    Camera.tick(bunny);
    renderer.render(scene);
  }
});

//
//
//

Bunny = Entity.extend('bunny', [
  Position,
  Size,
  PlayerInput,
  Motion,
  [Sprite, 'bunny']
]);
