const fs = require('fs');
const path = require('path')
const csv = require('fast-csv');
const { format } = require('@fast-csv/format');
const Color = require('./utils/Color.js');
const prompt = require("prompt-sync")({ sigint: true });

const records = []
const color = new Color()
let inputColumnName = undefined
let inputMaxChars = undefined
let csvPathObject = undefined
let csvFilePath = undefined

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

    // ===================================================================================================================================================================

    // Gather filepath, header name, and max number of characters from user
    
    // Input: CSV File Path
    let enteredPath = undefined
    let fileExists = undefined
    let isCSVFile = undefined

    // do {
    //     console.log(`${color.Yellow}CSV File Path${color.Reset} (or drag & drop file here): ${color.Green}`)
    //     csvFilePath = prompt('> ')

    //     if (!csvFilePath || csvFilePath === '' || csvFilePath === undefined || csvFilePath === null) {
    //         enteredPath = false

    //         console.log(`fileExists: ${fileExists}`)
    //         console.log(`enteredPath: ${enteredPath}`)
    //         console.log(`isCSVFile: ${isCSVFile}`)

    //         console.error(`${color.Red}ERROR: You must provide a file path to your CSV file. Please try again`)
    //     } else {
    //         enteredPath = true

    //         // Check if file exists
    //         console.log('')
    //         csvFilePath = path.resolve(csvFilePath)
    //         csvPathObject = path.parse(csvFilePath) // Create a path object (used during step #5 formatToCsv)

    //         if (!fs.existsSync(csvFilePath)) {
    //             fileExists = false

    //             console.log(`fileExists: ${fileExists}`)
    //             console.log(`enteredPath: ${enteredPath}`)
    //             console.log(`isCSVFile: ${isCSVFile}`)

    //             console.error(`${color.Red}ERROR: File does not exist at path: ${csvFilePath}.${color.Reset} Please try again`)
    //         } else {
    //             fileExists = true
    //             if (csvPathObject.ext !== '.csv') {
    //                 isCSVFile = false

    //                 console.log(`fileExists: ${fileExists}`)
    //                 console.log(`enteredPath: ${enteredPath}`)
    //                 console.log(`isCSVFile: ${isCSVFile}`)

    //                 console.error(`${color.Red}ERROR: This program only works with CSV files, ending in .csv - Please double check your file and try again ${color.Reset}`)
    //             }
    //         }
    //     }
    // } while (!enteredPath || !fileExists || !isCSVFile)

    

    // CHECK IF PATH ENTERED
    do {
        console.log(`${color.Yellow}CSV File Path${color.Reset} (or drag & drop file here): ${color.Green}`)
        csvFilePath = prompt('> ')

        csvFilePath = csvFilePath.replace(/['"]+/g, '')

        console.log('\n\nFILE PATH: ' + csvFilePath + '\n\n')

        if (!csvFilePath || csvFilePath === '' || csvFilePath === undefined || csvFilePath === null) {
            enteredPath = false

            console.log(`fileExists: ${fileExists}`)
            console.log(`enteredPath: ${enteredPath}`)
            console.log(`isCSVFile: ${isCSVFile}`)

            console.error(`${color.Red}ERROR: You must provide a file path to your CSV file. Please try again`)
        } else {
            enteredPath = true
        }
    } while (!enteredPath)



    // CHECK IF FILE EXISTS
    if (!fs.existsSync(csvFilePath)) {

        console.log(`fileExists: ${fileExists}`)
        console.log(`enteredPath: ${enteredPath}`)
        console.log(`isCSVFile: ${isCSVFile}`)

        console.error(`${color.Red}ERROR: File does not exist at path: ${csvFilePath}.${color.Reset} Please try again`)
        fileExists = undefined
    } else {
        fileExists = true
        console.log('')
        csvFilePath = path.resolve(csvFilePath)
        csvPathObject = path.parse(csvFilePath) // Create a path object (used during step #5 formatToCsv)
    }


    // CHECK IF FILE IS A CSV FILE
    if (fileExists) {
        if (csvPathObject.ext !== '.csv') {
            isCSVFile = false

            console.log(`fileExists: ${fileExists}`)
            console.log(`enteredPath: ${enteredPath}`)
            console.log(`isCSVFile: ${isCSVFile}`)

            console.error(`${color.Red}ERROR: This program only works with CSV files, ending in .csv - Please double check your file and try again ${color.Reset}`)
            prompt('Press [ENTER] to continue...')
            start()
        } else {
            isCSVFile = true
        }
    }
    












    // console.log('')
    // csvFilePath = path.resolve(csvFilePath)
    // csvPathObject = path.parse(csvFilePath) // Create a path object (used during step #5 formatToCsv)

    // // Check if file exists
    // if (!fs.existsSync(csvFilePath)) {
    //     console.log(`ERROR: File does not exist at path: ${csvFilePath}`)
    // }

    // Input: Column Name
    do {
        inputColumnName = prompt(`${color.Yellow}Column Name${color.Reset} to truncate (case-sensitive): ${color.Green}`)
    } while (inputColumnName === '' || inputColumnName === undefined || inputColumnName === null)

    // Input: MaxChars
    do {
        inputMaxChars = prompt(`${color.Yellow}Max Number of Characters${color.Reset} desired: ${color.Green}`)
    } while (parseInt(inputMaxChars) < 0 || inputMaxChars === '' || inputMaxChars === undefined || inputMaxChars === null)

    // Display verification prompt
    console.clear()
    console.log('+========================================================================+')
    console.log(color.Yellow + '\nPlease Verify:' + color.Reset + '\n')
    console.log('CSV File Path: ' + color.Green + csvFilePath + color.Reset)
    console.log('Truncate Column: ' + color.Green + inputColumnName + color.Reset)
    console.log('Max Characters: ' + color.Green + inputMaxChars + color.Reset + '\n')

    let inputVerify
    do {
        inputVerify = prompt(`${color.Reset}Is this correct? Type ${color.Green}'Y' for yes, ${color.Red}'N' for no: ${color.Yellow}`)
    } while (inputVerify === '' || inputVerify === undefined || inputVerify === null)

    if (inputVerify.toUpperCase() === 'Y') {
        console.clear()
        beginProcessing()       // step 2
    } else {
        console.clear()
        inputFilePath = undefined
        inputColumnName = undefined
        inputMaxChars = undefined
        csvPathObject = undefined
        csvFilePath = undefined
        start()
    }
}

// STEP 2 - (read in CSV from file)
const beginProcessing = () => {
    if (!csvFilePath || csvFilePath.length <= 0) {
        throw new Error('ERROR: csvFilePath (path to the CSV file) cannot be blank!')
    }

    if (!inputColumnName || inputColumnName.length <= 0) {
        throw new Error('ERROR: inputColumnName (the column name to truncate) cannot be blank!')
    }

    console.log(`${color.Yellow}Truncating ${color.White}${inputColumnName} column from ${color.Cyan}${csvFilePath}${color.Reset}...`)
    console.log(color.Red + 'Type Ctrl + C to abort this program at any time'+color.Reset)

    fs.createReadStream(csvFilePath)
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

    let inputVerify
    do {
        console.log(color.Yellow + 'Is this correct? ' + color.Green + "'Y' for yes (save to file)"+color.White+', or ' + color.Red + "'N' for no and abort the program." + color.Reset)
        inputVerify = prompt()
    } while (inputVerify === '' || inputVerify === undefined || inputVerify === null)

    if (inputVerify.toUpperCase() === 'Y') {
        formatToCsv()
    } else {
        start()
    }
}

// STEP 5 - Save changes to a separate CSV file (in same directory)
const formatToCsv = () => {

    console.clear()
    // Configure new path for saving (to avoid saving the source file)
    const saveFilePath = path.join(csvPathObject.dir, csvPathObject.name + '_TRUNC' + csvPathObject.ext)
    console.log(`\n${color.Reset}Saving to ${color.Yellow}${saveFilePath} ${color.Reset}\n`)

    // Create file stream and write changes to file
    const csvFile = fs.createWriteStream(saveFilePath);
    const stream = format({ headers:true });
    stream.pipe(csvFile);
    records.forEach(row => stream.write(row))
    stream.end();

    console.log(color.Green + color.Bold + csvFilePath + ' finished processing successfully' + color.Reset)
    console.log('Thank you for using CSVTruncator!' + color.Reset)
    prompt('Press [ENTER] to exit...')
}


// EXECUTION =======================================================================================================

start()     // step 1
