const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;

var engine, world, bgImg, ground, tower, towerImg;
var cannon
var angle=20
var balls = []
var boats = []
var cooldown = 0
var PirateSpeed= -1.2
var score= 0
var GameOver= false
var pirateIsLaughing= false

var boatAnimation= []
var boatSpriteData
var boatSpriteSheet

var brokenBoatAnimation= []
var brokenBoatSpriteData
var brokenBoatSpriteSheet


var waterSplashAnimation= []
var waterSplashSpriteData
var waterSplashSpriteSheet

var waterSound
var pirateSound
var backMusic
var cannonExplosion

function preload() {
bgImg = loadImage("./assets/background-river.jpg")
towerImg= loadImage("./assets/tower.png")

boatSpriteData= loadJSON("./assets/boat/boat.json")
boatSpriteSheet= loadImage("./assets/boat/boat.png")

brokenBoatSpriteData= loadJSON("./assets/boat/broken_boat.json")
brokenBoatSpriteSheet= loadImage("./assets/boat/broken_boat.png")

waterSplashSpriteData= loadJSON("./assets/water_splash/water_splash.json")
waterSplashSpriteSheet= loadImage("./assets/water_splash/water_splash.png")

waterSound= loadSound("./assets/cannon_water.mp3")
pirateSound= loadSound("./assets/pirate_laugh.mp3")
backMusic= loadSound("./assets/background_music.mp3")
cannonExplosion= loadSound("./assets/cannon_explosion.mp3")

}
function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  

  var static_option = {
    isStatic: true
  }

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, static_option);
  World.add(world, ground);

  tower = Bodies.rectangle(160,350,160,310,static_option)
  World.add(world, tower);
  angleMode(DEGREES)
  angle=15
  cannon= new Cannon(180,110,160,130,angle)

  var boatFrames = boatSpriteData.frames

  for(var i=0;i<boatFrames.length;i++){
    var pos = boatFrames[i].position
    var boatImg = boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    boatAnimation.push(boatImg)
  }

  var brokenBoatFrames = brokenBoatSpriteData.frames

  for(var i=0;i<brokenBoatFrames.length;i++){
    var pos = brokenBoatFrames[i].position
    var brokenBoatImg = brokenBoatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    brokenBoatAnimation.push(brokenBoatImg)
  }

  var waterSplashFrames = waterSplashSpriteData.frames

  for(var i=0;i<waterSplashFrames.length;i++){
    var pos = waterSplashFrames[i].position
    var waterSplashImg = waterSplashSpriteSheet.get(pos.x,pos.y,pos.w,pos.h)
    waterSplashAnimation.push(waterSplashImg)
  }


}
 

function draw() {
background("skyblue")
image(bgImg,0,0,1200,600)
fill(GRAY)
textSize(30)
text("score:"+score,20,30)


  Engine.update(engine);
  rect(ground.position.x, ground.position.y, width * 2, 1);
  push()
  imageMode(CENTER)
  image(towerImg,tower.position.x, tower.position.y, 160,310);
  pop()
  showBoats()
  cannon.display()
  for(var i=0;i<balls.length;i++){
    showCannonBalls(balls[i],i)
    collisionWithBoat(i)
  }

  if(cooldown>=1){cooldown-=1}
}

function keyReleased(){
  if(keyCode==DOWN_ARROW&&cooldown<=1){
    
    balls[balls.length-1].shoot()
    cooldown= 50
  }
}
function keyPressed(){
  if(keyCode==DOWN_ARROW){
   var cannonball = new CannonBall(cannon.x,cannon.y)
   balls.push(cannonball)
  }
}
function showCannonBalls(ball,index){
  if(ball){
    ball.display()
    if(ball.body.position.x>=width||ball.body.position.y>=height-50){
      ball.remove(index)
    }
  }

}
function showBoats(){
  if(boats.length>0){
    if(boats[boats.length-1]===undefined||
      boats[boats.length-1].body.position.x<width-300){
        var positions= [-40,-60,-70,-20]
        var position= random(positions)
        var boat= new Boat(width-79,height-60,170,170,position,boatAnimation)
        boats.push(boat)
      }
    for(var i= 0;i<boats.length;i++){
      if(boats[i]){
        Matter.Body.setVelocity(boats[i].body,{x:PirateSpeed,y:0})
        boats[i].display()
        boats[i].animate()
        var collision=Matter.SAT.collides(this.tower,boats[i].body)
        if(collision.collided&&!boats[i].isBroken){
          if(!pirateIsLaughing&&pirateSound.isPlaying()){
            pirateSound.play()
            pirateIsLaughing= true
          }
          GameOver= true
          
        }
      }
    }
  }
  else{
    var boat= new Boat(width-79,height-60,170,170,-80,boatAnimation)
    boats.push(boat)
  }
  if(frameCount%160===0&&PirateSpeed>=-2.6){
    PirateSpeed-=0.1
  }
}
function collisionWithBoat(index){
  for (let i = 0; i < boats.length; i++) {
    if (balls[index]!==undefined&&boats[i]!==undefined) {
      var collision=Matter.SAT.collides(balls[index].body,boats[i].body)
        if(collision.collided){
          score+=10
          boats[i].remove(i)
          Matter.World.remove(world,balls[index].body)
          delete balls[index]
        }
      }
    }
  }
