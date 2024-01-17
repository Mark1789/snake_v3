let out = document.querySelector(".out");
let snake = document.querySelector(".snakeHead");
let left = document.querySelector(".left");
let up = document.querySelector(".up");
let down = document.querySelector(".down");
let right = document.querySelector(".right");
let food = document.querySelector(".food");
let menu = document.querySelector(".menu");
let pause = document.querySelector(".pause_block");
let pause_t = document.querySelector(".pause_text");
let pause_s = document.querySelector(".pause_symbol");
let slowM = document.querySelector(".slowR");
let normM = document.querySelector(".normR");
let fastM = document.querySelector(".fastR");
let bounceM = document.querySelector(".bounceR");
let viewM = document.querySelector(".viewMode");

var process;
let startok = true;
let playPause = true;
let bounce = false;
let way = "s";
let wayBefore = "l";
let speed = 14;
let step = 1;
let sizeBoxes = 30;
let areaMin = 0;
let areaMax = 300 - sizeBoxes;
let coordinates = new Array(40).fill(["150px","150px"]);
let i = 1;
let longSumDef = 30;
let long = longSumDef;
let cornersHeadSnake = [];
let foodSides = [];
let bodySides = [];
let foodCoords = [];
let boxs = [];
let fail = () => `You fail. Score: ${score.innerHTML}`;
snake.style.transform = "rotate(0deg)";
let modeText = viewM.innerHTML;

function defaultMode (spd, mode, bnc) {

  snake.style.top = "150px";
  snake.style.left = "150px";
  coordinates = new Array(40).fill(["150px","150px"]);
  cornersHeadSnake = [];
  foodSides = [];
  bodySides = [];
  foodCoords = [];
  for (let i = 0; i < boxs.length; i += 1) {
    let elem = document.querySelector(`#${boxs[i]}`)
    out.removeChild(elem)
  }
  boxs = [];
  randLocFood();
  score.innerHTML = "0";
  modeText = mode;
  
  speed = spd;
  bounce = bnc;
  viewM.innerHTML = mode;
  
  moveBack();
}

//check snake hurt yourself body, if NOT, then take coordinates snake-head
function coord () {
  
  for (let y = 0; y < cornersHeadSnake.length; y += 1) {
    if (bodySides.includes(cornersHeadSnake[y].toString())) {
     alert(fail());
       pauseOn();
       defaultMode(speed, modeText, bounce?true:false);
    }
  }
 
  if (coordinates.size > (areaMax * 5)) coordinates.pop();
  coordinates.unshift([snake.style.top, snake.style.left])
  corners();
}

//get coordinates 4 corners head-snake
function corners() {
  let topSnake = parseInt(snake.style.top);
  let leftSnake = parseInt(snake.style.left);
  cornersHeadSnake = [];
  cornersHeadSnake.push([snake.style.top, snake.style.left]);
  cornersHeadSnake.push([snake.style.top, leftSnake + sizeBoxes + "px"]);
  cornersHeadSnake.push([topSnake + sizeBoxes + "px", leftSnake + sizeBoxes + "px"]);
  cornersHeadSnake.push([topSnake + sizeBoxes + "px", snake.style.left]);
}

//creat food
function randLocFood () {
  let randomTop = Math.round(Math.random()*(areaMax/step))*step;
  let randomLeft = Math.round(Math.random()*(areaMax/step))*step;
  
  let topSnake = parseInt(snake.style.top);
  let leftSnake = parseInt(snake.style.left);
  
  //check near food for snake head or not, if YES, restarting function 
  if (randomTop > (topSnake - 60) && randomTop < (topSnake + 60) && randomLeft > (leftSnake - 60) && randomLeft < (leftSnake + 60)) {
    randLocFood();
    return;
  }
  food.style.top =  randomTop + "px";
  food.style.left = randomLeft + "px";
  foodBorder()
}
randLocFood ();

//get all sides food
function foodBorder() {
  let topFood = parseInt(food.style.top);
  let leftFood = parseInt(food.style.left);
  foodSides = [];
  for (let i = 0; i < sizeBoxes; i += 1) {
    foodSides.push([food.style.top, leftFood + i + "px"].toString());
    
    foodSides.push([topFood + sizeBoxes + "px", leftFood + (sizeBoxes - i) + "px"].toString());
  }
  
  for (let i = 0; i < sizeBoxes; i += 1) {
    foodSides.push([topFood + i + "px", leftFood + sizeBoxes + "px"].toString());
  
    foodSides.push([topFood + (sizeBoxes - i) + "px", food.style.left].toString());
  }
}

//check to eat food, if YES, then creat body-box
function check() {
  let checkArrays = false;
  for (let y = 0; y < cornersHeadSnake.length; y += 1) {
    if (foodSides.includes(cornersHeadSnake[y].toString())) {
      checkArrays = true;
      break;
    }
  }

  if (checkArrays) {
    randLocFood();
     out.insertAdjacentHTML("afterbegin", `<div class='snakeBody' style='top:${coordinates[0][0]}; left:${coordinates[0][1]}' id='${'part'+i}'></div>`)
     boxs.push(`${"part"+i}`)
     i += 1;
     score.innerHTML = +score.innerHTML + 1;
  }
}

