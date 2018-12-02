const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let lines = []
lineReader.on('line', (line) => {
  const num = parseInt(line)
  lines.push(num)
})

lineReader.on('close', () => {
  const total = lines.reduce((agg, ln) => agg + ln, 0)
  console.log(total)
})