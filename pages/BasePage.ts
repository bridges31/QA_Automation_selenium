import { WebDriver, WebElement, By, until } from 'selenium-webdriver';

const DEFAULT_TIMEOUT = 10000;

export class BasePage {
  readonly driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  async goto(url: string) {
    await this.driver.get(url);
  }

  async waitForNavigation() {
    await this.driver.wait(async () => {
      const state = await this.driver.executeScript('return document.readyState');
      return state === 'complete';
    }, DEFAULT_TIMEOUT);
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async getUrl() {
    return await this.driver.getCurrentUrl();
  }

  async findVisible(selector: string, timeout = DEFAULT_TIMEOUT): Promise<WebElement> {
    const element = await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async isVisible(selector: string, timeout = 2000): Promise<boolean> {
    try {
      const element = await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
      return await element.isDisplayed();
    } catch {
      return false;
    }
  }

  async click(selector: string) {
    const element = await this.findVisible(selector);
    await element.click();
  }

  async type(selector: string, text: string) {
    const element = await this.findVisible(selector);
    await element.clear();
    await element.sendKeys(text);
  }
}
