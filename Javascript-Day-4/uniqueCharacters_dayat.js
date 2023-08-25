function hasUniqueCharacters2(str) {
    if (typeof (str) === 'number') {
        let text = str.toString()
        str = text
    }
    for (let i = 0; i < str.length; i++) {
        let countingLetter = 0
        for (let j = 0; j < str.length; j++) {
            if (str[i] === str[j]) {
                countingLetter++
            }

            if (countingLetter > 1) {
                return false
            }
        }
    }
    return true
}

function hasUniqueCharacters(str) {
    let tempSentence = []
    if (typeof (str) === 'number') {
        let text = str.toString()
        str = text
    }
    for (let i = 0; i < str.length; i++) {
        if (!tempSentence.includes(str[i])) {
            tempSentence.push(str[i])
        }
        else {
            return false
        }
    }
    return true
}

console.log(hasUniqueCharacters('aaafg'))
console.log(hasUniqueCharacters(102))