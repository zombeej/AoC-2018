const start = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('test.txt')
})

// The initial map data
const map = []

// Squares marked with "."
const canStand = []
const walls = []

// All the units
const units = []
const unitTypes = ['E', 'G']
const killed = []

// Unit stats
const hp = 200
const attack = 3

lineReader.on('line', (line) => {
  console.log(line)
  map.push(line.split(''))
})

lineReader.on('close', () => {
  console.log(map.length, map[0].length)
  init(map)
})

function init (map) {
  let y = 0
  for (y; y < map.length; y++) {
    let x = 0
    for (x; x < map[y].length; x++) {
      const p = map[y][x]
      if (p === '.') {
        canStand.push({y, x})
      }
      if(unitTypes.includes(p)) {
        units.push({
          x,
          y,
          t: p,
          hp,
          a: attack,
          id: units.length
        })
      }
      if (p === '#') {
        walls.push({y, x})
      }
    }
  }
  // console.log(canStand.length, walls.length, units.length)
  // console.log(units)
  move (map)
}

function move (map, round = 1) {
  let gameover = false
  const live = JSON.parse(JSON.stringify(map))
  console.log('\033[2J')
  displayMap(map, round)
  units.forEach(u => {
    if (gameover) { return false }
    console.log('-----------------')
    // console.log(u.t, u.id)
    let opponents = findOpponents(u)
    if (round > 100 || !opponents.length) {
      showFinalScore(round)
      gameover = true
      return false
    }
    // console.log(opponents[0])
    let opponent = null
    while (!opponent && opponents.length > 0) {
      opponent = canApproach (u, opponents.splice(0, 1)[0])
    }
    console.log(u, opponent)
    const diff = moveToward(u, opponent)
    console.log(diff)
    const newPos = {y: u.y + diff.y, x: u.x + diff.x}
    console.log(newPos)
    if (live[newPos.y][newPos.x] === '#') { return }
    if (units.filter(u => u.x === newPos.x && u.y === newPos.y).length > 0) { return }
    live[newPos.y][newPos.x] = u.t
    live[u.y][u.x] = '.'
    u.x = newPos.x
    u.y = newPos.y
  })
  if (gameover) { return }
  setTimeout(() => move(live, ++round), 250)
}

function findOpponents (u) {
  const opponents = units.filter(e => e.t !== u.t)
    .map(o => {
      const d = Math.abs(o.x - u.x) + Math.abs(o.y - u.y)
      return {
        ...o,
        d
      }
    }).sort((a, b) => {
      if (a.d !== b.d) {
        return a.d - b.d
      }
      if (a.y !== b.y) {
        return a.y - b.y
      }
      return a.x - b.x
    })
  return opponents
}

function canApproach (u, o) {
  return o
}

function moveToward (u, o) {
  if (o.d < 2) {
    return {y: 0, x: 0}
  }
  if (o.y - u.y < -1) {
    return {y: -1, x: 0}
  }
  if (o.x - u.x <= -1) {
    return {y: 0, x: -1}
  }
  if (o.x - u.x >= 1) {
    return {y: 0, x: 1}
  }
  if (o.y - u.y > 1) {
    return {y: 1, x: 0}
  }
  return {y: 0, x: 0}
}

function displayMap (map, round) {
  // console.log('\033[2J')
  console.log(`Round: ${round}\n`)
  map.forEach(r => {
    console.log(r.join('').replace(/\./g, ' '))
  })
  units.map(u => {
    return {
      id: u.id,
      t: u.t,
      hp: u.hp
    }
  }).forEach(u => console.log(u))
}

function showFinalScore (round) {
  console.log('game over after round ', --round)
}
