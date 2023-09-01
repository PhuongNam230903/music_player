const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "MUSIC_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const volumeBtn = $(".btn-volume input");
const playlist = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // config: {},
    // (1/2) Uncomment the line below to use localStorage
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
    {
        name: "Đáy Biển",
        singer: "Nhất Tri Liệu Tiên",
        path: "./assets/music/Song_1.mp3",
        image: "https://avatar-ex-swe.nixcdn.com/song/2023/02/09/3/c/3/5/1675932257094_640.jpg"
    },
    {
        name: "Mind Games",
        singer: "Sickick",
        path: "./assets/music/Song_2.mp3",
        image: "https://i.scdn.co/image/ab67616d0000b27373862007fbff72fcdddcf6bc"
    },
    {
        name: "Vài câu nói có khiến người thay đổi",
        singer: "Gray.D ft Tlinh",
        path: "./assets/music/Song_3.mp3",
        image: "https://i1.sndcdn.com/artworks-C383irzgH6yfn8it-QkpfPQ-t500x500.jpg"
    },
    {
        name: "The other side of paradise",
        singer: "Glass Animals",
        path: "./assets/music/Song_4.mp3",
        image: "https://i.ytimg.com/vi/sO0vmFLb3G0/maxresdefault.jpg"
    },
    {
        name: "Night Dancer",
        singer: "Imase",
        path: "./assets/music/Song_5.mp3",
        image: "https://awesomemagazine.jp/wpas/wp-content/uploads/2022/08/imase_nightdancer_220721-2048x2048.jpg"
    },
    {
        name: "Cheating on you",
        singer: "Charlie Puth",
        path: "./assets/music/Song_6.mp3",
        image: "https://tse4.mm.bing.net/th?id=OIP.ilfTauYPdGhSaLJhqvdx5gHaEK&pid=Api&P=0&h=220"
    },
    {
        name: "Gold Hour",
        singer: "JVKE",
        path: "./assets/music/Song_7.mp3",
        image: "https://tse4.mm.bing.net/th?id=OIP.hZz9EkLZDBXoPd_YmwUmqwHaEK&pid=Api&P=0&h=220"
    },
    {
        name: "Shadow Of The Sun",
        singer: "Max-Elto",
        path: "./assets/music/Song_8.mp3",
        image: "https://tse4.mm.bing.net/th?id=OIP.Wfxlu9JvrxcoAC-aWOxCPAHaHa&pid=Api&P=0&h=220",
    },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                    <div class="thumb"
                        style="background: url('${song.image}') no-repeat center center / cover;">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        })
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        
        // Xử lí cd quay / dừng
        const cdThumbAnimmate = cdThumb.animate([
            {transform: 'rotate(360deg)'},
        ], {
            duration: 10000,
            iterations: Infinity,
            direction: 'alternate',
            fill: 'forwards'
        })
        cdThumbAnimmate.pause();

        // Xử lí phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = document.doctype.scrollTop || window.scrollY;
            const newcdWidth = cdWidth - scrollTop;
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth/cdWidth;
        }
        // Xử lí khi click play
        playBtn.addEventListener("click", () => {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        });
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimmate.play();
        }
        // Khi song được pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimmate.pause();
        }
        // Khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function() {
            if(audio.duration) { // duration: độ dài của âm thanh
                let progressPercent = audio.currentTime / audio.duration * 100; // current time: thời gian hiện tại
                progress.value = progressPercent;
            }
        }
        //Xử lí khi thay đổi thời gian bài hát 
        progress.oninput = function (e) {
            let seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };
        // Xử lí khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            for(let i = 0; i < _this.songs.length; i++) {
                playlist.children[i].classList.remove('active');
                // playlist.children[i].setAttribute('data-index', i);
                if(i === _this.currentIndex) {
                    playlist.children[i].classList.add('active');
                    // playlist.children[i].setAttribute('data-index', i);
                }
                console.log(playlist.children[i])
            }
            _this.scrollActiveSong();
        }
        // Xử lí khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            for(let i = 0; i < _this.songs.length; i++) {
                playlist.children[i].classList.remove('active');
                // playlist.children[i].setAttribute('data-index', i);
                if(i === _this.currentIndex) {
                    playlist.children[i].classList.add('active');
                    // playlist.children[i].setAttribute('data-index', i);
                }
            }
            _this.scrollActiveSong();
        }
        // Xử lí bật tắt random 
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // Hết bài tự next
        audio.onended = function() {
            setTimeout(() => {
                if(_this.isRepeat) {
                    audio.play();
                } else {
                    nextBtn.click();
                }
            }, 2000) 
        }
        // Xử lí nút repeat lặp lại 1 song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //xử lí khi đang kích hoạt nút lặp lại
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };
        // Xử lí volume
        volumeBtn.oninput =  function(e) {
            audio.volume = e.target.value / 100;
            console.log(audio.volume);
            if(audio.volume === 0) {
                player.classList.add("change_volume");
            } else  {
                player.classList.remove("change_volume");
            }
        },
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // Xử lí khi click vào song ở playlists
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // Xử lí khi click vào option song ở playlists
                if(e.target.closest('.option')) {
                    alert('Chức năng chưa cập nhật')
                }
            }
        };
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    // next bài
    nextSong: function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    // prev bài
    prevSong: function () {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    // Random bài
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    // Active song
    scrollActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'end',
            });
        },100)
    },
    start: function() {
        // Gán cấu hình từ config
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe xử lí các sự kiện Dom Event
        this.handleEvent();

        //  Tải thông tin bài hát đầu tiên khi UI chạy ứng dụng
        this.loadCurrentSong();

        // Render Playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();