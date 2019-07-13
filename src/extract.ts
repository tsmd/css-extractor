import { DefaultTreeDocumentFragment, DefaultTreeElement, parseFragment } from 'parse5'

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

export function extractSelector(htmlString) {
  const selectors = []
  const fragment = parseFragment(htmlString) as DefaultTreeDocumentFragment
  const retrieveClassNames = el => {
    const classNames = getClassNames(el)
    selectors.push(classNames)
    el.childNodes.forEach(retrieveClassNames)
  }
  fragment.childNodes.forEach(retrieveClassNames)
  return selectors
}
