const fs = require('fs');
const csv = require('fast-csv');
const { format } = require('@fast-csv/format');
const Color = require('./utils/Color.js');
const prompt = require("prompt-sync")({ sigint: true });

const records = []
const color = new Color()
let inputFilePath = undefined
let inputColumnName = undefined
let inputMaxChars = undefined

// STEP 1 - Get info from user
const start = () => {

    // Display Prompt
    console.clear()
    console.log(color.Cyan)
    console.log('+========================================================================+')
    console.log('|                      ' + color.White+'\u001b[1m'+'C S V   T r u n c a t o r' + color.Cyan + '                         |')
    console.log('+========================================================================+')
    console.log('| ' + color.White + 'Author:' + color.Cyan + '      Jnxvln                                                    |')
    console.log('| ' + color.White + 'Published:' + color.Cyan + '   Tues, August 08, 2022                                     |')
    console.log('| ' + color.White + 'Description:' + color.Cyan + '                                                           |')
    console.log('| Truncate a column of CSV data to a desired number of characters        |')
    console.log('+========================================================================+')
    console.log(color.Red + 'Type Ctrl + C to abort this program at any time' + color.Reset + '\n')
    console.log('Please enter the following information:\n')

    // Gather filepath, header name, and max number of characters from user
    inputFilePath = prompt(`${color.Yellow}CSV File Path${color.Reset} (or drag & drop file here): ${color.Green}`)
    inputColumnName = prompt(`${color.Yellow}Column Name${color.Reset} to truncate (case-sensitive): ${color.Green}`)
    inputMaxChars = prompt(`${color.Yellow}Max Number of Characters${color.Reset} desired: ${color.Green}`)

    // Display verification prompt
    console.clear()
    console.log('+========================================================================+')
    console.log(color.Yellow + '\nPlease Verify:' + color.Reset + '\n')
    console.log('CSV File Path: ' + color.Green + inputFilePath + color.Reset)
    console.log('Truncate Column: ' + color.Green + inputColumnName + color.Reset)
    console.log('Max Characters: ' + color.Green + inputMaxChars + color.Reset + '\n')

    const inputVerify = prompt(`${color.Reset}Is this correct? Type ${color.Green}'Y' for yes, ${color.Red}'N' for no: ${color.Yellow}`)

    if (inputVerify.toUpperCase() === 'Y') {
        console.clear()
        beginProcessing()       // step 2
    } else {
        console.clear()
        start()
    }
}

// STEP 2 - (read in CSV from file)
const beginProcessing = () => {
    console.log(`${color.Yellow}Truncating ${color.White}${inputColumnName} column from ${color.Cyan}${inputFilePath}${color.Reset}...`)
    console.log(color.Red + 'Type Ctrl + C to abort this program at any time'+color.Reset)

    if (!inputFilePath || inputFilePath.length <= 0) {
        throw new Error('ERROR: inputFilePath (path to the CSV file) cannot be blank!')
    }

    if (!inputColumnName || inputColumnName.length <= 0) {
        throw new Error('ERROR: inputColumnName (the column name to truncate) cannot be blank!')
    }

    fs.createReadStream(inputFilePath)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => truncateColumn(row, inputColumnName))    // step 3
    .on('end', () => processResults());                         // step 4
}

// STEP 3 - Truncate the desired column
const truncateColumn = (row, columnName) => {
    row[columnName] = row[columnName].slice(0, inputMaxChars)
    records.push(row)
}

// STEP 4 - Preview changes and prompt to save
const processResults = () => {
    console.log('\n' + color.Reset + 'PREVIEW CHANGES')
    console.table(records)
    console.log('')
    console.log(color.Yellow + 'Look good? ' + color.Green + "'Y' for yes (save to file)"+color.White+', or ' + color.Red + "'N' for no and abort the program." + color.Reset)
    const inputVerify = prompt()

    if (inputVerify.toUpperCase() === 'Y') {
        formatToCsv()
    } else {
        return -1
    }
}

// STEP 5 - Save changes to a separate CSV file (in same directory)
const formatToCsv = () => {

    console.clear()
    // Configure new path for saving (to avoid saving the source file)
    const fileExtensionPeriod = inputFilePath.lastIndexOf('.')
    const filename = inputFilePath.slice(0, fileExtensionPeriod)
    const amendedFilePath = filename + '_TRUNCATED.csv'
    console.log(`\n${color.Reset}Saving to ${color.Yellow}${amendedFilePath} ${color.Reset}\n`)

    // Create file stream and write changes to file
    const csvFile = fs.createWriteStream(amendedFilePath);
    const stream = format({ headers:true });
    stream.pipe(csvFile);
    records.forEach(row => stream.write(row))
    stream.end();

    console.log(color.Green + color.Bold + inputFilePath + ' finished processing successfully' + color.Reset)
    console.log('Thank you for using CSVTruncator!')
}


// EXECUTION =======================================================================================================

start()     // step 1
