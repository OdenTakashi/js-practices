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

  create () {
    reader.on('line', function (line) {
      inputs.push('\n' + line)
    })

    reader.question('メモを作成してね！ \n', (answer) => {
      inputs.push(answer)
    })

    reader.on('close', function () {
      console.log('ファイルを保存しました。')
      fs.writeFileSync(`./memo_data/${inputs[0]}.txt`, inputs.join(''))
    })
  }

  destroy () {
    const files = this.files
    if (files.length === 0) {
      console.log('削除できるファイルがありません')
      exit()
    }
    const basename = files.map(file => {
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
    for (let number = 0; number < filenames.length; number++) {
      console.log(filenames[number].replace('.txt', ''))
    }
    exit()
  }

  show () {
    const files = this.files
    const basename = files.map(file => {
      return file.replace('.txt', '')
    })
    const question = {
      type: 'select',
      name: 'filename',
      message: 'Choose a note you want to see:',
      choices: basename
    }
    prompt(question)
      .then(answer => console.log(fs.readFileSync(`./memo_data/${answer.filename}.txt`, 'utf-8')))
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
