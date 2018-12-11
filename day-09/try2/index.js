const start = Date.now()
const players = 441
// Be patient... this took over 5.5 hours to run.
const marbles = 71032 * 100

let firstMarble = {
  v: 0,
  p: null,
  n: null
}
let currentMarble = 1
let currentPlayer = 1

let scores = {}

console.log(players, marbles)

// while (currentMarble < marbles) {
//   let player = 0
//   // console.log(currentMarble, marbles)
//   for (player; player < players; player++) {
//     if (currentMarble > marbles) { continue }
//     if (currentMarble % 23 === 0) {
//       // console.log('found a 23')
//       scores[player] = scores[player] || 0
//       scores[player] += currentMarble
//       let newIndex = currentPosition - 7
//       if (newIndex < 0) {
//         newIndex = circle.length + newIndex
//       }
//       currentPosition = newIndex
//       let removed = circle.splice(newIndex, 1)
//       // console.log(`plus ${removed} to the score of player ${player + 1}`)
//       scores[player] = scores[player] * 1 + removed * 1
//       // console.log(player, currentMarble, currentPosition, scores)
//       currentMarble++
//       continue
//     }
//     let newIndex = currentPosition + 2
//     if (newIndex > circle.length) {
//       newIndex = newIndex - circle.length
//     }
//     if (newIndex === circle.length) {
//       circle.push(currentMarble)
//     } else {
//       circle.splice(newIndex, 0, currentMarble)
//     }
//     currentPosition = newIndex
//     // console.log(player, currentMarble, currentPosition)
//     if (currentMarble % 10000 === 0) {
//       console.log('on marble ' + currentMarble, Date.now() - start)
//     }
//     currentMarble++
//   }
// }

function playMarble (currentPosition) {
  if (currentMarble % 1000000 === 0) {
    console.log(currentMarble, marbles, currentPlayer)
  }
  if (currentMarble > marbles) {
    printResults()
    return
  }
  if (currentMarble % 23 === 0) {
    scores[currentPlayer] = scores[currentPlayer] || 0
    scores[currentPlayer] += currentMarble
    let temp = currentPosition
    for (let p=0;p<7;p++) {
      temp = temp.p
      if (!temp) {
        temp = firstMarble
        while (temp.n) {
          temp = temp.n
        }
      }
    }
    scores[currentPlayer] += temp.v
    temp.p.n = temp.n
    temp.n.p = temp.p
    currentMarble += 1
    currentPlayer = currentPlayer === players ? 1 : currentPlayer + 1
    process.nextTick(() => playMarble(temp.n))
    return
  }
  // console.log(currentMarble, currentPosition)
  currentMarble += 1
  currentPlayer = currentPlayer === players ? 1 : currentPlayer + 1
  let temp = currentPosition
  for (let p=0; p < 2; p++) {
    temp = temp.n || firstMarble
  }
  let newMarble = {
    v: currentMarble,
    p: temp,
    n: null
  }
  temp.n = newMarble
  process.nextTick(() => playMarble(newMarble))
}

function printResults () {
  // console.log('scores: ', scores)
  console.log(currentMarble)
  const highest = Object.keys(scores).reduce((a, v) => {
    return Math.max(a, scores[v])
  }, 0)

  console.log('high score: ', highest)
  console.log('time in ms: ', Date.now() - start)
}

playMarble(firstMarble)
