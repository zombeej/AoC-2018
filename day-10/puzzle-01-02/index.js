const startTS = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let points = []

lineReader.on('line', (line) => {
  const nums = line.match(/(?<=\<).+?(?=\>)/g)
  const point = {
    p: nums[0].split(', ').map(n => parseInt(n)),
    v: nums[1].split(', ').map(n => parseInt(n))
  }
  points.push(point)
})

lineReader.on('close', () => {
  console.log(points.length)
  drawPoints(points)
})

function drawPoints (points, range = null, second = 0) {
  const minMax = points.reduce((a, v) => {
    return {
      x: [
        Math.min(a.x[0], v.p[0]),
        Math.max(a.x[1], v.p[0])
      ],
      y: [
        Math.min(a.y[0], v.p[1]),
        Math.max(a.y[1], v.p[1])
      ]
    }
  }, {
    x: [
      0,
      points[0].p[0]
    ],
    y: [
      0,
      points[0].p[1]
    ]
  })
  const minX = minMax.x[0] < 0 ? Math.abs(minMax.x[0]) : 0
  const minY = minMax.y[0] < 0 ? Math.abs(minMax.y[0]) : 0
  let newPoints = []
  for (p in points) {
    let c = points[p]
    // console.log(c.p[1] + minY, c.p[0] + minX)
    // console.log(grid[c.p[1] + minY][c.p[0] + minX])
    // grid[c.p[1] + minY][c.p[0] + minX] = '#'
    newPoints.push({
      p: [
        points[p].p[0] + points[p].v[0],
        points[p].p[1] + points[p].v[1]
      ],
      v: c.v
    })
  }
  const newMinMax = newPoints.reduce((a, v) => {
    return {
      x: [
        Math.min(a.x[0], v.p[0]),
        Math.max(a.x[1], v.p[0])
      ],
      y: [
        Math.min(a.y[0], v.p[1]),
        Math.max(a.y[1], v.p[1])
      ]
    }
  }, {
    x: [
      0,
      points[0].p[0]
    ],
    y: [
      0,
      points[0].p[1]
    ]
  })
  const newRange = [
    newMinMax.x[1] - newMinMax.x[0],
    newMinMax.y[1] - newMinMax.y[0]
  ]
    if (range && range[0] < newRange[0] && range[1] < newRange[1]) {
    console.log('\033[2J')
    let grid = Array(minMax.y[1] - minMax.y[0] + 1).fill().map(_g => {
      return Array(minMax.x[1] - minMax.x[0] + 1).fill('.')
    })
    for (p in points) {
      let c = points[p]
      // console.log(c.p[1] + minY, c.p[0] + minX)
      // console.log(grid[c.p[1] + minY][c.p[0] + minX])
      grid[c.p[1] + minY][c.p[0] + minX] = '#'
    }
    console.log(grid.map(g => g.join('')).join('\n'))
    console.log('seen on second ', second)
    return
  }
  // console.log(minMax)
  console.log(range, newRange)
  process.nextTick(() => drawPoints(newPoints, newRange, second + 1))
}
