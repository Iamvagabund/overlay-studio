"""Builds the static guide pages from tools/guides/*.md into guides/ and uk/guides/.

Run from the overlay-studio folder:  python3 tools/build-guides.py

Each .md file starts with a header block:
    lang: en | uk
    slug: how-to-add-twitch-chat-to-obs
    title: page <title> and <h1>
    description: meta description
    pair: same id on a guide and its translation (links them for the language switch)
    cta: editor widget id for the call-to-action button (e.g. chat)
    ---
followed by the article in a small Markdown subset: "## " headings, "1. " ordered lists,
"- " bullet lists, **bold**, `code`, [text](url) links and blank-line-separated paragraphs.
"""
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / "guides"
SITE = "https://iamvagabund.github.io/overlay-studio"  # public address of the site, used in hreflang links

TEXT = {
    "en": {"home": "Overlay Studio", "guides": "Guides", "cta": "Open the free editor →", "other": ("UA", "uk"),
           "footer": "Made for streamers.", "back": "All guides"},
    "uk": {"home": "Overlay Studio", "guides": "Інструкції", "cta": "Відкрити безкоштовний редактор →", "other": ("EN", "en"),
           "footer": "Зроблено для стрімерів.", "back": "Усі інструкції"},
}


def inline(s: str) -> str:
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"`(.+?)`", r"<code>\1</code>", s)
    return re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>', s)


def to_html(md: str) -> str:
    out, lst = [], None
    for block in re.split(r"\n\s*\n", md.strip()):
        lines = block.strip().splitlines()
        if lines[0].startswith("## "):
            out.append(f"<h2>{inline(lines[0][3:])}</h2>")
            lines = lines[1:]
            if not lines:
                continue
        if all(re.match(r"\d+\. ", l) for l in lines):
            items = (inline(re.sub(r"^\d+\. ", "", l)) for l in lines)
            out.append("<ol>" + "".join(f"<li>{i}</li>" for i in items) + "</ol>")
        elif all(l.startswith("- ") for l in lines):
            out.append("<ul>" + "".join(f"<li>{inline(l[2:])}</li>" for l in lines) + "</ul>")
        else:
            out.append(f"<p>{inline(' '.join(lines))}</p>")
    return "\n".join(out)


def parse(path: pathlib.Path):
    head, body = path.read_text(encoding="utf-8").split("\n---\n", 1)
    meta = dict(line.split(": ", 1) for line in head.strip().splitlines())
    return meta, body


def page(meta: dict, body_html: str, slugs: dict) -> str:
    """slugs: {lang: slug} for this guide and its translations."""
    lang, t = meta["lang"], TEXT[meta["lang"]]
    root = "../" if lang == "en" else "../../"          # path back to the site root
    home = "../" if lang == "en" else "../"              # this language's home page
    other_label, other_lang = t["other"]
    other_slug = slugs.get(other_lang)
    other_href = (f"../uk/guides/{other_slug}.html" if other_lang == "uk" else f"../../guides/{other_slug}.html") if other_slug else None
    lang_link = f'<a class="lang" href="{other_href}" hreflang="{other_lang}">{other_label}</a>' if other_href else ""
    hreflang = "\n".join(
        f'<link rel="alternate" hreflang="{l}" href="{SITE}/{"" if l == "en" else "uk/"}guides/{s}.html">'
        for l, s in slugs.items())
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(meta['title'])} | Overlay Studio</title>
<meta name="description" content="{html.escape(meta['description'])}">
{hreflang}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}assets/style.css">
</head>
<body>
<header class="top"><div class="wrap">
  <a class="logo" href="{home}"><i></i>{t['home']}</a>
  <nav><a href="{home}#guides">{t['guides']}</a>{lang_link}<a class="btn primary" href="{home}editor.html?w={meta['cta']}">{t['cta']}</a></nav>
</div></header>
<main class="wrap article">
  <p class="crumbs"><a href="{home}#guides">← {t['back']}</a></p>
  <h1>{html.escape(meta['title'])}</h1>
{body_html}
  <p><a class="btn primary" href="{home}editor.html?w={meta['cta']}">{t['cta']}</a></p>
</main>
<footer><div class="wrap">© Overlay Studio. {t['footer']}</div></footer>
</body>
</html>
"""


def main():
    docs = [parse(p) for p in sorted(SRC.glob("*.md"))]
    # guides with the same "pair" id are translations of each other
    pairs = {}
    for meta, _ in docs:
        pairs.setdefault(meta["pair"], {})[meta["lang"]] = meta["slug"]
    for meta, body in docs:
        out_dir = ROOT / ("guides" if meta["lang"] == "en" else "uk/guides")
        out_dir.mkdir(parents=True, exist_ok=True)
        html_out = page(meta, to_html(body), pairs[meta["pair"]])
        (out_dir / f"{meta['slug']}.html").write_text(html_out, encoding="utf-8")
        print("built", out_dir.relative_to(ROOT) / f"{meta['slug']}.html")


if __name__ == "__main__":
    main()
