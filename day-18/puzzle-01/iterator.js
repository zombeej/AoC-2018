const interval = 10000
const end = 1000000000

const vals = [
  '193965',
  '193438',
  '198950',
  '201026',
  '200364',
  '188942',
  '190162'
]

function nextOne (val, int = 0) {
  int = int === 7 ? 0 : int
  if (val === end) {
    console.log(vals[int])
    return
  }
  if (val % 100000000 === 0) {
    console.log(val, int)
  }
  process.nextTick(() => nextOne(val + interval, ++int))
}

nextOne(0, 6)
