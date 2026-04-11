"""
Render New Player Primer to PDF using Playwright.
Page breaks on every H2 section.
"""

import asyncio
import re
from pathlib import Path

VAULT = Path("d:/ObsidianVaults/Nova Praxis")
INPUT_MD = VAULT / "Campaign Overview/New Player Primer - Cold Start Syndicate.md"
OUTPUT_PDF = VAULT / "Campaign Overview/New Player Primer - Cold Start Syndicate.pdf"

def md_to_html(md: str) -> str:
    """Minimal markdown to HTML conversion for the primer."""
    lines = md.split("\n")
    html_lines = []
    in_table = False
    in_list = False
    in_blockquote = False
    table_rows = []
    i = 0

    def close_list():
        nonlocal in_list
        if in_list:
            html_lines.append("</ul>")
            in_list = False

    def close_blockquote():
        nonlocal in_blockquote
        if in_blockquote:
            html_lines.append("</blockquote>")
            in_blockquote = False

    def flush_table():
        nonlocal table_rows, in_table
        if not table_rows:
            in_table = False
            return
        html_lines.append('<table>')
        for idx, row in enumerate(table_rows):
            cells = [c.strip() for c in row.strip("|").split("|")]
            if idx == 0:
                html_lines.append("<thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in cells) + "</tr></thead><tbody>")
            elif idx == 1 and all(re.match(r"[-: ]+$", c) for c in cells):
                continue
            else:
                html_lines.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells) + "</tr>")
        html_lines.append("</tbody></table>")
        table_rows = []
        in_table = False

    def inline(text: str) -> str:
        # Bold
        text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
        # Italic
        text = re.sub(r"\*(.+?)\*", r"<em>\1</em>", text)
        # Inline code
        text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
        return text

    # Strip frontmatter
    content = md
    if md.startswith("---"):
        end = md.find("---", 3)
        if end != -1:
            content = md[end + 3:].lstrip()
    lines = content.split("\n")

    for line in lines:
        # Table row
        if line.strip().startswith("|"):
            close_list()
            close_blockquote()
            in_table = True
            table_rows.append(line)
            continue
        elif in_table:
            flush_table()

        # HR
        if re.match(r"^---+$", line.strip()):
            close_list()
            close_blockquote()
            continue  # skip --- in prose (page break is CSS-driven on h2)

        # Headings
        m = re.match(r"^(#{1,4})\s+(.*)", line)
        if m:
            close_list()
            close_blockquote()
            level = len(m.group(1))
            text = inline(m.group(2))
            tag = f"h{level}"
            html_lines.append(f"<{tag}>{text}</{tag}>")
            continue

        # Blockquote
        if line.startswith("> "):
            close_list()
            if not in_blockquote:
                html_lines.append("<blockquote>")
                in_blockquote = True
            html_lines.append(f"<p>{inline(line[2:])}</p>")
            continue
        elif in_blockquote:
            close_blockquote()

        # Checkbox list
        m = re.match(r"^- \[[ x]\] (.*)", line)
        if m:
            if not in_list:
                html_lines.append('<ul class="checklist">')
                in_list = True
            checked = "checked" if "x" in line[3] else ""
            html_lines.append(f'<li><input type="checkbox" {checked} disabled> {inline(m.group(1))}</li>')
            continue

        # Bullet list
        if re.match(r"^- ", line):
            close_blockquote()
            if not in_list:
                html_lines.append("<ul>")
                in_list = True
            html_lines.append(f"<li>{inline(line[2:])}</li>")
            continue
        elif in_list and line.strip() == "":
            close_list()

        # Blank line
        if line.strip() == "":
            close_list()
            close_blockquote()
            continue

        # Paragraph
        close_list()
        close_blockquote()
        html_lines.append(f"<p>{inline(line)}</p>")

    close_list()
    close_blockquote()
    if in_table:
        flush_table()

    return "\n".join(html_lines)


CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');

:root {
  --bg: #0e1117;
  --surface: #161b27;
  --surface2: #1e2535;
  --border: #2a3347;
  --accent: #4fc3f7;
  --accent2: #7c4dff;
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --danger: #ef4444;
  --success: #22c55e;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { background: var(--bg); }

body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10.5pt;
  line-height: 1.65;
  color: var(--text);
  background: var(--bg);
  padding: 0;
  margin: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.page-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 48px 64px;
}

/* ── PAGE BREAKS ──────────────────────────── */
h2 {
  page-break-before: always;
  break-before: page;
}
h2:first-of-type,
.no-break {
  page-break-before: avoid;
  break-before: avoid;
}

/* ── COVER ────────────────────────────────── */
.cover {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 48px;
  background: var(--bg);
  page-break-after: always;
  break-after: page;
  position: relative;
  overflow: hidden;
}

.cover::before {
  content: '';
  position: absolute;
  top: -200px; right: -200px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(76,195,247,0.07) 0%, transparent 70%);
  pointer-events: none;
}

.cover-label {
  font-size: 9pt;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 20px;
}

.cover-title {
  font-size: 36pt;
  font-weight: 700;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 8px;
}

.cover-subtitle {
  font-size: 15pt;
  color: var(--text-muted);
  font-weight: 400;
  margin-bottom: 40px;
}

