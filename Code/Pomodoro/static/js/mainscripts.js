console.log('Testing that we imported mainscripts.js correctly');



//  Begin JS for main.html
const work = document.getElementById("workSide");
const chill = document.querySelector("chillSide");
const mainContainer = document.getElementById("mainContainer")


//Detect which side is dominant.  1 = working side dominant
let detectSide = 1;
function switchSides(){
    if(detectSide == 1){
        mainContainer.classList.remove("animateGrowWork");
        mainContainer.classList.add("animateShrinkWork");
        detectSide = 0;
    } else {
        mainContainer.classList.add("animateGrowWork");
        mainContainer.classList.remove("animateShrinkWork");
        detectSide = 1;
    }
}