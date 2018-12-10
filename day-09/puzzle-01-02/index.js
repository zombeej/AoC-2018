const start = Date.now()
const players = 441
const marbles = 71032 * 100

let currentMarble = 1
let currentPosition = 0

let scores = {}
let circle = [0]

console.log(players, marbles)

while (currentMarble < marbles) {
  let player = 0
  // console.log(currentMarble, marbles)
  for (player; player < players; player++) {
    if (currentMarble > marbles) { continue }
    if (currentMarble % 23 === 0) {
      // console.log('found a 23')
      scores[player] = scores[player] || 0
      scores[player] += currentMarble
      let newIndex = currentPosition - 7
      if (newIndex < 0) {
        newIndex = circle.length + newIndex
      }
      currentPosition = newIndex
      let removed = circle.splice(newIndex, 1)
      // console.log(`plus ${removed} to the score of player ${player + 1}`)
      scores[player] = scores[player] * 1 + removed * 1
      // console.log(player, currentMarble, currentPosition, scores)
      currentMarble++
      continue
    }
    let newIndex = currentPosition + 2
    if (newIndex > circle.length) {
      newIndex = newIndex - circle.length
    }
    if (newIndex === circle.length) {
      circle.push(currentMarble)
    } else {
      circle.splice(newIndex, 0, currentMarble)
    }
    currentPosition = newIndex
    // console.log(player, currentMarble, currentPosition)
    if (currentMarble % 10000 === 0) {
      console.log('on marble ' + currentMarble, Date.now() - start)
    }
    currentMarble++
  }
}

console.log('scores: ', scores)
const highest = Object.keys(scores).reduce((a, v) => {
  return Math.max(a, scores[v])
}, 0)

console.log('high score: ', highest)
console.log('time in ms: ', Date.now() - start)
