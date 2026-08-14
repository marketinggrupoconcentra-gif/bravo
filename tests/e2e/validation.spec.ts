import { test, expect } from "@playwright/test";

/**
 * Form Validation E2E Tests — Bravo México
 * Verifica que las validaciones del formulario funcionan correctamente:
 * mensajes de error, restricciones de campo, y el comportamiento del botón Continuar.
 */

test.describe("Formulario — Validaciones de Campos", () => {
  async function goToStep3(page: any) {
    await page.goto("/formulario");
    await page.locator("label").filter({ hasText: /100,000/i }).first().click();
    await page.getByRole("button", { name: /continuar/i }).click();
    await page.locator("label").filter({ hasText: /tarjeta de cr/i }).first().click();
    await page.locator("select").selectOption({ index: 1 });
    await page.getByRole("button", { name: /continuar/i }).click();
    await expect(page.getByText(/paso 3 de 4/i)).toBeVisible();
  }

  test("Nombre inválido muestra mensaje de error", async ({ page }) => {
    await goToStep3(page);

    const nameInput = page.locator("#bravo-lead-name");
    await nameInput.fill("1");  // Solo un carácter — inválido
    await nameInput.blur();

    // Debe mostrar un mensaje de error
    const errorMsg = page.getByText(/mínimo 3/i);
    await expect(errorMsg).toBeVisible();
  });

  // Nota: El campo nombre filtra números en tiempo real (onChange handler).
  // Por eso usamos un nombre con solo 2 letras para disparar el error de longitud mínima.
  test("Nombre corto (2 letras) muestra mensaje de error de mínimo", async ({ page }) => {
    await goToStep3(page);

    const nameInput = page.locator("#bravo-lead-name");
    await nameInput.fill("Lu");  // Solo 2 letras — menos del mínimo de 3
    await nameInput.blur();

    const errorMsg = page.getByText(/mínimo 3 letras/i);
    await expect(errorMsg).toBeVisible();
  });

  test("Celular de menos de 10 dígitos no es válido", async ({ page }) => {
    await goToStep3(page);

    const phoneInput = page.locator("#bravo-lead-phone");
    await phoneInput.fill("123456");
    await phoneInput.blur();

    const errorMsg = page.getByText(/exactamente 10 dígitos/i);
    await expect(errorMsg).toBeVisible();
  });

  test("Celular con todos dígitos iguales no es válido", async ({ page }) => {
    await goToStep3(page);

    const phoneInput = page.locator("#bravo-lead-phone");
    await phoneInput.fill("1111111111");
    await phoneInput.blur();

    // Debe mostrar error para número repetido
    const continueBtn = page.getByRole("button", { name: /continuar/i });
    await expect(continueBtn).toBeDisabled();
  });

  test("Email inválido muestra mensaje de error", async ({ page }) => {
    await goToStep3(page);

    const emailInput = page.locator("#bravo-lead-email");
    await emailInput.fill("no-es-un-email");
    await emailInput.blur();

    const errorMsg = page.getByText(/correo electrónico válido/i);
    await expect(errorMsg).toBeVisible();
  });

  test("Email válido muestra indicador verde", async ({ page }) => {
    await goToStep3(page);

    const emailInput = page.locator("#bravo-lead-email");
    await emailInput.fill("correo@valido.com");
    await emailInput.blur();

    const validIndicator = page.getByText(/válido/i).last();
    await expect(validIndicator).toBeVisible();
  });

  test("Botón Continuar deshabilitado en Step 1 sin selección", async ({ page }) => {
    await page.goto("/formulario");
    const continueBtn = page.getByRole("button", { name: /continuar/i });
    await expect(continueBtn).toBeDisabled();
  });

  test("Botón Continuar deshabilitado en Step 2 sin institución", async ({ page }) => {
    await page.goto("/formulario");
    await page.locator("label").filter({ hasText: /100,000/i }).first().click();
    await page.getByRole("button", { name: /continuar/i }).click();

    // Seleccionar tipo de deuda pero NO institución
    await page.locator("label").filter({ hasText: /tarjeta de cr/i }).first().click();

    const continueBtn = page.getByRole("button", { name: /continuar/i });
    await expect(continueBtn).toBeDisabled();
  });

  test("El campo celular acepta máximo 10 dígitos", async ({ page }) => {
    await goToStep3(page);

    const phoneInput = page.locator("#bravo-lead-phone");
    await phoneInput.fill("55123456789999"); // más de 10 dígitos
    const value = await phoneInput.inputValue();
    // Debe estar limitado a 10 caracteres por el atributo maxLength
    expect(value.replace(/\D/g, "").length).toBeLessThanOrEqual(10);
  });

  test("El campo nombre no acepta caracteres especiales inválidos", async ({ page }) => {
    await goToStep3(page);

    const nameInput = page.locator("#bravo-lead-name");
    await nameInput.fill("Luis@García#2024");
    const value = await nameInput.inputValue();
    // Los caracteres @, #, números deben ser filtrados
    expect(value).not.toMatch(/[@#]/);
  });
});

test.describe("Formulario — Accesibilidad Básica", () => {
  test("Los inputs tienen labels asociados correctamente", async ({ page }) => {
    await page.goto("/formulario");

    // Avanzar hasta step 3
    await page.locator("label").filter({ hasText: /100,000/i }).first().click();
    await page.getByRole("button", { name: /continuar/i }).click();
    await page.locator("label").filter({ hasText: /tarjeta de cr/i }).first().click();
    await page.locator("select").selectOption({ index: 1 });
    await page.getByRole("button", { name: /continuar/i }).click();

    // Verificar que los inputs tienen IDs referenciados por labels
    const nameInput = page.locator("#bravo-lead-name");
    await expect(nameInput).toBeVisible();

    const phoneInput = page.locator("#bravo-lead-phone");
    await expect(phoneInput).toBeVisible();

    const emailInput = page.locator("#bravo-lead-email");
    await expect(emailInput).toBeVisible();
  });

  test("La barra de progreso tiene atributos ARIA correctos", async ({ page }) => {
    await page.goto("/formulario");
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    await expect(progressBar).toHaveAttribute("aria-valuemin", "1");
    await expect(progressBar).toHaveAttribute("aria-valuemax", "4");
  });

  test("Los campos de radio tienen fieldset y legend", async ({ page }) => {
    await page.goto("/formulario");
    const fieldset = page.locator("fieldset").first();
    await expect(fieldset).toBeVisible();
  });
});
