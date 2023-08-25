let favoriteBook = "Fate/Grand Order"
const otherFavoriteBook =  "Naruto"

let comparisonBookTitle = favoriteBook === otherFavoriteBook
console.log(comparisonBookTitle)

function bookTitleComparison() {
    if (favoriteBook === otherFavoriteBook) {
       return true
    }
    else if (favoriteBook !== otherFavoriteBook) {
        return false
    }
}

console.log(bookTitleComparison(favoriteBook,otherFavoriteBook))


let favoriteBookPrice = 120000
let otherFavoriteBookPrice = 120000

function max_price(favoriteBookPrice, otherFavoriteBookPrice) {
    if (favoriteBookPrice > otherFavoriteBookPrice) {
        return `${favoriteBook} with price ${favoriteBookPrice}`
    }
    else if(favoriteBookPrice===otherFavoriteBookPrice){
        return `${favoriteBook} and ${otherFavoriteBook} with price ${favoriteBookPrice}`
    }
    else {
        return `${otherFavoriteBook} with price ${otherFavoriteBookPrice}`
    }
}

function average_price(price1, price2) {
    let averagePrice = (price1 + price2) / 2
    return averagePrice
}

let moreExpensive = max_price(favoriteBookPrice, otherFavoriteBookPrice)
let averagePrice = average_price(favoriteBookPrice, otherFavoriteBookPrice)
let commendPrice = averagePrice > 500000 ? 'Expensive' : 'Cheap'

console.log(moreExpensive)
console.log(averagePrice)
console.log(commendPrice)

