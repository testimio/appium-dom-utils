const JSDOM = require("jsdom").JSDOM;
if (JSDOM) {
  DOMParser = new JSDOM().window.DOMParser;
}
const DOMPath = require("chrome-dompath");

module.exports.getXPathSelector = (element) => {
  return DOMPath.xPath(element, true);
};

module.exports.getClassChainSelector = (element) => {
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
    contextNode = contextNode.parentNode;
  }

  return `/${chain.reverse().join('/')}`;
};

module.exports.parseDomFromString = (xmlString) => {
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

module.exports.getElementAttributesMap = (element) => {
  return Array.from(element.attributes)
      .reduce((attributes, attribute) => {
          attributes[attribute.name] = convertStringToPrimitive(attribute);
          return attributes;
      }, {});
}