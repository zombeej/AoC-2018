const startTS = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let map = ''
let register = []
let total = 0

// const testString = '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$'
const testString = '^ENWWW(NEEE|SSE(EE|N))$'
// const testString = null

lineReader.on('line', (line) => {
  map = line
})

lineReader.on('close', () => {
  getLongest(testString || map)
})

function getLongest (str) {
  str = str.substring(1, str.length -1)
  getTotal(str)
}

function getTotal (str) {
  let tot = 0
  const firstParen = str.indexOf('(')
  if (firstParen < 0) {
    total += str.length
    console.log(total)
  }
  const lastParen = str.length - str.split('').reverse().indexOf(')')
  console.log(firstParen, lastParen)
  tot += str.substring(0, firstParen).length
  total += tot
}
