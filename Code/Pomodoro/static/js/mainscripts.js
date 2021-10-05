console.log('Testing that we imported mainscripts.js correctly');




// Begin JS for main.html
const work = document.getElementById("workSide");
const chill = document.querySelector(".chill");


//Detect which side is dominant.  1 = working side dominant
let detectSide = 1;

function shrinkWork(){
    if(detectSide == 1){
        console.log('inside of shrinkWork()');
        work.classList.remove("animateGrowWork");
        work.classList.add("animateShrinkWork");
        detectSide = 0;
    } else {
        console.log('inside of shrinkChill()');
        work.classList.remove("animateShrinkWork");
        work.classList.add("animateGrowWork");
        detectSide = 1;
    }
}

