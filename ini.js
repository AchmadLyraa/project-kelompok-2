const musikContainer = document.querySelector('.musik-container')
const playBtn = document.querySelector('#play')
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
const audio = document.querySelector('#audio')
const progress = document.querySelector('.progress')
const progressContainer = document.querySelector('.progress-container')
const title = document.querySelector('#title')
const cover = document.querySelector('#cover')

// Judul lagu
const songs = ['Aint Seen Nothing Like This', 'If I Can Stop One Heart From Breaking', 'Chopin nocturne op. 9']

// traking lagunya
let songIndex = 2

// buka lagunya
loadsong(songs[songIndex])

//pembaruan lagu
function loadsong(song) {
    title.innerText = song
    audio.src = `musik/${song}.mp3`
    cover.src = `images/${song}.jpg`
}

function playSong() {
musikContainer.classList.add('play')
playBtn.querySelector('i.fas').classList.remove('fa-play')
playBtn.querySelector('i.fas').classList.add('fa-pause')

audio.play()
}

function pauseSong() {
musikContainer.classList.remove('play')
playBtn.querySelector('i.fas').classList.add('fa-play')
playBtn.querySelector('i.fas').classList.remove('fa-pause')

audio.pause()
}

function prevSong(){
    songIndex--

    if (songIndex < 0){
        songIndex = songs.length - 1
    }

    loadsong(songs[songIndex])
    playSong()
}

function nextSong(){
    songIndex++

    if (songIndex > songs.length - 1){
        songIndex = 0
    }

    loadsong(songs[songIndex])
    playSong()
}

function updateProgress(e){
    const {duration, curretTime} = e.srcElement
    const progressPercent = (curretTime / duration) * 100
    progress.style.width = `${progressPercent}%`
}

function setProgress(e) {
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration

    audio.curretTime = (clickX / width) * duration
}
// event
playBtn.addEventListener('click', () =>{
    const isPlaying = musikContainer.classList.contains('play')

    if (isPlaying) {
        pauseSong()
    } else {
        playSong()
    }
})

// ganti lagu
prevBtn.addEventListener('click', prevSong)
nextBtn.addEventListener('click', nextSong)

audio.addEventListener('timeupdate', updateProgress)

progressContainer.addEventListener('click', setProgress)

audio.addEventListener('ended', nextSong)