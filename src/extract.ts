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
  const selectorFlag = {}

  const addSelector = (selector, el) => {
    if (!selectorFlag[selector]) {
      selectorFlag[selector] = true
      selectors.push({
        selector: selector,
        tagName: el.tagName,
        style: getAttribute(el, 'style')
      })
    }
  }

  const retrieveClassNames = (el, currentPath = []) => {
    const classNames = getClassNames(el)
    if (!classNames && currentPath.length === 0) {
      return
    }
    if (!classNames) {
      const path = currentPath.concat(el.tagName)
      const selector = path.join('>')
      addSelector(selector, el)
      el.childNodes.forEach(el => retrieveClassNames(el, path))
    } else {
      for (let i = 1; i <= classNames.length; i += 1) {
        combination(classNames.length, i).forEach(index => {
          const selector = index.map(cn => `.${classNames[cn]}`).join('')
          addSelector(selector, el)
          el.childNodes.forEach(el => retrieveClassNames(el, [selector]))
        })
      }
    }
  }

  const fragment = parseFragment(htmlString) as DefaultTreeDocumentFragment
  fragment.childNodes.forEach(el => retrieveClassNames(el))

  const css = selectors.map(selector => `${selector.selector} {${selector.style || ''}}`).join('\n\n')
  return prettier.format(css, { parser: 'css' })
}
