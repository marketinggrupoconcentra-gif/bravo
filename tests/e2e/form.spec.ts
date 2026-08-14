import { test, expect } from "@playwright/test";

/**
 * Form E2E Tests — Bravo México
 * Verifica el flujo completo del formulario de precalificación de 4 pasos.
 */

test.describe("Formulario de Precalificación — Flujo Completo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/formulario");
    // Esperar que el formulario esté visible
    await expect(page.locator("form")).toBeVisible({ timeout: 10_000 });
  });

  test("La página del formulario carga correctamente", async ({ page }) => {
    await expect(page).toHaveTitle(/precalificaci/i);
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("El indicador de progreso 'Paso 1 de 4' está visible al inicio", async ({ page }) => {
    const stepText = page.getByText(/paso 1 de 4/i);
    await expect(stepText).toBeVisible();
  });

  test("Step 1 — Selección de monto y avance al Paso 2", async ({ page }) => {
    // Step 1: Seleccionar un monto
    const amountOption = page.locator("label").filter({ hasText: /100,000/i }).first();
    await expect(amountOption).toBeVisible();
    await amountOption.click();

    // El botón Continuar debe activarse
    const continueBtn = page.getByRole("button", { name: /continuar/i });
    await expect(continueBtn).not.toBeDisabled();
    await continueBtn.click();

    // Verificar que avanzamos al paso 2
    await expect(page.getByText(/paso 2 de 4/i)).toBeVisible();
  });

  test("Step 1 — Monto menor a 50k muestra orientación contextual", async ({ page }) => {
    const lessOption = page.locator("label").filter({ hasText: /menos de \$50/i }).first();
    if (await lessOption.isVisible()) {
      await lessOption.click();
      const guidance = page.getByText(/orientaci/i);
      await expect(guidance).toBeVisible();
    }
  });

  test("Step 2 — Selección de tipo de deuda y institución", async ({ page }) => {
    // Step 1: Seleccionar monto
    const amountOption = page.locator("label").filter({ hasText: /100,000/i }).first();
    await amountOption.click();
    await page.getByRole("button", { name: /continuar/i }).click();
    await expect(page.getByText(/paso 2 de 4/i)).toBeVisible();

    // Step 2: Seleccionar tipo de deuda
    const debtOption = page.locator("label").filter({ hasText: /tarjeta de cr/i }).first();
    await expect(debtOption).toBeVisible();
    await debtOption.click();

    // Seleccionar institución del dropdown
    const dropdown = page.locator("select");
    await expect(dropdown).toBeVisible();
    await dropdown.selectOption({ index: 1 }); // Primera opción real (índice 0 = placeholder)

    // Continuar al paso 3
    const continueBtn = page.getByRole("button", { name: /continuar/i });
    await expect(continueBtn).not.toBeDisabled();
    await continueBtn.click();

    await expect(page.getByText(/paso 3 de 4/i)).toBeVisible();
  });

  test("Step 3 — Validación de datos de contacto", async ({ page }) => {
    // Avanzar hasta step 3
    await page.locator("label").filter({ hasText: /100,000/i }).first().click();
    await page.getByRole("button", { name: /continuar/i }).click();

    const debtOption = page.locator("label").filter({ hasText: /tarjeta de cr/i }).first();
    await debtOption.click();
    const dropdown = page.locator("select");
    await dropdown.selectOption({ index: 1 });
    await page.getByRole("button", { name: /continuar/i }).click();

    await expect(page.getByText(/paso 3 de 4/i)).toBeVisible();

    // El botón debe estar deshabilitado sin datos
    const continueBtn = page.getByRole("button", { name: /continuar/i });
    await expect(continueBtn).toBeDisabled();

    // Llenar nombre
    const nameInput = page.locator("#bravo-lead-name");
    await nameInput.fill("Luis García");
    await nameInput.blur();

    // Llenar celular
    const phoneInput = page.locator("#bravo-lead-phone");
    await phoneInput.fill("5512345678");
    await phoneInput.blur();

    // Llenar email
    const emailInput = page.locator("#bravo-lead-email");
    await emailInput.fill("luis.garcia@example.com");
    await emailInput.blur();

    // El botón debe activarse
    await expect(continueBtn).not.toBeDisabled();
  });

  test("Step 4 — Resumen de confirmación y aceptación de privacidad", async ({ page }) => {
    // Avanzar hasta step 4
    await page.locator("label").filter({ hasText: /100,000/i }).first().click();
    await page.getByRole("button", { name: /continuar/i }).click();

    const debtOption = page.locator("label").filter({ hasText: /tarjeta de cr/i }).first();
    await debtOption.click();
    await page.locator("select").selectOption({ index: 1 });
    await page.getByRole("button", { name: /continuar/i }).click();

    await page.locator("#bravo-lead-name").fill("Luis García");
    await page.locator("#bravo-lead-name").blur();
    await page.locator("#bravo-lead-phone").fill("5512345678");
    await page.locator("#bravo-lead-phone").blur();
    await page.locator("#bravo-lead-email").fill("luis@bravo-test.mx");
    await page.locator("#bravo-lead-email").blur();
    await page.getByRole("button", { name: /continuar/i }).click();

    // Step 4: Confirmación
    await expect(page.getByText(/paso 4 de 4/i)).toBeVisible();
    await expect(page.getByText(/revisemos tus datos/i)).toBeVisible();

    // El checkbox de privacidad debe existir
    const privacyCheck = page.locator("#privacy-check");
    await expect(privacyCheck).toBeVisible();

    // El botón submit debe estar deshabilitado sin aceptar privacidad
    const submitBtn = page.getByRole("button", { name: /solicitar evaluaci/i });
    await expect(submitBtn).toBeDisabled();

    // Aceptar privacidad
    await privacyCheck.check();
    await expect(submitBtn).not.toBeDisabled();
  });

  test("Flujo completo con mock de API — redirige a /gracias", async ({ page }) => {
    // Mock de la API de leads para no hacer llamadas reales en tests
    await page.route("/api/leads", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          lead: {
            id: "test-123",
            folio: "BR-999999",
            nombre: "Test Usuario",
            status: "Nuevo",
          },
          redirectUrl: "/gracias",
        }),
      });
    });

    // Step 1
    await page.locator("label").filter({ hasText: /100,000/i }).first().click();
    await page.getByRole("button", { name: /continuar/i }).click();

    // Step 2
    await page.locator("label").filter({ hasText: /tarjeta de cr/i }).first().click();
    await page.locator("select").selectOption({ index: 1 });
    await page.getByRole("button", { name: /continuar/i }).click();

    // Step 3
    await page.locator("#bravo-lead-name").fill("Test Usuario");
    await page.locator("#bravo-lead-name").blur();
    await page.locator("#bravo-lead-phone").fill("5599887766");
    await page.locator("#bravo-lead-phone").blur();
    await page.locator("#bravo-lead-email").fill("test@bravo.mx");
    await page.locator("#bravo-lead-email").blur();
    await page.getByRole("button", { name: /continuar/i }).click();

    // Step 4
    await page.locator("#privacy-check").check();
    await page.getByRole("button", { name: /solicitar evaluaci/i }).click();

    // Esperar redirección a /gracias
    await page.waitForURL(/\/gracias/, { timeout: 10_000 });
    expect(page.url()).toContain("/gracias");
  });

  test("El botón 'Atrás' navega al paso anterior", async ({ page }) => {
    // Avanzar a paso 2
    await page.locator("label").filter({ hasText: /100,000/i }).first().click();
    await page.getByRole("button", { name: /continuar/i }).click();
    await expect(page.getByText(/paso 2 de 4/i)).toBeVisible();

    // Regresar al paso 1
    await page.getByRole("button", { name: /atr/i }).click();
    await expect(page.getByText(/paso 1 de 4/i)).toBeVisible();
  });
});
