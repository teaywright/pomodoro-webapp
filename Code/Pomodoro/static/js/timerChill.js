// Set the date we're counting down to
//var countTime = parseInt(document.getElementById("totTime").value);
//console.log(countTime);
var startTimeChill;
var countTimeChill;
var hours;
var seconds;
var distanceChill;
var pauseTrackerChill;
var isPausedChill = new Boolean(false);


function loadTimes(min, sec){
    //console.log("called");
    //console.log("before" +min+ "m " +sec+ "s");
    min = min/3;
    //sec = 60 - sec;
    if(sec == 0){
        sec = 0;
    } else {
        sec = sec/3;
        min = min - 1;
    }
    //console.log("after" +min+ "m " +sec+ "s");
    document.getElementById("countdownChill").innerHTML = "Time left: " +min+ "m " +sec+ "s";
    min= min*60;
    countTimeChill = min + sec;
}


function onClickChill(goodTimeChill){
    console.log("Chill Timer Start");

    if(goodTimeChill == undefined){
        startTimeChill = countTimeChill;
    } else {
        countTimeChill = goodTimeChill;
    }
    // Update the count down every 1 second
    var y = setInterval(function() {
        console.log("chill" +countTimeChill);
        var now = countTimeChill--;
        // Find the distance between now and the count down date
        distanceChill = countTimeChill-1;
        var minChill = Math.trunc((distanceChill / 60));
        var secChill = (distanceChill % 60);
        // Display the result in the element with id="demo"
        document.getElementById("countdownChill").innerHTML = "Time left: " + minChill + "m " + secChill + "s";

        if(isPausedChill == true){
            clearInterval(y);
        }
        
        if (distanceChill <= 0) {
            clearInterval(y);
            document.getElementById("countdownChill").innerHTML = "TIME DONE!";
            switchSides();
            onClick2();
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

function onClickPauseChill(){
    pauseTracker = distance;

    if(isPausedChill == false){
        document.getElementById("PauseChill").innerHTML = "Resume";
        isPausedChill = true;
        distanceChill = 0;
        console.log("distance" + distance);
    } else if(isPausedChill == true){
        document.getElementById("PauseChill").innerHTML = "Pause";
        isPausedChill = false;
        onClickChill(pauseTrackerChill);
    }
}
