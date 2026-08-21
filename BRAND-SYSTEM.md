# Bravo Digital Brand System — V3 Impact

Este paquete aterriza la identidad observada en la referencia oficial de Bravo a componentes web reutilizables. Los activos incluidos se obtuvieron de la URL proporcionada para mantener consistencia visual.

## Dirección responsive

La versión mobile no es una reducción del escritorio. Utiliza un hero inmersivo en violeta, chips horizontales, formulario blanco superpuesto, navegación de pantalla completa y secciones explorables por gesto. En escritorio, el hero se divide entre narrativa de marca y la superficie de conversión para dar mayor jerarquía al formulario.

## Fundamentos

- Display: **Figtree**, 800 para titulares principales.
- Texto: stack nativo de sistema para rendimiento y legibilidad.
- Editorial opcional: **Source Serif 4**.
- Primario: `#5B2C72`.
- Oscuro: `#2E1739`.
- Acento: `#5ECBDB`.
- Página: `#F1EEF3`.
- Tinta: `#17131F`.
- Bordes: `#E7E3EC` y `#C9C1D4`.

Todos los valores viven como variables `--bravo-*` en `brand-system.css`.

## Componentes base

- `.brand-logo-lockup`: contenedor oficial oscuro para el logo blanco.
- `.button`, `.button-secondary`, `.button-light`: jerarquía de acciones.
- `.selection-card`: opción de selección para monto y tipo de deuda.
- `.field-group`: label, input/select, ayuda, error y foco visible.
- `.bravo-status[data-state]`: estados `info`, `success`, `review` y `error`.
- `.form-shell`: tarjeta de flujo con borde de 20 px.

## Estados funcionales

| Estado | Cuándo aparece | Acción principal |
| --- | --- | --- |
| Listo para continuar | El paso actual está completo | Continuar |
| Fuera de monto | Deuda menor a $50,000 | Modificar monto / ver recursos |
| Revisión individual | Crédito automotriz u “otro” | Continuar y confirmar con asesor |
| Error de envío | El endpoint rechaza o falla | Reintentar sin perder respuestas |
| Confirmación | Envío exitoso | Ver siguientes pasos |

## Regla única de rangos

Los mismos rangos se usan en simulador, formulario, revisión y confirmación:

- Menos de $50,000.
- $50,000 a $74,999.
- $75,000 a $99,999.
- $100,000 a $249,999.
- $250,000 a $499,999.
- $500,000 a $999,999.
- $1,000,000 o más.

La definición vive una sola vez en `AMOUNT_RANGES`, dentro de `script.js`.

## Datos y privacidad

El borrador de sesión guarda únicamente monto, rango y plazo preferido. Nombre, teléfono y correo permanecen en memoria durante el formulario y no se guardan en `sessionStorage`. La página de gracias muestra solo información financiera no sensible del resumen.

## Integración con el producto existente

El formulario permite definir `data-endpoint`. Con una URL válida envía un `POST` JSON y redirige a `gracias.html` únicamente tras una respuesta exitosa. El payload conserva:

- `amountRange`
- `estimatedAmount`
- `preferredTerm`
- `debtType`
- `institution`
- `name`
- `phone`
- `email`
- `consent`
- `source`

Web/SEO permanece en `index.html`; estados y validación viven en `script.js`; la identidad reutilizable está separada en `brand-system.css`.

## Pendientes de negocio/legal

La V2 evita convertir supuestos en promesas finales. Antes de producción se deben validar: alcance exacto del crédito automotriz, tipos de deuda aceptados, textos sobre Buró, tiempos de contacto y condiciones comerciales.
