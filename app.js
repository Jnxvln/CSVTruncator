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
let setupVerified = undefined
let continueMessage = `${color.Magenta}Press [ENTER] to continue...`

// #region UTILITY FUNCTIONS
const resetVariables = () => {
    inputColumnName = undefined
    inputMaxChars = undefined
    csvPathObject = undefined
    csvFilePath = undefined
    setupVerified = undefined
}

const promptToContinue = () => {
    prompt(continueMessage)
}

const printGreeting = () => {
    // Display greeting
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
}

const askFilePath = () => {
    let filePath = undefined

    do {
        console.log(`${color.Yellow}CSV File Path${color.Reset} (or drag & drop file here): ${color.Green}`)
        filePath = prompt('> ')
        filePath = filePath.replace(/['"]+/g, '')     // strip single-quotes and double-quotes

        if (!filePath) {
            // Nothing was entered (error)
            console.error(`${color.Red}ERROR: You must provide a CSV file path. ${color.Magenta}Please try again`)
        }
    } while (!filePath)

    csvFilePath = filePath
    // return filePath
}

const isFile = (filepath) => {
    // Check if file exists
    if (!fs.existsSync(filepath)) {
        console.error(`${color.Red}ERROR: The following file could not be found: ${filepath}.${color.Magenta}\n\nCheck filename and try again`)
        promptToContinue()
        return false
    }
    return true
}

const isFileCSV = (filepath) => {
    // Check if file is a CSV file
    if (csvPathObject.ext !== '.csv') {
        // console.error(`${color.Red}ERROR: This program only works with CSV files, ending in .csv - Please check your file extension and try again ${color.Reset}`)
        // promptToContinue()
        return false
    }
    return true
}

const askColumnName = () => {
    // Input: Column Name
    let columnName = undefined
    do {
        columnName = prompt(`${color.Yellow}Column Name${color.Reset} to truncate (case-sensitive): ${color.Green}`)
    } while (!columnName)

    return columnName
}

const setMaxChars = () => {
    let maxChars = undefined
    do {
        maxChars = prompt(`${color.Yellow}Max Number of Characters${color.Reset} desired: ${color.Green}`)
    } while (!maxChars || parseInt(maxChars) < 0)

    inputMaxChars = maxChars
    return maxChars
}

const setFilePath = () => {
    askFilePath()
    csvFilePath = path.resolve(csvFilePath)
    csvPathObject = path.parse(csvFilePath)         // Create path object (used during step #5 formatToCsv)
}

const setupIsVerified = () => {
    // Display verification prompt
    console.clear()
    console.log(color.Green + '+========================================================================+')
    console.log(color.Yellow + '\nPlease Verify:' + color.Reset + '\n')
    console.log('CSV File Path: ' + color.Green + csvFilePath + color.Reset)
    console.log('Truncate Column: ' + color.Green + inputColumnName + color.Reset)
    console.log('Max Characters: ' + color.Green + inputMaxChars + color.Reset + '\n')

    let inputVerify
    do {
        inputVerify = prompt(`${color.Reset}Is this correct? Type ${color.Green}'Y' for yes, ${color.Red}'N' for no: ${color.Yellow}`)
    } while (inputVerify === '' || inputVerify === undefined || inputVerify === null)


    console.log(color.Reset)

    if (inputVerify.toUpperCase() === 'Y') {
        console.clear()
        return true
    } else {
        console.clear()
        inputFilePath = undefined
        inputColumnName = undefined
        inputMaxChars = undefined
        csvPathObject = undefined
        csvFilePath = undefined
        return false
    }
}
// #endregion





// STEP 1 - Get info from user
const start = () => {

    printGreeting()

    // #1: Set the CSV file path
    setFilePath()


    // #2: Check if it's a file
    const fileExists = isFile(csvFilePath)
    if (!fileExists) {
        console.error(`File not found at ${csvFilePath}`)
        promptToContinue()
        resetVariables()
        start()
        // throw new Error(`File not found at ${csvFilePath}`)
    }

    // #3: Check if it has CSV file extension (.csv)
    const isCSVFile = isFileCSV(csvFilePath)
    if (!isCSVFile) {
        console.error(`${color.Red}ERROR: File type must be .csv${color.Reset}`)
        promptToContinue()
        resetVariables()
        start()
        // throw new Error(`File type must be .csv`)
    }

    // #4: Ask for column name to truncate
    inputColumnName = askColumnName()
    if (!inputColumnName) {
        console.error('Missing column name. You must provide the header name of the column you wish to truncate')
        promptToContinue()
        resetVariables()
        start()
        // throw new Error('Missing column name. You must provide the header name of the column you wish to truncate')
    }

    // #5: Input: MaxChars
    inputMaxChars = setMaxChars()
    if (!inputMaxChars) {
        console.error('You must enter the max number of visible characters')
        promptToContinue()
        resetVariables()
        start()
        throw new Error('You must enter the max number of visible characters')
    }


    // #6: Display verification prompt
    setupVerified = setupIsVerified()
    if (!setupVerified) {
        console.error('Setup was not verified')
        promptToContinue()
        resetVariables()
        start()
        // throw new Error('Setup was not verified')
    }

    // MOVE ON TO PROCESSING! (STEP #2)
    beginProcessing()
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

    try {        
        fs.createReadStream(csvFilePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => truncateColumn(row, inputColumnName))    // step 3
        .on('end', () => {
            console.log('------- FINISHED PROCESSING -------------')
            processResults()
        });                         // step 4
    } catch (error) {
        console.error(`${color.Red}${error}${color.Reset}`)
    }
}

// STEP 3 - Truncate the desired column
const truncateColumn = (row, columnName) => {
    if (row[columnName]) {
        row[columnName] = row[columnName].slice(0, inputMaxChars)
    } else {
        console.error(`${color.Red}ERROR: The column header named "${columnName}" does not exist${color.Reset}`)
        promptToContinue()
        resetVariables()
        start()
    }
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
    process.exit(1)
}


// EXECUTION =======================================================================================================

start()     // step 1
