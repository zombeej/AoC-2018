const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let lines = []
let guardCheck = {}
lineReader.on('line', (line) => {
  const ts = line.match(/\[(.*?)\]/)[1]
  // console.log(new Date(ts))
  let guard = line.match(/#(\d+)/)
  guardCheck[guard] = guardCheck[guard] || 0
  guardCheck[guard] += 1
  guard = guard ? guard[1] : null
  const asleep = /falls asleep/.test(line)
  const awake = /wakes up/.test(line)
  lines.push({
    ts,
    guard,
    asleep,
    awake
  })
})

lineReader.on('close', () => {
  console.log('lines:', lines.length)
  lines = lines.sort((a, b) => {
    const ads = a.ts.split(' ')[0].split('-')
    const ats = a.ts.split(' ')[1].split(':')
    const bds = b.ts.split(' ')[0].split('-')
    const bts = b.ts.split(' ')[1].split(':')
    return new Date(ads[0], ads[1], ads[2], ats[0], ats[1]).getTime() - new Date(bds[0], bds[1], bds[2], bts[0], bts[1]).getTime()
  }).map(a => {
    const ads = a.ts.split(' ')[0]
    const ats = a.ts.split(' ')[1].split(':')
    return {
      ...a,
      date: ads,
      minute: ats[1]
    }
  })
  let sleepMins = {}
  let currentGuard = null
  let currentMinute = 0
  lines.forEach(ev => {
    if (ev.guard) {
      currentGuard = ev.guard
      sleepMins[currentGuard] = sleepMins[currentGuard] || {}
      currentMinute = 0
      return
    }
    if (ev.asleep && !ev.guard) {
      currentMinute = parseInt(ev.minute)
    }
    if (ev.awake && !ev.guard) {
      for (currentMinute; currentMinute < ev.minute; currentMinute++) {
        sleepMins[currentGuard][currentMinute] = sleepMins[currentGuard][currentMinute] || 0
        sleepMins[currentGuard][currentMinute] += 1
      }
    }
  })
  sleepMins = Object.keys(sleepMins).map(k => {
    return {
      id: parseInt(k),
      count: Object.keys(sleepMins[k]).reduce((agg, m) => {
        return agg + sleepMins[k][m]
      }, 0),
      minutes: sleepMins[k]
    }
  }).sort((a, b) => b.count - a.count)
  console.log(sleepMins[0])
  const min = Object.keys(sleepMins[0].minutes).reduce((agg, m) => {
    return agg[1] > sleepMins[0].minutes[m] ? agg : [
      m,
      sleepMins[0].minutes[m]
    ]
  }, [0, 0])
  console.log(Object.keys(sleepMins).map(m => {
    return sleepMins[m].count
  }))
  console.log(sleepMins[0].id * min[0])
})