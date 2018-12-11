function calcCellPower (x, y, sn) {
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

function getPowerFromCoords (x, y, s, sn) {
  let total = 0
  let cx = x
  for (cx; cx < x + s; cx++) {
    let cy = y
    for (cy; cy < y + s; cy++) {
      // console.log(cx, cy)
      // console.log(calcCellPower(cx, cy))
      total += calcCellPower(cx, cy, sn)
    }
  }
  return total
}

async function getMaxGridPower (s, sn, wx, wy) {
  console.log(s, sn, wx, wy)
  let max = {
    size: s,
    coords: [1, 1],
    power: getPowerFromCoords(1, 1, s, sn)
  }
  // console.log(s, max)
  // console.log('starting size ', s)
  let x = 1
  for (x; x <= wx - s + 1; x++) {
    let y = 1
    for (y; y <= wy - s + 1; y++) {
      let spower = getPowerFromCoords(x, y, s, sn)
      if (spower > max.power) {
        max = {
          size: s,
          coords: [x, y],
          power: spower
        }
      }
    }
  }
  // console.log(JSON.stringify(max))
  process.send(max)
}

const s = parseInt(process.argv[2])
const sn = parseInt(process.argv[3])
const wx = parseInt(process.argv[4])
const wy = parseInt(process.argv[5])
getMaxGridPower(s, sn, wx, wy)
