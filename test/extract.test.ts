import { extractSelector } from '../src/extract'

test('1', () => {
  const input = '<div class="Hoge"></div>'
  const output = extractSelector(input)
  expect(output).toStrictEqual([['Hoge']])
})
