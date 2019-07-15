import { DefaultTreeDocumentFragment, DefaultTreeElement, DefaultTreeNode, parseFragment } from 'parse5'
import { format } from 'prettier/standalone'
import cssParser from 'prettier/parser-postcss'
import { combination } from './utils'

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

interface Selector {
  selector: string
  tagName: string
  style: string | null
}

interface ExtractOptions {
  ignorePatternForSingleClass?: RegExp
}

function isElement(el: any): el is DefaultTreeElement {
  return el.tagName && el.attrs
}

export function extract(htmlString: string, options: ExtractOptions = {}) {
  const selectors: Selector[] = []
  const selectorFlag = new Map<string, boolean>()

  const addSelector = (selector, el) => {
    if (!selectorFlag.has(selector)) {
      selectorFlag.set(selector, true)
      selectors.push({
        selector: selector,
        tagName: el.tagName,
        style: getAttribute(el, 'style')
      })
    }
  }

  const retrieveClassNames = (el: DefaultTreeNode, currentPath: string[] = []) => {
    if (!isElement(el)) {
      return
    }
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
          if (
            index.length === 1 &&
            options.ignorePatternForSingleClass &&
            options.ignorePatternForSingleClass.test(classNames[index[0]])
          ) {
            return
          }
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
  return format(css, { parser: 'css', plugins: [cssParser] })
}
