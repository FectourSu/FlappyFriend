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
  x: 120,
  y: 263,
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
      let clickY = evt.clientY - rect.top;

      //Check if we click start button
      if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h)
      {
        friend.friendReset();
        apartments.reset();
        score.reset();
        state.current = state.getReady;
      }
      break;
    
  }
    
});

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
        //this.y += (frames % 10 == 0) ? Math.sin(frames * DEGREE) : 0;
        this.y = 150;
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
  friendReset : function(){
    this.speed = 0;
    this.y = 150;
    this.frame = 0;
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
//Game over message
const gameOver = {
    sX: 205,
    sY: 228,
    w: 271,
    h: 200,
    x: cvs.width / 2 - 276 / 2,
    y: 90,

    draw: function () {
      if (state.current == state.over) {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
      }
    }
}
//Apartment
const apartments = {
  position: [],

  rand: [
    {
      sX: 502,
      sY: 0
    },
    {
      sX: 554, 
      sY: 0 
    }
    ],
   
    w: 53,
    h: 400,
    gap: 85,
    maxYPos: -150,
    dx: 2,

    draw: function () {
      for (let i = 0; i < this.position.length; i++) 
      {
        let p = this.position[i];

        let topYPos = p.y;
        let bottomYPos = p.y + this.h + this.gap;

        
        
        
        // top apartment
        ctx.drawImage(sprite, p.sX, p.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

        // bottom apartment
        ctx.drawImage(sprite, p.sX2, p.sY2, this.w, this.h, p.x, bottomYPos, this.w, this.h);
      }
    },

    update: function () {
      if (state.current !== state.game)
       return;

      let rands = this.rand[Math.floor(Math.random() * this.rand.length)];
      let rands2 = this.rand[Math.floor(Math.random() * this.rand.length)];

      if (frames % 100 == 0) {
        this.position.push({
          x: cvs.width,
          y: this.maxYPos * (Math.random() + 1),
          sX: rands.sX,
          sY: rands.sY,
          sX2: rands2.sX,
          sY2: rands2.sY
        });
      }

      for (let i = 0; i < this.position.length; i++) {
        let p = this.position[i];

        let bottomapartmentYPos = p.y + this.h + this.gap;

        // Collision detect
        // Top apartment
        if (friend.x + friend.radius > p.x && friend.x - friend.radius < p.x + this.w && friend.y + friend.radius > p.y && friend.y - friend.radius < p.y + this.h)
        {
          HIT_S.play();
          friend.frame = 1;
          state.current = state.over;
        }
        // Top apartmenet
        if (friend.x + friend.radius > p.x && friend.x - friend.radius < p.x + this.w && friend.y + friend.radius > bottomapartmentYPos && friend.y - friend.radius < bottomapartmentYPos + this.h) 
        {
          HIT_S.play();
          friend.frame = 1;
          state.current = state.over;
        }
        // Move the apartment to the left
        p.x -= this.dx;

        if (p.x == 140) 
        {
          SCORE_S.play();
          score.value += 1;
          score.best = Math.max(score.value, score.best);
          localStorage.setItem("best", score.best);
        }

        // if the apartment go beyond canvas, we delete them from the array
        if (p.x + this.w <= 0) 
        {
          this.position.shift();
        }
      }
    },

    reset: function () {
      this.position = [];
    }
}

//Score
const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value: 0,
  
  draw: function () {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";

    if(state.current == state.game)
    {
      ctx.lineWidth = 2;
      ctx.font = "35px FB";
      ctx.fillText(this.value, cvs.width / 2.1, 60);
      ctx.strokeText(this.value, cvs.width / 2.1, 60);
    }
    else if (state.current == state.over)
    {
      //Score value
      ctx.font = "20px FB";
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);
      // Best score
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },
  reset: function () {
    this.value = 0;
  }
}

//Draw
function draw()
{
  ctx.fillStyle = "#192755";
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  star.draw();
  bg.draw();
  apartments.draw();
  friend.draw();
  fg.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

//Update
function update() {
  friend.update();
  fg.update();
  apartments.update();
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
