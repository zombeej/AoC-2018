const startTS = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let map = []
let products = {}

lineReader.on('line', (line) => {
  map.push(line.split(''))
})

lineReader.on('close', () => {
  console.log(map.length)
  iterateMap(map)
})

function iterateMap (map, iteration = 1) {
  const newMap = analyzeMap(map)
  // displayMap(newMap)
  // console.log(iteration)
  if (iteration % 10000 === 0) {
    displayMap(newMap)
    finalCount(newMap, iteration)
    console.log(iteration)
  }
  if (iteration === 1000000000) {
    displayMap(newMap)
    finalCount(newMap)
    return
  }
  // setTimeout(() => iterateMap(newMap, ++iteration), 1000)
  process.nextTick(() => iterateMap(newMap, ++iteration))
}

function finalCount (map, iteration) {
  let lumberyards = 0
  let woods = 0
  map.forEach(r => r.forEach(c => {
    if (c === '#') { lumberyards++ }
    if (c === '|') { woods++ }
  }))
  const final = woods * lumberyards
  console.log('lumberyards: ', lumberyards)
  console.log('woods: ', woods)
  console.log('resource total: ', woods * lumberyards)
  products[final] = products[final] || []
  products[final].push(iteration)
  console.log(products)
}

function displayMap (map) {
  console.log('\033[2J')
  map.forEach(m => {
    console.log(m.join(''))
  })
}

function analyzeMap (map) {
  const h = map.length - 1
  const w = map[0].length - 1
  return map.map((r, ri) => {
    return r.map((c, ci) => {
      const rmin = Math.max(0, ri - 1)
      const rmax = Math.min(h, ri + 1)
      const cmin = Math.max(0, ci - 1)
      const cmax = Math.min(w, ci + 1)
      let surroundings = []
      for (let ra = rmin; ra <= rmax; ra++) {
        for (let ca = cmin; ca <= cmax; ca++) {
          if (ra === ri && ca === ci) { continue }
          surroundings.push(map[ra][ca])
        }
      }
      return getNewAcre(c, surroundings)
    })
  })
}

function getNewAcre (acre, surroundings) {
  switch (acre) {
    case '#':
      return checkLumberyard(surroundings)
      break
    case '.':
      return checkOpen(surroundings)
      break
    case '|':
      return checkTrees(surroundings)
      break
    default:
      return acre
      break
  }
}

function checkLumberyard (surroundings) {
  if (surroundings.includes('|') && surroundings.includes('#')) {
    return '#'
  }
  return '.'
}

function checkOpen (surroundings) {
  const fill = surroundings.filter(s => s === '|').length
  return fill > 2 ? '|' : '.'
}

function checkTrees (surroundings) {
  const change = surroundings.filter(s => s === '#').length
  return change > 2 ? '#' : '|'
}
