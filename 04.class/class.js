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

    reader.question('メモを作成してね！ 一行目がタイトルになります\n', (answer) => {
      inputs.push(answer)
    })

    reader.on('close', function () {
      console.log('ファイルを保存しました。')
      const memoTitle = inputs[0].replace(/\.*\//, '')
      console.log(memoTitle)
      fs.writeFileSync(`./memo_data/${memoTitle}.txt`, inputs.join(''))
    })
  }

  destroy () {
    const filenames = this.files
    if (filenames.length === 0) {
      console.log('削除できるファイルがありません')
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
      console.log('表示できるファイルがありません')
      exit()
    }
    for (let number = 0; number < filenames.length; number++) {
      console.log(filenames[number].replace('.txt', ''))
    }
    exit()
  }

  show () {
    const filenames = this.files
    if (filenames.length === 0) {
      console.log('選択できるファイルがありません')
      exit()
    }
    const basenames = filenames.map(file => {
      return file.replace('.txt', '')
    })
    const question = {
      type: 'select',
      name: 'filename',
      message: 'Choose a note you want to see:',
      choices: basenames
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
