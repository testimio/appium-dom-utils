const expect = require('chai').expect;
const JSDOM = require("jsdom").JSDOM;
const appiumSelectorBuilder = require('../lib/index');

function parseHtmlString(...args) {
  return new JSDOM(args.join('\n'), {
      features: {
          FetchExternalResources: ["script", "frame", "iframe", "link", "img"]
      },
      contentType: "text/xml"}).window.document;
}

describe('Appium Selector Builder', () => {

  it('element without attributes', () => {
    const dom = parseHtmlString('<root><a><b>T1</b><c>T2</c></a></root>');
    const targetElement = dom.querySelector('b');
    const selector = appiumSelectorBuilder.getClassChainSelector(targetElement);
    expect(selector).to.eql('/root/a/b');
  });

  it('element with attributes', () => {
    const dom = parseHtmlString('<root><a><b name="ran" label="cohen" value="505">T1</b><c>T2</c></a></root>');
    const targetElement = dom.querySelector('b');
    const selector = appiumSelectorBuilder.getClassChainSelector(targetElement);
    expect(selector).to.eql('/root/a/b[`value CONTAINS "505" AND name CONTAINS "ran" AND label CONTAINS "cohen"`]');
  });
  
  it('element with attributes on chain', () => {
    const dom = parseHtmlString('<root><a name="ran"><b label="cohen" value="505">T1</b><c>T2</c></a></root>');
    const targetElement = dom.querySelector('b');
    const selector = appiumSelectorBuilder.getClassChainSelector(targetElement);
    expect(selector).to.eql('/root/a[`name CONTAINS "ran"`]/b[`value CONTAINS "505" AND label CONTAINS "cohen"`]');
  });

  it('element with attributes and indexes on chain', () => {
    const dom = parseHtmlString('<root><a name="ran"><b label="cohen">T1</b><b value="505">T2</b></a></root>');
    const targetElement = dom.querySelector('b[value="505"]');
    const selector = appiumSelectorBuilder.getClassChainSelector(targetElement);
    expect(selector).to.eql('/root/a[`name CONTAINS "ran"`]/b[`value CONTAINS "505"`][2]');
  });
});