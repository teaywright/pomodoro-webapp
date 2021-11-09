//  Begin JS for main.html
const work = document.getElementById("workSide");
const chill = document.querySelector("chillSide");
const mainContainer = document.getElementById("mainContainer");
const mainBackground = document.getElementById("mainBackground");
const leftBlocker = document.getElementsByClassName("leftBlocker");
const rightBlocker = document.getElementsByClassName("rightBlocker");
const sideSwapSound = new Audio('static/sound/service-bell_daniel_simion.mp3');
//Detect which side is dominant.  1 = working side dominant
let detectSide = 1;
function switchSides(){
    if(detectSide == 1){
        mainContainer.classList.remove("animateGrowWork");
        mainContainer.classList.add("animateShrinkWork");
        mainBackground.classList.remove("animateGrowWorkBg");
        mainBackground.classList.add("animateShrinkWorkBg");
        $("#lefthand").removeClass("blocker-black-to-white");
        $("#lefthand").addClass("blocker-white-to-black");
        $("#righthand").removeClass("blocker-white-to-black");
        $("#righthand").addClass("blocker-black-to-white");
        sideSwapSound.play();        
        detectSide = 0;
        player.pauseVideo();
    } else {
        mainContainer.classList.add("animateGrowWork");
        mainContainer.classList.remove("animateShrinkWork");
        mainBackground.classList.add("animateGrowWorkBg");
        mainBackground.classList.remove("animateShrinkWorkBg");
        $("#lefthand").removeClass("blocker-white-to-black");
        $("#lefthand").addClass("blocker-black-to-white");
        $("#righthand").removeClass("blocker-black-to-white");
        $("#righthand").addClass("blocker-white-to-black");
        
        sideSwapSound.play();
        detectSide = 1;
    }
}


function changeP1(){
    document.getElementById("mainBackground").style.backgroundImage = "url(../static/pictures/logo.png)";
}
function changeP2(){
    document.getElementById("mainBackground").style.backgroundImage = "url(../static/pictures/bamboo.jpg)";
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
    if(userChoice == "spotify"){
        loadSpotify();
    }
}

//Remove Youtube to return to maindiv
function returnMain(){
    $( "#mediaPlayer-container" ).load("/mediaPlayer #mediaPlayer-container > *");
    
}

// AJAX spotify section:
function loadSpotify(){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            document.getElementById('mediaPlayer-container').innerHTML = xhr.responseText;
        }
    };
    xhr.open('GET', '/spotify');
    xhr.send();
    location.replace("/spotify-auth");
}

// Asynch load youtube:
function loadYoutube(){
    //Asynch
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            document.getElementById('mediaPlayer-container').innerHTML = xhr.responseText;
            onYouTubeIframeAPIReady();
        }
    };
    xhr.open('GET', '/youtube');
    xhr.send();
}


// AJAX save YouTube video and update videos list
function storeVideo() {
    console.log("Clicked save");
    var inputURL = document.getElementById("urlYoutube").value;
    var YTVideoID = YouTubeGetID(inputURL);

    if (YTVideoID == inputURL) {
        alert("Invalid url");
        return;
    }
    
    var name = document.getElementById("Video Name").value;
    var videosTable = document.getElementById("savedVideos");

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            videosTable.innerHTML +=    `<tr id=${YTVideoID}>
                                            <td>` + xhr.responseText + `</td>
                                            <td class='youtube_name'>${name}</td>
                                        </tr>`;
        }
    }
    
    xhr.open("POST", "/youtube/save_video", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("vidName=" + name + "&vidURL=" + inputURL);
}
// Click on ID savedVideos to play video after AJAX call
// Where comign from).on(event, )
$(document).on('click', `.videoStored`, function() {
    player.loadVideoById(YTVideoID);
});




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
        videoId: '5qap5aO4i9A',
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


/*
Start JS for login and registration
*/
function showPassword() {
    var x = document.getElementById("Password");
    console.log("showpassword");
    if (x.type === "password") {
      x.type = "text";
    } else 
    {
      x.type = "password";
      
    }
  }