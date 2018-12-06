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
  console.log(minX, maxX, minY, maxY)
  let z = 0
  let dupes = 0
  let grid = []
  let x = minX
  for (x; x <= maxX; x++) {
    let y = minY
    for (y; y <= maxY; y++) {
      z++
      let min = {
        c: [],
        d: maxX + maxY * 2
      }
      if (coords.findIndex(c => c[0] === x && c[1] === y) > -1) { continue }
      coords.forEach(c => {
        const diff = Math.abs(c[0] - x) + Math.abs(c[1] - y)
        if (diff === 0) { return }
        if (diff < min.d) {
          min = {
            c: c,
            d: diff
          }
          return
        }
        if (diff === min.d) {
          min = {
            c: [],
            d: diff
          }
        }
      })
      grid.push({
        point: [x, y],
        nearest: min.c,
        distance: min.d
      })
    }
  }
  let infinite = grid.filter(g => g.nearest.length === 1 && (g.point[0] === minX || g.point[0] === maxX || g.point[1] === minY || g.point[1] === maxY))
    .map(g => `${g.nearest[0]}-${g.nearest[1]}`)
  let distances = {}
  coords.forEach(c => {
    if (!infinite.includes(`${c[0]}-${c[1]}`)) {
      distances[`${c[0]}-${c[1]}`] = 1 // 1 because the total includes the node itself
    }
  })
  grid.forEach(g => {
    const key = `${g.nearest[0]}-${g.nearest[1]}`
    if (Object.keys(distances).includes(key)) {
      distances[key] += 1
    } 
  })
  const maxDistance = Object.keys(distances).reduce((agg, val) => {
    return Math.max(agg, distances[val])
  }, 0)
  console.log(distances)
  console.log(maxDistance)
})