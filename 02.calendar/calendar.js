const dayjs = require('dayjs')

const today = dayjs()
const lastdate = today.endOf('month').date()
const startweekday = today.day()

console.log(`     ${today.month() + 1}月 ${today.year()}`)
console.log(' 月 火 水 木 金 土 日')
const startweekdayspace = '   '.repeat(startweekday)
process.stdout.write(`   ${startweekdayspace}`)

for (let date = 1; date <= lastdate; date++) {
  const current = today.date(date)
  const dayofweek = current.day()
  if (dayofweek === 0) {
    console.log('')
  }
  process.stdout.write(` ${String(date).padStart(2)}`)
}
