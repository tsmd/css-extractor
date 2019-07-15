import { DefaultTreeDocumentFragment, DefaultTreeElement, DefaultTreeNode, parseFragment } from 'parse5'
import { format } from 'prettier/standalone'
import cssParser from 'prettier/parser-postcss'
import _ from 'underscore'

import { combination } from './utils'
import { reset } from './reset'

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
  modifierPattern?: RegExp
  reset?: boolean
}

function isElement(el: any): el is DefaultTreeElement {
  return el.tagName && el.attrs
}

const defaultOptions: ExtractOptions = {
  modifierPattern: /$./,
  reset: false
}

export function extract(htmlString: string, options: ExtractOptions = {}) {
  options = Object.assign({}, defaultOptions, options)

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
    if (!classNames) {
      // クラス名を起点とする文脈に居るかどうかの判定
      if (currentPath.length === 0) {
        el.childNodes.forEach(el => retrieveClassNames(el))
        return
      }

      const path = currentPath.concat(el.tagName)
      const selector = path.join('>')
      addSelector(selector, el)
      el.childNodes.forEach(el => retrieveClassNames(el, path))
      return
    }

    const [modifiers, modifierExcluded] = _.partition(classNames, cn => options.modifierPattern.test(cn))
    if (modifierExcluded.length === 0) {
      el.childNodes.forEach(el => retrieveClassNames(el))
      return
    }

    // モディファイア以外のクラス名は、組み合わせを列挙し
    // それぞれについて子孫要素を見ていく
    for (let i = 1; i <= modifierExcluded.length; i += 1) {
      combination(modifierExcluded.length, i).forEach(index => {
        const selector = index.map(cn => `.${modifierExcluded[cn]}`).join('')
        addSelector(selector, el)
        el.childNodes.forEach(el => retrieveClassNames(el, [selector]))

        for (let j = 0; j < modifiers.length; j += 1) {
          const selector2 = `${selector}.${modifiers[j]}`
          addSelector(selector2, el)
          el.childNodes.forEach(el => retrieveClassNames(el, [selector2]))
        }
      })
    }
  }

  const fragment = parseFragment(htmlString) as DefaultTreeDocumentFragment
  fragment.childNodes.forEach(el => retrieveClassNames(el))

  const css = selectors
    .map(selector => {
      const styleAttribute = selector.style || ''
      const defaultStyle = options.reset ? reset(selector.tagName) : ''
      return `${selector.selector} {${defaultStyle}${styleAttribute}}`
    })
    .join('\n\n')
  return format(css, { parser: 'css', plugins: [cssParser] })
}
