const songsList = [
    {
        title: "Yesterday",
        duration: "20:20",
        genre: "Pop",
        artist: 'Dayat'
    },
    {
        title: "Yesterday",
        duration: "20:20",
        genre: "Rock",
        artist: 'Dayat1'
    },
    {
        title: "Yesterday",
        duration:"30:20",
        genre: "Pop",
        artist: 'Dayat'
    },
    {
        title: "Yesterday",
        duration: "01:20:20",
        genre: "Rock",
        artist: 'Dayat1'
    },
    {
        title: "Yesterday",
        duration: "05:20",
        genre: "Jazz",
        artist: 'Dayat1'
    },
    {
        title: "Yesterday",
        duration: "01:20",
        genre: "Jazz",
        artist: 'Dayat1'
    }
]


function groupingDurationRandomSong(listMusics) {
    let groupedMusics = []
    let totalDuration = 0
    let musicsUnder1Hour = listMusics.filter((element) => {
        let timeSecond = element.duration.split(":")
        if (timeSecond.length < 3) {
            return element
        }
    })
    for (let i = musicsUnder1Hour.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        let shuffledSongTemp = musicsUnder1Hour[i]
        musicsUnder1Hour[i] = musicsUnder1Hour[j]
        musicsUnder1Hour[j] = shuffledSongTemp
    }
    for (let song of musicsUnder1Hour) {
        let tempDurationSong = song.duration
        song.duration = song.duration.split(':')
        song.duration[0]= +song.duration[0]*60
        song.duration[1]= +song.duration[1]
        song.duration= song.duration[0]+song.duration[1]
        totalDuration += song.duration
        if (totalDuration < 600) {
            song.duration=tempDurationSong
            groupedMusics.push(song)
        }
        else {
            break;
        }
    }
    return groupedMusics
}

function groupingArtistMusic(listMusics) {
    let artistMusic = []
    let groupedMusics = {}
    listMusics.forEach(song => {
        if (!artistMusic.includes(song.artist)) {
            artistMusic.push(song.artist)
        }
    });
    artistMusic.forEach((artist) => {
        let tempSongLists=[]
        listMusics.forEach((song) => {
            if (song.artist === artist) {
                tempSongLists.push(song)
                
            }
        })
        groupedMusics[artist]=tempSongLists
    })
    return groupedMusics
}


function groupingGenreMusic(listMusics) {
    let genreMusic = []
    let groupedMusics = {}
    listMusics.forEach(song => {
        if (!genreMusic.includes(song.genre)) {
            genreMusic.push(song.genre)
        }
    });
    genreMusic.forEach((genre) => {
        let tempSongsLists=[]
        listMusics.forEach((song) => {
            if (song.genre === genre) {
                tempSongsLists.push(song)
            }
        })
        groupedMusics[genre]=tempSongsLists
    })
    return groupedMusics
}


console.log(groupingArtistMusic(songsList))
console.log("===========================")
console.log(groupingGenreMusic(songsList))
console.log("===========================")
console.log(groupingDurationRandomSong(songsList))