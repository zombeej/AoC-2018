const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let lines = []
let matches = {}

lineReader.on('line', (line) => {
  lines.push(line)
})

lineReader.on('close', () => {
  finder()
})

function finder () {
  const target = lines[0].length - 1
  lines.forEach(l => {
    lines.forEach(l2 => {
      let same = 0
      const c2 = l2.split('')
      l.split('').forEach((c, i) => {
        if (c === c2[i]) {
          same++
        }
      })
      if (same === target) {
        matches = {
          l,
          l2
        }
      }
    })
  })
  console.log(matches)
  let diff = 0
  const l2s = matches.l2.split('')
  matches.l.split('').forEach((c, i) => {
    if (c !== l2s[i]) {
      diff = i
    }
  })
  const larr = matches.l.split('')
  larr.splice(diff, 1)
  console.log(larr.join(''))
}