//showing the menu and hiding it
function moveToward () {
  playPause = true;
  pauseOn();
  menu.style.left = "0%";
}
function moveBack () {
  menu.style.left = "100%";
}

//process interval
function start() {
 process = setInterval(act, speed);
 }
 
 function act () {
  
  let topSnake = parseInt(snake.style.top);
  let leftSnake = parseInt(snake.style.left);

  switch (way) {
    case "u": 
      snake.style.top = (topSnake || 0) - step + "px";
      break;
    case "d": 
      snake.style.top = (topSnake || 0) + step + "px";
      break;
    case "l": 
      snake.style.left = (leftSnake || 0) - step + "px";
      break;
    case "r": 
      snake.style.left = (leftSnake || 0) + step + "px";
      break;
    default: 
      break;
  }
  
  //check bump snake with border square
  if ((topSnake < areaMin) && bounce) {
      snake.style.top = (topSnake + 40) + "px";
      coordinates.splice(0, 30);
    }  
  if ((topSnake > areaMax) && bounce) {
      snake.style.top = (topSnake - 40) + "px";
      coordinates.splice(0, 30);
    }  
  if ((leftSnake < areaMin) && bounce) {
      snake.style.left = (leftSnake + 40) + "px";
      coordinates.splice(0, 30);
    }  
  if ((leftSnake > areaMax) && bounce) {
      snake.style.left = (leftSnake - 40) + "px";
      coordinates.splice(0, 30);
    }  
  
if ((topSnake < areaMin || topSnake > areaMax || leftSnake < areaMin || leftSnake > areaMax) && !bounce) {
       alert(fail());
       pauseOn();
       defaultMode(speed, modeText, false);
    }
  
  //assign move body-box
  for (let p = 0; p < boxs.length; p += 1) {
   let box = document.querySelector(`#${boxs[p]}`);
   box.style.top = coordinates[p+long][0];
   box.style.left = coordinates[+long][1];
   //get sides body-boxes
   if (p > 1) {
   let top = parseInt(box.style.top);
  let left = parseInt(box.style.left);
  for (let i = 0; i < sizeBoxes; i += 2) {
    bodySides.push([top + i + "px", left + i + "px"].toString());
    bodySides.push([top + (sizeBoxes - i) + "px", left + i + "px"].toString());
  }
}
   long += longSumDef;
  }
  long = longSumDef;
  
  check();
  coord();
  bodySides.splice(0)
}

//assign way and directory view
function direction (xy) {

  if (way === "u" && xy === "d") return;
  if (way === "d" && xy === "u") return;
  if (way === "l" && xy === "r") return;
  if (way === "r" && xy === "l") return;
  
   //get number corner snake head
  let transDeg = Number(snake.style.transform.match(/-?\d+/).join());
  
  //start move right
  if (wayBefore === "l" && xy === "r") {
      snake.style.transform = `rotate(${transDeg + 180}deg)`;
    }
    
  way = xy;
    
    //up
  if (wayBefore === "l" && way === "u") {
      snake.style.transform = `rotate(${transDeg + 90}deg)`;
    }
  if (wayBefore === "r" && way === "u") {
      snake.style.transform = `rotate(${transDeg - 90}deg)`;
     }
      //down
  if (wayBefore === "l" && way === "d") {
      snake.style.transform = `rotate(${transDeg - 90}deg)`;
     }
  if (wayBefore === "r" && way === "d") {
      snake.style.transform = `rotate(${transDeg + 90}deg)`;
     }
      //l
  if (wayBefore === "u" && way === "l") {
      snake.style.transform = `rotate(${transDeg - 90}deg)`;
    }
  if (wayBefore === "d" && way === "l") {
      snake.style.transform = `rotate(${transDeg + 90}deg)`;
    }
      //r
  if (wayBefore === "u" && way === "r") {
      snake.style.transform = `rotate(${transDeg + 90}deg)`;
    }
  if (wayBefore === "d" && way === "r") {
      snake.style.transform = `rotate(${transDeg - 90}deg)`;
    }
  wayBefore = way;
  
     //run setInterval 
  if (startok) {
    startok = false;
  start();
  }
}

//pause and run process
function pauseOn () {
  //no click while game not run
   if (way === "s") return;
  
  if (playPause) {
    clearInterval(process);
    playPause = false;
    pause_s.innerHTML = ">"
	  pause_t.innerHTML = "[PLAY]";
	  pause_s.style.transform = "rotate(0deg)";
    return;
  }
  if (!playPause) {
    process = setInterval(act, speed);
    playPause = true;
    pause_s.innerHTML = "="
	  pause_t.innerHTML = "[PAUSE]";
	  pause_s.style.transform = "rotate(90deg)";
    return;
  }
}

up.addEventListener("click", () => direction("u"))
down.addEventListener("click", () => direction("d"))
left.addEventListener("click", () => direction("l"))
right.addEventListener("click", () => direction("r"))


slowM.addEventListener("click", () => defaultMode(20, "[MODE] slow speed", false))
normM.addEventListener("click", () => defaultMode(14, "[MODE] norm speed", false))
fastM.addEventListener("click", () => defaultMode(8, "[MODE] fast speed", false))
bounceM.addEventListener("click", () => defaultMode(14, "[MODE] bounce", true))

pause.addEventListener("click", pauseOn)
