const menuBtn = document.querySelector(".menu-btn");
const container = document.querySelector(".container");

const progressBar = document.querySelector(".bar");
const progressDot = document.querySelector(".dot");
const currentTimeEl = document.querySelector(".current-time");
const DurationEl = document.querySelector(".duration");
const playlistContainer = document.querySelector("#playlist");
const infoWrapper = document.querySelector(".info");
const coverImage = document.querySelector(".cover-image");
const currentSongTitle = document.querySelector(".current-song-tittle");
const currentFavourite = document.querySelector("#current-favourite");
const repeatBtn = document.querySelector("#repeat");
const plaPausBtn = document.querySelector(`#playpause`);
const nextBtn = document.querySelector(`#next`);
const prevBtn = document.querySelector(`#prev`);
const shuffleBtn = document.querySelector("#shuffle");
const volumeSlider = document.getElementById("volume-slider");

const audio = new Audio();

let playing = false;
let currentSong = 0;
let shuffle = false;
let favourites = [];
let songs;

menuBtn.addEventListener("click", () => {
  container.classList.toggle("active");
});

function init() {
  fetch("database.json")
    .then((response) => response.json())
    .then((data) => {
      songs = data;
      console.log(songs);
      updatePlaylist(songs);
      loadSong(currentSong);
    })
    .catch((error) => console.error("Error fetching JSON:", error));
}

init();

function updatePlaylist(songs) {
  playlistContainer.innerHTML = "";
  songs.forEach((song, index) => {
    const { title, src } = song;
    const isFavourite = favourites.includes(index);

    const tr = document.createElement("tr");
    tr.classList.add("song");
    tr.innerHTML = `
            <td class="no">
                <h5>${index + 1}</h5>
            </td>
            <td class="title">
                <h6>${title}</h6>
            </td>
            <td class="length">
                <h5>2:03</h5>
            </td>
            <td>
                <i class="fa fa-heart ${
                  isFavourite ? "active" : ""
                }" data-index="${index}"></i>
            </td>
        `;
    playlistContainer.appendChild(tr);

    // fav music
    tr.querySelector(".fa-heart").addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      addToFavourites(index);
      e.target.classList.toggle("active");
      e.stopPropagation(); // Menghentikan event bubbling agar tidak memainkan lagu
    });

    // lagu di playlist
    tr.addEventListener("click", (e) => {
      currentSong = index;
      loadSong(currentSong);
      if (!audio.paused) {
        audio.pause();
        playing = false;
      }
      container.classList.remove("active");
      plaPausBtn.classList.replace("fa-play", "fa-pause");
      playing = true;
    });

    const audioForDuration = new Audio(`data/${src}`);
    audioForDuration.addEventListener("loadedmetadata", () => {
      const duration = audioForDuration.duration;
      let songDuration = formatTime(duration);
      tr.querySelector(".length h5").innerText = songDuration;
    });
  });
}

function formatTime(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
}

function loadSong(num) {
  infoWrapper.innerHTML = `
        <h2>${songs[num].title}</h2>
        <h3>${songs[num].artist}</h3>
    `;
  audio.src = `data/${songs[num].src}`;

  currentSongTitle.innerHTML = songs[num].title;
  coverImage.style.backgroundImage = `url(data/${songs[num].img_src})`;

  if (favourites.includes(num)) {
    currentFavourite.classList.add("active");
  } else {
    currentFavourite.classList.remove("active");
  }
}

plaPausBtn.addEventListener("click", () => {
  if (playing) {
    plaPausBtn.classList.replace("fa-pause", "fa-play");
    playing = false;
    audio.pause();
  } else {
    plaPausBtn.classList.replace("fa-play", "fa-pause");
    playing = true;
    audio.play();
  }
});

function nextSong() {
  // shuffle kalau next
  if (shuffle) {
    shuffleFunc();
    loadSong(currentSong);
    return;
  }
  // next
  else if (currentSong < songs.length - 1) {
    currentSong++;
  } else {
    currentSong = 0;
  }
  loadSong(currentSong);

  if (playing) {
    audio.play();
  }
}

nextBtn.addEventListener("click", nextSong);

