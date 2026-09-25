"""Adds ?v=<stamp> to every local CSS/JS link in the site's HTML, so browsers fetch fresh files after a deploy
instead of mixing a new page with old cached scripts (GitHub Pages lets browsers cache files for 10 minutes).

Run from the overlay-studio folder before every commit:  python3 tools/stamp-assets.py
"""
import pathlib
import re
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent
STAMP = time.strftime("%Y%m%d%H%M%S")
# src="assets/x.js", href="../assets/style.css", src="lib.js" (widgets), with or without an old ?v=
PATTERN = re.compile(r'((?:src|href)="(?:\.\./)*(?:assets/[\w.-]+|lib)\.(?:js|css))(?:\?v=\w+)?"')


def main():
    changed = 0
    for page in ROOT.rglob("*.html"):
        if ".git" in page.parts:
            continue
        text = page.read_text(encoding="utf-8")
        new = PATTERN.sub(rf'\1?v={STAMP}"', text)
        if new != text:
            page.write_text(new, encoding="utf-8")
            changed += 1
    print(f"stamped {changed} pages with v={STAMP}")


if __name__ == "__main__":
    main()
