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








// 
//  Begin JS for Media Player
// 
function loadDoc(){
//
// ATTEMPT 2:  AJAX THE ENTIRE PLAYER.  Probably the best way to end state.  Needs serious revamp in this case.  
    
    $(document).ready(
        function() {
            $("#tempYoutubePlayerButton").click(function(){
                $("#youtubePlayer").load("../templates/sharedTemplates/mediaPlayer.html");
            })
        }
        )
// 
// 
//  ATTEMPT 1:   ADD THE SRC
//         
        console.log('made it to loadDoc');
        var iframe = document.getElementById("youtubePlayer");
        iframe.src = "https://www.youtube.com/embed/Ar-IEE_DIEo?&autoplay=1&muted=1&loop=1";
    
}
