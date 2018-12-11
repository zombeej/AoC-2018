// New and improved!! Linked Lists make short work!
const start = Date.now()
const players = 441
const marbles = 71032 * 100

let firstMarble = {
  v: 0,
  p: null,
  n: null
}
firstMarble.n = firstMarble
let currentMarble = 1
let currentPlayer = 1

let scores = {}

console.log(players, marbles)

function playMarble (currentPosition) {
  if (currentMarble % 1000000 === 0) {
    console.log(currentMarble, currentPosition.v, currentPosition.n.v, currentPosition.p.v)
  }
  if (currentMarble > marbles) {
    printResults()
    return
  }
  if (currentPlayer > players) { currentPlayer = 1 }
  if (currentMarble > 0 && currentMarble % 23 === 0) {
    // console.log('scoring', currentMarble)
    scores[currentPlayer] = scores[currentPlayer] || 0
    scores[currentPlayer] += currentMarble
    let newPos = findMarble(currentPosition, -7)
    // console.log('scoring', newPos.v)
    scores[currentPlayer] += newPos.v
    newPos.p.n = newPos.n
    newPos.n.p = newPos.p
    currentMarble += 1
    currentPlayer += 1
    process.nextTick(() => playMarble(newPos.n))
    return
  }
  let newPos = findMarble(currentPosition, 1)
  // console.log('found', newPos.v)
  const newMarble = makeMarble(currentMarble, newPos, newPos.n)
  if (newPos.n) { newPos.n.p = newMarble }
  // console.log('newPos.n.p', newPos.n.p.v)
  newPos.n = newMarble
  newMarble.p = newPos
  // console.log(newMarble.v, 'between', newMarble.p.v, newMarble.n.v)
  currentMarble += 1
  currentPlayer += 1
  process.nextTick(() => playMarble(newMarble))
}

function makeMarble (v, p, n) {
  return {v, p, n}
}

function findMarble (current, move=0) {
  if (move === 0) { return current }
  // console.log('finding', current.v, move)
  if (!current) {
    return move > 0 ? firstMarble : null
  }
  return move < 0 ? findMarble(current.p, move + 1) : findMarble(current.n, move - 1)
}

function printResults () {
  // console.log('scores: ', scores)
  // console.log(currentMarble)
  const highest = Object.keys(scores).reduce((a, v) => {
    return Math.max(a, scores[v])
  }, 0)

  console.log('high score: ', highest)
  console.log('time in ms: ', Date.now() - start)
}

playMarble(firstMarble)
