//  Begin JS for main.html
const work = document.getElementById("workSide");
const chill = document.querySelector("chillSide");
const mainContainer = document.getElementById("mainContainer");
const mainBackground = document.getElementById("mainBackground");
const leftBlocker = document.getElementsByClassName("leftBlocker");
const rightBlocker = document.getElementsByClassName("rightBlocker");
const sideSwapSound = new Audio('static/sound/service-bell_daniel_simion.mp3');
sideSwapSound.volume = .25;
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
        try {
            player.pauseVideo();
            player2.playVideo();
        }
        catch(err) {
            console.log("No video to play");
        }
        sideSwapSound.play();
        detectSide = 0;
        
    } else {
        mainContainer.classList.add("animateGrowWork");
        mainContainer.classList.remove("animateShrinkWork");
        mainBackground.classList.add("animateGrowWorkBg");
        mainBackground.classList.remove("animateShrinkWorkBg");
        $("#lefthand").removeClass("blocker-white-to-black");
        $("#lefthand").addClass("blocker-black-to-white");
        $("#righthand").removeClass("blocker-black-to-white");
        $("#righthand").addClass("blocker-white-to-black");
        try{
            player.playVideo();
            player2.pauseVideo();
        }
        catch(err){
            console.log("No video to play");
        }
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
function changeP3(){
    document.getElementById("mainBackground").style.backgroundImage = "url(../static/pictures/.jpg)";
}
function changeP4(){
    document.getElementById("mainBackground").style.backgroundImage = "url(../static/pictures/.jpg)";
}
function changeP5(){
    document.getElementById("mainBackground").style.backgroundImage = "url(../static/pictures/.jpg)";
}  
function changeP6(){
    document.getElementById("mainBackground").style.backgroundImage = "url(../static/pictures/.jpg)";
}  

// 
//  Begin JS for Media Player
// 
//Remove The buttons and Choose the Player:
function mediaChoice(userChoice){
    if(userChoice == "youtube"){
        document.getElementById("mediaPlayerChoice").remove();
        loadYoutube('1');
    }
    if(userChoice == "youtube2"){
        
        loadYoutube('2');
    }
    if(userChoice == "spotify"){
        loadSpotify();
    }
}

//Remove Youtube to return to maindiv
function returnMain1(){
    $( ".mediaPlayer1" ).load("/mediaPlayer .mediaPlayer1 > *");
}
function returnMain2(){
    $( ".mediaPlayer2" ).load("/mediaPlayer .mediaPlayer2 > *");
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
function loadYoutube(side){
    //Asynch
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && side == '1'){
            document.getElementsByClassName("mediaPlayer1")[0].innerHTML = xhr.responseText;
            onYouTubeIframeAPIReady('1');
        }
        if(xhr.readyState === 4 && side == '2'){
            document.getElementsByClassName("mediaPlayer2")[0].innerHTML = xhr.responseText;
            onYouTubeIframeAPIReady('2');
        }
    };
    if(side == '1'){
        xhr.open('GET', '/youtube');
        xhr.send();
    }
    if(side == '2'){
        xhr.open('GET', '/youtube2');
        xhr.send();
    }
}



// AJAX save YouTube video and update videos list
function storeVideo(side) {
    console.log("Clicked save");
    let YTVideoID;
    if(side == '1'){    
        console.log("Saving video 1");
        let inputURL = document.getElementById("urlYoutube").value;
        YTVideoID = YouTubeGetID(inputURL);

        if (YTVideoID == inputURL) {
            alert("Invalid url");
            return;
        }
    }
    if(side == '2'){
        console.log("Saving video 2");
        let inputURL = document.getElementById("urlYoutube2").value;
        YTVideoID = YouTubeGetID(inputURL);

        if (YTVideoID == inputURL) {
            alert("Invalid url");
            return;
        }
    }
    console.log("Saving video " + YTVideoID);
    var name = document.getElementById("Video Name").value;
    var videosTable = document.getElementById("savedVideos");

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            videosTable.innerHTML +=    `<tr id=${YTVideoID}>
                                            <td>` + xhr.responseText + `</td>
                                            <td id="listedVidName">${name}</td>
                                            <td><button id="deleteVidBtn">Delete</button></td>
                                        </tr>`;
        }
    }
    
    xhr.open("POST", "/youtube/save_video", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("vidName=" + name + "&vidURL=" + YTVideoID);
}



// Click on ID savedVideos to play video after AJAX call
// Where comign from).on(event, )
$(document).ready(function() {
    $(document).on('click', `#listedVidName`, function() {
        console.log("Click to play saved vid");
        console.log(this);
        var rowSelect = $(this).closest("tr");   // Finds the closest row <tr>
        console.log(rowSelect);
        var urlID = rowSelect.attr("id");
        console.log(urlID);
        player.loadVideoById(urlID);
    });
});


// Deleting videos
$(document).ready(function() {
    $(document).on('click', `#deleteVidBtn`, function() {
        console.log("Click delete vid");
        var rowSelect = $(this).closest("tr");   // Finds the closest row <tr>
        var YT_videoID = rowSelect.attr("id");
        console.log(YT_videoID);
        rowSelect.remove();

        $.ajax({
            type : 'POST',
            url : "/youtube/delete_video",
            contentType: 'application/json;charset=UTF-8',
            data : JSON.stringify({'yt_id': YT_videoID})
        });
    });
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
// Builds a new Youtube IFrame Left Side
var player;
var player2;
function onYouTubeIframeAPIReady(side) {
    if(side == '1'){
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
    if(side == '2'){
        player2 = new YT.Player('player2', {
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
}

// Helper function to REGEX and rip out the video ID from the URL regardless of how received.
function YouTubeGetID(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}
// Function to "change channel" on Youtube
function changeYoutube1(){
    console.log('inside changeyoutube')
    let input=YouTubeGetID(document.getElementById("urlYoutube").value);
    player.loadVideoById(input);
    document.getElementById("urlYoutube").value = "";
}
function changeYoutube2(){
    let input=YouTubeGetID(document.getElementById("urlYoutube2").value);
    player2.loadVideoById(input);
    document.getElementById("urlYoutube2").value = "";
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