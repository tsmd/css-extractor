import { extract } from '../src/extract'
import prettier from 'prettier'

function format(cssString) {
  cssString = cssString.replace(/\}/g, '}\n\n')
  return prettier.format(cssString, { parser: 'css' })
}

test('1', () => {
  const input = '<div class="Hoge"></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge {}'))
})

test('2', () => {
  const input = '<div class="Hoge Fuga"></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Fuga{}.Hoge.Fuga{}'))
})

test('3', () => {
  const input = '<div class="Hoge"><div class="Fuga"></div></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Fuga{}'))
})

test('4', () => {
  const input = '<div class="Hoge"><div class="Hoge__test"></div></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Hoge__test{}'))
})

test('5', () => {
  const input = '<div class="Hoge"><a></a></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Hoge>a{}'))
})

test('6', () => {
  const input = '<ul class="Hoge"><li><a></a></li></ul>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Hoge>li{}.Hoge>li>a{}'))
})

test('7', () => {
  const input = '<ul class="Hoge"><li><a class="Hoge__anchor"></a></li></ul>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Hoge>li{}.Hoge__anchor{}'))
})

test('8', () => {
  const input = '<div class="Hoge"><p><a></a></p><a></a></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Hoge>p{}.Hoge>p>a{}.Hoge>a{}'))
})

test('9', () => {
  const input = '<div class="Hoge" style="display: block; color: red"></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{display:block;color:red}'))
})

test('10', () => {
  const input = '<div class="Hoge Fuga"><a></a></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Hoge>a{}.Fuga{}.Fuga>a{}.Hoge.Fuga{}.Hoge.Fuga>a{}'))
})
