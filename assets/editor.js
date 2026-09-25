// Editor: form built from the widget's field list, live preview, OBS link, saved overlays.
(() => {
  const $ = id => document.getElementById(id);
  const ROOT = document.querySelector('meta[name="root"]')?.content || "./";
  const STORE_KEY = "ol-saved";
  const pageParams = new URLSearchParams(location.search);

  const widget = WIDGETS.find(w => w.id === pageParams.get("w")) || WIDGETS[0];
  // base: folder of the widget file (default: the site's w/ folder); previewParams: extra URL params for the preview only
  const { fields, size: [width, height], file, base = ROOT + "w/", previewParams = { preview: 1 } } = widget;

  // current value of every field; `&cfg=` (a widget query string) pre-fills them, e.g. when opening a saved overlay
  const cfg = new URLSearchParams(pageParams.get("cfg") || "");
  const values = Object.fromEntries(fields.map(({ key, def }) => [key, cfg.get(key) ?? def]));

  /* ---------- page text ---------- */
  function renderHeader() {
    const name = tr(widget, "name");
    document.title = LANG === "uk" ? `${name}: безкоштовний оверлей для OBS | Overlay Studio` : `${name}: free animated OBS overlay | Overlay Studio`;
    $("picker").innerHTML = WIDGETS.map(w => `<a href="?w=${w.id}" class="${w === widget ? "on" : ""}">${tr(w, "name")}</a>`).join("");
    $("wname").textContent = name;
    $("wblurb").textContent = tr(widget, "blurb");
    $("ow").textContent = width;
    $("oh").textContent = height;
    const note = tr(widget, "note");
    $("wnote").textContent = note || "";
    $("wnote").hidden = !note;
    for (const el of document.querySelectorAll("[data-ui]")) el.textContent = UI[el.dataset.ui];
    for (const el of document.querySelectorAll("[data-ui-ph]")) el.placeholder = UI[el.dataset.uiPh];
  }

  /* ---------- form ---------- */
  function segmented(field) {
    const { key, options } = field;
    const names = tr(field, "labels") || options.map(o => o[0].toUpperCase() + o.slice(1));
    const seg = document.createElement("div");
    seg.className = "seg";
    options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = names[i];
      b.classList.toggle("on", opt === values[key]);
      b.setAttribute("aria-pressed", opt === values[key]);
      b.onclick = () => {
        values[key] = opt;
        seg.querySelectorAll("button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
        update();
      };
      seg.append(b);
    });
    return seg;
  }

  function input(field) {
    const { key, type, min, max } = field;
    const el = document.createElement("input");
    Object.assign(el, { type, value: values[key], id: "f-" + key });
    const ph = tr(field, "placeholder");
    if (ph) el.placeholder = ph;
    if (min != null) el.min = min;
    if (max != null) el.max = max;
    el.oninput = () => { values[key] = el.value; update(); };
    values[key] = el.value; // the browser may have rejected a value from &cfg= (e.g. "red" for a colour input)
    return el;
  }

  function renderForm() {
    const form = $("form");
    for (const field of fields) {
      const box = document.createElement("div");
      box.className = "field";
      const label = document.createElement("label");
      label.textContent = tr(field, "label");
      const control = field.type === "select" ? segmented(field) : input(field);
      if (control.id) label.htmlFor = control.id;
      box.append(label, control);
      const hint = tr(field, "hint");
      if (hint) { const s = document.createElement("small"); s.textContent = hint; box.append(s); }
      form.append(box);
    }
  }

  /* ---------- link + preview ---------- */
  /** Widget query string; fields at their default value are left out to keep links short. */
  function query(extra = {}) {
    const q = new URLSearchParams();
    for (const { key, def } of fields) {
      const v = String(values[key] ?? "").trim();
      if (v !== "" && v !== def) q.set(key, v);
    }
    for (const [k, v] of Object.entries(extra)) q.set(k, v);
    return q.toString();
  }
  const link = extra => {
    const qs = query(extra);
    return new URL(`${base}${file}${qs ? "?" + qs : ""}`, location.href).href;
  };

  let previewTimer;
  function update() {
    $("url").value = link();
    // widgets read their settings once on load, so the preview reloads (debounced)
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => { $("frame").src = link(previewParams); }, 250);
  }

  function fit() {
    const box = $("screen").getBoundingClientRect();
    const scale = Math.min(box.width / width, box.height / height) * (width === 1920 ? 1 : 0.92);
    Object.assign($("frame").style, { width: width + "px", height: height + "px", transform: `translate(-50%,-50%) scale(${scale})` });
  }

  function toast(text) {
    $("toast").textContent = text;
    $("toast").classList.add("show");
    setTimeout(() => $("toast").classList.remove("show"), 1800);
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText($("url").value); }
    catch { $("url").select(); document.execCommand("copy"); }
    toast(UI.copied);
  }

  /* ---------- saved overlays (this browser only) ---------- */
  const loadSaved = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } };
  const storeSaved = list => { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch {} };
  const editorUrl = (w, qs) => `editor.html?w=${w}${qs ? "&cfg=" + encodeURIComponent(qs) : ""}`;

  function saveCurrent() {
    const firstText = fields.filter(f => f.type === "text").map(f => values[f.key]).find(Boolean);
    const name = [tr(widget, "name"), firstText].filter(Boolean).join(" · ");
    storeSaved([{ id: Date.now(), w: widget.id, qs: query(), name }, ...loadSaved()].slice(0, 30));
    renderSaved();
    toast(UI.saved);
  }

  function renderSaved() {
    const list = loadSaved(), ul = $("saved");
    ul.replaceChildren();
    $("saved-empty").hidden = list.length > 0;
    for (const { id, w, qs, name } of list) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = editorUrl(w, qs);
      a.textContent = name;
      const del = document.createElement("button");
      del.type = "button"; del.textContent = "×"; del.title = UI.del;
      del.onclick = () => { storeSaved(loadSaved().filter(x => x.id !== id)); renderSaved(); };
      li.append(a, del);
      ul.append(li);
    }
  }

  /** Paste any overlay link (from OBS) to keep editing it. */
  function openPasted() {
    try {
      const url = new URL($("paste").value.trim());
      const w = WIDGETS.find(x => url.pathname.endsWith("/" + x.file));
      if (!w) throw new Error();
      location.href = editorUrl(w.id, url.searchParams.toString());
    } catch { toast(UI.badLink); }
  }

  /* ---------- start ---------- */
  renderHeader();
  renderForm();
  renderSaved();
  addEventListener("resize", fit);
  fit();
  update();
  $("copy").onclick = copyLink;
  $("save").onclick = saveCurrent;
  $("paste-go").onclick = openPasted;
  $("paste").onkeydown = e => { if (e.key === "Enter") openPasted(); };

  // keep the selected widget and settings when switching language
  const langLink = $("langlink");
  if (langLink) langLink.href = langLink.getAttribute("href") + location.search;
})();
