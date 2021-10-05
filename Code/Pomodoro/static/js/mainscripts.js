console.log('Testing that we imported mainscripts.js correctly');



//  Begin JS for main.html
const work = document.getElementById("workSide");
const chill = document.querySelector("chillSide");


//Detect which side is dominant.  1 = working side dominant
let detectSide = 1;
function switchSides(){
    if(detectSide == 1){
        console.log('inside of shrinkWork()');
        work.classList.remove("animateGrowWork");
        work.classList.add("animateShrinkWork");
        chill.classList.remove("animateShrinkChill");
        chill.classList.add("animateGrowChill");
        detectSide = 0;
    } else {
        console.log('inside of shrinkChill()');
        work.classList.remove("animateShrinkWork");
        work.classList.add("animateGrowWork");
        chill.classList.remove("animateGrowChill");
        chill.classList.add("animateShrinkChill");
        detectSide = 1;
    }
}