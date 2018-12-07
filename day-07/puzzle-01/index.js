const startTS = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let steps = []
let maxStack = 0

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
  console.log('time: ', Date.now() - startTS)
  console.log('maxStack: ', maxStack)
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
    f: steps.filter(s => s[0] === key).map(s => {
      return findFollowers(s[1], steps)
    })
  }
}

function merge (map, path = []) {
  // console.log('path', path.join(','))
  // console.log(map)
  if (!map.length) { return path.join('') }
  map = map.sort((a, b) => {
    if (a.k < b.k) { return -1 }
    if (a.k > b.k) { return 1 }
    return 0
  })
  const next = map.splice(0, 1)[0]
  path.push(next.k)
  let mergeable = next.f.filter((m, i) => {
    const set = [...next.f.filter((_f, ind) => ind !== i), ...map]
    return canMerge(m.k, set)
  })
  return merge([...mergeable, ...map], path)
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
