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

test('11', () => {
  const input = '<div class="Hoge"><div class="Hoge"></div></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}'))
})

test('12', () => {
  const input = '<div class="Hoge Fuga"><div class="Fuga"></div></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Fuga{}.Hoge.Fuga{}'))
})

test('13', () => {
  const input = '<div class="Hoge"><a><div class="Hoge"><a></a></div></a></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Hoge>a{}'))
})

test('14', () => {
  const input = '<div class="Hoge"><a></a></div><div class="Hoge"><a></a></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Hoge>a{}'))
})

test('15', () => {
  const input = '<li><a></a></li>'
  const output = extract(input)
  expect(output).toBe('')
})

test('16', () => {
  const input = '<div class="Hoge"><div class="Fuga Piyo"></div></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Fuga{}.Piyo{}.Fuga.Piyo{}'))
})

test('17', () => {
  const input = '<div class="Hoge"><div class="Fuga"></div>abc<!--dev-->ghi</div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Fuga{}'))
})

test('18', () => {
  const input = '<div class="Hoge is-opened"></div>'
  const output = extract(input, { modifierPattern: /^is-/ })
  expect(output).toBe(format('.Hoge{}.Hoge.is-opened{}'))
})

test('19', () => {
  const input = '<div class="Hoge"><img src="" alt=""></div>'
  const output = extract(input, { reset: true })
  expect(output).toBe(format('.Hoge{}.Hoge>img{display:block;}'))
})

test('20', () => {
  const input = '<div class="Hoge"><button class="Hoge__button" type="button" style="font-weight:bold">a</button></div>'
  const output = extract(input, { reset: true })
  expect(output).toBe(
    format(
      '.Hoge{}.Hoge__button{padding: 0; color: currentColor; background-color: transparent; border: 0; font: inherit; text-align: left; user-select: none;font-weight:bold;}'
    )
  )
})

test('21', () => {
  const input = '<button class="Button -size-small -rounded"></button>'
  const output = extract(input, { modifierPattern: /^-/ })
  expect(output).toBe(format('.Button{}.Button.-size-small{}.Button.-rounded{}'))
})

test('22', () => {
  const input = '<div class="Hoge Fuga -piyo -foo"><span></span></div>'
  const output = extract(input, { modifierPattern: /^-/ })
  expect(output).toBe(
    format(
      '.Hoge{}.Hoge>span{}' +
        '.Hoge.-piyo{}.Hoge.-piyo>span{}' +
        '.Hoge.-foo{}.Hoge.-foo>span{}' +
        '.Fuga{}.Fuga>span{}' +
        '.Fuga.-piyo{}.Fuga.-piyo>span{}' +
        '.Fuga.-foo{}.Fuga.-foo>span{}' +
        '.Hoge.Fuga{}.Hoge.Fuga>span{}' +
        '.Hoge.Fuga.-piyo{}.Hoge.Fuga.-piyo>span{}' +
        '.Hoge.Fuga.-foo{}.Hoge.Fuga.-foo>span{}'
    )
  )
})

test('23', () => {
  const input = '<div class="-piyo"></div>'
  const output = extract(input, { modifierPattern: /^-/ })
  expect(output).toBe(format(''))
})

test('24', () => {
  const input = '<div><div class="Hoge"><span></span></div></div>'
  const output = extract(input)
  expect(output).toBe(format('.Hoge{}.Hoge>span{}'))
})
