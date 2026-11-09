/* Stack: cada tecnologia com a camada, o anel (0 núcleo, 1 produção, 2 experiência) e onde foi usada. */
(() => {
  const CTX = {
    saas:   { pt: "Plataforma SaaS", en: "SaaS platform", kind: "p" },
    events: { pt: "App de eventos", en: "Events app", kind: "p" },
    mei:    { pt: "Automação fiscal", en: "Tax automation", kind: "p" },
    game:   { pt: "Jogo corporativo", en: "Corporate game", kind: "p" },
    nba:    { pt: "Estatística de basquete", en: "Basketball stats", kind: "p" },
    bots:   { pt: "Bots de Telegram", en: "Telegram bots", kind: "p" },
    gft:    { pt: "GFT", en: "GFT", kind: "c" },
    inm:    { pt: "Inmetrics", en: "Inmetrics", kind: "c" },
    zap:    { pt: "Zappts", en: "Zappts", kind: "c" },
    ipp:    { pt: "IPPLAN", en: "IPPLAN", kind: "c" },
    hur:    { pt: "Hurmez", en: "Hurmez", kind: "c" },
    tria:   { pt: "Tria Software", en: "Tria Software", kind: "c" },
    cog:    { pt: "Cognizant", en: "Cognizant", kind: "c" }
  };
  const GROUPS = {
    front:   { pt: "Frontend", en: "Frontend" },
    back:    { pt: "Backend", en: "Backend" },
    data:    { pt: "Dados", en: "Data" },
    cloud:   { pt: "Cloud e DevOps", en: "Cloud & DevOps" },
    ai:      { pt: "IA", en: "AI" },
    quality: { pt: "Qualidade", en: "Quality" }
  };
  const RINGS = [
    { pt: "Núcleo", en: "Core", d: { pt: "o que uso todo dia", en: "what I use every day" } },
    { pt: "Produção", en: "Production", d: { pt: "em sistemas no ar", en: "in live systems" } },
    { pt: "Experiência", en: "Experience", d: { pt: "projetos e empresas anteriores", en: "past projects and companies" } }
  ];
  const TECH = [
    ["Angular", "front", 0, ["saas", "game", "nba", "gft", "inm", "tria"]],
    ["TypeScript", "front", 0, ["saas", "events", "game", "gft", "zap", "tria"]],
    ["React Native", "front", 1, ["events"]],
    ["Expo", "front", 1, ["events"]],
    ["Microfrontends", "front", 1, ["gft"]],
    ["RxJS", "front", 1, ["saas", "gft"]],
    ["Tailwind CSS", "front", 1, ["saas"]],
    ["JavaScript", "front", 1, ["gft", "ipp", "hur", "tria"]],
    ["AngularJS", "front", 2, ["hur", "tria"]],
    ["Vue.js", "front", 2, ["hur"]],
    ["React", "front", 2, []],
    ["Node.js", "back", 0, ["saas", "events", "mei", "game", "gft", "inm", "zap"]],
    [".NET / C#", "back", 0, ["gft", "inm", "ipp", "hur", "tria"]],
    ["Express", "back", 1, ["saas", "gft", "zap"]],
    ["Fastify", "back", 1, ["events"]],
    ["Zod", "back", 1, ["events"]],
    ["Python", "back", 1, ["saas", "mei", "nba"]],
    ["Entity Framework", "back", 2, ["gft", "inm", "ipp", "hur", "tria"]],
    ["Java", "back", 2, ["tria", "cog"]],
    ["Spring Boot", "back", 2, ["tria", "cog"]],
    ["VB.NET", "back", 2, ["tria"]],
    ["VB6", "back", 2, ["inm", "tria"]],
    ["PostgreSQL", "data", 1, ["events", "gft", "tria"]],
    ["PostGIS", "data", 1, ["events"]],
    ["MongoDB", "data", 1, ["saas", "ipp", "hur"]],
    ["Redis", "data", 1, ["saas", "events"]],
    ["SQL Server", "data", 2, ["gft", "ipp", "hur", "tria"]],
    ["Oracle", "data", 2, ["gft", "ipp", "hur", "tria"]],
    ["DynamoDB", "data", 2, ["gft", "zap"]],
    ["Docker", "cloud", 0, ["saas", "events", "mei", "gft"]],
    ["GitHub Actions", "cloud", 1, ["saas", "events", "gft"]],
    ["AWS", "cloud", 1, ["gft", "zap"]],
    ["Serverless", "cloud", 1, ["zap", "hur"]],
    ["Nginx", "cloud", 1, ["saas", "events", "mei"]],
    ["Kong", "cloud", 1, ["saas"]],
    ["Linux", "cloud", 1, ["saas", "events", "mei"]],
    ["Azure", "cloud", 2, []],
    ["Kubernetes", "cloud", 2, []],
    ["Telegram Bot API", "back", 1, ["bots", "saas"]],
    ["Claude API", "ai", 1, ["saas", "events"]],
    ["LLMs · Prompt", "ai", 1, ["saas", "events"]],
    ["Visão multimodal", "ai", 1, ["saas", "events"]],
    ["Playwright", "quality", 1, ["saas", "events", "mei"]],
    ["Vitest", "quality", 1, ["saas", "events"]],
    ["Jest", "quality", 2, ["gft", "hur"]],
    ["JUnit", "quality", 2, ["ipp", "hur"]],
    ["Cypress", "quality", 2, ["gft"]],
    ["Selenium", "quality", 2, ["mei", "tria", "cog"]],
    ["Appium", "quality", 2, ["cog"]]
  ].map(([n, g, r, u], i) => ({ id: "t" + i, n, g, r, u }));
  const NAME_EN = { "Visão multimodal": "Multimodal vision" };
  /* De onde vem o texto de cada lugar (os projetos e as experiências do content.js). */
  const SRC = { saas: ["p", 0], events: ["p", 1], mei: ["p", 2], gft: ["j", 1], inm: ["j", 2], zap: ["j", 3], ipp: ["j", 4], hur: ["j", 5], tria: ["j", 6], cog: ["j", 7] };
  const L = {
    pt: { c: "Onde usei", d: "Destaques", e: "Cartão", other: "outros projetos", products: "Produtos", companies: "Empresas",
          hintC: "Passe o mouse num projeto ou empresa para ver a stack dele, ou numa tecnologia para ver onde a usei.",
          hintD: "Escolha um projeto ou empresa para destacar as principais tecnologias que usei lá.",
          main: "Principais tecnologias", allStack: "Stack completa", pickD: "Toda a stack" },
    en: { c: "Where I used it", d: "Highlights", e: "Card", other: "other projects", products: "Products", companies: "Companies",
          hintC: "Hover a project or company to see its stack, or a technology to see where I used it.",
          hintD: "Pick a project or company to highlight the main technologies I used there.",
          main: "Main technologies", allStack: "Full stack", pickD: "The whole stack" }
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const nm = (t, lang) => (lang === "en" && NAME_EN[t.n]) || t.n;
  const techsOf = k => TECH.filter(t => t.u.includes(k));

  let view = "d", picked = "saas";
  try { const v = localStorage.getItem("stackView3"); if (v === "c" || v === "d") view = v; } catch (e) {}

  const ctxList = (lang, sel) => kind => Object.keys(CTX).filter(k => CTX[k].kind === kind).map(k =>
    `<button type="button" class="sv-ctx${k === sel ? " on" : ""}" data-c="${k}">${esc(CTX[k][lang])}<span class="mono">${techsOf(k).length}</span></button>`).join("");
  const ctxColumn = (lang, sel) => { const l = ctxList(lang, sel); return `<div class="sv-ctxs"><span class="mono k">${esc(L[lang].products)}</span>${l("p")}<span class="mono k" style="margin-top:18px">${esc(L[lang].companies)}</span>${l("c")}</div>`; };
  const chipGrid = (lang, isOn) => `<div class="sv-chips">${Object.keys(GROUPS).map(g => `<div class="sv-grp"><span class="mono k">${esc(GROUPS[g][lang])}</span><div>${TECH.filter(t => t.g === g).map(t => `<button type="button" class="sv-chip${isOn && isOn(t) ? " on" : ""}" data-t="${t.id}">${esc(nm(t, lang))}</button>`).join("")}</div></div>`).join("")}</div>`;

  /* C: a original, que apaga o resto */
  function viewC(lang) {
    return `<div class="sv-c">${ctxColumn(lang)}${chipGrid(lang)}</div><p class="sv-hint mono">${esc(L[lang].hintC)}</p>`;
  }

  /* C2: destaca sem apagar nada */
  function viewD(lang) {
    const sel = picked;
    const title = sel ? L[lang].main + " · " + CTX[sel][lang] : L[lang].pickD;
    return `<div class="sv-c sv-d">${ctxColumn(lang, sel)}<div><span class="mono sv-d-t" id="svd-t">${esc(title)}</span>${chipGrid(lang, sel ? t => t.u.includes(sel) : null)}</div></div><p class="sv-hint mono">${esc(L[lang].hintD)}</p>`;
  }

  function bind(lang) {
    const root = document.getElementById("stack-view");
    const ctxs = root.querySelectorAll(".sv-ctx"), chips = root.querySelectorAll(".sv-chip");
    if (view === "c") {
      const clear = () => { chips.forEach(c => c.classList.remove("on", "off")); ctxs.forEach(c => c.classList.remove("on", "off")); };
      ctxs.forEach(b => {
        const on = () => { clear(); b.classList.add("on"); ctxs.forEach(c => c !== b && c.classList.add("off")); chips.forEach(c => c.classList.add(TECH.find(t => t.id === c.dataset.t).u.includes(b.dataset.c) ? "on" : "off")); };
        b.addEventListener("mouseenter", on); b.addEventListener("focus", on); b.addEventListener("click", on);
      });
      chips.forEach(b => {
        const on = () => { const t = TECH.find(x => x.id === b.dataset.t); clear(); b.classList.add("on"); chips.forEach(c => c !== b && c.classList.add("off")); ctxs.forEach(c => c.classList.add(t.u.includes(c.dataset.c) ? "on" : "off")); };
        b.addEventListener("mouseenter", on); b.addEventListener("focus", on); b.addEventListener("click", on);
      });
      root.querySelector(".sv-c").addEventListener("mouseleave", clear);
    }
    if (view === "d") {
      ctxs.forEach(b => b.addEventListener("click", () => {
        picked = picked === b.dataset.c ? null : b.dataset.c;
        ctxs.forEach(c => c.classList.toggle("on", c.dataset.c === picked));
        chips.forEach(c => c.classList.toggle("on", !!picked && TECH.find(t => t.id === c.dataset.t).u.includes(picked)));
        root.querySelector("#svd-t").textContent = picked ? L[lang].main + " · " + CTX[picked][lang] : L[lang].pickD;
      }));
    }
  }

  window.renderStack = function (lang) {
    const sw = document.getElementById("stack-switch");
    if (sw) {
      sw.innerHTML = ["d", "c"].map(v => `<button type="button" class="${v === view ? "on" : ""}" data-v="${v}">${esc(L[lang][v])}</button>`).join("");
      sw.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
        view = b.dataset.v;
        try { localStorage.setItem("stackView3", view); } catch (e) {}
        window.renderStack(lang);
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      }));
    }
    const root = document.getElementById("stack-view");
    root.innerHTML = view === "c" ? viewC(lang) : viewD(lang);
    bind(lang);
  };
})();
