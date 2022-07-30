const fs = require('fs')
const { prompt } = require('enquirer')
const { exit } = require('process')
const minimist = require('minimist')(process.argv.slice(2))
const inputs = []

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

if (minimist.r) {
  const files = fs.readdirSync('./memo_data', 'utf-8')
  const question = {
    type: 'select',
    name: 'filename',
    message: 'Choose a note you want to see:',
    choices: files
  }
  prompt(question)
    .then(answer => console.log(fs.readFileSync(`./memo_data/${answer.filename}`, 'utf-8')))
}

if (minimist.l) {
  const filenames = fs.readdirSync('./memo_data', 'utf-8')
  for (let number = 0; number < filenames.length; number++) {
    console.log(filenames[number].replace('.txt', ''))
  }
  exit()
}

if (!minimist.l && !minimist.r) {
  reader.on('line', function (line) {
    inputs.push(line)
  })

  reader.question('メモを作成してね！ \n', (answer) => {
    inputs.push(answer)
  })

  reader.on('close', function () {
    console.log('ファイルを保存しました。')
    fs.writeFileSync(`./memo_data/${inputs[0]}.txt`, inputs.toString().replace(',', '\n'))
  })
}
