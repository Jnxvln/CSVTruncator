class Color {
  constructor () {
    this._black = '\u001b[30m',
    this._red = '\u001b[31m',
    this._green = '\u001b[32m',
    this._yellow = '\u001b[33m',
    this._blue = '\u001b[34m',
    this._magenta = '\u001b[35m',
    this._cyan = '\u001b[36m',
    this._white = '\u001b[37m',
    this._bgBlack = '\x1b[40m',
    this._bgRed = '\x1b[41m',
    this._bgGreen = '\x1b[42m',
    this._bgYellow = '\x1b[43m',
    this._bgBlue = '\x1b[44m',
    this._bgMagenta = '\x1b[45m',
    this._bgCyan = '\x1b[46m',
    this._bgWhite = '\x1b[47m',
    this._bold = '\u001b[1m',
    this._underline = '\u001b[4m',
    this._reset = '\u001b[0m'
  }

  // #region GETTERS
  get Red () {
    return this._red
  }

  get Green () {
    return this._green
  }

  get Yellow () {
    return this._yellow
  }

  get Blue () {
    return this._blue
  }

  get Magenta () {
    return this._magenta
  }

  get Cyan () {
    return this._cyan
  }

  get White () {
    return this._white
  }

  get BGBlack () {
    return this._bgBlack
  }

  get BGRed () {
    return this._bgRed
  }

  get BGGreen () {
    return this._bgGreen
  }

  get BGYellow () {
    return this._bgYellow
  }

  get BGBlue () {
    return this._bgBlue
  }

  get BGMagenta () {
    return this._bgMagenta
  }

  get BGCyan () {
    return this._bgCyan
  }

  get BGWhite () {
    return this._bgWhite
  }

  get Bold () {
    return this._bold
  }

  get Underline () {
    return this._underline
  }

  get Reset () {
    return this._reset
  }
  // #endregion
  
  // #region METHODS

  // Convert the colors to an object
  toObject () {
    return {
      Red: this._red,
      Green: this._green,
      Yellow: this._yellow,
      Blue: this._blue,
      Magenta: this._magenta,
      Cyan: this._cyan,
      White: this._white,
      Reset: this._reset
    }
  }

  // Print colors as an object to the console
  print () {
    console.table(this.toObject())
  }

  // log (color) {
  //   if (!color || color.length <= 0) {
  //     throw new Error('ColorLog.log() expects a color argument (use colors on the class)')
  //   }
  // }

  // #endregion
}

module.exports = Color