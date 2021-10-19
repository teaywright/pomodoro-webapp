//  Begin JS for main.html
const work = document.getElementById("workSide");
const chill = document.querySelector("chillSide");
const mainContainer = document.getElementById("mainContainer");
const mainBackground = document.getElementById("mainBackground");
//Detect which side is dominant.  1 = working side dominant
let detectSide = 1;
function switchSides(){
    if(detectSide == 1){
        mainContainer.classList.remove("animateGrowWork");
        mainContainer.classList.add("animateShrinkWork");
        mainBackground.classList.remove("animateGrowWorkBg");
        mainBackground.classList.add("animateShrinkWorkBg");
        
        detectSide = 0;
        player.pauseVideo();
    } else {
        mainContainer.classList.add("animateGrowWork");
        mainContainer.classList.remove("animateShrinkWork");
        mainBackground.classList.add("animateGrowWorkBg");
        mainBackground.classList.remove("animateShrinkWorkBg");
        detectSide = 1;
    }
}








// 
//  Begin JS for Media Player
// 
//Remove The buttons and Choose the Player:
function mediaChoice(userChoice){
    document.getElementById("mediaPlayerChoice").remove();
    if(userChoice == "youtube"){
        loadYoutube();
    }
}
// Asynch load youtube:
function loadYoutube(){
    //Asynch
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            document.getElementById('mediaPlayer').innerHTML = xhr.responseText;
            onYouTubeIframeAPIReady();
        }
    };
    xhr.open('GET', '/youtube');
    xhr.send();
}

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
//  ...kinda don't know why I can't delete this....
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}
// Builds a new Youtube IFrame
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '50%',
        width: 'auto',
        videoId: 'M7lc1UVf-VE',
        playerVars: {
        'playsinline': 1
        },
        events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        }
    });
}
// Helper function to REGEX and rip out the video ID from the URL regardless of how received.
function YouTubeGetID(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}
// Function to "change channel" on Youtube
function changeYoutube(){
    console.log('inside changeyoutube')
    let input=YouTubeGetID(document.getElementById("urlYoutube").value);
    player.loadVideoById(input);
    document.getElementById("urlYoutube").value = "";
}