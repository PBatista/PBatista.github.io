(() => {
  const { T, PROJECTS, JOBS, MARQUEE1, MARQUEE2, MARQUEE2_EN, SKILLS, EDU, QA, QA_FALLBACK } = window;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const L = (v, lang) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] : v);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger) && !reduced;

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  let lang = new URLSearchParams(location.search).get("lang") || store("lang") || (navigator.language || "pt").slice(0, 2);
  if (lang !== "en") lang = "pt";

  /* ---------- Diagramas ---------- */
  const { ARCH, DIAGRAMS, ARCH_HINT } = window;
  document.querySelectorAll(".diagram").forEach(svg => {
    const D = DIAGRAMS[svg.dataset.d];
    svg.setAttribute("viewBox", D.vb);
    svg.innerHTML =
      D.labels.map(([t, y]) => `<text class="label" x="14" y="${y}">${t}</text>`).join("") +
      D.edges.map(([d, hot]) => `<path class="edge${hot ? " hot" : ""}" d="${d}"/>`).join("") +
      D.nodes.map(([id, x, y, w, kind]) => `
        <g class="node${kind === 1 ? " key" : ""}${kind === 2 ? " dash" : ""}" data-n="${id}" tabindex="0">
          <rect x="${x}" y="${y}" width="${w}" height="56"/>
          <text class="t" x="${x + w / 2}" y="${y + 26}" text-anchor="middle"></text>
          <text class="sub" x="${x + w / 2}" y="${y + 44}" text-anchor="middle">${ARCH[id].s}</text>
        </g>`).join("") +
      `<circle class="pulse" r="4"><animateMotion dur="3.2s" repeatCount="indefinite" path="${D.pulse}"/></circle>`;
    const info = document.querySelector(`[data-info="${svg.dataset.d}"]`);
    const show = g => {
      svg.querySelectorAll(".node").forEach(n => n.classList.toggle("on", n === g));
      const a = ARCH[g.dataset.n];
      info.querySelector(".k").textContent = a.t[lang];
      info.querySelector("p").textContent = a.d[lang];
      info.classList.add("active");
      info.dataset.cur = g.dataset.n;
    };
    svg.querySelectorAll(".node").forEach(g => {
      g.addEventListener("mouseenter", () => show(g));
      g.addEventListener("focus", () => show(g));
      g.addEventListener("click", () => show(g));
    });
  });
  function diagramText() {
    document.querySelectorAll(".diagram .node").forEach(g => { g.querySelector(".t").textContent = ARCH[g.dataset.n].t[lang]; });
    document.querySelectorAll(".bp-info").forEach(info => {
      const cur = info.dataset.cur;
      info.querySelector(".k").textContent = cur ? ARCH[cur].t[lang] : "";
      info.querySelector("p").textContent = cur ? ARCH[cur].d[lang] : ARCH_HINT[lang];
    });
  }

  /* ---------- Render ---------- */
  function render() {
    diagramText();
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.title = lang === "pt" ? "Pedro Luis Batista | Engenheiro de Software Sênior" : "Pedro Luis Batista | Senior Software Engineer";
    document.querySelectorAll("[data-i18n]").forEach(el => { const t = T[lang][el.dataset.i18n]; if (typeof t === "string") el.textContent = t; });
    document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = T[lang][el.dataset.i18nHtml]; });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = T[lang][el.dataset.i18nPh]; });

    document.getElementById("manifest").innerHTML = T[lang].manifest
      .split(/(\[[^\]]+\])/)
      .map(part => {
        const hl = part.startsWith("[");
        const words = (hl ? part.slice(1, -1) : part).split(/(\s+)/).map(w => w.trim() ? `<span class="w">${esc(w)}</span>` : w).join("");
        return hl ? `<em>${words}</em>` : words;
      }).join("");

    ["sys1", "sys2"].forEach(id => {
      document.getElementById(id + "-list").innerHTML = T[lang][id + ".list"].map(i => `<li>${esc(i)}</li>`).join("");
    });

    document.getElementById("proj-list").innerHTML = PROJECTS.map((p, i) => `
      <div class="proj">
        <button class="proj-row" type="button" aria-expanded="false">
          <span class="n">0${i + 1}</span>
          <h3>${esc(p.title[lang])}</h3>
          <span class="tg mono">${esc(p.tag[lang])}</span>
          <span class="pm" aria-hidden="true"></span>
        </button>
        <div class="proj-body"><div class="proj-inner">
          <div class="pad"></div>
          <div><p>${esc(p.desc[lang])}</p><div class="stack">${p.stack.map(s => `<span>${esc(s)}</span>`).join("")}</div></div>
          <ul class="ticks">${p.items[lang].map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        </div></div>
      </div>`).join("");

    document.getElementById("xp-list").innerHTML = JOBS.map(j => `
      <div class="xp-item">
        <button class="xp-row" type="button" aria-expanded="false">
          <span class="when mono">${esc(j.when[lang])}</span>
          <span><h3>${esc(j.role[lang])}</h3><span class="co">${esc(j.co[lang])}</span></span>
          <p>${esc(j.d[lang])}</p>
          <span class="pm" aria-hidden="true"></span>
        </button>
        <div class="xp-body"><div class="xp-inner"><ul class="ticks">${j.more[lang].map(x => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
      </div>`).join("");

    const items = (arr, map) => arr.map(s => `<span>${esc(lang === "en" && map && map[s] ? map[s] : s)}</span>`).join("");
    if (window.renderStack) window.renderStack(lang);

    document.getElementById("skills").innerHTML = SKILLS.map(s => `<div class="sk"><span class="k mono">${esc(L(s.k, lang))}</span><div>${esc(L(s.v, lang))}</div></div>`).join("");
    document.getElementById("edu").innerHTML = EDU.map(e => `<div><span class="k mono">${esc(L(e.k, lang))}</span><b>${esc(L(e.t, lang))}</b><span>${esc(L(e.s, lang))}</span></div>`).join("");

    const btn = document.getElementById("lang");
    btn.textContent = lang === "pt" ? "EN" : "PT";
    btn.setAttribute("aria-label", lang === "pt" ? "Switch to English" : "Mudar para português");

    bindAccordion(".proj", ".proj-row", ".proj-body", true);
    bindAccordion(".xp-item", ".xp-row", ".xp-body", false);
    resetChat();
  }

  function bindAccordion(itemSel, rowSel, bodySel, openFirst) {
    document.querySelectorAll(itemSel).forEach((item, i) => {
      const row = item.querySelector(rowSel), body = item.querySelector(bodySel);
      const set = open => {
        item.classList.toggle("open", open);
        row.setAttribute("aria-expanded", open);
        if (hasGsap) gsap.to(body, { height: open ? "auto" : 0, duration: .6, ease: "power3.inOut", onComplete: () => ScrollTrigger.refresh() });
        else body.style.height = open ? "auto" : "0";
      };
      row.addEventListener("click", () => set(!item.classList.contains("open")));
      if (openFirst && i === 0) { item.classList.add("open"); row.setAttribute("aria-expanded", true); body.style.height = "auto"; }
    });
  }

  /* ---------- Pergunte sobre mim ---------- */
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9#.+/ -]/g, " ").replace(/\s+/g, " ").trim();
  function answer(q) {
    const n = " " + norm(q) + " ";
    let best = null, score = 0;
    for (const item of QA) {
      let s = 0;
      for (const k of item.k) {
        const kk = norm(k);
        if (!kk) continue;
        if (n.includes(" " + kk + " ") || (kk.length > 4 && n.includes(kk))) s += kk.length > 6 ? 3 : 2;
      }
      if (s > score) { score = s; best = item; }
    }
    return best ? best[lang] : QA_FALLBACK[lang];
  }
  const log = () => document.getElementById("log");
  function addMsg(who, text, cls, type) {
    const m = document.createElement("div");
    m.className = "msg " + cls;
    m.innerHTML = `<span class="who mono">${esc(who)}</span><p></p>`;
    log().appendChild(m);
    const p = m.querySelector("p");
    if (!type || reduced) { p.textContent = text; log().scrollTop = log().scrollHeight; return Promise.resolve(); }
    return new Promise(res => {
      let i = 0, timer;
      const caret = document.createElement("span"); caret.className = "caret";
      p.appendChild(caret);
      const done = () => { clearTimeout(timer); p.textContent = text; log().scrollTop = log().scrollHeight; flushTyping = null; res(); };
      flushTyping = done;
      const step = () => {
        i = Math.min(text.length, i + 3);
        p.textContent = text.slice(0, i);
        p.appendChild(caret);
        log().scrollTop = log().scrollHeight;
        if (i < text.length) timer = setTimeout(step, 12); else done();
      };
      timer = setTimeout(step, 250);
    });
  }
  let flushTyping = null;
  function ask(q) {
    q = q.trim();
    if (!q) return;
    if (flushTyping) flushTyping();
    addMsg(T[lang]["ask.you"], q, "me", false);
    addMsg(T[lang]["ask.bot"], answer(q), "bot", true);
  }
  function resetChat() {
    if (flushTyping) flushTyping();
    log().innerHTML = "";
    addMsg(T[lang]["ask.bot"], T[lang]["ask.hello"], "bot", false);
    document.getElementById("chips").innerHTML = T[lang]["ask.suggest"].map(s => `<button type="button">${esc(s)}</button>`).join("");
    document.querySelectorAll("#chips button").forEach(b => b.addEventListener("click", () => ask(b.textContent)));
  }
  document.getElementById("ask-form").addEventListener("submit", e => {
    e.preventDefault();
    const inp = document.getElementById("ask-input");
    ask(inp.value); inp.value = "";
  });

  render();
  document.getElementById("lang").addEventListener("click", () => {
    lang = lang === "pt" ? "en" : "pt";
    store("lang", lang);
    render();
    setupManifest();
    if (hasGsap) ScrollTrigger.refresh();
  });

  /* ---------- Relógio ---------- */
  const clock = document.getElementById("clock");
  const tick = () => { clock.textContent = "SJC " + new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date()) + " BRT"; };
  tick(); setInterval(tick, 1000);
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Grade de fundo ---------- */
  (() => {
    const c = document.getElementById("grid"), ctx = c.getContext("2d");
    let w, h, mx = -999, my = -999, sy = 0;
    const size = 64;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const off = -(sy * .25) % size;
      ctx.strokeStyle = "rgba(255,255,255,0.035)"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = .5; x < w; x += size) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = off + .5; y < h; y += size) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();
      if (mx > 0) {
        const gx = Math.round(mx / size) * size + .5, gy = Math.round((my - off) / size) * size + off + .5;
        ctx.strokeStyle = "rgba(212,255,58,0.55)";
        ctx.beginPath(); ctx.moveTo(gx - 8, gy); ctx.lineTo(gx + 8, gy); ctx.moveTo(gx, gy - 8); ctx.lineTo(gx, gy + 8); ctx.stroke();
        ctx.fillStyle = "rgba(212,255,58,0.6)"; ctx.font = "10px JetBrains Mono, monospace";
        ctx.fillText(`${Math.round(gx)}·${Math.round(gy + sy)}`, gx + 10, gy - 8);
      }
    };
    const resize = () => { const dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; c.style.width = w + "px"; c.style.height = h + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(); };
    addEventListener("resize", resize);
    if (matchMedia("(pointer: fine)").matches) addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; requestAnimationFrame(draw); });
    addEventListener("scroll", () => { sy = scrollY; requestAnimationFrame(draw); }, { passive: true });
    resize();
  })();

  /* ---------- Animações ---------- */
  let manifestTrigger;
  function setupManifest() {
    if (!hasGsap) { document.querySelectorAll("#manifest .w").forEach(w => w.style.opacity = 1); return; }
    if (manifestTrigger) manifestTrigger.kill();
    manifestTrigger = gsap.to("#manifest .w", { opacity: 1, stagger: .05, ease: "none", scrollTrigger: { trigger: "#manifest", start: "top 80%", end: "bottom 45%", scrub: true } }).scrollTrigger;
  }

  if (!hasGsap) {
    setupManifest();
    document.querySelectorAll("[data-count]").forEach(el => el.textContent = el.dataset.count + (el.dataset.suffix || ""));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({ lerp: .09 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
      const t = document.querySelector(a.getAttribute("href"));
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -60 }); }
    }));
    document.getElementById("log").setAttribute("data-lenis-prevent", "");
  }

  gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });

  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(".hero h1 .in", { yPercent: 110, duration: 1.4, stagger: .12 })
    .from(".photo", { clipPath: "inset(100% 0 0 0)", duration: 1.4, ease: "expo.inOut" }, 0)
    .from(".hero-foot > *", { opacity: 0, y: 24, duration: 1, stagger: .08 }, "-=1")
    .from(".scroll-hint", { opacity: 0, duration: .8 }, "-=.6")
    .from(".hud", { yPercent: -100, duration: 1 }, "-=1.2");

  gsap.to(".hero h1", { yPercent: -14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  document.querySelectorAll(".sec-head h2").forEach(h => {
    gsap.from(h, { yPercent: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } });
  });

  setupManifest();

  document.querySelectorAll("[data-count]").forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || "", obj = { v: 0 };
    gsap.to(obj, { v: end, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" }, onUpdate: () => { el.textContent = Math.round(obj.v) + suf; } });
  });

  document.querySelectorAll(".diagram").forEach(svg => {
    const edges = svg.querySelectorAll(".edge");
    edges.forEach(p => { const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
    const notes = svg.closest(".bp").querySelectorAll(".bp-notes li");
    gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 75%" } })
      .from(svg.querySelectorAll(".label"), { opacity: 0, x: -10, duration: .5, stagger: .1 })
      .from(svg.querySelectorAll(".node"), { opacity: 0, scale: .92, transformOrigin: "50% 50%", duration: .5, stagger: .06, ease: "back.out(1.6)" }, "-=.2")
      .to(edges, { strokeDashoffset: 0, duration: .9, stagger: .05, ease: "power2.inOut" }, "-=.4")
      .from(svg.querySelectorAll(".pulse"), { opacity: 0, duration: .4 })
      .from(notes, { opacity: 0, x: -16, duration: .6, stagger: .1, ease: "power3.out" }, .3);
  });

  gsap.from(".proj", { opacity: 0, y: 30, duration: .9, stagger: .1, ease: "power3.out", scrollTrigger: { trigger: "#proj-list", start: "top 85%" } });
  gsap.from(".xp-item", { opacity: 0, y: 24, duration: .8, stagger: .07, ease: "power3.out", scrollTrigger: { trigger: "#xp-list", start: "top 85%" } });
  gsap.from(".term", { opacity: 0, y: 30, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".term", start: "top 85%" } });

  [["#m1", -1], ["#m2", 1]].filter(([sel]) => document.querySelector(sel)).forEach(([sel, dir]) => {
    const loop = gsap.fromTo(sel, { xPercent: dir < 0 ? 0 : -33.333 }, { xPercent: dir < 0 ? -33.333 : 0, duration: 40, ease: "none", repeat: -1 });
    ScrollTrigger.create({ trigger: "#stack", start: "top bottom", end: "bottom top", onUpdate: s => gsap.to(loop, { timeScale: 1 + Math.abs(s.getVelocity()) / 400, duration: .3, overwrite: true, onComplete: () => gsap.to(loop, { timeScale: 1, duration: 1 }) }) });
  });

  gsap.from(".contact h2 .in", { yPercent: 110, duration: 1.3, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".contact h2", start: "top 85%" } });
  gsap.from(".links a", { opacity: 0, y: 20, duration: .8, stagger: .1, scrollTrigger: { trigger: ".links", start: "top 90%" } });

  document.querySelectorAll(".hud nav a").forEach(a => {
    const sec = document.querySelector(a.getAttribute("href"));
    ScrollTrigger.create({ trigger: sec, start: "top 50%", end: "bottom 50%", onToggle: s => a.classList.toggle("on", s.isActive) });
  });
})();
