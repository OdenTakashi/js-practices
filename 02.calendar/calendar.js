const dayjs = require('dayjs')
const minimist = require('minimist')(process.argv.slice(2))

const year = minimist.y ? minimist.y : dayjs().year()
const month = minimist.m ? minimist.m : dayjs().month() + 1
const oneday = dayjs(`${year}-${month}`)
const lastdate = oneday.endOf('month').date()
const startweekday = oneday.day()

console.log(`     ${month}月 ${year}`)
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

console.log(dayjs().toDate().getTimezoneOffset())
