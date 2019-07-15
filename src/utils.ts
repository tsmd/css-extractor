/**
 * 組み合わせ nCr を求めて２次元配列を取得する。
 * 例えば 3C2 の結果は [[0, 1], [0, 2], [1, 2]]
 */
export function combination(n: number, r: number, offset = 0): number[][] {
  const combs: number[][] = []
  for (let i = 0; i <= n - r; i += 1) {
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
