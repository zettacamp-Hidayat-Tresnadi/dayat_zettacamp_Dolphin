function containDuplicate(nums) {
    let tempArray = []
    let isDuplicate = false
    nums.forEach(number => {
        if (!tempArray.includes(number)) {
            tempArray.push(number)
        }
        else {
            isDuplicate=true
        }
    });
    return isDuplicate
}

console.log(containDuplicate([1, 2, 3, 1])); // Output: true
console.log(containDuplicate([1, 2, 3, 4])); // Output: false
console.log(containDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])); // Output: true
console.log(containDuplicate([]))