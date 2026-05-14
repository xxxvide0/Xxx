const videoData = [
    { id: 1, title: "COMATOZZE STEP BROTHER", url: "https://ik.imagekit.io/jrfbzodll/480p.h264%20(4).mp4?updatedAt=1778775304451" },
    { id: 2, title: "STEP DAUGHTER", url: "https://ik.imagekit.io/jrfbzodll/480p.h264%20(2).mp4?updatedAt=1778775297368" },
    { id: 3, title: "STEP BROTHER / STEP SIS", url: "https://ik.imagekit.io/jrfbzodll/480p.h264%20(3).mp4?updatedAt=1778775312038" },
    { id: 4, title: "Super HD Movie 2K", url: "https://ik.imagekit.io/jrfbzodll/lv_0_20260406210329.mp4" },
    { id: 5, title: "Action Scene 1080p", url: "https://ik.imagekit.io/jrfbzodll/lv_0_20260406210329.mp4" },
    { id: 6, title: "Nature Clip 720p", url: "https://ik.imagekit.io/jrfbzodll/lv_0_20260406210329.mp4" }

];

let currentVideoId = null;
let currentUrl = "";
const mainVideo = document.getElementById('main-video');

function loadHome() {
    const list = document.getElementById('video-list');
    list.innerHTML = videoData.map(v => `
        <div class="video-card" onclick="playVideo(${v.id})">
            <img src="${v.url}/ik-thumbnail.jpg?tr=w-500" alt="thumb">
            <p>${v.title}</p>
        </div>
    `).join('');
    lucide.createIcons();
}

function playVideo(id) {
    const video = videoData.find(v => v.id === id);
    if(!video) return;

    currentVideoId = id;
    currentUrl = video.url;

    // भिडियोलाई सुरुबाट प्ले गर्ने (RESET Logic)
    mainVideo.pause();
    mainVideo.src = video.url;
    mainVideo.currentTime = 0; // यो लाइनले भिडियोलाई सुरुबाट लोड गर्छ
    mainVideo.load();

    // UI Updates
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('dynamic-header').classList.add('hidden');
    document.getElementById('player-page').classList.remove('hidden');

    // Download Fix
    document.getElementById('download-link').href = video.url + "?ik-attachment=true";

    setupQualityMenu(video.title);
    loadSuggested(id);
    
    mainVideo.play();
    updatePlayIcon(true);
    lucide.createIcons();
    window.scrollTo(0,0);
}

function loadSuggested(currentId) {
    const suggestedList = document.getElementById('suggested-list');
    const otherVideos = videoData.filter(v => v.id !== currentId);
    
    suggestedList.innerHTML = otherVideos.map(v => `
        <div class="video-card" onclick="playVideo(${v.id})">
            <img src="${v.url}/ik-thumbnail.jpg?tr=w-400" alt="thumb">
            <p>${v.title}</p>
        </div>
    `).join('');
    lucide.createIcons();
}

// Full Screen Fix for all browsers
function toggleFullScreen() {
    const container = document.getElementById('video-container');
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (container.requestFullscreen) container.requestFullscreen();
        else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
        
        // Auto-Rotate to Landscape
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch(() => console.log("Orientation lock not supported"));
        }
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
}

function changeQuality(label, height) {
    const time = mainVideo.currentTime;
    const isPaused = mainVideo.paused;
    
    let newUrl = currentUrl;
    if (!label.includes("K") && label !== "1080p") {
        newUrl = currentUrl.replace('ik.imagekit.io/jrfbzodll/', `ik.imagekit.io/jrfbzodll/tr:h-${height}/`);
    }

    mainVideo.src = newUrl;
    mainVideo.load();
    mainVideo.onloadedmetadata = () => {
        mainVideo.currentTime = time;
        if (!isPaused) mainVideo.play();
    };
    document.getElementById('quality-menu').classList.add('hidden');
}

function toggleMute() {
    mainVideo.muted = !mainVideo.muted;
    document.getElementById('mute-btn').setAttribute('data-lucide', mainVideo.muted ? 'volume-x' : 'volume-2');
    lucide.createIcons();
}

function togglePlay() {
    if (mainVideo.paused) { mainVideo.play(); updatePlayIcon(true); }
    else { mainVideo.pause(); updatePlayIcon(false); }
}

function updatePlayIcon(isPlay) {
    document.getElementById('play-btn').setAttribute('data-lucide', isPlay ? 'pause' : 'play');
    lucide.createIcons();
}

function skip(v) { mainVideo.currentTime += v; }
function goHome() { location.reload(); }
function toggleSettings() { document.getElementById('quality-menu').classList.toggle('hidden'); }

function setupQualityMenu(title) {
    const menu = document.getElementById('quality-menu');
    let maxQ = title.toLowerCase().includes("2k") ? "2K" : "1080p";
    const options = [maxQ, "720p", "480p", "360p"];
    menu.innerHTML = options.map(q => `<button onclick="changeQuality('${q}', '${q.replace(/\D/g,'')}')">${q}</button>`).join('');
}

mainVideo.ontimeupdate = () => {
    const per = (mainVideo.currentTime / mainVideo.duration) * 100;
    document.getElementById('progress').style.width = per + "%";
};

loadHome();
