const startTS = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let steps = []
let maxStack = 0
let queues = []
let totalTime = 0
const delay = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

lineReader.on('line', (line) => {
  const order = line.match(/\s[A-Z]\s/g).map(e => e.trim())
  steps.push(order)
})

lineReader.on('close', () => {
  console.log(steps.length)
  buildOrder(steps)
})

function buildOrder (steps) {
  // console.log(steps)
  const start = steps.reduce((a, v) => {
    const f = steps.findIndex(s => s[1] === v[0]) > -1 ? null : v[0]
    return f && !a.includes(v[0]) ? [...a, f] : a
  }, [])
  console.log(start)
  const map = start.map(e => findFollowers(e, steps))
  // console.log(map)
  const order = merge(map)
  console.log('order: ', order)
  console.log('time to build: ', totalTime)
  console.log('compute time: ', Date.now() - startTS, 'ms')
  // console.log('maxStack: ', maxStack)
  test = order.split('')
  let dupes = []
  while (test.length) {
    let x = test.splice(0, 1)[0]
    if (test.includes(x)) { dupes.push(x) }
  }
  if (dupes.length) {
    console.log('Something went wrong!!')
    console.log('dupes: ', dupes)
  }
}

function findFollowers (key, steps) {
  return {
    k: key,
    t: 60 + delay.indexOf(key) + 1,
    f: steps.filter(s => s[0] === key).map(s => {
      return findFollowers(s[1], steps)
    })
  }
}

function merge (map, path = []) {
  // console.log('path', path.join(','))
  // console.log(map)
  if (!map.length && !queues.length) { return path.join('') }
  map = map.sort((a, b) => {
    if (a.k < b.k) { return -1 }
    if (a.k > b.k) { return 1 }
    return 0
  })
  const removed = updateQueues()
  // console.log(removed)
  path.push(...removed.map(r => r.k))
  while (removed.length) {
    let next = removed.splice(0, 1)[0]
    next.f.forEach((f, i) => {
      let set = [
        ...next.f.filter((_f, fi) => i !== fi),
        ...removed,
        ...queues,
        ...map
      ]
      if (canMerge(f.k, set)) {
        map.push(f)
      }
    })
  }
  const open = 5 - queues.length
  queues.splice(0, 0, ...map.splice(0, open))
  // console.log('queues: ', queues)
  // console.log('total time: ', totalTime)
  return merge(map, path)
}

function updateQueues () {
  if (!queues.length) { return [] }
  const minTS = queues.reduce((min, q) => Math.min(min, q.t), queues[0].t)
  totalTime += minTS
  let removed = []
  while (queues.findIndex(q => q.t === minTS) > -1) {
    const rem = queues.findIndex(q => q.t === minTS)
    removed.push(...queues.splice(rem, 1))
  }
  queues = queues.map(q => {
    return {
      ...q,
      t: q.t - minTS
    }
  })
  return removed
}

function canMerge (f, map, stack = 1) {
  maxStack = Math.max(stack, maxStack)
  let merge = true
  for (let i = 0; i < map.length; i++) {
    // console.log(f, map[i].k)
    if (map[i].k === f) {
      // console.log('matches', i, map[i].k, f)
      merge = false
      break
    }
    if (!canMerge(f, map[i].f, stack + 1)) {
      merge = false
      break
    }
  }
  return merge
}
