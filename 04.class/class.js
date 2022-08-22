const fs = require('fs')
const { MultiSelect } = require('enquirer')
const { exit } = require('process')
const minimist = require('minimist')(process.argv.slice(2))

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

class Memo {
  constructor () {
    this.files = fs.readdirSync('./memo_data', 'utf-8')
  }

  buildChoice () {
    const result = this.files.map((path) => {
      const fileContent = fs.readFileSync(`./memo_data/${path}`, 'utf-8')
      const text = fileContent.split(/\r\n|\r|\n/)
      const choice = { name: `${text[0]} in ${path}`, value: path }
      return choice
    })
    return result
  }

  create () {
    const inputs = []
    reader.on('line', function (line) {
      inputs.push('\n' + line)
    })

    reader.question('Make a note !\n', (answer) => {
      inputs.push(answer)
    })

    reader.on('close', function () {
      console.log('Your note was saved safely.')
      const now = new Date()
      fs.writeFileSync(`./memo_data/${now.getTime()}.txt`, inputs.join(''))
    }
    )
  }

  destroy () {
    if (this.files.length === 0) {
      console.log('No files to delete')
      exit()
    }

    const firstLineAndPaths = this.buildChoice()

    const prompt = new MultiSelect({
      message: 'Choose a note you want to destroy:',
      limit: firstLineAndPaths.count,
      choices: firstLineAndPaths,
      result (values) {
        return this.map(values)
      }
    })

    prompt.run()
      .then(answer => {
        for (const [key, value] of Object.entries(answer)) {
          console.log(`${key} was selected and destroyed`)
          fs.unlinkSync(`./memo_data/${value}`)
        }
      })
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
    if (this.files.length === 0) {
      console.log('No files to select')
      exit()
    }
    const firstLineAndPaths = this.buildChoice()

    const prompt = new MultiSelect({
      message: 'Choose a note you want to destroy:',
      limit: firstLineAndPaths.count,
      choices: firstLineAndPaths,
      result (values) {
        return this.map(values)
      }
    })

    prompt.run()
      .then(answer => {
        for (const [key, value] of Object.entries(answer)) {
          console.log(`${key} was selected`)
          console.log(fs.readFileSync(`./memo_data/${value}`, 'utf-8'))
        }
      })
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
