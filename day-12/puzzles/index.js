const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let init = []
let patterns = {}
let first = 0
// Eventually this would give you the right answer...
// const gens = 50000000000
const gens = 20
let generations = []

lineReader.on('line', (line) => {
  if (/initial state:/.test(line)) {
    init = line.split(': ')[1] // .split('').map(v => v === '#')
    let fill = Array(Math.abs(first)).fill('.').join('')
    init = fill + init + fill
    generations.push(init)
    console.log('initial length ', init.length)
    return
  }
  if (line === '') { return }
  if (/=>/.test(line)) {
    const pattern = line.split(' => ')
    patterns[pattern[0]] = pattern[1]
  }
})

lineReader.on('close', () => {
  console.log(init)
  console.log(patterns)
  runGens(init)
})

function runGens (init, gen = 1) {
  if (gen % 50000 === 0) {
    console.log('gen ', gen)
    console.log('length ', init.length)
  }
  // while (init.indexOf('#') < 3 || init.slice(-3) !== '...') {
  //   // console.log(init.indexOf('#'), init.slice(-3))
  //   init = '.' + init + '.'
  //   first--
  // }
  // let nextGen = getNextGen (init)
  let nextGen = getNextGen ('...' + init + '...')
  first = first - 3
  // console.log(nextGen)
  let rem = nextGen.match(/^\.*/)
  // console.log(rem[0].length)
  first = first + rem[0].length
  nextGen = nextGen.replace(/^\.*/, '').replace(/\.*$/, '')
  // console.log(nextGen)
  // console.log('----------')
  generations = [nextGen]
  gen++
  if (gen <= gens) {
    // console.log('-------------------')
    process.nextTick(() => runGens(nextGen, gen))
  } else {
    calcTotal(generations.slice(-1)[0])
  }
}

function getNextGen (init) {
  let nextGen = ''
  for (p in init.split('')) {
    let s = p < 2 ? 0 : p - 2
    let e = p * 1 + 3
    let group = init.slice(s, e)
    let nextPlant = patterns[group] || '.'
    // console.log(p, s, e, group, nextPlant)
    nextGen += nextPlant
  }
  return nextGen
}

function calcTotal (gen) {
  // generations.forEach((g, i) => {
  //   console.log(i, g)
  // })
  const total = generations.slice(-1)[0].split('').reduce((a, v, i) => {
    return v === '#' ? a + i + first : a
  }, 0)
  console.log('total: ', total)
  console.log('final length ', generations[0].length)
}
