let favoriteBook = "Fate/Grand Order"
const otherFavoriteBook ="Five Nights at Freddy's"

favoriteBook: String='Atomic Habits'

console.log(typeof favoriteBook)
// otherFavoriteBook = 'Eyeshield 21'

let concatBooks = `${favoriteBook} and ${otherFavoriteBook}`

let concatBooks2 = favoriteBook+' '+'and'+' '+otherFavoriteBook


let number1 = 28
let number2 = 15

let totalNumber = number1+number2

console.log(favoriteBook)
console.log(concatBooks)
console.log(concatBooks2)
console.log(totalNumber)

let myAnimeList = ['Naruto','One Piece','Dragonball']

let myAnimeList2 = ['Naruto','Bleach','Doraemon']


console.log(myAnimeList.concat(myAnimeList2))

let biodata = {
    name:'Dayat',
    hobby:'Genshin',
    favoriteNumber:totalNumber
}

let test={...biodata}
biodata.name='Kiki'
console.log(test.name)
biodata.favoriteNumber =2

console.log(biodata)


