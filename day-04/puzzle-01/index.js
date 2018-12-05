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
    let tsa = a.ts.replace(/[-:\s]/g, '')
    let tsb = b.ts.replace(/[-:\s]/g, '')
    return tsa - tsb
  }).map(a => {
    const ads = a.ts.split(' ')[0]
    const ats = a.ts.split(' ')[1].split(':')
    return {
      ...a,
      date: ads,
      minute: ats[1]
    }
  })
  let guards = []
  lines.forEach(l => {
    if (l.guard) {
      if (!guards.includes(l.guard))
      guards.push(l.guard)
    }
  })
  const times = guards.map(g => {
    let time = 0
    let minutes = Array(60).fill(0)
    let start = 0
    let isGuard = false
    lines.forEach(l => {
      if (l.guard === g) {
        isGuard = true
        return
      }
      if (l.guard) {
        isGuard = false
        return
      }
      if (isGuard && l.asleep) {
        start = parseInt(l.minute)
      }
      if (isGuard && l.awake) {
        const min = parseInt(l.minute)
        // console.log(g, start, min, min - start)
        time += (min - start)
        let s = start
        for (s; s < min; s++) {
          minutes[s] += 1
        }
      }
    })
    return {
      id: g,
      time,
      minutes
    }
  })
  const sorted = times.sort((a, b) => b.time - a.time)
  const maxMin = sorted[0].minutes.reduce((agg, m) => Math.max(agg, m), 0)
  console.log(lines.slice(0, 10).map(l => l.ts))
  console.log(times[0], maxMin)
  console.log('answer:', sorted[0].minutes.indexOf(maxMin) * parseInt(sorted[0].id))
  console.log(sorted.map(s => {
    return {
      id: s.id,
      time: s.time
    }
  }))
})
// 733 * 48
