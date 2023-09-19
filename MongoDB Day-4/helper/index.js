const fs = require('fs')
const book = {
    title: "Naruto",
    price: 10000,
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

async function generateCreditDates(creditTerm) {
    try {
        // Credit Term
        let today = new Date()
        // today.setDate(30)
        let informations = []
        const dueDates = Array.from({ length: creditTerm }, (_) => {
            let dueDate = new Date(today.setMonth(today.getMonth() + 1));
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dayFormat = dueDate.toLocaleDateString('id-Id', options)
            return dayFormat
        })
        informations = dueDates.map((dueDate, i) => {
            const objectFormat = new Object()
            objectFormat.dueDate = dueDate
            objectFormat.term = i + 1
            return objectFormat
        })
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(informations)
            }, 1000)
        })
    } catch (error) {
        console.log(error)
    }

    // return informations
}

async function generatePrices(generateCreditDates, totalPrice,additionalPrice, chosenTerm) {
    try {
        let chosenIndex = +chosenTerm - 1
        let creditTerm = generateCreditDates.length
        let totalInstalment = 0
        let installmentPrice = Math.ceil(+totalPrice / creditTerm)
        let generateListPrices = generateCreditDates.map((element, i) => {
            if (chosenTerm && additionalPrice>0) {
                if (i === chosenIndex && i < generateCreditDates.length - 1) {
                    element.payment = +additionalPrice + installmentPrice
                    totalInstalment += (+additionalPrice + installmentPrice)
                    installmentPrice=Math.ceil((totalPrice-totalInstalment)/(creditTerm-(i+1)))
                }
                else if (i === generateCreditDates.length - 1) {
                    element.payment = +totalPrice - totalInstalment
                }
                else {
                    element.payment = installmentPrice
                    totalInstalment += installmentPrice
                }
                return element.payment
            }
            else {
                if (i === generateCreditDates.length - 1) {
                    element.payment = +totalPrice - totalInstalment
                }
                else {
                    element.payment = installmentPrice
                    totalInstalment += installmentPrice
                }
                return element.payment
            }
        })
        // let generateListPrices =generateCreditDates.map((element, i) => {
        //     let installmentPrice = Math.ceil(+totalPrice / creditTerm)
        //         if (i === generateCreditDates.length - 1) {
        //             element.payment = +totalPrice - totalInstalment
        //         }
        //         else {
        //             element.payment = installmentPrice
        //             totalInstalment += installmentPrice
        //         }
        // });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(generateListPrices)
            }, 1000)
        })
    } catch (error) {
        console.log(error)
    }

    // return generateCreditDates
}

async function bookPurchasing(book, discountPercentage, taxPercentage, amountOfStock, amountOfPurchasedBook) {
    try {
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
        // const creditDates = await generateCreditDates(creditTerm, totalPrice, additionalPricePercentage)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ bookTitle: book.title, totalPrice: totalPrice, totalTax: totalTax, totalDiscount: totalDiscount, totalPriceAfterDiscount: totalPriceAfterDiscount, message: response })
            }, 1000)
        })
    } catch (error) {
        console.log(error)
    }

    // return { bookTitle: book.title, totalPrice: totalPrice, totalTax: totalTax, totalDiscount: totalDiscount, totalPriceAfterDiscount: totalPriceAfterDiscount, dueDate: creditDates, message:response}
}
// console.log(bookPurchasing(book, 25, 10, 4, 3, 3))
// console.log(generateCreditDates(10,10000))

async function loopingText(text) {
    try {
        let jsonData = fs.readFileSync('./coba.json', 'utf-8')
        let parsedData = JSON.parse(jsonData)
        for (let i = 1; i <= 5; i++) {
            await new Promise((resolve, reject) => {
                setTimeout((_) => {
                    if (text) {
                        resolve(`${text} from iteration: ${i}`)
                    }
                    else {
                        reject('Please input text')
                    }
                }, 2000)
            })
                .then((resolve) => {
                    console.log(resolve)
                    parsedData.push(resolve)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        let stringData = JSON.stringify(parsedData, null, 2)
        fs.writeFileSync('./coba.json', stringData)
        return text
    } catch (error) {
        console.log(error)
    }
}

module.exports = { bookPurchasing, validateInput, generateCreditDates, generatePrices, loopingText }