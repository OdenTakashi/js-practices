const dayjs = require('dayjs')
const minimist = require('minimist')(process.argv.slice(2))

const year = minimist.y ? minimist.y : dayjs().year()
const month = minimist.m ? minimist.m : dayjs().month() + 1
const certainMonth = dayjs(`${year}-${month}`)
const lastDate = certainMonth.endOf('month').date()
const startWeekday = certainMonth.day()

console.log(`     ${month}月 ${year}`)
console.log(' 日 月 火 水 木 金 土')
const startMargin = '   '.repeat(startWeekday)
process.stdout.write(startMargin)

for (let date = 1; date <= lastDate; date++) {
  const current = certainMonth.date(date)
  const weekday = current.day()
  const dateAdjusted = String(date).padStart(3)
  if (weekday === 0 && date !== 1) {
    console.log('')
  }
  process.stdout.write(dateAdjusted)
}
