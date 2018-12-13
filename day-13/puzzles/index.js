const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let map = []
let cartTypes = ['<', '^', '>', 'v', '<']
let cartDir = {
  '<': [-1, 0],
  '>': [1, 0],
  '^': [0, -1],
  'v': [0, 1]
}
let changes = {
  '/': {
    '^': '>',
    '<': 'v',
    'v': '<',
    '>': '^'
  },
  '\\': {
    '^': '<',
    '<': '^',
    'v': '>',
    '>': 'v'
  }
}
let turnCart = ['l', 's', 'r', 'l']
let cartTracks = ['-', '|', '-', '|']
let carts = []

lineReader.on('line', (line) => {
  // console.log(line)
  map.push(line.split(''))
})

lineReader.on('close', () => {
  console.log(map.length, map[0].length)
  init()
  // console.log('carts: ', cartCount)
})

function init () {
  let live = [[]]
  map.forEach((v, x) => {
    v.forEach((t, y) => {
      if (!live[x]) { live.push([[]])}
      live[x][y] = {
        t,
        c: null
      }
      if (cartTypes.includes(t)) {
        live[x][y].t = cartTracks[cartTypes.indexOf(t)]
        live[x][y].c = {
          d: t,
          n: 'l'
        }
      }
    })
  })
  map = live
  process.nextTick(() => tick())
}

function tick (prev=0, end=false) {
  let live = JSON.parse(JSON.stringify(map))
  let cartsLeft = 0
  let lastCart = []
  live.forEach((r, y) => {
    r.forEach((c, x) => {
      if (end && c.c) {
        lastCart = [x, y]
        cartsLeft = 0
        return
      }
      let collision = false
      if (c.c) {
        // console.log(y, x, c)
        const m = cartDir[c.c.d]
        const newC = [y + m[1], x + m[0]]
        const atNew = live[newC[0]][newC[1]]
        // console.log(atNew)
        // console.log(atNew.t, changes[atNew.t] || 'no change')
        if (atNew.c || map[newC[0]][newC[1]].c) {
          console.log('COLLISION AT ', newC[1], newC[0])
          collision = true
        } else {
          cartsLeft++
        }
        let d = c.c.d
        let n = c.c.n
        if (atNew.t === '+') {
          let cur = cartTypes.indexOf(d) 
          if (n === 'l') {
            d = cartTypes[cur - 1] || cartTypes[3]
          }
          if (n === 'r') {
            d = cartTypes[cur + 1]
          }
          n = turnCart[turnCart.indexOf(n) + 1]
        }
        if (atNew.t === '/' || atNew.t === '\\') {
          d = changes[atNew.t][d]
        }
        map[y][x].c = null
        if (collision) {
          map[newC[0]][newC[1]].c = null
          atNew.c = null
          if (prev === 3) {
            cartsLeft = 1
            end = true
          }
          return
        }
        lastCart = [newC[1], newC[0]]
        map[newC[0]][newC[1]] = {
          t: atNew.t,
          c: {
            d,
            n
          }
        }
        // console.log('new', newC, atNew)
      }
    })
  })
  if (cartsLeft !== prev) {
    console.log(cartsLeft, ' carts left')
  }
  if (cartsLeft > 0){
    // Uncomment this and comment the nextTick to animate the paths
    // console.log('\033[2J')
    // map.forEach(l => {
    //   console.log(l.map(c => c.c ? c.c.d : c.t).join(''))
    // })
    // setTimeout(() => tick(cartsLeft, end), 50)
    process.nextTick(() => tick(cartsLeft, end))
  } else {
    console.log('last cart: ', lastCart)
    console.log('time taken(ms): ', Date.now() - start)
  }
}