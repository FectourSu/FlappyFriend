//Select cvs
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
const DEGREE = Math.PI / 180;

//Load sprite image
const sprite = new Image();
sprite.src = "img/sprite.png";

const sprite2  = new Image();
sprite2.src = "img/sprite2.png";

//Load sounds
const SCORE_S = new Audio();
SCORE_S.src = "sound/point.wav";

const HIT_S = new Audio();
HIT_S.src = "sound/die.wav";

const SWOOSHING_S = new Audio();
SWOOSHING_S.src = "sound/swooshing.wav";

const DIE_S = new Audio();
DIE_S.src = "sound/die.wav";

const FLAP_S = new Audio();
FLAP_S.src = "sound/flap.wav";

//Game State
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  over: 2
}

//Start button cord
const startBtn = {
  x : 302,
  y : 400,
  w : 83,
  h : 29
}

//Control the game
cvs.addEventListener("click", function(evt){
  switch(state.current)
  {

    case state.getReady:
      state.current = state.game;
      SWOOSHING_S.play();
      break;
      
    case state.game:
      if(friend.y - friend.radius <= 0) 
        return;
      friend.flap();
      break;

    case state.over:
      let rect = cvs.getBoundingClientRect();
      let clickX = evt.clientX - rect.left;
      let clickY = evt.clickY - rect.top;

    if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h)
    {
      apartment.reset();
      freind.speedReset();
      score.reset();
      state.current = sate.getReady;
    }
    break;
    
  }
    
})

//Background
const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: cvs.height - 226,

  draw: function () {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }

}

//Star
const star = {
  sX: 0,
  sY: 0,
  w: 365,
  h: 200,
  x: cvs.width - 365,
  y: 0,
  w1: 255,
  x1: cvs.width - 155,

  draw: function () {
    ctx.drawImage(sprite2, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite2, this.sX, this.sY, this.w, this.h, this.x, this.y + this.h, this.w, this.h);
    //full star canvas
    ctx.drawImage(sprite2, this.sX, this.sY, this.w1, this.h, this.x1, this.y, this.w1, this.h);
    ctx.drawImage(sprite2, this.sX, this.sY, this.w1, this.h, this.x1, this.y + this.h, this.w1, this.h);
  }

}

//ForeGround
const fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: cvs.height - 112,
  dx: 2,

    draw: function () {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update : function(){
      if(state.current == state.game)
        this.x = (this.x - this.dx)%(this.w/2);
    }
}

//Friend
const friend = {
   animation : [
        {sX: 280, sY : 115},
        {sX: 279, sY : 163}
    ],
  x: 158,
  y: 150,
  w: 23,
  h: 30,

  frame: 0,
  radius: 12,

  gravity: 0.3,
  jump: 4.5,
  speed: 0,
  rotation: 0,

  draw: function(){
    let friend = this.animation[this.frame];

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation*DEGREE);
    ctx.drawImage(sprite, friend.sX, friend.sY, this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  },

  flap: function(){
    FLAP_S.play();
    this.speed = - this.jump;
  },

  update: function(){

    if(state.current == state.getReady)
    {
        this.rotation = 0;
        this.y += (frames % 10 == 0) ? Math.sin(frames * DEGREE) : 0;
        this.frame += (frames % 10 == 0) ? 1 : 0;
    }
    else
    {
      this.speed += this.gravity;
      this.y += this.speed;

      if(this.y + this.h/3 >= cvs.height - fg.h)
      {
        this.y = cvs.height - fg.h - this.h/3;
        if(state.current == state.game)
        {
          DIE_S.play();
          state.current = state.over;
          this.frame = 1;
        }
      }
      if(this.speed >= this.jump) //if the speed is greater then the jump means the bird is falling down
         this.rotation = Math.max(-75, -75 * this.speed / (-2 * this.jump));

      else
        this.rotation = Math.min(60, 60 * this.speed / (this.jump * 3));

      if (state.current == state.over)
        this.rotation = Math.min(65, 65 * this.speed / (this.jump * 1.5));
    }
  },
  speedReset : function(){
    this.speed = 0;
  }
}

//Get ready message
const getReady = {
  sX : 0,
  sY : 228,
  w : 210,
  h : 269,
  x : cvs.width/2 - 210/2,
  y : 80,
  
  draw: function(){
     if(state.current == state.getReady){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
}

//Draw
function draw()
{
  ctx.fillStyle = "#192755";
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  star.draw();
  bg.draw();
  friend.draw();
  fg.draw();
  getReady.draw();
}

//Update
function update() {
  frames++;
  friend.update();
  fg.update();
  //apartment.update();
}

//Loop
function loop()
{
  update();
  draw();
  frames++;

  requestAnimationFrame(loop);
}
loop();
