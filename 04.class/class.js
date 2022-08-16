const fs = require('fs')
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

  getFileContent () {
    const hash = {}
    this.files.forEach((path) => {
      const fileContent = fs.readFileSync(`./memo_data/${path}`, 'utf-8')
      const text = fileContent.split(/\r\n|\r|\n/)
      hash[text[0]] = path
    })
    return hash
  }

  create () {
    const filenames = this.files
    let filesNumber = filenames.length

    reader.on('line', function (line) {
      inputs.push('\n' + line)
    })

    reader.question('Make a note !\n', (answer) => {
      inputs.push(answer)
    })

    reader.on('close', function () {
      let flag = true
      while (flag) {
        const path = `./memo_data/memo_${filesNumber + 1}.txt`
        if (!fs.existsSync(path)) {
          flag = false
          fs.writeFileSync(path, inputs.join(''))
        } else {
          filesNumber++
        }
      }
      console.log('Your note was saved safely.')
    })
  }

  destroy () {
    const filenames = this.files
    if (filenames.length === 0) {
      console.log('No files to delete')
      exit()
    }

    const fileFirstLineContentsAndPaths = this.getFileContent()
    const fileFirstLineContents = Object.keys(fileFirstLineContentsAndPaths)
    const question = {
      type: 'select',
      name: 'content',
      message: 'Choose a note you want to destroy:',
      choices: fileFirstLineContents
    }
    prompt(question)
      .then(answer => fs.unlinkSync(`./memo_data/${fileFirstLineContentsAndPaths[answer.content]}`))
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
    const fileFirstLineContentsAndPaths = this.getFileContent()
    const fileFirstLineContents = Object.keys(fileFirstLineContentsAndPaths)
    const question = {
      type: 'select',
      name: 'content',
      message: 'Choose a note you want to see:',
      choices: fileFirstLineContents
    }
    prompt(question)
      .then(answer => console.log(fs.readFileSync(`./memo_data/${fileFirstLineContentsAndPaths[answer.content]}`, 'utf-8')))
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
