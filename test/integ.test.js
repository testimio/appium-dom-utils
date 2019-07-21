const expect = require('chai').expect;
const webdriverio = require("webdriverio");
const {
  parseDomFromString,
  getXPathSelector,
  getClassChainSelector,
} = require('../lib/index');

describe('Integration Test', () => {

  it.only('android', async () => {
    const opts = {
      port: 4723,
      capabilities: {
        platformName: "Android",
        platformVersion: "8.0",
        deviceName: "Android Emulator",
        app: `${__dirname}/calculator.apk`,
        automationName: "UiAutomator2"
      }
    };
    
    const client = await webdriverio.remote(opts);
    const xmlSourceString = await client.getPageSource();
    const dom = parseDomFromString(xmlSourceString);
    const domElement = dom.querySelector("[text*='9']");
    const xpath = getXPathSelector(domElement);
    expect(xpath).to.eql("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.LinearLayout/androidx.slidingpanelayout.widget.SlidingPaneLayout/android.widget.LinearLayout/android.view.ViewGroup[1]/android.widget.Button[3]");
    const appiumElement = await client.$(xpath);
    await appiumElement.click();
    await client.deleteSession();
  });
});