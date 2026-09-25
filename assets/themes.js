// Themes page. Without ?t= it lists the themes; with ?t=<id> it shows that theme's kit:
// the user types their channel/name once and gets a ready link for every widget in the theme.
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const STORE_KEY = "ol-personal"; // remembered channel/name, this browser only
  const theme = THEMES.find(t => t.id === new URLSearchParams(location.search).get("t"));
  const frames = []; // [iframe, box, size] to rescale on resize

  const swatch = ({ colors }) => `<span class="swatch">${colors.map(c => `<i style="background:${c}"></i>`).join("")}</span>`;
  const widgetById = id => WIDGETS.find(w => w.id === id);

  /** A widget's values inside a theme: field defaults + theme settings + the user's channel/name. */
  function valuesFor(widget, personal) {
    const values = OS.initialValues(widget);
    Object.assign(values, theme.items[widget.id]);
    for (const { id, to } of PERSONAL) if (to[widget.id] && personal[id]) values[to[widget.id]] = personal[id];
    return values;
  }

  function addPreview(box, widget, values) {
    const frame = document.createElement("iframe");
    frame.loading = "lazy";
    frame.title = tr(widget, "name");
    frame.src = OS.previewUrl(widget, values);
    box.append(frame);
    frames.push([frame, box, widget.size]);
    OS.fitFrame(frame, box, widget.size, widget.size[0] === 1920 ? 1 : 0.9);
  }

  /* ---------- list of themes ---------- */
  function renderList() {
    $("title").textContent = UI.themesTitle;
    $("lead").textContent = UI.themesLead;
    $("kit").hidden = true;
    const grid = $("grid");
    for (const t of THEMES) {
      const card = document.createElement("a");
      card.className = "card theme-card";
      card.href = `?t=${t.id}`;
      card.innerHTML = `<div class="thumb"></div><div class="body">${swatch(t)}<h3>${esc(tr(t, "name"))}</h3><p>${esc(tr(t, "blurb"))}</p><span class="btn ghost">${UI.openTheme}</span></div>`;
      grid.append(card);
      const cover = widgetById("starting-soon");
      addPreview(card.querySelector(".thumb"), cover, { ...OS.initialValues(cover), ...t.items["starting-soon"] });
    }
  }

  /* ---------- one theme's kit ---------- */
  function renderKit() {
    document.title = `${tr(theme, "name")}: ${UI.themeTitleSuffix} | Overlay Studio`;
    $("title").innerHTML = `${swatch(theme)} ${esc(tr(theme, "name"))}`;
    $("lead").textContent = tr(theme, "blurb");
    $("back").hidden = false;

    let personal = {};
    try { personal = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch {}

    // the "type once" inputs
    const form = $("personal");
    for (const p of PERSONAL) {
      const box = document.createElement("div");
      box.className = "field";
      box.innerHTML = `<label for="p-${p.id}">${esc(tr(p, "label"))}</label><input id="p-${p.id}" placeholder="${esc(p.placeholder)}">`;
      const input = box.querySelector("input");
      input.value = personal[p.id] || "";
      input.oninput = () => {
        personal[p.id] = input.value.trim();
        try { localStorage.setItem(STORE_KEY, JSON.stringify(personal)); } catch {}
        clearTimeout(input._t);
        input._t = setTimeout(renderWidgets, 400);
      };
      form.append(box);
    }

    function renderWidgets() {
      const grid = $("grid");
      grid.replaceChildren();
      frames.length = 0;
      for (const widgetId of Object.keys(theme.items)) {
        const widget = widgetById(widgetId);
        const values = valuesFor(widget, personal);
        const missing = OS.missing(widget, values);
        const qs = OS.query(widget, values);
        const [w, h] = widget.size;
        const card = document.createElement("div");
        card.className = "card kit-card";
        card.innerHTML = `
          <div class="thumb checker"></div>
          <div class="body">
            <h3>${esc(tr(widget, "name"))}</h3>
            <small class="muted">OBS: ${w} × ${h}</small>
            ${missing ? `<p class="need">${esc(UI.fillFirst)}: ${esc(tr(missing, "label"))}</p>` : ""}
            <div class="row">
              <button class="btn primary copy" type="button" ${missing ? "disabled" : ""}>${UI.copy}</button>
              <a class="btn ghost" href="${OS.editorHref(widget.id, qs)}">${UI.customize}</a>
            </div>
          </div>`;
        card.querySelector(".copy").onclick = async () => { await OS.copy(OS.url(widget, values)); OS.toast(UI.copied); };
        grid.append(card);
        addPreview(card.querySelector(".thumb"), widget, values);
      }
    }
    $("kit").hidden = false;
    renderWidgets();
  }

  theme ? renderKit() : renderList();
  addEventListener("resize", () => frames.forEach(([f, b, s]) => OS.fitFrame(f, b, s, s[0] === 1920 ? 1 : 0.9)));
  const langLink = $("langlink");
  if (langLink) langLink.href = langLink.getAttribute("href") + location.search;
})();
