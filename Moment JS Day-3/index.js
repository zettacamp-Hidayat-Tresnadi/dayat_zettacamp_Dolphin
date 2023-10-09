const moment = require('moment')

const stringOfDate = '08-10-2023'
const stringOfSecondDate = '29-10-2023'

function generateTime(stringOfDate, stringOfSecondDate) {
    const isFirstDateValid = moment(stringOfDate, "DD-MM-YYYY", true).isValid()
    const isSecondDateValid = moment(stringOfSecondDate, "DD-MM-YYYY", true).isValid()
    if (!isFirstDateValid || !isSecondDateValid) {
        return 'please input valid date'
    }
    const indonesianFormat = moment(stringOfDate, "DD-MM-YYYY").utcOffset(7 * 60).locale('id').format("LLLL [dengan GMT:] Z")
    const firstDateParameter = moment(stringOfDate, "DD-MM-YYYY")
    const secondDateParameter = moment(stringOfSecondDate, "DD-MM-YYYY")
    const currentDate = moment()
    const differentWeeks = firstDateParameter.diff(secondDateParameter, 'weeks')
    const isSameOrAfter = firstDateParameter.isSameOrAfter(secondDateParameter)
    const isSameOrBefore = firstDateParameter.isSameOrBefore(secondDateParameter)
    const isBetween = currentDate.isBetween(firstDateParameter, secondDateParameter,'date')
    return { indonesianFormat, differentWeeks, isSameOrAfter, isSameOrBefore, isBetween }
}

console.log(generateTime(stringOfDate, stringOfSecondDate))
