const fs = require('fs')
const dayjs = require('dayjs')
const { prompt } = require('enquirer')
const { exit } = require('process')
const minimist = require('minimist')(process.argv.slice(2))
const inputs = []

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

class Memo {
  constructor () {
    this.files = fs.readdirSync('./memo_data', 'utf-8')
  }

  create () {
    console.log(this.files)
    reader.on('line', function (line) {
      inputs.push('\n' + line)
    })

    reader.question('Make a note !\n', (answer) => {
      inputs.push(answer)
    })

    reader.on('close', function () {
      console.log('Your note was saved safely.')
      const now = dayjs().format('YYYY_MM_DD_HH:mm')
      fs.writeFileSync(`./memo_data/${now}.txt`, inputs.join(''))
    })
  }

  destroy () {
    const filenames = this.files
    if (filenames.length === 0) {
      console.log('No files to delete')
      exit()
    }

    const basename = filenames.map(file => {
      return file.replace('.txt', '')
    })
    const question = {
      type: 'select',
      name: 'filename',
      message: 'Choose a note you want to destroy:',
      choices: basename
    }
    prompt(question)
      .then(answer => fs.unlinkSync(`./memo_data/${answer.filename}.txt`))
  }

  list () {
    const filenames = this.files
    if (filenames.length === 0) {
      console.log('No files to show')
      exit()
    }
    filenames.forEach((filename) => {
      const fileContent = fs.readFileSync(`./memo_data/${filename}`, 'utf-8')
      const text = fileContent.split(/\r\n|\r|\n/)
      console.log(text[0])
    })
    exit()
  }

  show () {
    const filenames = this.files
    if (filenames.length === 0) {
      console.log('No files to select')
      exit()
    }
    const hash = {}
    const filesContent = filenames.map((filename) => {
      const fileContent = fs.readFileSync(`./memo_data/${filename}`, 'utf-8')
      const text = fileContent.split(/\r\n|\r|\n/)
      hash[text[0]] = filename
      return text[0]
    })
    console.log(hash)
    const question = {
      type: 'select',
      name: 'filename',
      message: 'Choose a note you want to see:',
      choices: filesContent
    }
    prompt(question)
      .then(answer => console.log(fs.readFileSync(`./memo_data/${hash[answer.filename]}`, 'utf-8')))
  }
}

const memo = new Memo()

if (minimist.d) {
  memo.destroy()
} else if (minimist.l) {
  memo.list()
} else if (minimist.r) {
  memo.show()
} else {
  memo.create()
}
