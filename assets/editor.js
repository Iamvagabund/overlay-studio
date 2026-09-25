// Editor: form built from the widget's field list, live preview, OBS link, saved overlays.
// Link building lives in links.js (OS.*), shared with the themes page.
(() => {
  const $ = id => document.getElementById(id);
  const STORE_KEY = "ol-saved";
  const pageParams = new URLSearchParams(location.search);

  const widget = WIDGETS.find(w => w.id === pageParams.get("w")) || WIDGETS[0];
  const { size } = widget;
  const fields = OS.fields(widget); // own fields + shared styling fields
  const [width, height] = size;
  // `&cfg=` (a widget query string) pre-fills the form: saved overlays, pasted links, themes
  const values = OS.initialValues(widget, pageParams.get("cfg") || "");

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
    const buttons = options.map((opt, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = names[i];
      b.onclick = () => { values[key] = opt; mark(); update(); };
      return b;
    });
    const mark = () => buttons.forEach((b, i) => { const on = options[i] === values[key]; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    mark();
    seg.append(...buttons);
    return seg;
  }

  function dropdown(field) {
    const { key, options } = field;
    const names = tr(field, "labels") || options;
    const el = document.createElement("select");
    el.id = "f-" + key;
    options.forEach((opt, i) => el.append(new Option(names[i], opt, false, opt === values[key])));
    el.onchange = () => { values[key] = el.value; update(); };
    return el;
  }

  function input(field) {
    const { key, type, min, max, step, required } = field;
    const el = document.createElement("input");
    Object.assign(el, { type, value: values[key], id: "f-" + key, required: !!required });
    if (step) el.step = step;
    const ph = tr(field, "placeholder");
    if (ph) el.placeholder = ph;
    if (min != null) el.min = min;
    if (max != null) el.max = max;
    el.oninput = () => { values[key] = el.value; el.classList.remove("invalid"); if (out) out.textContent = el.value; update(); };
    values[key] = el.value; // the browser may have rejected a value from &cfg= (e.g. "red" for a colour input)
    // sliders show their number next to them
    let out;
    if (type === "range") {
      const wrap = document.createElement("div");
      wrap.className = "range";
      out = document.createElement("output");
      out.textContent = el.value;
      wrap.append(el, out);
      wrap.id = "w-" + key;
      return wrap;
    }
    return el;
  }

  function renderForm() {
    const form = $("form");
    // shared styling options go into a collapsible section below the widget's own settings
    const styleBox = document.createElement("details");
    styleBox.className = "more";
    styleBox.innerHTML = `<summary>${UI.moreStyle}</summary>`;
    for (const field of fields) {
      const box = document.createElement("div");
      box.className = "field";
      const label = document.createElement("label");
      label.textContent = tr(field, "label") + (field.required ? " *" : "");
      const control = field.type === "select" ? segmented(field) : field.type === "dropdown" ? dropdown(field) : input(field);
      if (control.id) label.htmlFor = control.id;
      box.append(label, control);
      const hint = tr(field, "hint");
      if (hint) { const s = document.createElement("small"); s.textContent = hint; box.append(s); }
      (field.group === "style" ? styleBox : form).append(box);
    }
    if (styleBox.children.length > 1) {
      // open it automatically when a saved/pasted overlay already uses styling options
      styleBox.open = fields.some(f => f.group === "style" && String(values[f.key]) !== f.def);
      form.append(styleBox);
    }
  }

  /* ---------- link + preview ---------- */
  let previewTimer;
  function update() {
    const missing = OS.missing(widget, values);
    // no OBS link until required fields (e.g. the Twitch channel) are filled
    $("url").value = missing ? "" : OS.url(widget, values);
    $("url").placeholder = missing ? `${UI.fillFirst}: ${tr(missing, "label")}` : "";
    $("demo-note").hidden = !missing;
    // widgets read their settings once on load, so the preview reloads (debounced)
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => { $("frame").src = OS.previewUrl(widget, values); }, 250);
  }

  /** Blocks copy/save while a required field is empty and points the user at it. */
  function requireFilled() {
    const missing = OS.missing(widget, values);
    if (!missing) return true;
    const el = $("f-" + missing.key);
    el.classList.add("invalid");
    el.focus();
    OS.toast(`${UI.fillFirst}: ${tr(missing, "label")}`);
    return false;
  }

  async function copyLink() {
    if (!requireFilled()) return;
    await OS.copy($("url").value);
    OS.toast(UI.copied);
  }

  /* ---------- saved overlays (this browser only) ---------- */
  const loadSaved = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } };
  const storeSaved = list => { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch {} };

  function saveCurrent() {
    if (!requireFilled()) return;
    const firstText = fields.filter(f => f.type === "text").map(f => values[f.key]).find(Boolean);
    const name = [tr(widget, "name"), firstText].filter(Boolean).join(" · ");
    storeSaved([{ id: Date.now(), w: widget.id, qs: OS.query(widget, values), name }, ...loadSaved()].slice(0, 30));
    renderSaved();
    OS.toast(UI.saved);
  }

  function renderSaved() {
    const list = loadSaved(), ul = $("saved");
    ul.replaceChildren();
    $("saved-empty").hidden = list.length > 0;
    for (const { id, w, qs, name } of list) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = OS.editorHref(w, qs);
      a.textContent = name;
      const del = document.createElement("button");
      Object.assign(del, { type: "button", textContent: "×", title: UI.del });
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
      location.href = OS.editorHref(w.id, url.searchParams.toString());
    } catch { OS.toast(UI.badLink); }
  }

  /* ---------- start ---------- */
  renderHeader();
  renderForm();
  renderSaved();
  const fit = () => OS.fitFrame($("frame"), $("screen"), size, width === 1920 ? 1 : 0.92);
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
