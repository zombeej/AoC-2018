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
})

lineReader.on('close', () => {
  console.log('lines:', lines.length)
  // firstTry()
  secondTry()
})

// takes about 9.5s
function firstTry () {
  while (!found) {
    dupeFinder()
  }
}

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

// takes about 150ms
function secondTry () {
  sums.push(0)
  lines.forEach(n => {
    sum += n
    sums.push(sum)
  })
  const period = sums.splice(-1)[0]
  let stack = 1
  while (!found) {
    for (let i = 0; i < sums.length; i++) {
      let test = sums[i] + (period * stack)
      if (sums.includes(test)) {
        found = test
        break
      }
    }
    stack++
  }
  console.log('first repeated sum: ', found)
  console.log('time: ', Date.now() - start)
  console.log('stack: ', stack)
}
