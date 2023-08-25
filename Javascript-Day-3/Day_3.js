const book = {
    title: "Naruto",
    price: 40000,
    amount: 5
}

function bookPurchasing(book, discountPercentage, taxPercentage) {
    if (!discountPercentage || !taxPercentage) {
        return false
    }
    const percentage = 100
    let isDiscount = false
    let stringDiscount ='no discount price'
    const bookPrice = book.price * book.amount
    const tax = taxPercentage / percentage
    const amountOfTax = tax * bookPrice
    let priceAfterTax = bookPrice + amountOfTax
    let response =''
    // let response = `Book with title ${book.title} has total price ${priceAfterTax} with details: ${stringDiscount} and tax price = ${amountOfTax}, price after tax is ${priceAfterTax}`

    if (book.amount < 1) {
        return 'Stock is empty'
    }
    else if (book.amount > 3) {
        isDiscount = true
        const discount = discountPercentage / percentage
        const amountOfDicscount = discount * bookPrice
        const priceAfterDiscount = bookPrice - amountOfDicscount
        priceAfterTax -= amountOfDicscount
        if(isDiscount){
            stringDiscount=`discount price = ${amountOfDicscount}, price after discount is ${priceAfterDiscount}`
        }
        // response = `Book with title ${book.title} has total price ${priceAfterTax} with details: ${stringDiscount} and tax price = ${amountOfTax}, price after tax is ${priceAfterTax}`
    }
    response = `Book with title ${book.title} has total price ${priceAfterTax} with details: ${stringDiscount} and tax price = ${amountOfTax}, price after tax is ${priceAfterTax}`
    return response
}

console.log(bookPurchasing(book, 25, 10))
// console.log(bookPurchasing('Naruto', 40000, 25))