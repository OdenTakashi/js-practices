const fs = require('fs')
const { exit } = require('process')
const minimist = require('minimist')(process.argv.slice(2))
const inputs = []

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

if (minimist.l) {
  const filenames = fs.readdirSync('./memo_data', 'utf-8')
  for (let number = 0; number < filenames.length; number++) {
    console.log(filenames[number].replace('.txt', ''))
  }
  exit()
}
reader.on('line', function (line) {
  inputs.push(line)
})

reader.question('メモを作成してね！ \n', (answer) => {
  inputs.push(answer)
})

reader.on('close', function () {
  for (let i = 0; i < inputs.length; i++) {
    console.log(inputs[i])
  }
  fs.writeFileSync(`./memo_data/${inputs[0]}.txt`, String(inputs))
})
