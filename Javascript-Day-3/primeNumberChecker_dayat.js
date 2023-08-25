function isPrime(n) {
    if (typeof (n) !== 'number') {
        return 'Invalid Input'
    }

    else if (n % 1 !== 0) {
        return false
    }

    else if (n <= 1) {
        return false
    }
    let squareRoot = Math.floor(Math.sqrt(n))
    for (let i = 2; i <= squareRoot; i++) {
        if (n % i === 0) {
            return false
        }
    }
    return true
}

const isPrime2 = (n) => {
    if (typeof (n) !== 'number') {
        return 'Invalid Input'
    }
    else if (n % 1 !== 0) {
        return false
    }
    else if (n <= 1) {
        return false
    }
    let squareRoot = Math.floor(Math.sqrt(n))
    for (let i = 2; i < n; i++) {
        if (n % i === 0) {
            return false
        }
    }
    return true
}

// console.log(isPrime(10));
// console.log(isPrime(43));
// console.log(isPrime(241));
// console.log(isPrime(2));
// console.log(isPrime('a'))
// console.log(isPrime(5))

console.log(isPrime(10.1));
// console.log(isPrime(43));
// console.log(isPrime(241));
// console.log(isPrime(2));
// console.log(isPrime('a'))