const moment = require('moment')

const stringOfDate = '06-10-2023'
// '28-09-2023'

function generateTime(stringOfDate){
    if(!stringOfDate){
        stringOfDate = moment().format("DD-MM-YYYY")
    }
    const isDateValid = moment(stringOfDate,"DD-MM-YYYY",true).isValid()
    if(!isDateValid){
        return 'please input valid date'
    }
    const added2Hours = moment(stringOfDate,"DD-MM-YYYY").add(2, 'h').format("dddd DD MMMM YYYY HH:mm:ss")
    const added5Days = moment(stringOfDate,"DD-MM-YYYY").add(5, 'd').format("dddd DD MMMM YYYY HH:mm:ss")
    const addedOneWeek = moment(stringOfDate,"DD-MM-YYYY").add(1, 'w').format("dddd DD MMMM YYYY HH:mm:ss")
    const minus5Days = moment(stringOfDate,"DD-MM-YYYY").subtract(5, 'd').format("dddd DD MMMM YYYY HH:mm:ss")
    const startOfTheWeek = moment(stringOfDate,"DD-MM-YYYY").startOf('week').format("dddd DD MMMM YYYY HH:mm:ss")
    const endOfTheMonth = moment(stringOfDate,"DD-MM-YYYY").endOf('month').format("dddd DD MMMM YYYY HH:mm:ss")

    return {added2Hours,added5Days,addedOneWeek,minus5Days,startOfTheWeek,endOfTheMonth}
}

console.log(generateTime(stringOfDate))