.cover-rule {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  margin-bottom: 32px;
  border-radius: 2px;
}

.cover-tagline {
  font-size: 11pt;
  color: var(--text-muted);
  max-width: 480px;
  line-height: 1.7;
  font-style: italic;
  border-left: 3px solid var(--accent2);
  padding-left: 20px;
}

.cover-footer {
  position: absolute;
  bottom: 48px;
  left: 48px;
  right: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8pt;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-top: 1px solid var(--border);
  padding-top: 16px;
}

/* ── TYPOGRAPHY ────────────────────────────── */
h1 {
  font-size: 22pt;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
  line-height: 1.2;
}

h2 {
  font-size: 15pt;
  font-weight: 700;
  color: var(--accent);
  margin: 0 0 20px;
  padding-top: 40px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
  letter-spacing: 0.02em;
}

h3 {
  font-size: 11pt;
  font-weight: 600;
  color: var(--text);
  margin: 28px 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h4 {
  font-size: 10.5pt;
  font-weight: 600;
  color: var(--accent);
  margin: 24px 0 8px;
}

p {
  margin: 0 0 12px;
  color: var(--text);
}

strong { color: var(--text); font-weight: 600; }
em { color: var(--text-muted); font-style: italic; }
code {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9pt;
  color: var(--accent);
  background: var(--surface2);
  padding: 1px 5px;
  border-radius: 3px;
}

/* ── BLOCKQUOTE ────────────────────────────── */
blockquote {
  border-left: 3px solid var(--accent2);
  background: var(--surface);
  margin: 16px 0 20px;
  padding: 14px 20px;
  border-radius: 0 6px 6px 0;
}

blockquote p {
  color: var(--text);
  font-style: italic;
  margin: 0;
  font-size: 10.5pt;
  line-height: 1.65;
}

/* ── LISTS ────────────────────────────────── */
ul {
  margin: 0 0 14px 0;
  padding-left: 20px;
}

ul li {
  margin: 4px 0;
  color: var(--text);
  line-height: 1.6;
}

ul li::marker { color: var(--accent); }

ul.checklist {
  list-style: none;
  padding-left: 4px;
}

ul.checklist li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid var(--border);
}

ul.checklist li:last-child { border-bottom: none; }

ul.checklist input[type="checkbox"] {
  width: 14px;
  height: 14px;
  accent-color: var(--accent);
  flex-shrink: 0;
}

/* ── TABLES ────────────────────────────────── */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0 20px;
  font-size: 9.5pt;
  page-break-inside: avoid;
}

thead tr {
  background: var(--surface2);
}

th {
  text-align: left;
  padding: 8px 12px;
  color: var(--accent);
  font-weight: 600;
  font-size: 8.5pt;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 2px solid var(--border);
}

td {
  padding: 7px 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  vertical-align: top;
}

tr:last-child td { border-bottom: none; }

tbody tr:nth-child(even) td {
  background: rgba(255,255,255,0.02);
}

/* ── SUGGESTION CARDS ────────────────────── */
.suggestion-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent2);
  border-radius: 6px;
  padding: 20px 24px;
  margin: 16px 0 24px;
  page-break-inside: avoid;
}

.suggestion-card h4 {
  margin-top: 0;
  color: var(--accent2);
}

/* ── HORIZONTAL RULE ─────────────────────── */
hr { display: none; }

/* ── PRINT OVERRIDES ─────────────────────── */
@media print {
  @page {
    size: A4;
    margin: 0;
  }

  body {
    background: var(--bg) !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .page-wrap {
    padding: 40px 48px 56px;
  }
}
"""


def build_html(body_html: str, title: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>
{CSS}
</style>
</head>
<body>

<div class="cover">
  <div class="cover-label">Player Handout — Session 0+</div>
  <div class="cover-title">Cold Start<br>Syndicate</div>
  <div class="cover-subtitle">New Player Primer</div>
  <div class="cover-rule"></div>
  <div class="cover-tagline">
    You woke up 100 years late in the future, pulled from cryo by an unknown patron.
    Now you run deniable jobs in the House shadow wars while trying to stay human — and stay yourselves.
  </div>
  <div class="cover-footer">
    <span>Nova Praxis — FATE Edition</span>
    <span>Session 0+ // April 19, 2026</span>
    <span>Confidential</span>
  </div>
</div>

<div class="page-wrap">
{body_html}
</div>

</body>
</html>"""


async def render_pdf():
    from playwright.async_api import async_playwright

    md_text = INPUT_MD.read_text(encoding="utf-8")
    body_html = md_to_html(md_text)
    full_html = build_html(body_html, "Cold Start Syndicate — New Player Primer")

    # Write debug HTML
    html_path = OUTPUT_PDF.with_suffix(".html")
    html_path.write_text(full_html, encoding="utf-8")
    print(f"HTML written: {html_path}")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(f"file:///{html_path.as_posix()}", wait_until="networkidle")
        await page.pdf(
            path=str(OUTPUT_PDF),
            format="A4",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        await browser.close()

    print(f"PDF written: {OUTPUT_PDF}")


if __name__ == "__main__":
    asyncio.run(render_pdf())
