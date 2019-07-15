/** nCr */
export function combination(n, r, offset = 0) {
  const combs = []
  for (var i = 0; i <= n - r; i += 1) {
    if (r === 1) {
      combs.push([offset + i])
    } else {
      combination(n - i - 1, r - 1, offset + i + 1).forEach(result => {
        combs.push([i + offset].concat(result))
      })
    }
  }
  return combs
}