function prevSong() {
  //sama aj
  if (shuffle) {
    shuffleFunc();
    loadSong(currentSong);
    return;
  }
  // putar sebelum
  if (currentSong > 0) {
    currentSong--;
  } else {
    currentSong = songs.length - 1;
  }
  loadSong(currentSong);

  if (playing) {
    audio.play();
  }
}

prevBtn.addEventListener("click", prevSong);

function addToFavourites(index) {
  //kalau dah fav
  if (favourites.includes(index)) {
    favourites = favourites.filter((item) => item !== index);
    // kalau lagu sekarang diganti ganti curent fav juga
    currentFavourite.classList.remove("active");
  } else {
    favourites.push(index);

    //kalau dari fav sama dengan index
    if (index === currentSong) {
      currentFavourite.classList.add("active");
    }
  }
  //playlist fav
  updatePlaylist(songs);
}

// add to favourit lagu saat ini kalau dipencet like
currentFavourite.addEventListener("click", () => {
  addToFavourites(currentSong);
  // currentFavourite.classList.toggle("active");
});

shuffleBtn.addEventListener("click", shuffleSong);

function shuffleSong() {
  // kalau false buat jadi true
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active"); // Menggunakan shuffleBtn
}

// kalau shuffle true shuffle kalau next atau back
function shuffleFunc() {
  if (shuffle) {
    currentSong = Math.floor(Math.random() * songs.length);
  }
}

// ngulang lagu

function repeatSong() {
  if (repeat === 0) {
    repeat = 1;
    repeatBtn.classList.add("active");
  } else if (repeat === 1) {
    repeat = 2;
    repeatBtn.classList.add("active");
  } else {
    repeat = 0;
    repeatBtn.classList.remove("active");
  }
}
repeatBtn.addEventListener("click", repeatSong);
// kalau diklik sekali ngulang 1 kali kalau 2 kali ngulang 2

audio.addEventListener("ended", () => {
  if (repeat === 1) {
    loadSong(currentSong); //ulang  lagu lagi dan load ulang 1 kali lagu ini
    audio.play();
  } else if (repeat === 2) {
    // kalau ini ngulang 1 playlist jadi mulai next song
    nextSong();
    audio.play();
  } else {
    // repeat mati ya mati
    if (currentSong === songs.length - 1) {
      //kalau lagu akhir di playlist stop
      audio.pause();
      plaPausBtn.classList.replace("fa-pause", "fa-play");
      playing = false;
    } else {
      //kalau bukan terakhir lanjut lagi
      nextBtn();
      audio.play();
    }
  }
});

function progres() {
  let { duration, currentTime } = audio;
  //kalau NaN jadi 0
  isNaN(duration) ? (duration = 0) : duration;
  isNaN(currentTime) ? (currentTime = 0) : currentTime;

  //update waktu
  currentTimeEl.innerHTML = formatTime(currentTime);
  DurationEl.innerHTML = formatTime(duration);

  //buat jalanin progres dot
  let progresPrecentage = (currentTime / duration) * 100;
  progressDot.style.left = `${progresPrecentage}%`;
}

//update progres audio time update event
audio.addEventListener("timeupdate", progres);

// ubah dari bar

function setProgress(e) {
  let width = this.clientWidth;
  let clickX = e.offsetX;
  let duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

progressBar.addEventListener("click", setProgress);

setVolume(100);

// Listen for changes in the volume slider
volumeSlider.addEventListener("mousemove", function () {
  setVolume(volumeSlider.value);
});

// Function to set volume
function setVolume(volume) {
  audio.volume = volume / 100;
  setVolumeIcon(volume);
}

// Function to set volume icon
function setVolumeIcon(volume) {
  const volumeIcon = document.getElementById("volume-icon");
  if (volume > 67) {
    volumeIcon.className = "fas fa-volume-up"; // High volume
  } else if (volume > 33) {
    volumeIcon.className = "fas fa-volume-down"; // Medium volume
  } else if (volume > 0) {
    volumeIcon.className = "fas fa-volume-off"; // Low volume
  } else {
    volumeIcon.className = "fas fa-volume-mute"; // Muted
  }
}
