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
  let pos = 0
  while (pos < data.length - 1) {
    for (pos; pos < data.length - 1; pos++) {
      let c = data[pos]
      let n = data[pos + 1]
      if (keys[c] === n) {
        // console.log('removing', c, n)
        data.splice(pos, 2)
        pos--
        break
      }
    }
  }
  console.log(data.length)
  console.log('time', Date.now() - start)
}
