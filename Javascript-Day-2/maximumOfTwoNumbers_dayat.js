function max_of_two(a, b) {
    try {
        let checka = typeof (a)
        let checkb = typeof (b)
        if (checka !== 'number' || checkb !== 'number') {
            throw error
        }
        if (a > b) {
            return a
        }
        return b
        // else {
        //     return b
        // }
    } catch (error) {
        return 'Please Input Integer'
    }
}

console.log(max_of_two(10, 5));
console.log(max_of_two(45, 66));
console.log(max_of_two(66, 66));
console.log(max_of_two('a', 66));