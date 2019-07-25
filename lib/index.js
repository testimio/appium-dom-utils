const JSDOM = require("jsdom").JSDOM;
if (JSDOM) {
  DOMParser = new JSDOM().window.DOMParser;
}
const DOMPath = require("chrome-dompath");

const getXPathSelector = (element) => {
  return DOMPath.xPath(element, true);
};

const ROOT_NODE_NAMES = {
  IOS: [
    'root',
    'XCUIElementTypeApplication',
  ],
  ANDROID: [

  ]
}
const getClassChainSelector = (element) => {
  let chain = [];

  let contextNode = element;
  while (contextNode.localName && !ROOT_NODE_NAMES.IOS.includes(contextNode.localName)) {
    let value = contextNode.localName;

    const elementAttrs = getElementAttributesMap(contextNode, false);
    let predicate = '';
    if(elementAttrs.value) {
      predicate = `value CONTAINS "${elementAttrs.value}"`;
    }
    if(elementAttrs.name) {
      predicate += `${predicate ? ' AND ' : ''}name CONTAINS "${elementAttrs.name}"`;
    }
    if(elementAttrs.label) {
      predicate += `${predicate ? ' AND ' : ''}label CONTAINS "${elementAttrs.label}"`;
    }
    if(predicate) {
      value = `${value}[\`${predicate}\`]`;
    }

    const index = DOMPath._xPathIndex(contextNode);
    if (index > 0 && !predicate) {
      value = `${value}[${index}]`;
    }

    chain.push(value);
    contextNode = contextNode.parentNode;
  }

  return `${chain.reverse().join('/')}`;
};

const parseDomFromString = (xmlString) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(xmlString, 'text/xml');
  const isParseError = dom.getElementsByTagName("parsererror").length > 0;
  if(isParseError) {
      throw new Error('Error parsing XML');
  }
  return dom;
}

function convertStringToPrimitive({nodeValue, name}) {
  if (!nodeValue) {
    return nodeValue;
  }
  if(name === "index") {
    return Number(nodeValue);
  }
  if (nodeValue === "true") {
    return true;
  }
  if (nodeValue === "false") {
    return false;
  }
  return nodeValue;
}

const getElementAttributesMap = (element, withConversion = true) => {
  return Array.from(element.attributes)
      .reduce((attributes, attribute) => {
          attributes[attribute.name] = withConversion ? convertStringToPrimitive(attribute) : attribute.nodeValue;
          return attributes;
      }, {});
}

module.exports = {
  getXPathSelector,
  getClassChainSelector,
  parseDomFromString,
  getElementAttributesMap
}