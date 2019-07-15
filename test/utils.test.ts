import { combination } from '../src/utils'

describe('combination', () => {
  test('5C1', () => {
    const input = combination(5, 1)
    const output = [[0], [1], [2], [3], [4]]
    expect(input).toStrictEqual(output)
  })

  test('5C2', () => {
    const input = combination(5, 2)
    const output = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
    expect(input).toStrictEqual(output)
  })

  test('5C3', () => {
    const input = combination(5, 3)
    const output = [
      [0, 1, 2],
      [0, 1, 3],
      [0, 1, 4],
      [0, 2, 3],
      [0, 2, 4],
      [0, 3, 4],
      [1, 2, 3],
      [1, 2, 4],
      [1, 3, 4],
      [2, 3, 4]
    ]
    expect(input).toStrictEqual(output)
  })

  test('5C4', () => {
    const input = combination(5, 4)
    const output = [[0, 1, 2, 3], [0, 1, 2, 4], [0, 1, 3, 4], [0, 2, 3, 4], [1, 2, 3, 4]]
    expect(input).toStrictEqual(output)
  })

  test('5C5', () => {
    const input = combination(5, 5)
    const output = [[0, 1, 2, 3, 4]]
    expect(input).toStrictEqual(output)
  })
})
