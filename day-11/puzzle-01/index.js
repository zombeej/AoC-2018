const start = Date.now()
const wx = 300
const wy = 300

const sn = 7672

function calcCellPower (x, y) {
  const rid = x + 10
  // console.log('rid: ', rid)
  let power = rid * y
  power += sn
  power = power * rid
  // console.log(power)
  power = power.toString().slice(-3, -2) || 0
  // console.log(power)
  return parseInt(power) - 5
}

function getPowerFromCoords (x, y, s) {
  let total = 0
  let cx = x
  for (cx; cx < x + s; cx++) {
    let cy = y
    for (cy; cy < y + s; cy++) {
      // console.log(cx, cy)
      // console.log(calcCellPower(cx, cy))
      total += calcCellPower(cx, cy)
    }
  }
  return total
}

// console.log(calcCellPower(101, 153))
// console.log(getPowerFromCoords(21, 61))
let max = {
  size: 1,
  coords: [1, 1],
  power: getPowerFromCoords(1, 1)
}
let s = 1
for (s; s <= wx; s++) {
  console.log(s, max)
  let x = 1
  for (x; x <= wx - s + 1; x++) {
    let y = 1
    for (y; y <= wy - s + 1; y++) {
      let spower = getPowerFromCoords(x, y, s)
      if (spower > max.power) {
        max = {
          size: s,
          coords: [x, y],
          power: spower
        }
      }
    }
  }
}

console.log(max)
console.log('time in ms: ', Date.now() - start)