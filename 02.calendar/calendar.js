const dayjs = require('dayjs')
const minimist = require('minimist')(process.argv.slice(2))

const year = minimist.y ? minimist.y : dayjs().year()
const month = minimist.m ? minimist.m : dayjs().month() + 1
const certain_month = dayjs(`${year}-${month}`)
const last_date = certain_month.endOf('month').date()
const start_weekday = certain_month.day()

console.log(`     ${month}月 ${year}`)
console.log(' 日 月 火 水 木 金 土')
const start_margin = '   '.repeat(start_weekday)
process.stdout.write(`${start_margin}`)

for (let date = 1; date <= last_date; date++) {
  const current = certain_month.date(date)
  const weekday = current.day()
  if (weekday === 0 && date !== 1) {
    console.log('')
  }
  process.stdout.write(` ${String(date).padStart(2)}`)
}
