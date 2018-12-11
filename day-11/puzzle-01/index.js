const start = Date.now()
const { fork } = require('child_process')
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

async function getMaxGridPower (s) {
  let max = {
    size: s,
    coords: [1, 1],
    power: getPowerFromCoords(1, 1, s)
  }
  // console.log(s, max)
  console.log('starting size ', s)
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
  console.log(s, max)
  return max
}

// console.log(calcCellPower(101, 153))
// console.log(getPowerFromCoords(21, 61))
function doTheThings () {
  let s = 1
  let r = wx
  while (s < wx) {
    let f = fork('child', [s, sn, wx, wy])
    f.on('message', m => {
      console.log(m)
      r--
      checker(r, m)
    })
    s++
  }
  // const vals = await Promise.all(promises)
  // const max = vals.reduce((a, v) => {
  //   return a.power > v.power ? a : v
  // }, {size: null, coords: null, power: 0})

  // console.log(max)
}

let max = {
  size: null,
  coords: null,
  power: 0
}

function checker (r, m) {
  console.log('messages awaiting: ', r)
  if (m.power > max.power) {
    max = m
  }
  if (r <= 1) {
    console.log('done')
    console.log(max)
    console.log('time in ms: ', Date.now() - start)
  }
}

doTheThings()