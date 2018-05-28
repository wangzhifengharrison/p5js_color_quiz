var img;
var imgs = [];
var levels;
var bg;

function setup() { 
  colorMode(HSL);
  createCanvas(windowWidth, windowHeight);
  bg = color(255);
  var colors = {
    r: color(  0,100,45),
    o: color( 30,100,50),
    y: color( 60,100,50),
    g: color(120,100,40),
    b: color(240,100,70),
    p: color(290,100,40)
  };
  levels = new CircularArray([
    ['car-o',       'rb'],
    ['shoe-o',      'rg'],
    ['hat-o',       'gb'],
    ['bicycle-o',   'ryb'],
    ['sock-o',      'rygb'],
    ['pants-o',     'roygb'],
    ['truck-o',     'roygbp'],
    ['train-o',     'pog'],
    ['motorcycle-o','prb'],
    ['shirt-o',     'gy'],
    ['boot-o',      'gp'],
    ['bird-o',      'op'],
  ].map(([imgName,colorCodes]) => {
    let img = loadImage('assets/' + imgName + '.svg');
    return colorCodes
      .split('')
      .map((k,i) => new ColoredSubject(
        colors[k],
        i*360/colorCodes.length,
        img));
  }));
} 

function keyPressed(){
  switch(keyCode){
    case LEFT_ARROW:  levels.movePrev(); break;
    case RIGHT_ARROW: levels.moveNext(); break;
    break;
  }
}

function mouseClicked(){
  let drawables = levels.getCurrent();
  let clicked = drawables.filter(d => d.containsPoint(mouseX, mouseY))[0];
  if(clicked){
    bg = clicked.color;
  }
}

function draw() { 
  background(bg);
  let drawables = levels.getCurrent();
  for(var i=0; i<drawables.length; i++){
    drawables[i].draw();
  }
}

function svgImage(img, x, y, size){
  let scale = Math.min(size / img.width, size / img.height);
  image(img, x, y, scale * img.width, scale * img.height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function ColoredSubject(color,degreesOffset,img){
  var _inBound = true;
  var _rotation = 0;
  var _size = {
    ellipse: 1
  };
  this.color = color;
  this.containsPoint = (x,y) => {

    return false;
  };
  this.draw = () => {
    push();
    let duration = 100;
    angleMode(DEGREES);
    rectMode(CENTER);
    imageMode(CENTER);
    _rotation = degreesOffset + (frameCount/10 % 360);
    let x0 = windowWidth / 5;
    let y0 = windowHeight / 5;
    let r = Math.sqrt(x0*x0 + y0*y0);
    let x = r * cos(radians(_rotation)) + x0;
    let y = r * sin(radians(_rotation)) + y0;
    translate(windowWidth / 2, windowHeight / 2);
    rotate(-_rotation);
    translate(x0,y0);
    rotate(_rotation);
    if(frameCount % duration == 0){
      _inBound = !_inBound;
    }
    let progress = (frameCount % duration)/duration;

    let sizeFactor = (windowWidth / 500 );
    let s = sizeFactor * (40 + 10 * Easing.Sinusoidal.InOut(_inBound ? progress : 1 - progress));
    _size.ellipse = s + (sizeFactor * 40);
    strokeWeight(5);
    fill(color);
    ellipse(0, 0, _size.ellipse, _size.ellipse);
    if(img){
      svgImage(img,0,0,s);
    }
    pop();
  };
}