const dayjs = require('dayjs')
const minimist = require('minimist')(process.argv.slice(2))

const oneday = minimist.y ? dayjs(`${minimist.y}-${minimist.m}`) : dayjs()
const lastdate = oneday.endOf('month').date()
const startweekday = oneday.day()

console.log(`     ${oneday.month() + 1}月 ${oneday.year()}`)
console.log(' 日 月 火 水 木 金 土')
const startmargin = '   '.repeat(startweekday)
process.stdout.write(`${startmargin}`)

for (let date = 1; date <= lastdate; date++) {
  const current = oneday.date(date)
  const weekday = current.day()
  if (weekday === 0) {
    console.log('')
  }
  process.stdout.write(` ${String(date).padStart(2)}`)
}
