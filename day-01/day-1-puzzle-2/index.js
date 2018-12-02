const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let lines = []
let sums = []
let sum = 0
let found = false

lineReader.on('line', (line) => {
  const num = parseInt(line)
  lines.push(num)
  console.log('pushed: ', num)
})

lineReader.on('close', () => {
  console.log('lines:', lines.length)
  while (!found) {
    dupeFinder()
  }
})

function dupeFinder () {
  let i = 0
  const s = lines.length

  // Uncommend this for debugging. Logging makes things take longer.
  // console.log(sums.length / lines.length)

  for (i; i < s; i++) {
    sum += lines[i]
    if (sums.includes(sum)) {
      console.log('first repeated sum: ', sum)
      console.log('time: ', Date.now() - start)
      found = true
      break
    }
    sums.push(sum)
  }
}
