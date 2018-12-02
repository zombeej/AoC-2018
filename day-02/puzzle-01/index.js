const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let twos = 0
let threes = 0

lineReader.on('line', (line) => {
  let chars = {}
  let has2 = false
  let has3 = false
  line.split('').forEach(c => {
    chars[c] = chars[c] ? chars[c] + 1 : 1
  })
  Object.keys(chars).forEach(c => {
    if (chars[c] === 2) { has2 = true }
    if (chars[c] === 3) { has3 = true }
  })
  if (has2) { twos++ }
  if (has3) { threes ++ }
})

lineReader.on('close', () => {
  console.log(twos * threes)
})