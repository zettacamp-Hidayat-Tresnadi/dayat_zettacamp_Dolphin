const book = {
    title: "Naruto",
    price: 10000,
}

const jwt = require('jsonwebtoken');
const token = (data) => {
    let encodedToken = jwt.sign(data, process.env.SECRET_KEY,{ expiresIn: '1h' })
    return encodedToken
};
async function decoded (token) {
    try {
        let decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        return decodedToken
    } catch (error) {
        console.log(error.name)
        if(error.name==='JsonWebTokenError'){
            throw {name :'Invalid Token'}
        }
        else if(error.name==='TokenExpiredError'){
            throw {name : 'Relogin'}
        }
    }
}



function validateInput(discountPercentage, taxPercentage, amountOfPurchasedBook, creditTerm, chosenTerm, additionalPrice) {
    if (!discountPercentage || !taxPercentage) {
        return false
    }
    else if (discountPercentage < 0 || discountPercentage >= 100) {
        return 'Discount Percentage is only between 1-99'
    }
    else if (taxPercentage < 0 || taxPercentage >= 100) {
        return 'Tax Percentage is only between 1-99'
    }
    else if (amountOfPurchasedBook < 1) {
        return 'Invalid Input of amount purchased book'
    }
    else if (creditTerm <= 0 || !creditTerm) {
        return 'Invalid input of credit Term'
    }
    else if (chosenTerm < 0 || chosenTerm >= creditTerm) {
        return 'Please input right chosen term'
    }
    else if (additionalPrice < 0) {
        return 'Invalid additional price'
    }
}

async function groupingDurationRandomSong(listMusics) {
    try {
        let groupedMusics = []
        let totalDuration = 0
        let musicsUnder1Hour = listMusics.filter((element) => {
            let timeSecond = element.duration.split(":")
            if (timeSecond.length < 3) {
                return element
            }
        })
        // 1. i lebih dari 0 soalnya klo sama dengan 0 tar dia cuman shuffle sama dirinya sendiri, ga guna kan wkkw, klo i=1 dia masih bisa shuffle sama i=0
        // 2. kalau math random i+1 itu biar batas generate randomnya makin kecil dan angka lebih kecil jadi lebih besar peluang dapetnya
        for (let i = musicsUnder1Hour.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            let shuffledSongTemp = musicsUnder1Hour[i]
            musicsUnder1Hour[i] = musicsUnder1Hour[j]
            musicsUnder1Hour[j] = shuffledSongTemp
        }
        for (let song of musicsUnder1Hour) {
            let tempDurationSong = song.duration
            song.duration = song.duration.split(':')
            song.duration[0] = +song.duration[0] * 60
            song.duration[1] = +song.duration[1]
            song.duration = song.duration[0] + song.duration[1]
            totalDuration += song.duration
            if (totalDuration < 3600) {
                song.duration = tempDurationSong
                groupedMusics.push(song)
            }
            else {
                song.duration = tempDurationSong
            }
        }
        return groupedMusics
    } catch (error) {
        console.log(error)
    }

}

// console.log(groupingGenre(musicAmpas))
// console.log("==========================")
// console.log(groupingArtist(musicAmpas))
// console.log("==========================")
// console.log(groupingDuration(musicAmpas))


async function groupingArtistMusic(listMusics) {
    try {
        let artistMusic = []
        let groupedMusics = {}
        listMusics.forEach(song => {
            if (!artistMusic.includes(song.artist)) {
                artistMusic.push(song.artist)
            }
        });
        artistMusic.forEach((artist) => {
            let tempSongLists = []
            listMusics.forEach((song) => {
                if (song.artist === artist) {
                    tempSongLists.push(song)

                }
            })
            groupedMusics[artist] = tempSongLists
        })
        return groupedMusics
    } catch (error) {
        console.log(error)
    }

}

async function groupingGenreMusic(listMusics) {
    try {
        let genreMusic = []
        let groupedMusics = {}
        listMusics.forEach(song => {
            if (!genreMusic.includes(song.genre)) {
                genreMusic.push(song.genre)
            }
        });
        genreMusic.forEach((genre) => {
            let tempSongsLists = []
            listMusics.forEach((song) => {
                if (song.genre === genre) {
                    tempSongsLists.push(song)
                }
            })
            groupedMusics[genre] = tempSongsLists
        })
        return groupedMusics
    } catch (error) {
        console.log(error)
    }

}

// console.log(groupingArtistMusic(songsList))
// console.log("===========================")
// console.log(groupingGenreMusic(songsList))
// console.log("===========================")
// console.log(groupingDurationRandomSong(songsList))


module.exports = { groupingArtistMusic, validateInput, groupingGenreMusic, groupingDurationRandomSong, token, decoded }