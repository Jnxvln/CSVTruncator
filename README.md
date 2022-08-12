# CSVTruncator

## Summary
<p>Truncate a column of CSV data to a desired number of characters
</p>
<br/>

> <p>This program was created to help my employer programatically truncate the 'Description' column (between 60-100 characters!) without having to manually edit each row in Excel. Of course, there are other ways to do this in Excel, so this project is mainly for fun.
</p>
<br/>

## Install & Run
```
git clone https://github.com/Jnxvln/CSVTruncator.git
cd CSVTruncator
npm install
node app.js
```
Optionally: Download from the project's [GitHub Repo](https://github.com/Jnxvln/CSVTruncator) and unzip.

Inside the CSVTruncator directory, open a terminal and run `npm install` to install dependencies, then run `node app.js` to run the program.

<br/>

## How To Use
When the program starts, you will be prompted to enter the following information:

| Info | Description |
|------|-------------|
| CSV File Path | The absolute or relative path to the CSV file (or drag & drop file) |
| Column Name | The name of the `column` in the CSV file you wish to truncate `(this IS case-sensitive)` |
| Max Characters | The maximum number of *visible* characters |

### CSV File Path
When asked for the `CSV File Path`, if the CSV file is in the same directory as the program, you can simply enter the filename with its extension. For example, if you have `employees.csv` in the same directory as the program itself, you can enter `employees.csv` into the prompt.

Otherwise, you'll need to supply the full path to the file. Such as, `c:\company\employees.csv`

<br/>

> *Quick tip*:  You may be able to **drag and drop** the file into the terminal when asked for the file path. Some shells allow this, but you will need to enter it manually if not.

<br/>



### Column Name
The column name (or header name) is the name of the column you wish to truncate. Typically this is a value in first line of most CSV files. Using the `sample.csv` you'll notice `Email` on line 1. 

```
Name,Age,Email
John Doe,23,JDoe@test.com
Kim West,34,KWest@test.com
...
```

In fact, each value on line 1 is treated as a header because of this code:

```
.pipe(csv.parse({ headers: true }))
```
*from `beginProcessing()`*

<br/>

With option `{ headers: true }` the parser treats line 1 of the CSV file as the table headers, or column names.

> IMPORTANT: This program is not yet equipped to handle if `{ headers: false }`

<br/>

### Max Number of Characters
The number of characters you want to see remaining. If you enter 10, for example, you will see a maximum of 10 characters long, everything else gets truncated.


---------------------

## Verify
The next step is to verify what is printed to the console. Do this by typing 'y' for yes, or 'n' for no, and pressing the Return key.
If you choose no, the program terminates.

## Write To File
Once everything has been verified and you choose to save the file, you should get a success message!

You'll now see another CSV file in the same directory as the original file. It has the same filename plus `_TRUNCATED` appended, as to not overwrite the original file. Make sure to look at this file and check that it worked correctly.

## WIP
It should be noted that this program is still under development, and more improvements will be added at some point in the future.

## Thank You!
I appreciate your feedback, I am a fairly new developer looking to build up my skills, and this is my first NodeJS console application!