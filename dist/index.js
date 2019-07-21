"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSDOM = require("jsdom").JSDOM;
var DOMParser = new JSDOM().window.DOMParser;
var DOMPath = require("chrome-dompath");
exports.getXPathSelector = function (element) {
    return DOMPath.xPath(element, true);
};
exports.getClassChainSelector = function (element) {
    var chain = [];
    var contextNode = element;
    while (contextNode.localName) {
        var value = contextNode.localName;
        var elementAttrs = contextNode.getAttributeNames();
        var predicate = '';
        if (elementAttrs.includes('value')) {
            predicate = "value CONTAINS \"" + contextNode.getAttribute('value') + "\"";
        }
        if (elementAttrs.includes('name')) {
            predicate += (predicate ? ' AND ' : '') + "name CONTAINS \"" + contextNode.getAttribute('name') + "\"";
        }
        if (elementAttrs.includes('label')) {
            predicate += (predicate ? ' AND ' : '') + "label CONTAINS \"" + contextNode.getAttribute('label') + "\"";
        }
        if (predicate) {
            value = value + "[`" + predicate + "`]";
        }
        var index = DOMPath._xPathIndex(contextNode);
        if (index > 0) {
            value = value + "[" + index + "]";
        }
        chain.push(value);
        contextNode = contextNode.parentNode;
    }
    return "/" + chain.reverse().join('/');
};
exports.parseDomFromString = function (xmlString) {
    var parser = new DOMParser();
    var dom = parser.parseFromString(xmlString, 'text/xml');
    var isParseError = dom.getElementsByTagName("parsererror").length > 0;
    if (isParseError) {
        throw new Error('Error parsing XML');
    }
    return dom;
};
//# sourceMappingURL=index.js.map