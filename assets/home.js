// Home page: fills the free and PRO galleries. Paths are relative to the site root (meta[name=root]).
(() => {
  const ROOT = document.querySelector('meta[name="root"]')?.content || "./";
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const freeCard = w => {
    const [name, blurb] = [tr(w, "name"), tr(w, "blurb")];
    return `
    <a class="card" href="editor.html?w=${w.id}" style="text-decoration:none">
      <img src="${ROOT}${w.img}" alt="${esc(name)} ${UI.preview}" loading="lazy">
      <div class="body"><span class="tag free">${UI.free}</span><h3>${esc(name)}</h3><p>${esc(blurb)}</p>
      <span class="btn ghost">${UI.customize}</span></div>
    </a>`;
  };

  const proCard = p => {
    const [name, blurb] = [tr(p, "name"), tr(p, "blurb")];
    return `
    <div class="card">
      <img src="${ROOT}${p.img}" alt="${esc(name)} ${UI.preview}" loading="lazy">
      <div class="body"><span class="tag pro">PRO · ${p.price}</span><h3>${esc(name)}</h3><p>${esc(blurb)}</p>
      ${ETSY_URL
        ? `<a class="btn primary" href="${ETSY_URL}" target="_blank" rel="noopener">${UI.getEtsy}</a>`
        : `<span class="btn ghost soon" aria-disabled="true">${UI.soon}</span>`}</div>
    </div>`;
  };

  const themeCard = t => {
    const [name, blurb] = [tr(t, "name"), tr(t, "blurb")];
    const [a, b, bg] = t.colors;
    return `
    <a class="card theme-card" href="themes.html?t=${t.id}">
      <div class="thumb" style="background:radial-gradient(circle at 30% 40%, ${a}aa, transparent 55%), radial-gradient(circle at 75% 65%, ${b}88, transparent 50%), ${bg}"></div>
      <div class="body"><h3>${esc(name)}</h3><p>${esc(blurb)}</p><span class="btn ghost">${UI.openTheme}</span></div>
    </a>`;
  };

  document.getElementById("y").textContent = new Date().getFullYear();
  const themesGrid = document.getElementById("themes-grid");
  if (themesGrid) themesGrid.innerHTML = THEMES.map(themeCard).join("");
  document.getElementById("free-grid").innerHTML = WIDGETS.map(freeCard).join("");
  document.getElementById("pro-grid").innerHTML = PRO.map(proCard).join("");
})();
