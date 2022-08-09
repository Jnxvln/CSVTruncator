const fs = require('fs');
const csv = require('fast-csv');
const { format } = require('@fast-csv/format');
const prompt = require("prompt-sync")({ sigint: true });

const records = []
let inputFilePath = undefined
let inputColumnName = undefined
let inputMaxChars = undefined

// STEP 1
const start = () => {
    console.log('\x1b[36m')
    console.log('+========================================================================+')
    console.log('|                      ', '\x1b[37m', '\u001b[1m', 'C S V   T r u n c a t o r', '\x1b[36m','                    |')
    console.log('+========================================================================+')
    console.log('|', '\u001b[37m', 'Author:', '\x1b[36m', '   Justin Cox                                                |')
    console.log('|', '\u001b[37m', 'Published:', '\x1b[36m', 'Tues, August 08, 2022                                     |')
    console.log('|', '\u001b[37m', 'Description:', '\x1b[36m', '                                                        |')
    console.log('|  Truncate a column of CSV data to a desired number of characters       |')
    console.log('+========================================================================+')
    console.log('\x1b[41m', '\x1b[37m', 'Type Ctrl + C to abort this program at any time', '\x1b[0m', '\n')

    // console.log('\u001b[33m')
    inputFilePath = prompt('CSV File Path: ')
    inputColumnName = prompt('Column name to truncate (case-sensitive): ')
    inputMaxChars = prompt('Max number of characters desired: ')
    // console.log('\u001b[0m')

    console.log('+========================================================================+')
    console.log('\x1b[33m', '\nPlease Verify:', '\x1b[0m', '\n')
    console.log('CSV File Path: ' + '\x1b[32m' +inputFilePath + '\x1b[0m')
    console.log('Truncate Column: ' + '\x1b[32m' +inputColumnName + '\x1b[0m')
    console.log('Max Characters: ' + '\x1b[32m' +inputMaxChars + '\x1b[0m' + '\n')

    const inputVerify = prompt("Is this correct? Type 'Y' for yes, 'N' for no: ")

    if (inputVerify.toUpperCase() === 'Y') {
        console.clear()
        beginProcessing()
    } else {
        console.clear()
        start2()
    }
}

// STEP 2
const beginProcessing = () => {
    console.log(`\n\x1b[36mProcessing ${inputFilePath}...\u001b[0m`)
    console.log('\x1b[41m', '\x1b[37m', 'Type Ctrl + C to abort this program at any time', '\x1b[0m', '\n')
    if (!inputFilePath || inputFilePath.length <= 0) {
        throw new Error('ERROR: inputFilePath (path to the CSV file) cannot be blank!')
    }

    if (!inputColumnName || inputColumnName.length <= 0) {
        throw new Error('ERROR: inputColumnName (the column name to truncate) cannot be blank!')
    }

    fs.createReadStream(inputFilePath)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => truncateColumn(row, inputColumnName))
    .on('end', () => processResults());
}

// STEP 3
const truncateColumn = (row, columnName) => {
    row[columnName] = row[columnName].slice(0, inputMaxChars)
    records.push(row)
}

// STEP 4
const processResults = () => {
    console.log('\nPROCESSED RECORDS: ')
    console.log(records)
    console.log('')
    console.log("Is this correct?", "\x1b[32m", "'Y' for yes and to continue saving to file,", "\x1b[31m", "'N' for no and abort the program.", "\x1b[0m")
    const inputVerify = prompt()

    if (inputVerify.toUpperCase() === 'Y') {
        formatToCsv()
    } else {
        return -1
    }
}

// STEP 5
const formatToCsv = () => {

    // Update filename to [path]_TRUNCATED.csv
    const indexOfLastPeriod = inputFilePath.lastIndexOf('.')
    const firstPath = inputFilePath.slice(0, indexOfLastPeriod)
    const amendedFilePath = firstPath + '_TRUNCATED.csv'
    console.log(`\nWriting to ${amendedFilePath}`)

    // Write to file
    const csvFile = fs.createWriteStream(amendedFilePath);
    const stream = format({ headers:true });
    stream.pipe(csvFile);
    records.forEach(row => stream.write(row))
    stream.end();
    console.log(`\u001b[42m \u001b[37m \u001b[1m ${inputFilePath} processed successfully!`);
    console.log('\u001b[0m Check your CSV file to ensure changes. Thank you for using my program!')
}


// EXECUTION =======================================================================================================

start()     // step 1
