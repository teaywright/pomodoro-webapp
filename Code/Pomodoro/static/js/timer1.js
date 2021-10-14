// Set the date we're counting down to
var countTime = 60;
console.log("working");


function onClick2(){
// Update the count down every 1 second
    var x = setInterval(function() {
      console.log(countTime);
    //console.log("Hello");
    var now = countTime--;

    // Find the distance between now and the count down date
    var distance = countTime-1;
    //console.log(countTime);

    //console.log(minutes);
    //console.log(seconds);
    var min2 = Math.trunc((distance / 60));
    var sec2 = (distance % 60);
    //console.log(min2);
    // Display the result in the element with id="demo"
    document.getElementById("countdown").innerHTML = "Time left: " + min2 + "m " + sec2 + "s";

    
    if (distance <= 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "TIME DONE!";
        // INSERT HERE THE SWAP COMMAND
    }
    
    }, 1000);
}

function onClickFunction(){
    countTime = 3601;
}
