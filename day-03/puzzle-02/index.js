const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let lines = []
lineReader.on('line', (line) => {
  const data = line.split('@')[1]
  const size = data.split(': ')
  const pos = size[0].split(',')
  const sz = size[1].split('x')
  const piece = {
    i: line.split('@')[0],
    p: [parseInt(pos[0]), parseInt(pos[1])],
    s: [parseInt(sz[0]), parseInt(sz[1])]
  }
  lines.push(piece)
})

lineReader.on('close', () => {
  console.log('lines:', lines.length)
  calcInches()
})

function calcInches () {
  console.log(lines[0])
  let matrix = {}
  lines.forEach(l => {
    let x = 0
    for (x; x < l.s[0]; x++) {
      let y = 0
      for (y; y < l.s[1]; y++) {
        let val = matrix[`${l.p[0] + x}-${l.p[1] + y}`]
        matrix[`${l.p[0] + x}-${l.p[1] + y}`] = val ? val + 1 : 1
      }
    }
  })
  let magic = undefined
  lines.forEach((l, i) => {
    let overlaps = false
    let x = 0
    for (x; x < l.s[0]; x++) {
      let y = 0
      for (y; y < l.s[1]; y++) {
        let val = matrix[`${l.p[0] + x}-${l.p[1] + y}`]
        if (val > 1) {
          overlaps = true
          break
        }
      }
      if (overlaps) { break }
    }
    if (!overlaps) { magic = l.i }
  })
  console.log(magic)
  console.log('time: ', Date.now() - start)
}