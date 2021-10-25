// Set the date we're counting down to
//var countTime = parseInt(document.getElementById("totTime").value);
//console.log(countTime);
var startTime;
var countTime;
var hours;
var seconds;
var distance;
var pauseTracker;
var isPaused = new Boolean(false);


function onClick2(goodTime){
    //console.log("does this repeat");
    //countTime = document.getElementById("totTime").value;

    if(goodTime == undefined){
        minutes = parseInt(document.getElementById("minutes").value);
        seconds = parseInt(document.getElementById("seconds").value);
        loadTimes(minutes, seconds);
        minutes = minutes*60;
        countTime = minutes + seconds;
        startTime = countTime;
    } else {
        countTime = goodTime;
    }
    // Update the count down every 1 second
    var x = setInterval(function() {
        console.log("Work" +countTime);
        var now = countTime--;
        // Find the distance between now and the count down date
        distance = countTime-1;
        var min2 = Math.trunc((distance / 60));
        var sec2 = (distance % 60);
        // Display the result in the element with id="demo"
        document.getElementById("countdown").innerHTML = "Time left: " + min2 + "m " + sec2 + "s";

        if(isPaused == true){
            clearInterval(x);
        }
        
        if (distance <= 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "TIME DONE!";
            switchSides();
        } 
    }, 1000);
}

function onClickFunction(){
    //console.log(startTime);
    minutes = document.getElementById("minutes").value;
    seconds = document.getElementById("seconds").value;
    minutes = minutes*60;
    startTime = minutes + seconds;
    countTime = startTime;
}

function onClickPause(){
    pauseTracker = distance;

    if(isPaused == false){
        document.getElementById("Pause").innerHTML = "Resume";
        isPaused = true;
        distance = 0;
        console.log("distance" + distance);
    } else if(isPaused == true){
        document.getElementById("Pause").innerHTML = "Pause";
        isPaused = false;
        onClick2(pauseTracker);
    }
}
