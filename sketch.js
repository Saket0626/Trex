var PLAY = 1;
var END = 0;
var gamestate = PLAY
var trex, trex_running, groundImage;
var trex_collided,gameoverImage,restartImage
var jumpsound,diesound,checkpointsound
function preload() {
  restartImage = loadImage("restart.png")
  gameoverImage = loadImage("gameOver.png")
  trex_collided = loadAnimation("trex_collided.png")
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  jumpsound=loadSound("jump.mp3")
  checkpointsound=loadSound("checkpoint.mp3")
  diesound=loadSound("die.mp3")
}

function setup() {
  createCanvas(600, 200)
  //create a trex sprite
  trex = createSprite(50, 160, 20, 50)
  trex.addAnimation("running", trex_running)
  edges = createEdgeSprites()
  //adding scale and position to trex
  trex.scale = 0.5
  trex.x = 50
  //create ground sprite
  ground = createSprite(200, 180, 400, 20)
  ground.addImage("ground", groundImage)
  ground.x = ground.width / 2
  gameover=createSprite(300,300);
  gameover.addImage(gameoverImage);
  gameover.scale=0.5
 restart=createSprite(300,300);
  restart.addImage(gameoverImage);
  restart.scale=0.5
  // create invisible ground sprite
  invisibleGround = createSprite(200, 190, 400, 10)
  invisibleGround.visible = false
  //to create obstacle and cloud groups
  obstaclegroup = new Group();
  cloudgroup = new Group()
  console.log("Hello" + "world")
  trex.setCollider("rectangle",0,0,400,trex.height);
  trex.debug=true;
  score = 0;
}

function draw() {
  background("white");
  console.log("This is a test message");
  text("score; " + score, 500, 50);
  if (gamestate === PLAY) {
    gameover.visible=false;
    restart.visible=false;
    ground.velocityX = -(6+3*score/100)
    score = score + Math.round(getFrameRate() / 60)
    if(score>0 && score%100===0){
      checkpointsound.play()
    }
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
    //jump when space key is pressed
    if (keyDown("space") && (trex.y >= 160)) {
      trex.velocityY = -10;
      jumpsound.play()
    }
    trex.velocityY = trex.velocityY + 0.5
    spawnclouds()
    spawnobstacles()
    if(obstaclegroup.isTouching(trex)){
    gamestate=END;
     // diesound.play()
     jumpsound.play()
     trex.velocityY=-10
    }
  }
  else if (gamestate === END) {
    gameover.visible=true;
    restart.visible=true;
    if(mousePressedOver(restart)){
      restart
    }
    ground.velocityX = 0
    trex.velocityY = 0
    trex.changeAnimation("collided",trex_collided)
    obstaclegroup.setLifetimeEach(-1)
    cloudgroup.setLifetimeEach(-1)
    obstaclegroup.setVelocityXEach(0)
    cloudgroup.setVelocityXEach(0)
  }
  console.log(trex.y)
  console.log("trex runner")
  console.log(trex.y)
  //stop trex from falling down
  trex.collide(invisibleGround)
  if(mousePressedOver(restart)){
    reset();
  }
  drawSprites()
  console.log(frameCount)
}
function reset(){
  gamestate=PLAY;
  gameover.visible=false
  restart.visible=false;
  obstaclegroup.destroyEach()
  cloudgroup.destroyEach()
  trex.changeAnimation("running",trex_running)
  score=0
}

function spawnclouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10)
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10, 60))
    cloud.scale = 0.4
    cloud.velocityX = -3

    //assign life time to variable
    cloud.lifetime = 200;
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1
    //to add a cloud to the group
    cloudgroup.add(cloud);
  }
}

function spawnobstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6+score/100);
    var ran = Math.round(random(1, 6))
    console.log(ran)
    switch (ran) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default: break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 300
    //to add each obstacle to the group
    obstaclegroup.add(obstacle)
  }
}