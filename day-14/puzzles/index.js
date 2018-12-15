const ts = Date.now()
const input = 704321
// const input = 9
const input2 = '704321'
const resultLen = 10
let start = [3, 7]
let p1 = false
let p2 = false

function nextRecipes (cur = [0, 1], total = []) {
  // if (total.length % 10000 === 0) {
  //   console.log(total.length)
  //   console.log((Date.now() - ts) / 60000)
  // }
  if (!p1 && total.length >= input + resultLen) {
    getResult(total)
    p1 = true
  }
  if (!p2 && checkForMatch(total)) {
    getMatchFound(total)
    p2 = true
  }
  if (p1 && p2) { return }
  let r1 = total[cur[0]] + 1 + cur[0]
  let r2 = total[cur[1]] + 1 + cur[1]
  // console.log(r1, r2)
  if (r1 + cur[0] > total.length - 1) {
    r1 = r1 % total.length || 0
  }
  if (r2 + cur[1] > total.length - 1) {
    r2 = r2 % total.length || 0
  }
  // console.log(r1, r2, total)
  const newScore = total[r1] + total[r2]
  if (newScore < 10) {
    total.push(newScore)
  } else {
    total.push(1)
    total.push(newScore % 10 || 0)
  }
  process.nextTick(() => nextRecipes([r1, r2], total))
}

function getResult (total) {
  const res = total.slice(input).slice(0, 10)
  console.log('final result: ', res.join(''), res.length)
}

function checkForMatch (total) {
  const str = total.slice(-10).join('')
  return str.search(input2) > -1
}

function getMatchFound (total) {
  const str = total.join('')
  const match = str.search(input2)
  console.log('number of recipes to match: ', match)
  console.log('finished in ms: ', Date.now() - ts)
}

nextRecipes([0, 1], start)
