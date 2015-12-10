var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioElement = document.getElementById("sound");
console.log(audioElement);
var audioSrc = audioCtx.createMediaElementSource(audioElement);
var analyser = audioCtx.createAnalyser();
// Bind our analyser to the media element source.
audioSrc.connect(analyser);
audioSrc.connect(audioCtx.destination);
var frequencyData = new Uint8Array(200);


var c = document.getElementById("c");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var particles = [];
var max = 1000;

//Background
var red = 0;
var blue = 0;
var green = 0;
var redChange = 0;
var greenChange = 0;
var blueChange = 0;
var clearColor = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";

var density = 3;
var cubeH = 1;
var cubeW = 1;
var speed = 2;
var heightChange = 0;
var heightDir = 1;

var alpha = 0.4;
var alphaChange = 0;
var hue = 0;
var hueChange = 0.1;
var cubeSize = 20;

var mirror = false;
var toggle = false;
var ready = false;

var fov = 15;
var camAngle = 0;

var frame = 0;
var start = 310;
var height = 0;

function toggleFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {  
      document.documentElement.requestFullScreen();  
    } else if (document.documentElement.mozRequestFullScreen) {  
      document.documentElement.mozRequestFullScreen();  
    } else if (document.documentElement.webkitRequestFullScreen) {  
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
    }  
  } else {  
    if (document.cancelFullScreen) {  
      document.cancelFullScreen();  
    } else if (document.mozCancelFullScreen) {  
      document.mozCancelFullScreen();  
    } else if (document.webkitCancelFullScreen) {  
      document.webkitCancelFullScreen();  
    }  
  }  
}

function updateSound () {
analyser.getByteFrequencyData(frequencyData);
alpha = parseFloat(Math.pow(1.003, frequencyData[0])-1.14);
cubeW = parseFloat(Math.pow(1.01, frequencyData[0]));
cubeH = parseFloat(Math.pow(1.01, frequencyData[0]));
console.log (alpha);
}

function random(min, max) {
return (Math.random() * (max - min)) + min;
}

function P() {
this.startZ = start;
start += .18;
}

P.prototype.init = function() {
this.x = random(-w * 8, w * 8); //width of stream 1-8
this.y = height;
this.z = this.startZ || 500;
this.startZ = null;
this.vx = 0; //horz pos of camera
this.vy = camAngle; //vert pos of camera   -100-100
this.vz = speed; //speed towards cam  0.1-10
this.color = "hsla(" + hue + ", 100%, 50%, .8)"; //color of dots
this.size = cubeSize; //cube size
};

P.prototype.draw = function() {
var scale = fov / (fov + this.z);
var x2d = this.x * scale + w / 2;
var y2d = this.y * scale + h / 2;
ctx.fillStyle = this.color;
ctx.fillRect(x2d, y2d, this.size * scale * cubeW, this.size * scale * cubeH);
//Height/width - 1-20
if (x2d < 0 || x2d > w || y2d < 0 || y2d > h) {
this.init();
}

this.update();
};

P.prototype.update = function() {
this.z -= this.vz;
this.x += this.vx;
this.y += this.vy;
if (this.z < -fov) {
this.init();
}
};

for (var i = 0; i < max; i++) {
(function(x) {
setTimeout(function() {
var p = new P();
p.init();
particles.push(p);
}, x * density) //density of particles 0.1-10
})(i)
}

window.addEventListener("resize", function() {
w = c.width = window.innerWidth;
h = c.height = window.innerHeight;
})

function anim() {
ctx.fillStyle = clearColor;
ctx.globalCompositeOperation = "source-over";
ctx.fillRect(0, 0, w, h);

for (var i in particles) {
particles[i].draw();
}

hue += hueChange;
blue += blueChange;
red += redChange;
green += greenChange;
alpha += alphaChange;
height += heightChange*heightDir;
clearColor = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
if (height > 6500)
{
heightDir = -1;
}
   if (height < -6500)
{
heightDir = 1;
}
if (red > 255 || red < -50) //top and bot bounds
{
redChange = redChange * (-1);
}
if (green > 255 || green < -50) //top and bot bounds
{
greenChange = greenChange * (-1);
}
if (blue > 255 || blue < -50) //top and bot bounds
{
blueChange = blueChange * (-1);
}
if (alpha > 1 || alpha < 0) //top and bot bounds
{
alphaChange = alphaChange * (-1);
}
if (toggle)
{
camAngle = -camAngle;
}
if (ready == true)
{
analyser.getByteFrequencyData(frequencyData);
}
updateSound();
window.requestAnimationFrame(anim);
}

function applyBG() {
redChange = Math.round(document.getElementById("redslide").value);
greenChange = Math.round(document.getElementById("greenslide").value);
blueChange = Math.round(document.getElementById("blueslide").value);
}

function applyHeight() {
height = -parseInt(document.getElementById("height").value)
heightChange = 0;
document.getElementById("heightChange").value = 0;
}

function applyMove() {
heightChange = Math.round(document.getElementById("heightChange").value);
speed = Math.round(document.getElementById("speed").value);
}

function applyColor() {
//alphaChange = parseFloat(document.getElementById("alpha").value); This will be for audio reaction
hueChange = parseFloat(document.getElementById("huechange").value);
cubeSize = parseInt(document.getElementById("dotsize").value);
cubeW = parseFloat(document.getElementById("dotwidth").value);
cubeH = parseFloat(document.getElementById("dotheight").value);
}

function applyView() {
camAngle = parseInt(document.getElementById("angle").value);
fov = parseInt(document.getElementById("fov").value);
}

function toggleMirror() {
if (toggle)
{
toggle = false;
}
else
{
if (camAngle == 0)
{
camAngle = 2;
document.getElementById("angle").value = 2;
}
toggle = true;
}
}

function resetAll() {
red = 0;
blue = 0;
green = 0;
document.getElementById("redslide").value = 0;
document.getElementById("greenslide").value = 0;
document.getElementById("blueslide").value = 0;
document.getElementById("height").value = 0;
document.getElementById("heightChange").value = 0;
document.getElementById("speed").value = 2;
document.getElementById("dotsize").value = 20;
document.getElementById("dotwidth").value = 1;
document.getElementById("dotheight").value = 1;
document.getElementById("huechange").value = 0.1;
hue = 0;
document.getElementById("fov").value = 15;
document.getElementById("angle").value = 0;
frame = 0;
start = 310;
toggle = false;
}

anim();
