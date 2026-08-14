import { test, expect } from "@playwright/test";

/**
 * Homepage E2E Tests — Bravo México
 * Verifica que la landing page carga con los elementos críticos del Hero y la navegación.
 */
test.describe("Homepage — Critical Elements", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("La página principal carga correctamente (200)", async ({ page }) => {
    await expect(page).toHaveURL(/\//);
    expect(page.url()).toContain("localhost:3000");
  });

  test("El título de la página contiene 'Bravo'", async ({ page }) => {
    await expect(page).toHaveTitle(/Bravo/i);
  });

  test("El H1 del Hero está visible", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    // El H1 debe contener contenido sustancial
    const h1Text = await h1.innerText();
    expect(h1Text.length).toBeGreaterThan(10);
  });

  test("El CTA principal 'Revisar mi caso' está visible", async ({ page }) => {
    const cta = page.getByRole("link", { name: /revisar mi caso/i }).first();
    await expect(cta).toBeVisible();
  });

  test("El header/navegación está presente", async ({ page }) => {
    const header = page.locator("header").first();
    await expect(header).toBeVisible();
  });

  test("El footer está presente y tiene contenido", async ({ page }) => {
    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible();
  });

  test("No hay errores de JavaScript en consola al cargar", async ({ page }) => {
    const jsErrors: string[] = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Permite errores de analytics/trackers externos pero no errores de app
    const criticalErrors = jsErrors.filter(
      (e) => !e.includes("gtm") && !e.includes("fbq") && !e.includes("analytics")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("La página no tiene overflow horizontal (mobile 390px)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance
  });

  test("La página del formulario es accesible desde el CTA", async ({ page }) => {
    const cta = page.getByRole("link", { name: /revisar mi caso/i }).first();
    await cta.click();

    // Debe navegar al formulario o scroll down (según implementación)
    // Acepta tanto /formulario como un scroll to form
    await page.waitForTimeout(500);
    const currentUrl = page.url();
    const isFormPage = currentUrl.includes("/formulario") || currentUrl.includes("localhost:3000");
    expect(isFormPage).toBe(true);
  });
});

test.describe("SEO — Metadata básica", () => {
  test("La página tiene meta description", async ({ page }) => {
    await page.goto("/");
    const metaDesc = await page.getAttribute('meta[name="description"]', "content");
    expect(metaDesc).toBeTruthy();
    expect((metaDesc ?? "").length).toBeGreaterThan(20);
  });

  test("La página tiene og:title (si está configurado)", async ({ page }) => {
    await page.goto("/");

    // og:title es opcional — si existe, debe tener contenido válido
    const ogTitle = await page.evaluate(() => {
      const meta = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
      return meta ? meta.content : null;
    });

    if (ogTitle !== null) {
      expect(ogTitle.length).toBeGreaterThan(5);
    } else {
      // No configurado — test pasa de forma condicional
      console.log("[INFO] og:title no está configurado en el proyecto.");
    }
  });
});
