const fs = require('fs')
const { MultiSelect } = require('enquirer')
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
    const result = this.files.map((path) => {
      const fileContent = fs.readFileSync(`./memo_data/${path}`, 'utf-8')
      const text = fileContent.split(/\r\n|\r|\n/)
      const hash = { name: text[0], value: path }
      return hash
    })
    return result
  }
  /// [{name: 'kodama'}, {name: 'naoki'}]

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
    console.log(fileFirstLineContentsAndPaths)

    const prompt = new MultiSelect({
      name: 'value',
      message: 'Choose a note you want to destroy:',
      limit: fileFirstLineContentsAndPaths.count,
      choices: fileFirstLineContentsAndPaths,
      result (names) {
        return this.map(names)
      }
    })

    prompt.run()
      .then(answer => {
        for (const [key, value] of Object.entries(answer)) {
          console.log(key, value)
        }
      }
      )
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
