import { DefaultTreeDocumentFragment, DefaultTreeElement, parseFragment } from 'parse5'
import prettier from 'prettier'

function getAttribute(el: DefaultTreeElement, attrName: string): string | null {
  for (let i = 0; i < el.attrs.length; i += 1) {
    if (el.attrs[i].name === attrName) {
      return el.attrs[i].value
    }
  }
  return null
}

function getClassNames(el: DefaultTreeElement): string[] | null {
  const className = getAttribute(el, 'class')
  return className ? className.split(/\s+/) : null
}

export function extract(htmlString) {
  const selectors = []
  const fragment = parseFragment(htmlString) as DefaultTreeDocumentFragment
  const retrieveClassNames = (el, currentPath = []) => {
    const classNames = getClassNames(el)
    if (!classNames) {
      currentPath.push(el.tagName)
      selectors.push({
        selector: currentPath.join('>'),
        tagName: el.tagName,
        style: getAttribute(el, 'style')
      })
      el.childNodes.forEach(el => retrieveClassNames(el, currentPath.slice()))
      currentPath.pop()
    } else {
      // TODO 組み合わせ動的生成
      if (classNames.length === 2) {
        currentPath.push(`.${classNames[0]}`)
        selectors.push({
          selector: currentPath.join('>'),
          tagName: el.tagName,
          style: getAttribute(el, 'style')
        })
        el.childNodes.forEach(el => retrieveClassNames(el, currentPath.slice()))
        currentPath.pop()
        currentPath.push(`.${classNames[1]}`)
        selectors.push({
          selector: currentPath.join('>'),
          tagName: el.tagName,
          style: getAttribute(el, 'style')
        })
        el.childNodes.forEach(el => retrieveClassNames(el, currentPath.slice()))
        currentPath.pop()
        currentPath.push(`.${classNames[0]}.${classNames[1]}`)
        selectors.push({
          selector: currentPath.join('>'),
          tagName: el.tagName,
          style: getAttribute(el, 'style')
        })
        el.childNodes.forEach(el => retrieveClassNames(el, currentPath.slice()))
        currentPath.pop()
      } else if (classNames.length === 1) {
        currentPath = [`.${classNames[0]}`]
        selectors.push({
          selector: `.${classNames[0]}`,
          tagName: el.tagName,
          style: getAttribute(el, 'style')
        })
        el.childNodes.forEach(el => retrieveClassNames(el, currentPath.slice()))
      } else {
        console.error('unsupported')
      }
    }
  }
  fragment.childNodes.forEach(el => retrieveClassNames(el))
  const css = selectors.map(selector => `${selector.selector} {${selector.style || ''}}`).join('\n\n')
  return prettier.format(css, { parser: 'css' })
}
