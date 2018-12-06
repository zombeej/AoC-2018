const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let coords = []

lineReader.on('line', (line) => {
  const coord = line.split(',')
  coords.push(coord.map(c => parseInt(c)))
})

lineReader.on('close', () => {
  console.log('coords:', coords.length)
  const minX = coords.reduce((agg, val) => Math.min(agg, val[0]), coords[0][0])
  const maxX = coords.reduce((agg, val) => Math.max(agg, val[0]), coords[0][0])
  const minY = coords.reduce((agg, val) => Math.min(agg, val[1]), coords[0][1])
  const maxY = coords.reduce((agg, val) => Math.max(agg, val[1]), coords[0][1])
  // console.log(minX, maxX, minY, maxY)
  let z = 0
  let area = 0
  let x = minX
  for (x; x <= maxX; x++) {
    let y = minY
    for (y; y <= maxY; y++) {
      z++
      let sum = 0
      coords.forEach(c => {
        const diff = Math.abs(c[0] - x) + Math.abs(c[1] - y)
        sum += diff
      })
      if (sum >= 10000) { continue }
      area += 1
    }
  }
  console.log('size of acceptable area: ', area)
})