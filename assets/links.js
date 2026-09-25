// Builds widget links. Shared by the editor and the themes page so both produce identical OBS links.
(() => {
  const ROOT = document.querySelector('meta[name="root"]')?.content || "./";

  window.OS = {
    ROOT,

    /** A widget's own fields plus the shared styling fields it opts into (`style: [...]`). */
    fields: widget => [...widget.fields, ...(widget.style || []).map(k => STYLE_FIELDS[k])],

    /** Query string for `values`; fields at their default value are left out to keep links short. */
    query(widget, values, extra = {}) {
      const q = new URLSearchParams();
      for (const { key, def } of OS.fields(widget)) {
        const v = String(values[key] ?? "").trim();
        if (v !== "" && v !== def) q.set(key, v);
      }
      for (const [k, v] of Object.entries(extra)) q.set(k, v);
      return q.toString();
    },

    /** Absolute widget URL, the one people paste into OBS. */
    url(widget, values, extra) {
      const qs = OS.query(widget, values, extra);
      const base = widget.base ?? ROOT + "w/";
      return new URL(`${base}${widget.file}${qs ? "?" + qs : ""}`, location.href).href;
    },

    /** First required field that is still empty (e.g. the Twitch channel for chat), or undefined. */
    missing: (widget, values) => OS.fields(widget).find(f => f.required && !String(values[f.key] ?? "").trim()),

    /**
     * URL for the live preview only. Adds `previewParams`, and `demoParams` (fake messages) while a
     * required field is empty, so the preview isn't blank. Links for OBS never get these.
     */
    previewUrl(widget, values) {
      const { previewParams = {}, demoParams = {} } = widget;
      return OS.url(widget, values, { ...previewParams, ...(OS.missing(widget, values) ? demoParams : {}) });
    },

    /** Starting values: field defaults, overridden by a widget query string (a saved overlay, a pasted link, a theme). */
    initialValues(widget, qs = "") {
      const cfg = new URLSearchParams(qs);
      return Object.fromEntries(OS.fields(widget).map(({ key, def }) => [key, cfg.get(key) ?? def]));
    },

    editorHref: (widgetId, qs) => `editor.html?w=${widgetId}${qs ? "&cfg=" + encodeURIComponent(qs) : ""}`,

    /** Scales a fixed-size iframe so it fits inside its box, centred. */
    fitFrame(frame, box, [w, h], shrink = 1) {
      const r = box.getBoundingClientRect();
      const scale = Math.min(r.width / w, r.height / h) * shrink;
      Object.assign(frame.style, { width: w + "px", height: h + "px", transform: `translate(-50%,-50%) scale(${scale})` });
    },

    async copy(text) {
      try { await navigator.clipboard.writeText(text); return true; }
      catch {
        const t = Object.assign(document.createElement("textarea"), { value: text });
        document.body.append(t); t.select(); const ok = document.execCommand("copy"); t.remove(); return ok;
      }
    },

    toast(text) {
      let el = document.getElementById("toast");
      if (!el) { el = Object.assign(document.createElement("div"), { id: "toast", className: "toast" }); document.body.append(el); }
      el.textContent = text;
      el.classList.add("show");
      clearTimeout(OS._t);
      OS._t = setTimeout(() => el.classList.remove("show"), 2200);
    },
  };
})();
