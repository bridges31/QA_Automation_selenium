import { Builder, WebDriver } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import { expect } from 'chai';
import { SaucedemoLoginPage } from '../pages/SaucedemoLoginPage';
import { SaucedemoHomePage } from '../pages/SaucedemoHomePage';
import { SaucedemoCartPage } from '../pages/SaucedemoCartPage';
import { SaucedemoCheckoutPage } from '../pages/SaucedemoCheckoutPage';

describe('Saucedemo - E-commerce Application Tests', () => {
  const SAUCEDEMO_URL = 'https://www.saucedemo.com/';
  const VALID_USERNAME = 'standard_user';
  const VALID_PASSWORD = 'secret_sauce';
  const INVALID_PASSWORD = 'wrong_password';

  let driver: WebDriver;

  beforeEach(async () => {
    const options = new ChromeOptions();
    options.setUserPreferences({
      credentials_enable_service: false,
      'profile.password_manager_enabled': false,
      'profile.password_manager_leak_detection': false,
    });
    options.addArguments(
      '--disable-features=PasswordLeakDetection,PasswordManagerOnboarding,PasswordChangeToastUI'
    );
    if (process.env.CI || process.env.HEADLESS !== 'false') {
      options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800');
    }
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  afterEach(async () => {
    await driver.quit();
  });

  describe('Login Tests', () => {
    it('Debe cargar la página de login de Saucedemo', async () => {
      const loginPage = new SaucedemoLoginPage(driver);
      await loginPage.goto(SAUCEDEMO_URL);
      const title = await loginPage.getTitle();
      expect(title).to.include('Swag Labs');
    });

    it('Debe hacer login exitoso con credenciales válidas', async () => {
      const loginPage = new SaucedemoLoginPage(driver);
      await loginPage.goto(SAUCEDEMO_URL);
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

      const url = await loginPage.getUrl();
      expect(url).to.include('inventory');
    });

    it('Debe mostrar error con contraseña inválida', async () => {
      const loginPage = new SaucedemoLoginPage(driver);
      await loginPage.goto(SAUCEDEMO_URL);
      await loginPage.login(VALID_USERNAME, INVALID_PASSWORD);

      const isError = await loginPage.isErrorDisplayed();
      expect(isError).to.be.true;
    });

    it('Debe mostrar error con usuario bloqueado', async () => {
      const loginPage = new SaucedemoLoginPage(driver);
      await loginPage.goto(SAUCEDEMO_URL);
      await loginPage.login('locked_out_user', VALID_PASSWORD);

      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).to.include('locked out');
    });
  });

  describe('Home Page Tests', () => {
    beforeEach(async () => {
      const loginPage = new SaucedemoLoginPage(driver);
      await loginPage.goto(SAUCEDEMO_URL);
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    });

    it('Debe mostrar lista de productos', async () => {
      const homePage = new SaucedemoHomePage(driver);
      const productCount = await homePage.getProductCount();
      expect(productCount).to.be.greaterThan(0);
    });

    it('Debe agregar primer producto al carrito', async () => {
      const homePage = new SaucedemoHomePage(driver);
      await homePage.addFirstProductToCart();

      await homePage.goToCart();
      const cartPage = new SaucedemoCartPage(driver);
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).to.be.greaterThan(0);
    });

    it('Debe ordenar productos por precio de menor a mayor', async () => {
      const homePage = new SaucedemoHomePage(driver);
      await homePage.sortBy('lohi');
      const prices = await homePage.getProductPrices();
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sortedPrices);
    });

    it('Debe ordenar productos por precio de mayor a menor', async () => {
      const homePage = new SaucedemoHomePage(driver);
      await homePage.sortBy('hilo');
      const prices = await homePage.getProductPrices();
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).to.deep.equal(sortedPrices);
    });
  });

  describe('Shopping Cart Tests', () => {
    beforeEach(async () => {
      const loginPage = new SaucedemoLoginPage(driver);
      await loginPage.goto(SAUCEDEMO_URL);
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

      const homePage = new SaucedemoHomePage(driver);
      await homePage.addProductByIndex(0);
      await homePage.addProductByIndex(1);
      await homePage.goToCart();
    });

    it('Debe mostrar productos en el carrito', async () => {
      const cartPage = new SaucedemoCartPage(driver);
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).to.equal(2);
    });

    it('Debe remover un producto del carrito', async () => {
      const cartPage = new SaucedemoCartPage(driver);
      await cartPage.removeFirstItem();

      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).to.equal(1);
    });

    it('Debe ir a checkout desde el carrito', async () => {
      const cartPage = new SaucedemoCartPage(driver);
      await cartPage.goToCheckout();

      const url = await driver.getCurrentUrl();
      expect(url).to.include('checkout-step-one');
    });
  });

  describe('Checkout Flow Tests', () => {
    it('Debe completar el flujo de compra exitosamente', async () => {
      const loginPage = new SaucedemoLoginPage(driver);
      await loginPage.goto(SAUCEDEMO_URL);
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

      const homePage = new SaucedemoHomePage(driver);
      await homePage.addProductByIndex(0);
      await homePage.goToCart();

      const cartPage = new SaucedemoCartPage(driver);
      await cartPage.goToCheckout();

      const checkoutPage = new SaucedemoCheckoutPage(driver);
      await checkoutPage.fillCheckoutInfo('Juan', 'Pérez', '12345');

      const total = await checkoutPage.getOrderTotal();
      expect(total).to.not.be.empty;

      await checkoutPage.finishOrder();

      const isComplete = await checkoutPage.isOrderComplete();
      expect(isComplete).to.be.true;
    });

    it('Debe mostrar el total de la orden en resumen', async () => {
      const loginPage = new SaucedemoLoginPage(driver);
      await loginPage.goto(SAUCEDEMO_URL);
      await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

      const homePage = new SaucedemoHomePage(driver);
      await homePage.addProductByIndex(0);
      await homePage.goToCart();

      const cartPage = new SaucedemoCartPage(driver);
      await cartPage.goToCheckout();

      const checkoutPage = new SaucedemoCheckoutPage(driver);
      await checkoutPage.fillCheckoutInfo('Juan', 'Test', '99999');

      const total = await checkoutPage.getOrderTotal();
      expect(total).to.include('Total');
      expect(total).to.include('$');
    });
  });

  it('Debe poder hacer logout', async () => {
    const loginPage = new SaucedemoLoginPage(driver);
    await loginPage.goto(SAUCEDEMO_URL);
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);

    const homePage = new SaucedemoHomePage(driver);
    await homePage.logout();

    const isUsernameVisible = await loginPage.isVisible('[data-test="username"]', 8000);
    const isLoginButtonVisible = await loginPage.isVisible('[data-test="login-button"]', 8000);
    expect(isUsernameVisible).to.be.true;
    expect(isLoginButtonVisible).to.be.true;
  });
});
