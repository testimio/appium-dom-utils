import { JSDOM } from 'jsdom';
const { DOMParser } = new JSDOM().window;
import DOMPath from 'chrome-dompath';
declare module "chrome-dompath" {
  function _xPathIndex(node: Element): Number
}

export const getXPathSelector = (element: Element): string => {
  return DOMPath.xPath(element, true);
};

export const getClassChainSelector = (element: Element): string => {
  let chain = [];

  let contextNode = element;
  while (contextNode.localName) {
    let value = contextNode.localName;

    const elementAttrs = contextNode.getAttributeNames();
    let predicate = '';
    if(elementAttrs.includes('value')) {
      predicate = `value CONTAINS "${contextNode.getAttribute('value')}"`;
    }
    if(elementAttrs.includes('name')) {
      predicate += `${predicate ? ' AND ' : ''}name CONTAINS "${contextNode.getAttribute('name')}"`;
    }
    if(elementAttrs.includes('label')) {
      predicate += `${predicate ? ' AND ' : ''}label CONTAINS "${contextNode.getAttribute('label')}"`;
    }
    if(predicate) {
      value = `${value}[\`${predicate}\`]`;
    }

    const index = DOMPath._xPathIndex(contextNode);
    if (index > 0) {
      value = `${value}[${index}]`;
    }

    chain.push(value);
    contextNode = contextNode.parentNode as Element;
  }

  return `/${chain.reverse().join('/')}`;
};

export const parseDomFromString = (xmlString: string): Document => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(xmlString, 'text/xml');
  const isParseError = dom.getElementsByTagName("parsererror").length > 0;
  if(isParseError) {
      throw new Error('Error parsing XML');
  }
  return dom;
}