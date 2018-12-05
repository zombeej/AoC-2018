const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

const keys = {
  a: 'A',
  A: 'a',
  b: 'B',
  B: 'b',
  c: 'C',
  C: 'c',
  d: 'D',
  D: 'd',
  e: 'E',
  E: 'e',
  f: 'F',
  F: 'f',
  g: 'G',
  G: 'g',
  h: 'H',
  H: 'h',
  i: 'I',
  I: 'i',
  j: 'J',
  J: 'j',
  k: 'K',
  K: 'k',
  l: 'L',
  L: 'l',
  m: 'M',
  M: 'm',
  n: 'N',
  N: 'n',
  o: 'O',
  O: 'o',
  p: 'P',
  P: 'p',
  q: 'Q',
  Q: 'q',
  r: 'R',
  R: 'r',
  s: 'S',
  S: 's',
  t: 'T',
  T: 't',
  u: 'U',
  U: 'u',
  v: 'V',
  V: 'v',
  w: 'W',
  W: 'w',
  x: 'X',
  X: 'x',
  y: 'Y',
  Y: 'y',
  z: 'Z',
  Z: 'z'
}

let data = null
lineReader.on('line', (line) => {
  data = line
})

lineReader.on('close', () => {
  console.log('characters:', data.length)
  doReaction(data)
})

function doReaction(data) {
  data = data.split('')
  console.log('length', data.length)
  let lengths = []
  Object.keys(keys).filter((_k, i) => i % 2 === 0).forEach(r => {
    let pos = 0
    let newData = data.filter(d => {
      return d !== r && d !== keys[r]
    })
    while (pos < newData.length - 1) {
      for (pos; pos < newData.length - 1; pos++) {
        let c = newData[pos]
        let n = newData[pos + 1]
        if (keys[c] === n) {
          // console.log('removing', c, n)
          newData.splice(pos, 2)
          pos--
          break
        }
      }
    }
    lengths.push({
      removed: `${r}, ${keys[r]}`,
      length: newData.length
    })
  })
  lengths.sort((a, b) => a.length - b.length)
  console.log(lengths[0])
  console.log('time', Date.now() - start)
}
