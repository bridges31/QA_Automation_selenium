import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class SaucedemoCheckoutPage extends BasePage {
  readonly firstNameInput = '[data-test="firstName"]';
  readonly lastNameInput = '[data-test="lastName"]';
  readonly postalCodeInput = '[data-test="postalCode"]';
  readonly continueButton = '[data-test="continue"]';
  readonly finishButton = '[data-test="finish"]';
  readonly completeMessage = '.complete-header';
  readonly cartList = '[data-test="inventory-item"]';
  readonly summaryTotalLabel = '.summary_total_label';

  constructor(driver: WebDriver) {
    super(driver);
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    await this.type(this.firstNameInput, firstName);
    await this.type(this.lastNameInput, lastName);
    await this.type(this.postalCodeInput, postalCode);
    await this.click(this.continueButton);
    await this.waitForNavigation();
  }

  async getOrderTotal() {
    const element = await this.findVisible(this.summaryTotalLabel);
    return await element.getText();
  }

  async finishOrder() {
    await this.click(this.finishButton);
    await this.waitForNavigation();
  }

  async isOrderComplete() {
    return await this.isVisible(this.completeMessage);
  }

  async getCompleteMessage() {
    const element = await this.findVisible(this.completeMessage);
    return await element.getText();
  }

  async getOrderItems() {
    const items = await this.driver.findElements(By.css(this.cartList));
    return items.length;
  }
}
