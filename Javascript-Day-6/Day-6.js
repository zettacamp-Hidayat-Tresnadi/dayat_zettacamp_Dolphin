const book = {
    title: "Naruto",
    price: 40000,
}


function validateInput(discountPercentage, taxPercentage, amountOfPurchasedBook, creditTerm) {
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
}

function generateCreditDates(creditTerm, totalPrice) {
    // Credit Term
    let today = new Date()
    // today.setDate(30)
    let informations = []

    const dueDates = Array.from({ length: creditTerm }, (_) => {
        let dueDate = new Date(today.setMonth(today.getMonth() + 1));
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const dayFormat = dueDate.toLocaleDateString('en-Us', options)
        return dayFormat
    })
    informations = dueDates.map((dueDate, i) => {
        const objectFormat = new Object()
        objectFormat.dueDate = dueDate
        objectFormat.term = i + 1
        if (i === dueDates.length-1) {
            objectFormat.payment = totalPrice - (Math.ceil(totalPrice / creditTerm))*(dueDates.length-1)
        }
        else {
            objectFormat.payment = Math.ceil(totalPrice / creditTerm)
        }
        return objectFormat
    })
    return informations
}

function bookPurchasing(book, discountPercentage, taxPercentage, amountOfStock, amountOfPurchasedBook, creditTerm) {
    let validation = validateInput(discountPercentage, taxPercentage, amountOfPurchasedBook, creditTerm)
    let response = ''
    // Validate Input
    if (validation) {
        response = validation
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
    else if (amountOfPurchasedBook > 3 && amountOfStock > 3) {
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
        response = `Book with title ${book.title} has total price ${totalPrice} with details: ${stringDiscount} and tax price = ${totalTax}, price after tax is ${totalPrice}. Sorry, you can't buy it anymore.`
    }
    else if (difference < 0 && amountOfStock > 0) {
        response = `Sorry, you can only buy ${amountOfStock} book with title ${book.title} has total price ${totalPrice} with details: ${stringDiscount} and tax price = ${totalTax}, price after tax is ${totalPrice}.`
    }
    else {
        response = `Book with title ${book.title} has total price ${totalPrice} with details: ${stringDiscount} and tax price = ${totalTax}, price after tax is ${totalPrice}. You can buy again, the stock is still ${difference}.`
    }
    response += ` If paid in installments, these are the credit terms : `
    // creditDates.unshift(response)
    console.log(response)
    const creditDates = generateCreditDates(creditTerm, totalPrice)
    return creditDates
}
console.log(bookPurchasing(book, 25, 10, 4, 6, 11))