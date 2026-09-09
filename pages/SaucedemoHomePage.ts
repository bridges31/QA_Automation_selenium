import { WebDriver, By, until } from 'selenium-webdriver';
import { BasePage } from './BasePage';

export class SaucedemoHomePage extends BasePage {
  readonly cartButton = '[data-test="shopping-cart-link"]';
  readonly cartBadge = '.shopping_cart_badge';
  readonly productList = '[data-test="inventory-item"]';
  readonly addToCartButton = 'button[data-test*="add-to-cart"]';
  readonly sortDropdown = '[data-test="product-sort-container"]';
  readonly productPrice = '.inventory_item_price';
  readonly menuButton = '#react-burger-menu-btn';
  readonly logoutLink = '#logout_sidebar_link';

  constructor(driver: WebDriver) {
    super(driver);
  }

  async getProductCount() {
    const products = await this.driver.findElements(By.css(this.productList));
    return products.length;
  }

  async addFirstProductToCart() {
    const firstAddButton = await this.driver.findElement(By.css(this.addToCartButton));
    await firstAddButton.click();
    await this.driver.wait(until.elementLocated(By.css(this.cartBadge)), 10000);
  }

  async addProductByIndex(index: number) {
    const products = await this.driver.findElements(By.css(this.productList));
    const product = products[index];
    const initialButton = await product.findElement(By.css('button'));
    await initialButton.click();
    await this.driver.wait(async () => {
      try {
        const freshButton = await product.findElement(By.css('button'));
        const text = await freshButton.getText();
        return /remove/i.test(text);
      } catch {
        return false;
      }
    }, 10000);
  }

  async goToCart() {
    await this.click(this.cartButton);
    await this.waitForNavigation();
  }

  async getCartCount() {
    try {
      const visible = await this.isVisible(this.cartBadge, 2000);
      if (visible) {
        const badge = await this.driver.findElement(By.css(this.cartBadge));
        const count = await badge.getText();
        return count ? count.trim() : '0';
      }
    } catch {
      return '0';
    }
    return '0';
  }

   async sortBy(optionValue: string) {
    const dropdown = await this.findVisible(this.sortDropdown);
    await dropdown.click();
    const option = await dropdown.findElement(By.css(`option[value="${optionValue}"]`));
    await option.click();
    // Re-consultamos el dropdown fresco: el re-render de la lista
    // invalida la referencia original, igual que con el botón de "Add to cart".
    await this.driver.wait(async () => {
      try {
        const freshDropdown = await this.driver.findElement(By.css(this.sortDropdown));
        const selected = await freshDropdown.getAttribute('value');
        return selected === optionValue;
      } catch {
        return false;
      }
    }, 5000);
  }

  async getProductPrices(): Promise<number[]> {
    const priceElements = await this.driver.findElements(By.css(this.productPrice));
    const prices: number[] = [];
    for (const el of priceElements) {
      const text = await el.getText(); // ej. "$29.99"
      prices.push(parseFloat(text.replace('$', '')));
    }
    return prices;
  }

  async logout() {
    await this.click(this.menuButton);
    await this.driver.wait(until.elementLocated(By.css(this.logoutLink)), 10000);
    await this.click(this.logoutLink);
    await this.waitForNavigation();
  }
}
