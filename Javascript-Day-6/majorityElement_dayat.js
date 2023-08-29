function majorityElement(nums) {
    let number = 0
    let countNumber = 0
    for (let i = 0; i < nums.length; i++) {
        let countingCurrentNumber = 1
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] === nums[j]) {
                countingCurrentNumber++
            }
        }
        if(countNumber<countingCurrentNumber){
            countNumber=countingCurrentNumber
            number=nums[i]
        }
    }
    return number
}

console.log(majorityElement([3, 2, 3])); // Output: 3 
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // Output: 2
console.log(majorityElement([2, 2, 1, 1, 1, 0, 5])); // Output: 1