import { WebDriver } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class SaucedemoLoginPage extends BasePage {
  readonly usernameInput = '[data-test="username"]';
  readonly passwordInput = '[data-test="password"]';
  readonly loginButton = '[data-test="login-button"]';
  readonly errorMessage = '[data-test="error"]';

  constructor(driver: WebDriver) {
    super(driver);
  }

  async login(username: string, password: string) {
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForNavigation();
  }

  async getErrorMessage() {
    const element = await this.findVisible(this.errorMessage);
    return await element.getText();
  }

  async isErrorDisplayed() {
    return await this.isVisible(this.errorMessage);
  }
}
