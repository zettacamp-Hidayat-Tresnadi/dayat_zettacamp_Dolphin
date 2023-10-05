const moment = require('moment')

function formatDateWithValidation(dateString) {
    const expectedFormat = "YYYY-MM-DD";
    const parsedDate = moment(dateString, expectedFormat, true).locale('id')
    if (parsedDate.isValid()) {
        return parsedDate.format("dddd DD MMMM YYYY HH:mm:ss"); // Valid date
    } else {
        return 'Please input valid date'; // Invalid date
    }
}

function formatDateWithValidationUTC(dateString) {
    const expectedFormat = "YYYY-MM-DD";
    const parsedDate = moment(dateString, expectedFormat, true).utc().locale('id')
    if (parsedDate.isValid()) {
        return parsedDate.format("dddd DD MMMM YYYY HH:mm:ss"); // Valid date
    } else {
        return 'Please input valid date, the format should be YYYY-MM-DD'; // Invalid date
    }
}

function formatDateObjectWithDateAndTimeProperties(dateObject) {
    let dateTimeArray = []
    for (const [key] of Object.entries(dateObject)) {
        let validationDateAndTime = dateObject[key]
        if (!validationDateAndTime) {
            return "Please input data"
        }
        dateTimeArray.push(dateObject[key])
    }
    const dateTimeString = dateTimeArray.join(" ")
    const parsedDate = moment(dateTimeString)
    const isDateValid = parsedDate.isValid()
    const invalidDate = parsedDate.invalidAt()
    if (!isDateValid) {
        return `sorry the input is invalid this is the invalid code: ${invalidDate}`
    }
    let modifiedParsedData = parsedDate.locale('en').format("dddd DD MMMM YYYY HH:mm:ss")
    return modifiedParsedData
}

function formatDateObjectWithDateAndTimePropertiesUTC(dateObject) {
    let dateTimeArray = []
    for (const [key] of Object.entries(dateObject)) {
        let validationDateAndTime = dateObject[key]
        if (!validationDateAndTime) {
            return
        }
        dateTimeArray.push(dateObject[key])
    }
    const dateTimeString = dateTimeArray.join(" ")
    const parsedDate = moment(dateTimeString).utc()
    const isDateValid = parsedDate.isValid()
    const invalidDate = parsedDate.invalidAt()
    if (!isDateValid) {
        return `sorry the input is invalid this is the invalid code: ${invalidDate}`
    }
    let modifiedParsedData = parsedDate.locale('en').format("dddd DD MMMM YYYY HH:mm:ss")
    return modifiedParsedData
}

const myDateObject2 = {
    date: '1000-12-28',
    time: '11:11:11'
}

const myString = '1997-09-28'
function generateFormatDateParameters(stringDate, dateObject) {
    let dateFormatWithStringData
    let dateFormatWithObjectData
    if(!stringDate){
        dateFormatWithStringData =moment().format("dddd YYYY-MM-DD HH:mm:ss.SSS")
    }
    else {
        dateFormatWithStringData = formatDateWithValidation(stringDate)
    }
    dateFormatWithObjectData = formatDateObjectWithDateAndTimeProperties(dateObject)
   
    return {dateFormatWithStringData,dateFormatWithObjectData}
}

function generateFormatDateParametersUTC(stringDate, dateObject) {
    let dateFormatWithStringData
    let dateFormatWithObjectData
    if(!stringDate){
        dateFormatWithStringData =moment().utc().format("dddd YYYY-MM-DD HH:mm:ss.SSS")
    }
    else {
        dateFormatWithStringData = formatDateWithValidationUTC(stringDate)
    }
    dateFormatWithObjectData = formatDateObjectWithDateAndTimePropertiesUTC(dateObject)
   
    return {dateFormatWithStringData,dateFormatWithObjectData}
}

console.log(generateFormatDateParameters(myString,myDateObject2))
console.log(generateFormatDateParametersUTC(myString,myDateObject2))