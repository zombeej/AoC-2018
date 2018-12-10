const startTS = Date.now()
const lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.txt')
})

let bytes = []

lineReader.on('line', (line) => {
  bytes = line.split(' ').map(i => parseInt(i))
})

lineReader.on('close', () => {
  console.log(bytes.length)
  generateTree(bytes)
})

function generateTree (bytes) {
  const nextNode = popNode (bytes)
  // console.log(JSON.stringify(nextNode))
  const value = getNodeValue(nextNode)
  console.log('root node value: ', value)
}

function popNode (bytes, stack = 0) {
  // console.log(bytes.length, stack)
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

function getNodeValue (node) {
  if (!node.children.length) {
    return node.meta.reduce((a, v) => a + v, 0)
  }
  let childMeta = []
  for (c in node.meta) {
    let ind = node.meta[c] - 1
    if (node.children[ind]) {
      childMeta.push(getNodeValue(node.children[ind]))
    }
  }
  return childMeta.reduce((a, v) => a + v, 0)
}
