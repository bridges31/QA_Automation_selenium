# QA Project - Automatización con Selenium WebDriver

Proyecto de automatización de pruebas para la aplicación Saucedemo usando Selenium WebDriver, TypeScript y Mocha.

Este es el **proyecto hermano** de [`QA_Automation_playwright`](https://github.com/bridges31/QA_Automation_playwright): misma aplicación bajo prueba (Saucedemo), mismos casos de negocio y misma estructura de Page Object Model, pero implementado con **Selenium WebDriver** en lugar de Playwright. Sirve para comparar ambos enfoques de automatización sobre el mismo alcance funcional.

## Objetivo

Crear una base sólida para automatización de pruebas end-to-end con Selenium WebDriver, aplicando buenas prácticas de mantenimiento, reutilización y estructura por capas.

## Tecnologías

- Selenium WebDriver
- TypeScript
- Mocha + Chai
- Mochawesome (reportes)
- Node.js
- Page Object Model (POM)

## Estructura del proyecto

```text
QA_Automation_selenium/
├── pages/
│   ├── BasePage.ts
│   ├── SaucedemoLoginPage.ts
│   ├── SaucedemoHomePage.ts
│   ├── SaucedemoCartPage.ts
│   └── SaucedemoCheckoutPage.ts
├── tests/
│   └── saucedemo.spec.ts
├── .github/
│   └── workflows/
│       └── selenium.yml
├── .gitignore
├── .mocharc.json
├── package.json
├── tsconfig.json
└── README.md
```

## Casos cubiertos

- Login con credenciales válidas
- Login con contraseña inválida
- Login con usuario bloqueado
- Visualización de productos
- Agregar productos al carrito
- Eliminar productos del carrito
- Flujo completo de checkout
- Logout

## Instalación

1. Clonar el repositorio
2. Instalar dependencias

```bash
npm install
```

`selenium-webdriver` necesita un navegador Chrome instalado localmente; el binario de ChromeDriver se obtiene automáticamente mediante el paquete `chromedriver` (incluido en las devDependencies).

## Ejecución de pruebas

### Ejecutar todas las pruebas

```bash
npm test
```

Por defecto las pruebas corren en modo headless cuando la variable de entorno `CI` está definida, o cuando `HEADLESS` no es `"false"`. Para ver el navegador durante la ejecución local:

```bash
HEADLESS=false npm test
```

### Ejecutar con reporte HTML (Mochawesome)

```bash
npm run test:report
```

El reporte se genera en `mochawesome-report/`.

### Ejecutar solo el caso de logout

```bash
npm run test:logout
```

## Configuración

- `.mocharc.json`: configuración de Mocha (directorio de specs, timeout, uso de `ts-node/register`).
- `tsconfig.json`: configuración de compilación TypeScript.

## Recomendación de estructura

La lógica de automatización se mantiene separada en `pages/` para facilitar mantenimiento y lectura, mientras que los escenarios de prueba viven en `tests/`. Esto permite reutilizar acciones comunes y mantener los casos de prueba más legibles.

## Notas

Este proyecto sirve como base para seguir ampliando automatizaciones de aplicaciones web con Selenium WebDriver, aplicando buenas prácticas de QA y mantenimiento de pruebas, en paralelo al proyecto hermano basado en Playwright.

## Recursos

- [Selenium WebDriver Documentation](https://www.selenium.dev/documentation/webdriver/)
- [Mocha Documentation](https://mochajs.org/)
- [Chai Documentation](https://www.chaijs.com/)
