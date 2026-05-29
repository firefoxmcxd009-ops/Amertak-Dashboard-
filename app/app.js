// Music
const icon = document.querySelector(".music-icon")
const play = document.getElementById("play");
const sound = new Audio("/music/villager-sad.mp3");

sound.volume = 0.4;
sound.loop =  true;
play.addEventListener("click", () => {
    if(sound.paused) {
        sound.play();
        play.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 5H8V19H6V5ZM16 5H18V19H16V5Z"></path></svg>`;
        icon.innerHTML = `<svg class="icon-ro" style="scale: none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M13 9.17071C12.6872 9.06015 12.3506 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V2.4578C19.0571 3.73207 22 7.52236 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.3375 2 12.6711 2.01672 13 2.04938V9.17071Z"></path></svg>`;
    } else {
        if(sound.play) {
            sound.pause();
            play.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z"></path></svg>`;
            icon.innerHTML = `<svg style="scale: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.7134 8.12811L18.4668 8.69379C18.2864 9.10792 17.7136 9.10792 17.5331 8.69379L17.2866 8.12811C16.8471 7.11947 16.0555 6.31641 15.0677 5.87708L14.308 5.53922C13.8973 5.35653 13.8973 4.75881 14.308 4.57612L15.0252 4.25714C16.0384 3.80651 16.8442 2.97373 17.2761 1.93083L17.5293 1.31953C17.7058 0.893489 18.2942 0.893489 18.4706 1.31953L18.7238 1.93083C19.1558 2.97373 19.9616 3.80651 20.9748 4.25714L21.6919 4.57612C22.1027 4.75881 22.1027 5.35653 21.6919 5.53922L20.9323 5.87708C19.9445 6.31641 19.1529 7.11947 18.7134 8.12811ZM7 3H12V5H9V17C9 19.2091 7.20914 21 5 21C2.79086 21 1 19.2091 1 17C1 14.7909 2.79086 13 5 13C5.72857 13 6.41165 13.1948 7 13.5351V3ZM18 13.5351V11H20V17C20 19.2091 18.2091 21 16 21C13.7909 21 12 19.2091 12 17C12 14.7909 13.7909 13 16 13C16.7286 13 17.4117 13.1948 18 13.5351ZM5 19C6.10457 19 7 18.1046 7 17C7 15.8954 6.10457 15 5 15C3.89543 15 3 15.8954 3 17C3 18.1046 3.89543 19 5 19ZM16 19C17.1046 19 18 18.1046 18 17C18 15.8954 17.1046 15 16 15C14.8954 15 14 15.8954 14 17C14 18.1046 14.8954 19 16 19Z"></path></svg>`;
        }
    }
});

const song = document.querySelector(".song");
const errorms = document.getElementById("errorms")
const percenterror = document.getElementById("percenterror");

song.addEventListener("click", () => {
    errorms.classList.toggle("error");
    percenterror.classList.toggle("percenterror");
});

percenterror.addEventListener("animationend", () => {
    errorms.classList.remove("error");
    percenterror.classList.remove("percenterror");
})