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

  document.getElementById("y").textContent = new Date().getFullYear();
  document.getElementById("free-grid").innerHTML = WIDGETS.map(freeCard).join("");
  document.getElementById("pro-grid").innerHTML = PRO.map(proCard).join("");
})();
