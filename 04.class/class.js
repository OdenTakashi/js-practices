const fs = require('fs')
const { prompt } = require('enquirer')
const { exit } = require('process')
const minimist = require('minimist')(process.argv.slice(2))
const inputs = []

// // dオプション
// if (minimist.d) {
//   const files = fs.readdirSync('./memo_data', 'utf-8')
//   const basename = files.map(file => {
//     return file.replace('.txt', '')
//   })
//   const question = {
//     type: 'select',
//     name: 'filename',
//     message: 'Choose a note you want to destroy:',
//     choices: basename
//   }
//   prompt(question)
//     .then(answer => fs.unlinkSync(`./memo_data/${answer.filename}.txt`))
// }

// // rオプション
// if (minimist.r) {
//   const files = fs.readdirSync('./memo_data', 'utf-8')
//   const basename = files.map(file => {
//     return file.replace('.txt', '')
//   })
//   const question = {
//     type: 'select',
//     name: 'filename',
//     message: 'Choose a note you want to see:',
//     choices: basename
//   }
//   prompt(question)
//     .then(answer => console.log(fs.readFileSync(`./memo_data/${answer.filename}.txt`, 'utf-8')))
// }

// // lオプション
// if (minimist.l) {
// const filenames = fs.readdirSync('./memo_data', 'utf-8')
// for (let number = 0; number < filenames.length; number++) {
//   console.log(filenames[number].replace('.txt', ''))
// }
// exit()
// }

// // オプションなし
const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

// if (!minimist.l && !minimist.r && !minimist.d) {
//   reader.on('line', function (line) {
//     inputs.push('\n' + line)
//   })

//   reader.question('メモを作成してね！ \n', (answer) => {
//     inputs.push(answer)
//   })

//   reader.on('close', function () {
//     console.log('ファイルを保存しました。')
//     console.log(inputs.join(''))
//     fs.writeFileSync(`./memo_data/${inputs[0]}.txt`, inputs.join(''))
//   })
// }

class Memo {
  create () {
    reader.on('line', function (line) {
      inputs.push('\n' + line)
    })

    reader.question('メモを作成してね！ \n', (answer) => {
      inputs.push(answer)
    })

    reader.on('close', function () {
      console.log('ファイルを保存しました。')
      console.log(inputs.join(''))
      fs.writeFileSync(`./memo_data/${inputs[0]}.txt`, inputs.join(''))
    })
  }

  delete () {
    const files = fs.readdirSync('./memo_data', 'utf-8')
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
    const filenames = fs.readdirSync('./memo_data', 'utf-8')
    for (let number = 0; number < filenames.length; number++) {
      console.log(filenames[number].replace('.txt', ''))
    }
    exit()
  }

  show () {
    const files = fs.readdirSync('./memo_data', 'utf-8')
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
  memo.delete()
} else if (minimist.l) {
  memo.list()
} else if (minimist.r) {
  memo.show()
} else {
  memo.create()
}
