var timer = 60;
var score = 0;
var hitrn = 0;

// jispe clcik kroge wo elemnt per event raise hoga ,aur event listner na milne par element ke parent par listener dhundhega, waha bhi naa milne par event parent ke parent ke parent par listner dhundega

function increaseScore(){
    score += 10;
    document.querySelector("#scoreval").textContent = score;
}

function getNewHit(){
     hitrn = Math.floor(Math.random()*10);
    document.querySelector("#hitval").textContent = hitrn;
}

function makeBubble() {
  var clutter = " ";

  // 🔥 ONLY ADDITION (mobile vs desktop loop)
  let isMobile = window.innerWidth < 600;
  let loopCount = isMobile ? 50 : 100;
  // 🔥 ABOVE 2 LINES ADDED — NOTHING ELSE

  for (var i = 1; i <= loopCount; i++) {
    var rn = Math.floor(Math.random() * 10);
    clutter += ` <div class="bubble">${rn}</div>`;
  }

  document.querySelector("#pbtm").innerHTML = clutter;
}

function runTimer() {
  var timerint = setInterval(function () {
    if (timer > 0) {
      timer--;
      document.querySelector("#timervalue").textContent = timer;
    } else {
      clearInterval(timerint);
      document.querySelector("#pbtm").innerHTML = ` <h1> Game Over 😭 </h1>`;
    }
  }, 1000);
}

document.querySelector("#pbtm").addEventListener("click", function(dets){
    var clicknum = Number(dets.target.textContent);
    if(clicknum === hitrn){
        increaseScore();
        makeBubble();
        getNewHit();
    }
});

getNewHit();
runTimer();
makeBubble();
