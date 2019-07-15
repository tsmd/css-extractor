const resetStyles = {
  button: [
    'padding: 0',
    'color: currentColor',
    'background-color: transparent',
    'border: 0',
    'font: inherit',
    'text-align: left',
    'user-select: none'
  ],
  dd: ['margin-left: 0'],
  img: ['display: block'],
  ol: ['padding-left: 0'],
  ul: ['padding-left: 0']
}

export function reset(tagName: string): string {
  const found = resetStyles[tagName]
  if (found) {
    return found.join(';') + ';'
  }
  return ''
}
