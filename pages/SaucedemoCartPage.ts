import { WebDriver, By } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class SaucedemoCartPage extends BasePage {
  readonly cartItems = '[data-test="inventory-item"]';
  readonly checkoutButton = '[data-test="checkout"]';
  readonly continueShoppingButton = '[data-test="continue-shopping"]';
  readonly removeButton = 'button[data-test*="remove"]';
  readonly cartBadge = '.shopping_cart_badge';

  constructor(driver: WebDriver) {
    super(driver);
  }

  async getCartItemCount() {
    const items = await this.driver.findElements(By.css(this.cartItems));
    return items.length;
  }

  async removeFirstItem() {
    const firstRemoveButton = await this.driver.findElement(By.css(this.removeButton));
    await firstRemoveButton.click();
  }

  async goToCheckout() {
    await this.click(this.checkoutButton);
    await this.waitForNavigation();
  }

  async continueShopping() {
    await this.click(this.continueShoppingButton);
    await this.waitForNavigation();
  }

  async isEmpty() {
    const items = await this.driver.findElements(By.css(this.cartItems));
    return items.length === 0;
  }
}
