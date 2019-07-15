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

/** nCr */
function combination(n, r, offset = 0) {
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
      if (classNames.length === 1) {
        currentPath = [`.${classNames[0]}`]
        selectors.push({
          selector: `.${classNames[0]}`,
          tagName: el.tagName,
          style: getAttribute(el, 'style')
        })
        el.childNodes.forEach(el => retrieveClassNames(el, currentPath.slice()))
      } else {
        for (let i = 1; i <= classNames.length; i += 1) {
          combination(classNames.length, i).forEach(hoge => {
            currentPath.push(hoge.map(cn => `.${classNames[cn]}`).join(''))
            selectors.push({
              selector: currentPath.join('>'),
              tagName: el.tagName,
              style: getAttribute(el, 'style')
            })
            el.childNodes.forEach(el => retrieveClassNames(el, currentPath.slice()))
            currentPath.pop()
          })
        }
      }
    }
  }
  fragment.childNodes.forEach(el => retrieveClassNames(el))
  const css = selectors.map(selector => `${selector.selector} {${selector.style || ''}}`).join('\n\n')
  return prettier.format(css, { parser: 'css' })
}
