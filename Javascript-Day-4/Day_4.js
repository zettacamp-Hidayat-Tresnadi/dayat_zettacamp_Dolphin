const book = {
    title: "Naruto",
    price: 40000,
}


function validateInput (discountPercentage, taxPercentage, amountOfPurchasedBook){
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
}

function bookPurchasing(book, discountPercentage, taxPercentage, amountOfStock, amountOfPurchasedBook) {
    let validation = validateInput(discountPercentage, taxPercentage, amountOfPurchasedBook)
    let response = ''
    // Validate Input
    if(validation){
        response=validation
        return response
    }
   
    const difference = amountOfStock - amountOfPurchasedBook
    const percentage = 100
    let isDiscount = false
    let stringDiscount = 'no discount price'
    let totalPrice = 0
    const tax = taxPercentage / percentage
    const amountOfTax = tax * book.price
    let priceAfterTax = book.price + amountOfTax
    let totalTax = 0
    const discount = discountPercentage / percentage
    const amountOfDicscount = discount * book.price
    const priceAfterDiscount = book.price - amountOfDicscount
    let totalDiscount = 0
    let totalPriceAfterDiscount = 0
    
    // Check amount of stock
    if (amountOfStock < 1) {
        return 'Stock is empty'
    }
    else if (amountOfPurchasedBook > 3 && amountOfStock>3) {
        isDiscount = true
        priceAfterTax -= amountOfDicscount
    }
    // Determining Price
    for (let i = 1; i <= amountOfPurchasedBook; i++) {
        if (i > amountOfStock) {
            break;
        }
        if (isDiscount) {
            totalDiscount += amountOfDicscount
            totalPriceAfterDiscount += priceAfterDiscount
        }
        totalTax += amountOfTax
        totalPrice += priceAfterTax
    }
    // Check if discount condition fulfilled
    if (isDiscount) {
        stringDiscount = `discount price = ${totalDiscount}, price after discount is ${totalPriceAfterDiscount}`
    }
    // String output
    if (difference === 0) {
        response = `Book with title ${book.title} has total price ${totalPrice} with details: ${stringDiscount} and tax price = ${totalTax}, price after tax is ${totalPrice}. Sorry, you can't buy it anymore`
    }
    else if (difference < 0 && amountOfStock > 0) {
        response = `Sorry, you can only buy ${amountOfStock} book with title ${book.title} has total price ${totalPrice} with details: ${stringDiscount} and tax price = ${totalTax}, price after tax is ${totalPrice}`
    }
    else {
        response = `Book with title ${book.title} has total price ${totalPrice} with details: ${stringDiscount} and tax price = ${totalTax}, price after tax is ${totalPrice}. You can buy again, the stock is still ${difference}`
    }
    return response
}
console.log(bookPurchasing(book, 25, 10, 4, 6))