const resetStyles = {
  address: ['font-style: inherit'],
  b: ['font-weight: inherit'],
  blockquote: ['margin: 0'],
  button: [
    'padding: 0',
    'color: inherit',
    'background-color: transparent',
    'border: 0',
    'font: inherit',
    'line-height: inherit',
    'text-align: inherit',
    'user-select: none'
  ],
  caption: ['text-align: inherit'],
  cite: ['font-style: inherit'],
  code: ['font-family: inherit'],
  dd: ['margin: 0'],
  del: ['text-decoration: inherit'],
  dfn: ['font-style: inherit'],
  dl: ['margin: 0'],
  em: ['font-style: inherit'],
  fieldset: ['min-width: 0', 'margin: 0', 'padding: 0', 'border: 0'],
  figure: ['margin: 0'],
  h1: ['margin: 0', 'font: inherit'],
  h2: ['margin: 0', 'font: inherit'],
  h3: ['margin: 0', 'font: inherit'],
  h4: ['margin: 0', 'font: inherit'],
  h5: ['margin: 0', 'font: inherit'],
  h6: ['margin: 0', 'font: inherit'],
  hr: ['margin: 0'],
  i: ['font-style: inherit'],
  img: ['display: block'],
  input: ['padding: 0', 'color: inherit', 'font: inherit', 'line-height: inherit'],
  ins: ['text-decoration: inherit'],
  kbd: ['font-family: inherit'],
  legend: ['max-width: 100%', 'padding: 0', 'border: 0'],
  li: ['display: block'],
  main: ['display: block'],
  mark: ['background-color: transparent', 'color: inherit'],
  menu: ['margin: 0', 'padding: 0', 'list-style-type: none'],
  ol: ['margin: 0', 'padding: 0', 'list-style-type: none'],
  p: ['margin: 0'],
  pre: ['font-family: inherit'],
  s: ['text-decoration: inherit'],
  samp: ['font-family: inherit'],
  select: ['padding: 0', 'color: inherit', 'font: inherit', 'line-height: inherit'],
  small: ['font-size: inherit'],
  strong: ['font-weight: inherit'],
  sub: ['vertical-align: inherit', 'font-size: inherit'],
  sup: ['vertical-align: inherit', 'font-size: inherit'],
  svg: ['display: block'],
  table: ['border-collapse: collapse', 'table-layout: fixed'],
  textarea: ['padding: 0', 'color: inherit', 'font: inherit', 'line-height: inherit'],
  th: ['text-align: inherit', 'font-weight: inherit'],
  u: ['text-decoration: inherit'],
  ul: ['margin: 0', 'padding: 0', 'list-style-type: none'],
  var: ['font-style: inherit']
}

export function reset(tagName: string): string {
  const found = resetStyles[tagName]
  if (found) {
    return found.join(';') + ';'
  }
  return ''
}
