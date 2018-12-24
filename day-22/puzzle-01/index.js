const depth = 4845
const target = [6, 770]

// const depth = 510
// const target = [10, 10]

const xConst = 16807
const yConst = 48271

const erosion = 20183
const typeConstant = 3

const types = [
  ['rocky', '.'],
  ['wet', '='],
  ['narrow', '|']
]

function drawMap () {
  let map = []
  let y = 0
  for (y; y <= target[1] + 5; y++) {
    map.push([])
    let x = 0
    for (x; x <= target[0] + 5; x++) {
      map[y].push(getType(x, y, map))
    }
  }
  // console.log(map)
  map.forEach(m => console.log(m.map(t => t[1]).join('')))
  getRisk(map)
}

function getType (x, y, map) {
  if (x === 0 && y === 0) { return ['Mouth', 'M', 0] }
  if (x === target[0] && y === target[1]) { return ['Target', 'T', 0] }
  let geoIndex = 0
  if (x === 0) { geoIndex = y * yConst }
  else if (y === 0) { geoIndex = x * xConst }
  else {
    geoIndex = map[y - 1][x][2] * map[y][x - 1][2]
  }
  const eros = (geoIndex + depth) % erosion
  const type = eros % 3
  return [...types[type], eros]
}

function getRisk (map) {
  let totalRisk = 0
  let y = 0
  for (y; y <= target[1]; y++) {
    let x = 0
    for (x; x <= target[0]; x++) {
      const risk = map[y][x][2] % typeConstant
      totalRisk += risk
    }
  }
  console.log('\nTotal risk: ', totalRisk)
}

drawMap()

// The region at 0,0 (the mouth of the cave) has a geologic index of 0.
// The region at the coordinates of the target has a geologic index of 0.
// If the region's Y coordinate is 0, the geologic index is its X coordinate times 16807.
// If the region's X coordinate is 0, the geologic index is its Y coordinate times 48271.
// Otherwise, the region's geologic index is the result of multiplying the erosion levels 
// of the regions at X-1,Y and X,Y-1.
// A region's erosion level is its geologic index plus the cave system's depth, all modulo 20183. 

// Then:
// If the erosion level modulo 3 is 0, the region's type is rocky.
// If the erosion level modulo 3 is 1, the region's type is wet.
// If the erosion level modulo 3 is 2, the region's type is narrow.
