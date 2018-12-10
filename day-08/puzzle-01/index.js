const startTS = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let bytes = []
let metaTotal = 0

lineReader.on('line', (line) => {
  bytes = line.split(' ').map(i => parseInt(i))
})

lineReader.on('close', () => {
  console.log(bytes.length)
  generateTree(bytes)
})

function generateTree (bytes) {
  let openNodes = 0
  let nodes = []
  let nextNode = popNode (bytes)
  console.log(JSON.stringify(nextNode))
  console.log(metaTotal)
}

function popNode (bytes, stack = 0) {
  console.log(bytes.length, stack)
  const header = bytes.splice(0, 2)
  let c = 0
  let children = []
  for (c; c < header[0]; c++) {
    let cnode = popNode(bytes, stack + 1)
    bytes = cnode.bytes
    children.push({
      children: cnode.children,
      meta: cnode.meta
    })
  }
  let metapop = popMeta(bytes, header[1])
  bytes = metapop.bytes
  let meta = metapop.meta
  metaTotal += meta.reduce((a, v) => a + v, 0)
  return {
    bytes,
    children,
    meta
  }
}

function popMeta (bytes, len) {
  return {
    meta: bytes.splice(0, len),
    bytes
  }
}
