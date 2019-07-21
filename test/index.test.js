const expect = require('chai').expect;
const JSDOM = require("jsdom").JSDOM;
const {
  parseDomFromString,
  getXPathSelector,
  getClassChainSelector,
  getElementAttributesMap
} = require('../lib/index');

describe('Appium Selector Builder', () => {

  it('element without attributes', () => {
    const dom = parseDomFromString('<root><a><b>T1</b><c>T2</c></a></root>');
    const targetElement = dom.querySelector('b');
    const selector = getClassChainSelector(targetElement);
    expect(selector).to.eql('/root/a/b');
  });

  it('element with attributes', () => {
    const dom = parseDomFromString('<root><a><b name="ran" label="cohen" value="505">T1</b><c>T2</c></a></root>');
    const targetElement = dom.querySelector('b');
    const selector = getClassChainSelector(targetElement);
    expect(selector).to.eql('/root/a/b[`value CONTAINS "505" AND name CONTAINS "ran" AND label CONTAINS "cohen"`]');
  });
  
  it('element with attributes on chain', () => {
    const dom = parseDomFromString('<root><a name="ran"><b label="cohen" value="505">T1</b><c>T2</c></a></root>');
    const targetElement = dom.querySelector('b');
    const selector = getClassChainSelector(targetElement);
    expect(selector).to.eql('/root/a[`name CONTAINS "ran"`]/b[`value CONTAINS "505" AND label CONTAINS "cohen"`]');
  });

  it('element with attributes and indexes on chain', () => {
    const dom = parseDomFromString('<root><a name="ran"><b label="cohen">T1</b><b clickable="true" value="505">T2</b></a></root>');
    const targetElement = dom.querySelector('b[value="505"]');
    const selector = getClassChainSelector(targetElement);
    expect(selector).to.eql('/root/a[`name CONTAINS "ran"`]/b[`value CONTAINS "505"`][2]');
    expect(getElementAttributesMap(targetElement)).to.eql({
      value: "505",
      clickable: true
    })
  });
});