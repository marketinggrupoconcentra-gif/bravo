(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const DRAFT_KEY = "bravo-prequalification-draft-v2";
  const SUMMARY_KEY = "bravo-prequalification-summary-v2";
  const PRIVACY_URL = "https://bravo-virid.vercel.app/aviso-de-privacidad";

  const icons = {
    arrow: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>',
    check: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.8"/></svg>',
    close: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    lock: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="11" x="5" y="10" rx="2"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10M12 14v3"/></svg>',
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    wallet: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7.5h14a2 2 0 0 1 2 2V19H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h11v4.5"/><path d="M16 12h4v4h-4a2 2 0 1 1 0-4Z"/></svg>',
    alert: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17.5h.01"/></svg>',
  };

  const AMOUNT_RANGES = [
    { value: "under-50", label: "Menos de $50,000", min: 0, max: 49999 },
    { value: "50-75", label: "$50,000 a $74,999", min: 50000, max: 74999 },
    { value: "75-100", label: "$75,000 a $99,999", min: 75000, max: 99999 },
    { value: "100-250", label: "$100,000 a $249,999", min: 100000, max: 249999 },
    { value: "250-500", label: "$250,000 a $499,999", min: 250000, max: 499999 },
    { value: "500-1000", label: "$500,000 a $999,999", min: 500000, max: 999999 },
    { value: "over-1000", label: "$1,000,000 o más", min: 1000000, max: Number.POSITIVE_INFINITY },
  ];

  const DEBT_TYPES = [
    { value: "Tarjeta de crédito", label: "Tarjeta de crédito", state: "standard" },
    { value: "Préstamo personal", label: "Préstamo personal", state: "standard" },
    { value: "Tarjeta departamental", label: "Tarjeta departamental", state: "standard" },
    { value: "Crédito automotriz", label: "Crédito automotriz", state: "review" },
    { value: "Otro", label: "Otro", state: "review" },
  ];

  const INSTITUTIONS = [
    ["Bancos e instituciones", ["BBVA", "Banamex", "Santander", "Banorte", "HSBC", "Scotiabank", "Amex (American Express)", "Nu México", "RappiCard", "Banregio", "Afirme", "Banco del Bajío", "Bradescard", "Compartamos Banco", "CREDOMATIC", "Mercado Crédito", "Didi Préstamos", "Coordinadora Rec (CORESA)", "Crédito Familiar S.A. de C.V.", "Exitus", "GRAFENO", "La Tasa", "PRR", "SICME"]],
    ["Tiendas departamentales", ["Liverpool", "SEARS", "Palacio de Hierro", "Suburbia", "Sanborns", "Bodega Aurrera", "Walmart", "Sam's Club", "Soriana Falabella", "C&A", "Bradescard (C&A, Promoda, Suburbia)"]],
    ["Instituciones financieras", ["Kueski", "Yo te presto", "Kubo Financiero", "Creditea", "Afluenta", "Dimex", "Exitus Nómina", "Crédito Familiar", "Didi Préstamos / Fintech"]],
    ["Crédito automotriz", ["GM Financial", "NR Finance (Nissan / Renault)", "Banamex ALS / Autos", "BBVA Auto", "Banorte Auto", "Santander Auto", "HSBC Auto", "Scotiabank Auto", "BNP Paribas Personal Finance", "Maxicash"]],
    ["Otra", ["Otra institución no listada"]],
  ];

  const STEP_LABELS = ["Monto aproximado", "Tipo e institución", "Datos de contacto", "Revisión"];
  const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);

  const rangeForAmount = (amount) => AMOUNT_RANGES.find((range) => amount >= range.min && amount <= range.max) || AMOUNT_RANGES[0];
  const rangeByValue = (value) => AMOUNT_RANGES.find((range) => range.value === value);
  const debtState = (value) => DEBT_TYPES.find((type) => type.value === value)?.state || "standard";

  const greetingNameFromFullName = (fullName) => {
    const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    const firstName = parts[0];
    // In the usual Mexican full-name format, the final two groups are the
    // paternal and maternal surnames. Particles remain attached, so
    // "José Luis de la Cruz Pérez" becomes "José de la Cruz".
    let surnameStart = parts.length >= 4 ? parts.length - 2 : 1;
    const particles = new Set(["de", "del", "la", "las", "los"]);
    while (surnameStart > 1 && particles.has(parts[surnameStart - 1].toLocaleLowerCase("es-MX"))) surnameStart -= 1;
    const surnameParts = parts.length >= 4 ? parts.slice(surnameStart, parts.length - 1) : parts.slice(1, 2);
    const titleCase = (part) => part.split(/([-'])/).map((piece) => {
      if (piece === "-" || piece === "'") return piece;
      return piece ? piece.charAt(0).toLocaleUpperCase("es-MX") + piece.slice(1).toLocaleLowerCase("es-MX") : "";
    }).join("");
    const formattedSurname = surnameParts.map((part, index) => {
      const lower = part.toLocaleLowerCase("es-MX");
      return index < surnameParts.length - 1 && particles.has(lower) ? lower : titleCase(part);
    });
    return [titleCase(firstName), ...formattedSurname].filter(Boolean).join(" ");
  };

  function readSession(key) {
    try { return JSON.parse(window.sessionStorage.getItem(key) || "null"); }
    catch { return null; }
  }

  function writeSession(key, value) {
    try { window.sessionStorage.setItem(key, JSON.stringify(value)); }
    catch { /* The experience remains functional when storage is unavailable. */ }
  }

  function setupMenu() {
    const toggle = $(".menu-toggle");
    const navigation = $("#mobile-navigation");
    const header = $(".site-header");
    if (!toggle || !navigation || !header) return;
    let hideTimer;

    const setMenu = (open) => {
      window.clearTimeout(hideTimer);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      toggle.innerHTML = open ? icons.close : icons.menu;
      document.body.classList.toggle("menu-open", open);
      if (open) {
        navigation.hidden = false;
        requestAnimationFrame(() => navigation.classList.add("is-open"));
      } else {
        navigation.classList.remove("is-open");
        hideTimer = window.setTimeout(() => { if (toggle.getAttribute("aria-expanded") === "false") navigation.hidden = true; }, 190);
      }
    };

    toggle.addEventListener("click", (event) => { event.stopPropagation(); setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    navigation.addEventListener("click", (event) => { if (event.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });
    document.addEventListener("click", (event) => { if (toggle.getAttribute("aria-expanded") === "true" && !header.contains(event.target)) setMenu(false); });
    window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => { if (event.matches) setMenu(false); });
    setMenu(false);
  }

  function setupRevealAnimations() {
    const elements = $$(".reveal");
    if (!elements.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight * 0.88) {
        element.classList.add("will-reveal");
        observer.observe(element);
      } else element.classList.add("is-visible");
    });
  }

  function setupSectionFocus() {
    // The trust bar is intentionally excluded: its short height means the
    // viewport centre never reaches it, so it could remain blurred on scroll.
    const sections = $$("main > section:not(.trust-bar)");
    if (!sections.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    sections.forEach((section) => section.classList.add("focus-section"));
    document.documentElement.classList.add("focus-effects");
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = window.innerHeight * 0.5;
        const visible = sections.filter((section) => {
          const rect = section.getBoundingClientRect();
          return rect.bottom > 70 && rect.top < window.innerHeight - 35;
        });
        if (!visible.length) return;
        const active = visible.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= center && rect.bottom >= center;
        }) || visible[0];
        sections.forEach((section) => {
          section.classList.toggle("is-focus-section", section === active);
          section.classList.toggle("is-muted-section", visible.includes(section) && section !== active);
        });
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    sections.forEach((section) => section.addEventListener("focusin", () => {
      sections.forEach((item) => item.classList.toggle("is-focus-section", item === section));
    }));
    update();
  }

  function setupFaqAccordion() {
    const list = $(".faq-list");
    if (!list) return;
    const items = $$("details", list);

    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item && other.open) other.open = false;
        });
      });
    });
  }

  function setupScrollProgress() {
    const progress = document.createElement("span");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.append(progress);
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function setupStickyCta() {
    const sticky = $(".mobile-sticky-cta");
    const form = $("#precalificar");
    if (!sticky || !form || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(([entry]) => sticky.classList.toggle("is-hidden", entry.isIntersecting), { threshold: 0.12 }).observe(form);
  }

  function setupSimulator() {
    const simulator = $("#simulador");
    const slider = simulator && $("#debt-simulator", simulator);
    if (!simulator || !slider) return;

    const stored = readSession(DRAFT_KEY);
    let selectedAmount = Number(stored?.estimatedAmount || slider.value);
    let selectedTerm = Number(stored?.preferredTerm || 22);
    const amountOutput = $("#simulator-amount", simulator);
    const resultAmount = $("#simulator-result-amount", simulator);
    const resultTerm = $("#simulator-result-term", simulator);
    const resultRange = $("#simulator-result-range", simulator);
    const quickAmounts = $$('[data-sim-amount]', simulator);
    const termButtons = $$('[data-sim-term]', simulator);
    const useButton = $("[data-use-simulator]", simulator);
    const savedMessage = $("[data-simulator-saved]", simulator);

    const updateAmount = (nextAmount) => {
      selectedAmount = Math.min(Number(slider.max), Math.max(Number(slider.min), Number(nextAmount)));
      slider.value = String(selectedAmount);
      slider.style.setProperty("--simulator-progress", `${((selectedAmount - Number(slider.min)) / (Number(slider.max) - Number(slider.min))) * 100}%`);
      const formatted = currency.format(selectedAmount);
      slider.setAttribute("aria-valuetext", `${formatted} pesos mexicanos`);
      amountOutput.textContent = formatted;
      resultAmount.textContent = formatted;
      resultRange.textContent = rangeForAmount(selectedAmount).label;
      quickAmounts.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.simAmount) === selectedAmount)));
      if (savedMessage) savedMessage.hidden = true;
    };

    const updateTerm = (term) => {
      selectedTerm = Number(term);
      resultTerm.textContent = `${selectedTerm} meses`;
      termButtons.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.simTerm) === selectedTerm)));
      if (savedMessage) savedMessage.hidden = true;
    };

    slider.addEventListener("input", () => updateAmount(slider.value));
    quickAmounts.forEach((button) => button.addEventListener("click", () => updateAmount(button.dataset.simAmount)));
    termButtons.forEach((button) => button.addEventListener("click", () => updateTerm(button.dataset.simTerm)));
    useButton?.addEventListener("click", () => {
      const range = rangeForAmount(selectedAmount);
      const draft = { ...(readSession(DRAFT_KEY) || {}), amount: range.value, estimatedAmount: selectedAmount, preferredTerm: selectedTerm, amountSource: "simulator" };
      writeSession(DRAFT_KEY, draft);
      window.dispatchEvent(new CustomEvent("bravo:simulator-selection", { detail: draft }));
      if (savedMessage) savedMessage.hidden = false;
      useButton.textContent = "Datos agregados";
      window.setTimeout(() => { useButton.textContent = "Usar estos datos en mi precalificación"; }, 1800);
    });

    updateAmount(selectedAmount);
    updateTerm(selectedTerm);
  }

  function setupQualificationForm() {
    const form = $(".qualification-form");
    if (!form) return;

    const stored = readSession(DRAFT_KEY) || {};
    let step = 1;
    let screen = "form";
    let submitting = false;
    let errors = {};
    let values = {
      amount: stored.amount || "",
      estimatedAmount: Number(stored.estimatedAmount || 0) || null,
      preferredTerm: Number(stored.preferredTerm || 0) || null,
      amountSource: stored.amountSource || "manual",
      debtType: "",
      institution: "",
      name: "",
      phone: "",
      email: "",
      consent: false,
    };

    const persistNonSensitiveDraft = () => writeSession(DRAFT_KEY, {
      amount: values.amount,
      estimatedAmount: values.estimatedAmount,
      preferredTerm: values.preferredTerm,
      amountSource: values.amountSource,
    });

    const error = (key, id) => errors[key] ? `<p class="field-error" id="${id}" role="alert">${errors[key]}</p>` : "";
    const card = (name, value, label) => {
      const selected = values[name] === value;
      return `<label class="selection-card ${selected ? "is-selected" : ""}"><input type="radio" name="${name}" value="${escapeHtml(value)}" ${selected ? "checked" : ""}/><span>${escapeHtml(label)}</span><span class="selection-check" aria-hidden="true">${icons.check}</span></label>`;
    };

    const progress = () => `<div class="form-progress" aria-label="Paso ${step} de 4: ${STEP_LABELS[step - 1]}"><div class="progress-meta"><span>Paso ${step} de 4</span><span>${STEP_LABELS[step - 1]}</span></div><div class="progress-track" role="progressbar" aria-valuemin="1" aria-valuemax="4" aria-valuenow="${step}" aria-label="Progreso de la precalificación"><span style="width:${step * 25}%"></span></div></div>`;

    const filteredInstitutionGroups = () => {
      const allowed = values.debtType === "Tarjeta departamental" ? ["Tiendas departamentales", "Otra"]
        : values.debtType === "Crédito automotriz" ? ["Crédito automotriz", "Otra"]
          : ["Bancos e instituciones", "Instituciones financieras", "Otra"];
      return INSTITUTIONS.filter(([label]) => values.debtType === "Otro" || allowed.includes(label));
    };

    const institutionOptions = () => filteredInstitutionGroups().map(([label, options]) => `<optgroup label="${escapeHtml(label)}">${options.map((option) => `<option value="${escapeHtml(option)}" ${values.institution === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</optgroup>`).join("");

    const simulatorContext = () => {
      if (values.amountSource !== "simulator" || !values.estimatedAmount) return "";
      return `<div class="simulator-transfer bravo-status" data-state="info" data-simulator-transfer><span aria-hidden="true">↗</span><div><strong>Datos traídos del simulador</strong><p>${currency.format(values.estimatedAmount)}${values.preferredTerm ? ` · ${values.preferredTerm} meses` : ""}. Puedes cambiar el rango si lo necesitas.</p></div></div>`;
    };

    const reviewNotice = () => debtState(values.debtType) === "review"
      ? `<div class="eligibility-note bravo-status" data-state="review">${icons.alert}<div><strong>Este producto requiere validación individual</strong><p>Puedes continuar. Un asesor confirmará si esta deuda puede incluirse y te explicará las alternativas disponibles.</p></div></div>`
      : "";

    const stepMarkup = () => {
      if (step === 1) {
        return `<div class="form-heading"><p class="eyebrow">Primero, lo esencial</p><h2>¿Aproximadamente cuánto debes en total?</h2><p>Los rangos no se traslapan; cada monto corresponde a una sola opción.</p></div>${simulatorContext()}<fieldset class="selection-grid amount-grid" tabindex="-1" aria-invalid="${Boolean(errors.amount)}"><legend class="sr-only">Monto total aproximado de deuda</legend>${AMOUNT_RANGES.map((range) => card("amount", range.value, range.label)).join("")}</fieldset>${error("amount", "amount-error")}`;
      }

      if (step === 2) {
        return `<div class="form-heading"><p class="eyebrow">Tu situación</p><h2>¿Cuál es tu deuda principal?</h2><p>Elige el producto con mayor saldo y después dinos con quién lo tienes.</p></div><fieldset class="selection-grid debt-grid" tabindex="-1" aria-invalid="${Boolean(errors.debtType)}"><legend class="sr-only">Tipo de deuda principal</legend>${DEBT_TYPES.map((type) => card("debtType", type.value, type.label)).join("")}</fieldset>${error("debtType", "debt-type-error")}<div data-review-notice>${reviewNotice()}</div><div class="field-group"><label for="institution">¿Con quién tienes esta deuda? <span aria-hidden="true">*</span></label><select id="institution" ${values.debtType ? "" : "disabled"} aria-invalid="${Boolean(errors.institution)}"><option value="">${values.debtType ? "Elige una institución" : "Primero elige el tipo de deuda"}</option>${institutionOptions()}</select><p class="field-help">Si tienes varias, elige la que representa el mayor saldo.</p>${error("institution", "institution-error")}</div>`;
      }

      if (step === 3) {
        return `<div class="form-heading"><p class="eyebrow">Datos de contacto</p><h2>¿Cómo podemos contactarte?</h2><p>Un asesor revisará lo que compartiste y se comunicará para explicar qué alternativas podrían aplicar.</p></div><div class="personal-fields"><div class="field-group"><label for="name">Nombre completo <span aria-hidden="true">*</span></label><input id="name" name="name" type="text" autocomplete="name" placeholder="Tu nombre completo" value="${escapeHtml(values.name)}" aria-invalid="${Boolean(errors.name)}"/>${error("name", "name-error")}</div><div class="field-group"><label for="phone">Celular <span aria-hidden="true">*</span></label><input id="phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="10" placeholder="Ej. 5512345678" value="${escapeHtml(values.phone)}" aria-invalid="${Boolean(errors.phone)}"/><p class="field-help"><span id="phone-count">${values.phone.length}</span>/10 dígitos, sin espacios.</p>${error("phone", "phone-error")}</div><div class="field-group"><label for="email">Correo electrónico <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="ejemplo@correo.com" value="${escapeHtml(values.email)}" aria-invalid="${Boolean(errors.email)}"/>${error("email", "email-error")}</div></div>`;
      }

      const amountLabel = rangeByValue(values.amount)?.label || "";
      const rows = [
        ...(values.estimatedAmount ? [["Deuda aproximada", currency.format(values.estimatedAmount), 1]] : []),
        ["Rango de evaluación", amountLabel, 1],
        ...(values.preferredTerm ? [["Plazo preferido", `${values.preferredTerm} meses`, 1]] : []),
        ["Tipo de deuda", values.debtType, 2], ["Institución", values.institution, 2],
        ["Nombre", values.name, 3], ["Celular", values.phone.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3"), 3], ["Correo", values.email, 3],
      ];
      return `<div class="form-heading"><p class="eyebrow">Último paso</p><h2>Revisa tus datos antes de enviar</h2><p>Confirma que la información sea correcta. Ninguna alternativa está aprobada todavía.</p></div>${reviewNotice()}<dl class="review-list">${rows.map(([term, value, editStep]) => `<div><dt>${term}</dt><dd>${escapeHtml(value)}</dd><button type="button" data-action="edit" data-step="${editStep}">Editar</button></div>`).join("")}</dl><label class="consent ${errors.consent ? "has-error" : ""}"><input id="consent" type="checkbox" ${values.consent ? "checked" : ""}/><span>Acepto el <a href="${PRIVACY_URL}">Aviso de Privacidad</a> y que un asesor me contacte para revisar mi caso.</span></label>${error("consent", "consent-error")}`;
    };

    const isStepReady = () => {
      if (step === 1) return Boolean(values.amount);
      if (step === 2) return Boolean(values.debtType && values.institution);
      if (step === 3) return values.name.trim().length >= 2 && /^\d{10}$/.test(values.phone) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
      return values.consent;
    };

    const render = () => {
      if (screen === "ineligible") {
        form.innerHTML = `<div class="form-state form-state-ineligible" role="status"><span class="state-icon muted" aria-hidden="true">${icons.wallet}</span><p class="eyebrow">Fuera del monto inicial</p><h2>Este programa comienza a partir de $50,000 MXN</h2><p>Tu respuesta se conserva para que puedas modificarla. Si el total de tus deudas es menor, puedes consultar recursos para ordenar pagos o hablar directamente con tu institución.</p><div class="state-detail"><strong>Tu respuesta</strong><span>${escapeHtml(rangeByValue(values.amount)?.label || "Menos de $50,000")}</span></div><div class="state-actions"><button class="button" type="button" data-action="modify">Modificar el monto</button><a class="button button-secondary" href="https://bravo-virid.vercel.app/recursos">Ver recursos ${icons.arrow}</a></div></div>`;
        return;
      }
      if (screen === "error") {
        form.innerHTML = `<div class="form-state form-state-error" role="alert"><span class="state-icon error" aria-hidden="true">${icons.alert}</span><p class="eyebrow">No se pudo completar el envío</p><h2>Tus respuestas siguen aquí</h2><p>No perdimos la información del formulario. Revisa tu conexión e inténtalo de nuevo; si el problema continúa, vuelve a la revisión.</p><div class="state-actions"><button class="button" type="button" data-action="retry">Intentar de nuevo</button><button class="button button-secondary" type="button" data-action="review">Volver a revisar</button></div></div>`;
        return;
      }
      const actionDisabled = submitting || !isStepReady();
      form.innerHTML = `${progress()}<div class="step-panel">${stepMarkup()}</div><div class="form-actions">${step > 1 ? '<button class="button button-secondary" type="button" data-action="back">Atrás</button>' : ""}<button class="button button-primary" type="button" data-action="${step === 4 ? "submit" : "next"}" ${actionDisabled ? "disabled" : ""} aria-busy="${submitting}">${submitting ? '<span class="spinner"></span> Enviando…' : step === 4 ? "Solicitar evaluación" : `Continuar ${icons.arrow}`}</button></div><p class="privacy-microcopy">${icons.lock} Usaremos tus datos para revisar tu caso y dar seguimiento conforme al <a href="${PRIVACY_URL}">Aviso de Privacidad</a>.</p>`;
    };

    const syncActionState = () => {
      const actionButton = $("[data-action='next'], [data-action='submit']", form);
      if (actionButton) actionButton.disabled = submitting || !isStepReady();
    };

    const updateRadioCards = (name) => {
      $$(`input[name="${name}"]`, form).forEach((input) => {
        const selected = input.value === values[name];
        input.checked = selected;
        input.closest(".selection-card")?.classList.toggle("is-selected", selected);
      });
    };

    const clearFieldError = (fieldSelector, errorSelector) => {
      $(fieldSelector, form)?.setAttribute("aria-invalid", "false");
      $(errorSelector, form)?.remove();
    };

    const updateDebtDependencies = () => {
      const notice = $("[data-review-notice]", form);
      if (notice) notice.innerHTML = reviewNotice();
      const select = $("#institution", form);
      if (!select) return;
      select.disabled = !values.debtType;
      select.innerHTML = `<option value="">${values.debtType ? "Elige una institución" : "Primero elige el tipo de deuda"}</option>${institutionOptions()}`;
      select.value = values.institution;
      select.setAttribute("aria-invalid", "false");
    };

    const focusError = (selector) => requestAnimationFrame(() => {
      const element = $(selector, form);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      element?.focus({ preventScroll: true });
    });

    const next = () => {
      errors = {};
      if (step === 1) {
        if (!values.amount) errors.amount = "Selecciona una opción para continuar.";
        else if (values.amount === "under-50") screen = "ineligible";
        else step = 2;
      } else if (step === 2) {
        if (!values.debtType) errors.debtType = "Selecciona el tipo de deuda principal.";
        if (!values.institution) errors.institution = "Selecciona la institución para continuar.";
        if (!Object.keys(errors).length) step = 3;
      } else if (step === 3) {
        if (values.name.trim().length < 2) errors.name = "Ingresa tu nombre completo para continuar.";
        if (!/^\d{10}$/.test(values.phone)) errors.phone = "Ingresa un celular válido de 10 dígitos.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Ingresa un correo válido.";
        if (!Object.keys(errors).length) step = 4;
      }
      render();
      if (errors.amount || errors.debtType) focusError("fieldset");
      else if (errors.institution) focusError("#institution");
      else if (errors.name) focusError("#name");
      else if (errors.phone) focusError("#phone");
      else if (errors.email) focusError("#email");
    };

    const submitLead = async () => {
      values.consent = Boolean($("#consent", form)?.checked || values.consent);
      if (!values.consent) {
        errors = { consent: "Acepta el Aviso de Privacidad para solicitar la evaluación." };
        render();
        focusError("#consent");
        return;
      }
      submitting = true;
      errors = {};
      screen = "form";
      render();
      const payload = {
        amountRange: values.amount,
        estimatedAmount: values.estimatedAmount,
        preferredTerm: values.preferredTerm,
        debtType: values.debtType,
        institution: values.institution,
        name: values.name.trim(),
        phone: values.phone,
        email: values.email.trim(),
        consent: values.consent,
        source: values.amountSource,
      };
      try {
        const endpoint = form.dataset.endpoint?.trim();
        if (endpoint) {
          const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
          if (!response.ok) throw new Error("Lead endpoint rejected the request");
        } else {
          await new Promise((resolve) => window.setTimeout(resolve, 750));
          if (new URLSearchParams(window.location.search).get("estado") === "error") throw new Error("Simulated error state");
        }
        writeSession(SUMMARY_KEY, {
          displayName: greetingNameFromFullName(values.name),
          amountRange: rangeByValue(values.amount)?.label || "",
          estimatedAmount: values.estimatedAmount,
          preferredTerm: values.preferredTerm,
          debtType: values.debtType,
          institution: values.institution,
          requiresReview: debtState(values.debtType) === "review",
        });
        window.location.assign("./gracias.html");
      } catch {
        submitting = false;
        screen = "error";
        render();
      }
    };

    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("input", (event) => {
      const target = event.target;
      if (target.matches("#name")) values.name = target.value;
      if (target.matches("#phone")) {
        values.phone = target.value.replace(/\D/g, "").slice(0, 10);
        target.value = values.phone;
        const counter = $("#phone-count", form);
        if (counter) counter.textContent = String(values.phone.length);
      }
      if (target.matches("#email")) values.email = target.value;
      syncActionState();
    });

    form.addEventListener("change", (event) => {
      const target = event.target;
      if (target.matches('input[name="amount"]')) {
        values.amount = target.value;
        values.estimatedAmount = null;
        values.amountSource = "manual";
        persistNonSensitiveDraft();
        updateRadioCards("amount");
        $("[data-simulator-transfer]", form)?.remove();
        clearFieldError("fieldset", "#amount-error");
      }
      if (target.matches('input[name="debtType"]')) {
        values.debtType = target.value;
        values.institution = "";
        updateRadioCards("debtType");
        clearFieldError("fieldset", "#debt-type-error");
        $("#institution-error", form)?.remove();
        updateDebtDependencies();
      }
      if (target.matches("#institution")) {
        values.institution = target.value;
        clearFieldError("#institution", "#institution-error");
      }
      if (target.matches("#consent")) {
        values.consent = target.checked;
        target.closest(".consent")?.classList.remove("has-error");
        $("#consent-error", form)?.remove();
      }
      errors = {};
      syncActionState();
    });

    form.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      if (action === "next") next();
      if (action === "back") { step = Math.max(1, step - 1); errors = {}; render(); }
      if (action === "edit") { step = Number(button.dataset.step); errors = {}; render(); }
      if (action === "modify") { step = 1; screen = "form"; errors = {}; render(); }
      if (action === "review") { step = 4; screen = "form"; errors = {}; render(); }
      if (action === "submit" || action === "retry") void submitLead();
    });

    window.addEventListener("bravo:simulator-selection", (event) => {
      const amount = Number(event.detail?.estimatedAmount || 0);
      values.amount = rangeForAmount(amount).value;
      values.estimatedAmount = amount;
      values.preferredTerm = Number(event.detail?.preferredTerm || 0) || null;
      values.amountSource = "simulator";
      step = 1;
      screen = "form";
      errors = {};
      persistNonSensitiveDraft();
      render();
      requestAnimationFrame(() => {
        $("#precalificar")?.scrollIntoView({ behavior: "smooth", block: "center" });
        $('input[name="amount"]:checked', form)?.focus({ preventScroll: true });
      });
    });

    render();
  }

  function setupThankYouSummary() {
    const target = $("[data-thanks-summary]");
    if (!target) return;
    const summary = readSession(SUMMARY_KEY);
    if (!summary) {
      target.hidden = true;
      return;
    }
    const title = $("[data-thanks-title]");
    if (title && summary.displayName) {
      title.textContent = `Gracias, ${summary.displayName}. Tu revisión inicial ya está en camino.`;
    }
    const rows = [
      ...(summary.estimatedAmount ? [["Monto aproximado", currency.format(summary.estimatedAmount)]] : []),
      ["Rango", summary.amountRange],
      ...(summary.preferredTerm ? [["Plazo preferido", `${summary.preferredTerm} meses`]] : []),
      ["Deuda principal", summary.debtType],
      ["Institución", summary.institution],
    ];
    target.innerHTML = `<p class="eyebrow">Resumen enviado</p><dl>${rows.map(([key, value]) => `<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>${summary.requiresReview ? '<p class="bravo-status" data-state="review">Tu tipo de deuda requiere validación individual; el asesor lo confirmará durante el seguimiento.</p>' : ""}`;
    target.hidden = false;
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
    setupQualificationForm();
    setupSimulator();
    setupThankYouSummary();
    setupRevealAnimations();
    setupSectionFocus();
    setupFaqAccordion();
    setupStickyCta();
    setupScrollProgress();
  });
})();
