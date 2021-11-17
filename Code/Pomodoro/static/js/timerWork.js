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
    console.log("Work time starting");
    document.getElementById("start").disabled = true;


    if(goodTime == undefined){
        var minBox = document.getElementById("minutes").value;
        var secBox = document.getElementById("seconds").value;
        if(minBox === ''){
            minutes = 0;
        } else {
            minutes = parseInt(document.getElementById("minutes").value);  
        }
        if(secBox === ''){
            seconds = 0; 
        } else {
            seconds = parseInt(document.getElementById("seconds").value);
        }
        loadTimes(minutes, seconds);
        minutes = minutes*60;
        countTime = minutes + seconds;
        startTime = countTime;
        $(".workbutton, .chillbutton").toggle();
    } else {
        countTime = goodTime;
    }
    console.log("Total Count time: " +countTime);
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
            $(".workbutton, .chillbutton").toggle();
        }
        
        if (distance <= 0) {
            console.log("Timer done work side, switching...");
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "TIME DONE!";
            onClickChill();
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
        $(".workbutton, .chillbutton").toggle();
    }
}
// if(isPaused == true || minutes != 0 && seconds != 0){
//     $("#chillButton").remove();
// }
// if(isPaused == true ){
//     $("#workbutton").remove();
// }